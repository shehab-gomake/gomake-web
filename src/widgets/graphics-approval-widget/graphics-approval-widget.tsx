import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";
import { SuccessIcon } from "@/icons/success-icon";
import { ErrorIcon } from "@/icons/error-icon";
import { style } from "./style";

const GraphicsApprovalWidget = () => {
  const router = useRouter();
  const { boardMissionId } = router.query;
  const { callApi } = useGomakeAxios();
  const { successColor, errorColor, neutralColor } = useGomakeTheme();
  const { t } = useTranslation();
  const direction: "rtl" | "ltr" = t("direction");
  const classes = style({ direction, successColor, errorColor, neutralColor });

  const [isLoading, setIsLoading] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateGraphicsApproval = async () => {
      if (!boardMissionId || typeof boardMissionId !== "string") {
        setError(t("graphicsApproval.missingParameter"));
        setIsLoading(false);
        return;
      }

      try {
        // Get approval status from query params (optional, defaults to true if not provided)
        const approvedParam = router.query.approved;
        let approvalStatus = true; // Default to true if not specified

        if (approvedParam !== undefined) {
          // Handle string or string array from query params
          const paramValue = Array.isArray(approvedParam)
            ? approvedParam[0]
            : approvedParam;
          approvalStatus = paramValue === "false" || paramValue === "0" ? false : true;
        }

        // Call the UPDATE endpoint: POST /v1/erp-service/board-missions/update-board-mission-graphic-approval-status/:boardMissionId
        const response: any = await callApi(
          "POST",
          `/v1/erp-service/board-missions/update-board-mission-graphic-approval-status/${boardMissionId}`,
          {
            approved: approvalStatus,
          },
          false // Don't lock screen for this call
        );

        if (response?.success) {
          // The backend returns: { success: true, data: { data: update.data } }
          // Check if the response indicates success
          const responseData = response?.data?.data?.data ?? response?.data?.data ?? response?.data;

          // If response contains approved status, use it; otherwise use the status we sent
          const approved =
            responseData?.approved !== undefined
              ? Boolean(responseData.approved)
              : approvalStatus;

          setIsApproved(approved);
        } else {
          setError(response?.message || t("graphicsApproval.updateFailed"));
          setIsApproved(false);
        }
      } catch (err: any) {
        // Handle API errors gracefully
        console.error("Graphics approval update error:", err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          t("graphicsApproval.errorOccurred")
        );
        setIsApproved(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      updateGraphicsApproval();
    }
  }, [boardMissionId, router.isReady, router.query.approved, callApi]);

  if (isLoading) {
    return (
      <Box sx={classes.container}>
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={60} sx={{ color: successColor(500) }} />
          <Typography variant="h6" sx={classes.loadingText}>
            {t("graphicsApproval.updatingStatus")}
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error && isApproved === null) {
    return (
      <Box sx={classes.container}>
        <Stack spacing={3} alignItems="center">
          <Box sx={classes.iconContainerError}>
            <ErrorIcon width="80" height="80" />
          </Box>
          <Typography variant="h4" sx={classes.titleError}>
            {t("graphicsApproval.errorTitle")}
          </Typography>
          <Typography variant="body1" sx={classes.message}>
            {error}
          </Typography>
        </Stack>
      </Box>
    );
  }

  const isSuccess = isApproved === true;

  return (
    <Box sx={classes.container}>
      <Stack spacing={4} alignItems="center" sx={classes.content}>
        {/* Icon Container with Animation */}
        <Box
          sx={{
            ...classes.iconContainer,
            ...(isSuccess ? classes.iconContainerSuccess : classes.iconContainerError),
          }}
        >
          {isSuccess ? (
            <SuccessIcon width="120" height="120" />
          ) : (
            <ErrorIcon width="120" height="120" />
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          sx={isSuccess ? classes.titleSuccess : classes.titleError}
        >
          {isSuccess ? t("graphicsApproval.successTitle") : t("graphicsApproval.failedTitle")}
        </Typography>

        {/* Message */}
        <Typography variant="body1" sx={classes.message}>
          {isSuccess
            ? t("graphicsApproval.successMessage")
            : t("graphicsApproval.failedMessage")}
        </Typography>

        {/* Decorative Elements */}
        <Box sx={classes.decorativeCircle} />
      </Stack>
    </Box>
  );
};

export { GraphicsApprovalWidget };

