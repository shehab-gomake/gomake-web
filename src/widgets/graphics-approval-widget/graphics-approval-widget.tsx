import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { Box, Stack, Typography, CircularProgress, Paper, Button, TextField } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";
import { SuccessIcon } from "@/icons/success-icon";
import { ErrorIcon } from "@/icons/error-icon";
import { style } from "./style";
import { updateTempUserTokenStorage } from "@/services/storage-data";
import { getGraphicsApprovalApi, updateGraphicsApprovalFileApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { getCompanyLoginLogo } from "@/services/api-service/profiles/company-profile-api";
import { FONT_FAMILY } from "@/utils/font-family";
import { GoMakeIcon } from "@/components/icons/go-make-icon";



interface GraphicsApprovalFile {
  id: string;
  fileName: string;
  fileUrl: string;
  description: string;
  status: number; // 0: Pending, 1: Approved, 2: Rejected
  note: string;
  approvedDate?: string;
  rejectedDate?: string;
}

interface GraphicsApproval {
  id: string;
  boardMissionId: string;
  contactEmail: string;
  createdDate: string;
  sentDate?: string;
  jobNumber?: string;
  orderNumber?: string;
  files: GraphicsApprovalFile[];
}

const GraphicsApprovalWidget = () => {
  const router = useRouter();
  const { id, boardMissionId } = router.query;
  const { callApi } = useGomakeAxios();
  const { successColor, errorColor, neutralColor, primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const direction: "rtl" | "ltr" = t("direction");
  const classes = style({ direction, successColor, errorColor, neutralColor, primaryColor });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approval, setApproval] = useState<GraphicsApproval | null>(null);
  const [fileNotes, setFileNotes] = useState<Record<string, string>>({});
  const [updatingFiles, setUpdatingFiles] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<{
    loginLogo: string;
    name: string;
  }>({ loginLogo: "", name: "" });

  // Load graphics approval data
  const loadGraphicsApproval = useCallback(async () => {
    if (!id || typeof id !== "string") {
      setError(t("graphicsApproval.missingParameter") || "Missing approval ID");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const callBack = (res: any) => {
      setIsLoading(false);
      if (res?.success && res?.data) {
        const data = res.data.data || res.data;
        setApproval(data);
        // Initialize notes from existing file notes
        const notes: Record<string, string> = {};
        data.files?.forEach((file: GraphicsApprovalFile) => {
          if (file.note) {
            notes[file.id] = file.note;
          }
        });
        setFileNotes(notes);
      } else {
        setError(res?.message || t("graphicsApproval.loadFailed") || "Failed to load graphics approval");
      }
    };

    await getGraphicsApprovalApi(callApi, callBack, { id });
  }, [id, callApi, t]);

  // Update file approval status
  const handleFileStatusUpdate = async (fileId: string, status: number) => {
    if (updatingFiles.has(fileId)) return;

    setUpdatingFiles((prev) => new Set(prev).add(fileId));

    const note = fileNotes[fileId] || "";

    const callBack = (res: any) => {
      setUpdatingFiles((prev) => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });

      if (res?.success) {
        // Reload approval data to get updated status
        loadGraphicsApproval();
      } else {
        setError(res?.message || t("graphicsApproval.updateFailed") || "Failed to update file status");
      }
    };

    await updateGraphicsApprovalFileApi(callApi, callBack, {
      fileId,
      status,
      note,
    });
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return t("graphicsApproval.approved") || "Approved";
      case 2:
        return t("graphicsApproval.rejected") || "Rejected";
      default:
        return t("graphicsApproval.pending") || "Pending";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return successColor(500);
      case 2:
        return errorColor(500);
      default:
        return neutralColor(500);
    }
  };

  // Get company logo
  const getCompanyLogo = useCallback(async () => {
    const callBack = (res: any) => {
      if (res?.success) {
        setCompanyLogo(res.data);
      }
    };
    await getCompanyLoginLogo(callApi, callBack);
  }, [callApi]);

  // Update screen width for mobile responsiveness
  useEffect(() => {
    const updateScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  // Load company logo
  useEffect(() => {
    if (isTokenReady) {
      getCompanyLogo();
    }
  }, [isTokenReady, getCompanyLogo]);

  // Get temp user token for authentication
  useEffect(() => {
    const getTempUserToken = async () => {
      const tokenParam = id || boardMissionId;
      if (!tokenParam || typeof tokenParam !== "string") {
        setIsLoadingToken(false);
        setIsTokenReady(false);
        return;
      }

      try {
        const TokenRes: any = await callApi("GET", "/v1/auth/get-temp-user-token", {
          token: tokenParam,
        });
        if (TokenRes?.success) {
          const userToken = TokenRes?.data?.data?.result?.token;
          if (userToken) {
            updateTempUserTokenStorage(userToken);
            setIsTokenReady(true);
          } else {
            setIsTokenReady(false);
          }
        } else {
          setIsTokenReady(false);
        }
      } catch (err) {
        console.error("Failed to get temp user token:", err);
        setIsTokenReady(false);
      } finally {
        setIsLoadingToken(false);
      }
    };

    if (router.isReady) {
      getTempUserToken();
    }
  }, [router.isReady, id, boardMissionId, callApi]);

  // Load graphics approval after token is successfully loaded
  useEffect(() => {
    if (!isLoadingToken && isTokenReady && router.isReady && id) {
      loadGraphicsApproval();
    }
  }, [isLoadingToken, isTokenReady, router.isReady, id, loadGraphicsApproval]);


  if (isLoadingToken || isLoading) {
    return (
      <Box sx={classes.firstContainer}>
        <Box sx={isMobile ? classes.iconMobileStyle : classes.iconStyle}>
          {companyLogo?.loginLogo ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src={companyLogo?.loginLogo}
                alt="Print House Logo"
                style={classes.printHouseLogo}
              />
              <Typography
                sx={{
                  color: "#000",
                  ...(isMobile
                    ? FONT_FAMILY.Inter(600, 24)
                    : FONT_FAMILY.Inter(700, 32)),
                  textTransform: "capitalize",
                }}
              >
                {companyLogo?.name}
              </Typography>
            </Box>
          ) : (
            <GoMakeIcon />
          )}
        </Box>
        <Box sx={classes.contentWrapper}>
          <Stack spacing={3} alignItems="center" sx={{ padding: isMobile ? "16px" : "24px" }}>
            <CircularProgress size={isMobile ? 40 : 60} sx={{ color: primaryColor(500) }} />
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              sx={{ ...classes.loadingText, fontSize: isMobile ? "16px" : undefined }}
            >
              {t("graphicsApproval.loading") || "Loading..."}
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  }

  if (error && !approval) {
    return (
      <Box sx={classes.firstContainer}>
        <Box sx={isMobile ? classes.iconMobileStyle : classes.iconStyle}>
          {companyLogo?.loginLogo ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src={companyLogo?.loginLogo}
                alt="Print House Logo"
                style={classes.printHouseLogo}
              />
              <Typography
                sx={{
                  color: "#000",
                  ...(isMobile
                    ? FONT_FAMILY.Inter(600, 24)
                    : FONT_FAMILY.Inter(700, 32)),
                  textTransform: "capitalize",
                }}
              >
                {companyLogo?.name}
              </Typography>
            </Box>
          ) : (
            <GoMakeIcon />
          )}
        </Box>
        <Box sx={classes.contentWrapper}>
          <Stack spacing={3} alignItems="center" sx={{ padding: isMobile ? "16px" : "24px" }}>
            <Box sx={{ ...classes.iconContainerError, width: isMobile ? "120px" : "200px", height: isMobile ? "120px" : "200px" }}>
              <ErrorIcon width={isMobile ? "60" : "80"} height={isMobile ? "60" : "80"} />
            </Box>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              sx={{ ...classes.titleError, fontSize: isMobile ? "20px" : undefined }}
            >
              {t("graphicsApproval.errorTitle") || "Error"}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ ...classes.message, fontSize: isMobile ? "14px" : undefined, padding: isMobile ? "0 16px" : undefined }}
            >
              {error}
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  }

  if (!approval) {
    return null;
  }

  return (
    <Box sx={classes.firstContainer}>
      {/* Header with Logo and Name */}
      <Box sx={isMobile ? classes.iconMobileStyle : classes.iconStyle}>
        {companyLogo?.loginLogo ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src={companyLogo?.loginLogo}
              alt="Print House Logo"
              style={classes.printHouseLogo}
            />
            <Typography
              sx={{
                color: "#000",
                ...(isMobile
                  ? FONT_FAMILY.Inter(600, 24)
                  : FONT_FAMILY.Inter(700, 32)),
                textTransform: "capitalize",
              }}
            >
              {companyLogo?.name}
            </Typography>
          </Box>
        ) : (
          <GoMakeIcon />
        )}
      </Box>

      {/* Content */}
      <Box sx={classes.contentWrapper}>
        <Stack spacing={isMobile ? 3 : 4} sx={{ maxWidth: "1200px", width: "100%", padding: isMobile ? "16px" : "24px" }}>
        {/* Header */}
        <Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ fontWeight: "bold", marginBottom: "8px", fontSize: isMobile ? "20px" : undefined }}
          >
            {t("graphicsApproval.title") || "Graphics Approval"}
          </Typography>
          <Typography variant="body2" sx={{ color: neutralColor(600), fontSize: isMobile ? "14px" : undefined }}>
            {t("graphicsApproval.subtitle") || "Review and approve or reject the graphics files"}
            {approval.jobNumber && approval.orderNumber && (
              <>
                {" - "}
                {t("graphicsApproval.jobNumber") || "Job"}: {approval.jobNumber}
                {", "}
                {t("graphicsApproval.orderNumber") || "Order"}: {approval.orderNumber}
              </>
            )}
          </Typography>
        </Box>

        {/* Files List */}
        {approval.files && approval.files.length > 0 ? (
          <Stack spacing={3}>
            {approval.files.map((file) => {
              const isUpdating = updatingFiles.has(file.id);
              const isPending = file.status === 0;

              return (
                <Paper key={file.id} elevation={2} sx={{ padding: isMobile ? "16px" : "24px" }}>
                  <Stack spacing={2}>
                    {/* File Header */}
                    <Stack 
                      direction={isMobile ? "column" : "row"} 
                      justifyContent="space-between" 
                      alignItems={isMobile ? "flex-start" : "flex-start"}
                      spacing={isMobile ? 2 : 0}
                    >
                      <Box sx={{ flex: 1, width: "100%" }}>
                        <Typography 
                          variant={isMobile ? "subtitle1" : "h6"} 
                          sx={{ 
                            fontWeight: "bold", 
                            marginBottom: "8px",
                            fontSize: isMobile ? "16px" : undefined,
                            wordBreak: "break-word"
                          }}
                        >
                          {file.fileName}
                        </Typography>
                        {file.description && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: neutralColor(600), 
                              marginBottom: "8px",
                              fontSize: isMobile ? "13px" : undefined,
                              wordBreak: "break-word"
                            }}
                          >
                            {file.description}
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            color: getStatusColor(file.status),
                            fontWeight: "bold",
                            fontSize: isMobile ? "13px" : undefined,
                          }}
                        >
                          {getStatusLabel(file.status)}
                        </Typography>
                      </Box>
                      <Box sx={{ width: isMobile ? "100%" : "auto" }}>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", width: isMobile ? "100%" : "auto", display: "block" }}
                        >
                          <Button 
                            variant="outlined" 
                            size={isMobile ? "medium" : "small"}
                            fullWidth={isMobile}
                          >
                            {t("graphicsApproval.viewFile") || "View File"}
                          </Button>
                        </a>
                      </Box>
                    </Stack>

                    {/* Note Input */}
                    <TextField
                      label={t("graphicsApproval.note") || "Note"}
                      multiline
                      rows={3}
                      value={fileNotes[file.id] || ""}
                      onChange={(e) =>
                        setFileNotes((prev) => ({
                          ...prev,
                          [file.id]: e.target.value,
                        }))
                      }
                      disabled={!isPending || isUpdating}
                      fullWidth
                      placeholder={t("graphicsApproval.notePlaceholder") || "Add a note (optional)"}
                    />

                    {/* Action Buttons */}
                    {isPending && (
                      <Stack 
                        direction={isMobile ? "column" : "row"} 
                        spacing={2} 
                        justifyContent="flex-end"
                        sx={{ width: "100%" }}
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleFileStatusUpdate(file.id, 2)}
                          disabled={isUpdating}
                          fullWidth={isMobile}
                          size={isMobile ? "medium" : "small"}
                        >
                          {isUpdating ? (
                            <CircularProgress size={20} />
                          ) : (
                            t("graphicsApproval.reject") || "Reject"
                          )}
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleFileStatusUpdate(file.id, 1)}
                          disabled={isUpdating}
                          fullWidth={isMobile}
                          size={isMobile ? "medium" : "small"}
                        >
                          {isUpdating ? (
                            <CircularProgress size={20} />
                          ) : (
                            t("graphicsApproval.approve") || "Approve"
                          )}
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        ) : (
          <Paper sx={{ padding: isMobile ? "16px" : "24px", textAlign: "center" }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: neutralColor(600),
                fontSize: isMobile ? "14px" : undefined
              }}
            >
              {t("graphicsApproval.noFiles") || "No files found"}
            </Typography>
          </Paper>
        )}
        </Stack>
      </Box>
    </Box>
  );
};

export { GraphicsApprovalWidget };
