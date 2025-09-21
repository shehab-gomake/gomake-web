import { useEffect } from "react";
import { FormInput } from "@/components/form-inputs/form-input";
import { PrimaryButton } from "@/components/button/primary-button";
import Head from "next/head";
import { useFileApiSettings } from "./use-file-api-settings";

const SettingsFileApiWidget = () => {
  const {
    loading,
    isConfigured,
    fileServiceStatus,
    authorizationKey,
    isCopied,
    formInputs,
    handleInputChange,
    handleSubmitAndDownload,
    handleDownloadInstaller,
    handleCopyAuthorizationKey,
    fetchFileServiceConfigs,
    t,
  } = useFileApiSettings();

  const getStatusDisplay = () => {
    switch (fileServiceStatus) {
      case 0: // Inactive
        return {
          text: t("fileApiSettings.status.inactive"),
          color: "#F59E0B", // Amber/Orange
          bgColor: "#FEF3C7",
          dotColor: "#F59E0B",
        };
      case 1: // Active
        return {
          text: t("fileApiSettings.status.active"),
          color: "#059669", // Green
          bgColor: "#D1FAE5",
          dotColor: "#059669",
        };
      case 2: // Error
        return {
          text: t("fileApiSettings.status.error"),
          color: "#DC2626", // Red
          bgColor: "#FEE2E2",
          dotColor: "#DC2626",
        };
      default:
        return {
          text: "Unknown",
          color: "#6B7280",
          bgColor: "#F3F4F6",
          dotColor: "#6B7280",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  useEffect(() => {
    fetchFileServiceConfigs();
  }, []);

  return (
    <>
      <Head>
        <title>{t("settings.fileApiSettings")}</title>
      </Head>
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {t("settings.fileApiSettings")}
          </h2>

          {/* Service Status Display - Only show if configured */}
          {isConfigured && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: statusDisplay.bgColor,
                color: statusDisplay.color,
                fontSize: "14px",
                fontWeight: "500",
                border: `1px solid ${statusDisplay.color}20`,
              }}
            >
              <span>
                {t("fileApiSettings.fileServiceStatus")}: {statusDisplay.text}
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: statusDisplay.dotColor,
                    display: "inline-block",
                    marginLeft: "8px",
                    verticalAlign: "middle",
                  }}
                />
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "1200px",
          }}
        >
          {/* First row - Remote Name and Computer Name */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[0]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[1]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
          </div>

          {/* Second row - Username and Password */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[2]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[3]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
          </div>

          {/* Third row - Base Directory and Workflow Directory */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[4]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[5]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
          </div>

          {/* Fourth row - Workflow Remote Name and Workflow Username */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[6]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[7]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
          </div>

          {/* Fifth row - Workflow Password and Folders Creation Type */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[8]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
            <div style={{ flex: 1 }}>
              <FormInput
                input={formInputs[9]}
                changeState={handleInputChange}
                error={false}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              gap: "20px",
              //   justifyContent: "center",
            }}
          >
            <PrimaryButton
              variant="contained"
              onClick={handleSubmitAndDownload}
              disabled={loading}
              style={{ width: "fit-content" }}
            >
              {loading
                ? "Loading..."
                : isConfigured
                ? t("modal.update")
                : t("fileApiSettings.submitAndDownload")}
            </PrimaryButton>
            {isConfigured && (
              <PrimaryButton
                variant="outlined"
                onClick={handleDownloadInstaller}
                style={{ width: "fit-content" }}
              >
                {t("translations.download")}
              </PrimaryButton>
            )}
          </div>

          {/* Authorization Key Display */}
          {authorizationKey && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#F8F9FA",
                borderRadius: "6px",
                border: "1px solid #E9ECEF",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    margin: 0,
                    color: "#495057",
                  }}
                >
                  {t("fileApiSettings.authorizationKey")}:
                </h3>
                <PrimaryButton
                  variant="outlined"
                  onClick={handleCopyAuthorizationKey}
                  style={{
                    width: "fit-content",
                    fontSize: "13px",
                    padding: "3px 8px",
                    minWidth: "auto",
                    height: "24px",
                    backgroundColor: isCopied ? "#D1FAE5" : "transparent",
                    borderColor: isCopied ? "#059669" : undefined,
                    color: isCopied ? "#059669" : undefined,
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {isCopied
                    ? `✓ ${t("fileApiSettings.copied")} !`
                    : t("fileApiSettings.copy")}
                </PrimaryButton>
              </div>
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #DEE2E6",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "#495057",
                  wordBreak: "break-all",
                  userSelect: "all",
                }}
              >
                {authorizationKey}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { SettingsFileApiWidget };
