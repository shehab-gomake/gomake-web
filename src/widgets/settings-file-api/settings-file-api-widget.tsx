import { useEffect } from "react";
import { FormInput } from "@/components/form-inputs/form-input";
import { PrimaryButton } from "@/components/button/primary-button";
import Head from "next/head";
import { useFileApiSettings } from "./use-file-api-settings";
import { HotfolderArrayInput } from "./hotfolder-array-input";
import { useStyle } from "./style";

const SettingsFileApiWidget = () => {
  const {
    loading,
    isConfigured,
    fileServiceStatus,
    authorizationKey,
    isCopied,
    hotfolderInputs,
    formData,
    handleHotfolderChange,
    handleSubmitAndDownload,
    handleDownloadInstaller,
    handleCopyAuthorizationKey,
    fetchFileServiceConfigs,
    t,
  } = useFileApiSettings();
  const { classes } = useStyle();

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
      <div style={classes.mainContainer}>
        <div style={classes.headerContainer}>
          <div style={classes.titleContainer}>
            <h2 style={classes.pageTitle}>{t("settings.fileApiSettings")}</h2>
            <div style={classes.helpIcon}>?</div>
          </div>

          {/* Service Status Display and Download Button - Only show if configured */}
          {isConfigured && (
            <div style={classes.statusAndDownloadContainer}>
              {/* Download Button */}
              <PrimaryButton
                variant="outlined"
                onClick={handleDownloadInstaller}
                style={classes.downloadButton}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    lineHeight: "1.1",
                  }}
                >
                  <span>Download API</span>
                  <span
                    style={{ fontSize: "11px", opacity: 0.7, marginTop: "2px" }}
                  >
                    for Windows only
                  </span>
                </div>
              </PrimaryButton>
            </div>
          )}
        </div>

        <div className="custom-scrollbar" style={classes.scrollableContent}>
          <div style={classes.contentContainer}>
            {/* Authorization Key Display */}
            {authorizationKey && (
              <div style={classes.authKeyContainer}>
                <div style={classes.authKeyHeader}>
                  <h3 style={classes.authKeyTitle}>
                    {t("fileApiSettings.authorizationKey")}:
                  </h3>
                  <PrimaryButton
                    variant="outlined"
                    onClick={handleCopyAuthorizationKey}
                    style={{
                      ...classes.copyButton,
                      backgroundColor: isCopied ? "#D1FAE5" : "transparent",
                      borderColor: isCopied ? "#059669" : undefined,
                      color: isCopied ? "#059669" : undefined,
                    }}
                  >
                    {isCopied
                      ? `✓ ${t("fileApiSettings.copied")} !`
                      : t("fileApiSettings.copy")}
                  </PrimaryButton>
                </div>
                <div style={classes.authKeyValue}>{authorizationKey}</div>
              </div>
            )}

            <HotfolderArrayInput
              name=""
              parameterKey="hotFolders"
              inputs={hotfolderInputs}
              value={formData.hotFolders}
              updateState={handleHotfolderChange}
              isValid={true}
            />
          </div>
        </div>

        {/* Fixed Submit Button */}
        <div style={classes.fixedSubmitButtonContainer}>
          <PrimaryButton
            variant="contained"
            onClick={handleSubmitAndDownload}
            disabled={loading}
            style={classes.submitButton}
          >
            {loading
              ? "Loading..."
              : isConfigured
              ? t("fileApiSettings.updateSettings")
              : t("fileApiSettings.submitAndDownload")}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
};

export { SettingsFileApiWidget };
