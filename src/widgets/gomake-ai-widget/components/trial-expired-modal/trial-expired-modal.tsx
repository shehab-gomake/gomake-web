import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useStyle } from "./style";
import { PrimaryButton } from "@/components/button/primary-button";
import { GomakeTextInput } from "@/components/text-input/text-input";

interface TrialExpiredModalProps {
  open: boolean;
  onClose: () => void;
}

export const TrialExpiredModal = ({
  open,
  onClose,
}: TrialExpiredModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [apiError, setApiError] = useState("");

  const handleUpgradeClick = async () => {
    // Validate company name
    if (!companyName || companyName.trim().length === 0) {
      setCompanyNameError("Company name is required");
      return;
    }

    // Clear any previous API errors
    setApiError("");

    try {
      setIsLoading(true);

      // Call API to get billing URL with token
      const response = await callApi(
        "POST",
        "/v1/crm-service/employee/create-go-ai-print-house",
        {
          companyName: companyName.trim(),
        },
        false
      );

      if (response?.success) {
        debugger;
        const data = response?.data?.data?.data;

        if (data?.redirectUrl) {
          const currentUrl = new URL(window.location.href);
          currentUrl.search = "";
          window.history.replaceState({}, "", currentUrl.toString());

          window.location.href = data.redirectUrl;
        } else {
          // No redirect URL in response
          setApiError("Unable to process your request. Please try again.");
          setIsLoading(false);
        }
      } else {
        const errorMessage =
          response?.message ||
          response?.msg ||
          "Something went wrong. Please try again.";
        setApiError(errorMessage);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error getting billing URL:", error);
      setApiError(
        error?.message || "Failed to connect to the server. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
    if (companyNameError) {
      setCompanyNameError("");
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleClose = () => {
    // Reset all states when modal closes
    setIsLoading(false);
    setCompanyName("");
    setCompanyNameError("");
    setApiError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: "linear-gradient(135deg, #ffffff 0%, #fef5fa 100%)",
          margin: { xs: "16px", sm: "32px" },
          maxHeight: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
        },
      }}
    >
      <DialogContent
        sx={{
          padding: { xs: "24px 20px", sm: "40px" },
          overflowY: "auto",
        }}
      >
        <Stack spacing={{ xs: 2.5, sm: 3 }} alignItems="center">
          {/* Icon */}
          <Box sx={classes.iconContainer}>
            <Box sx={classes.icon}>
              <LockOpenIcon
                sx={{
                  fontSize: { xs: "26px", sm: "36px" },
                  color: "#9333ea",
                }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Box sx={classes.titleContainer}>
            <Box sx={classes.title}>Your Trial Has Ended</Box>
            <Box sx={classes.subtitle}>
              Thank you for trying GoMake AI! Your trial period has expired.
              Please upgrade to continue using our AI services.
            </Box>
          </Box>

          {/* Company Name Input */}
          <Box sx={{ width: "100%" }}>
            <div style={(classes as any).label}>
              Company Name <span style={(classes as any).required}>*</span>
            </div>
            <GomakeTextInput
              value={companyName}
              onChange={handleCompanyNameChange}
              error={!!companyNameError || !!apiError}
              placeholder="Enter your company name"
              autoFocus
              style={(classes as any).input}
              disabled={isLoading}
            />
          </Box>

          {/* API Error Message */}
          {apiError && (
            <Box
              sx={{
                width: "100%",
                padding: { xs: "12px", sm: "16px" },
                backgroundColor: "#fef2f2",
                borderRadius: "8px",
                border: "1px solid #fecaca",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#dc2626",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                ⚠️ {apiError}
              </div>
            </Box>
          )}

          {/* Features List */}
          <Box sx={classes.featuresContainer}>
            <Box sx={classes.featureItem}>✓ Unlimited AI conversations</Box>
            <Box sx={classes.featureItem}>✓ Priority support</Box>
            <Box sx={classes.featureItem}>✓ Advanced features</Box>
          </Box>

          {/* Buttons */}
          <Stack
            spacing={{ xs: 1.5, sm: 2 }}
            width="100%"
            direction={{ xs: "column", sm: "row" }}
          >
            <Box sx={classes.upgradeButton}>
              <PrimaryButton
                variant="contained"
                onClick={handleUpgradeClick}
                disabled={isLoading || !companyName.trim()}
                fullWidth
              >
                {isLoading ? (
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                    <span>Loading...</span>
                  </Box>
                ) : (
                  "Upgrade Now"
                )}
              </PrimaryButton>
            </Box>
            <Box sx={classes.cancelButton}>
              <PrimaryButton
                variant="outlined"
                onClick={handleClose}
                disabled={isLoading}
                fullWidth
              >
                Maybe Later
              </PrimaryButton>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
