import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "../style";

interface SecretDisplayProps {
  clientId: string;
  clientSecret: string;
  onClose: () => void;
  onContinue: () => void;
}

export const SecretDisplay = ({
  clientId,
  clientSecret,
  onClose,
  onContinue,
}: SecretDisplayProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [copied, setCopied] = useState({ clientId: false, secret: false });

  const copyToClipboard = async (text: string, type: "clientId" | "secret") => {
    if (!text || text === "undefined") {
      console.error(`Cannot copy ${type}: value is undefined or empty`);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div style={classes.modalContent}>
      <h3 style={classes.modalTitle}>{t("apiTokens.tokenCreated")}</h3>
      <p style={classes.warningText}>
        {t("apiTokens.secretWarning")}
      </p>

      <div style={classes.secretContainer}>
        <div style={classes.secretField}>
          <label style={classes.secretLabel}>{t("apiTokens.clientId")}</label>
          <div style={classes.secretValue}>
            <code>{clientId}</code>
            <PrimaryButton
              size="small"
              onClick={() => copyToClipboard(clientId, "clientId")}
            >
              {copied.clientId ? t("common.copied") : t("common.copy")}
            </PrimaryButton>
          </div>
        </div>

        <div style={classes.secretField}>
          <label style={classes.secretLabel}>{t("apiTokens.clientSecret")}</label>
          <div style={classes.secretValue}>
            <code>{clientSecret}</code>
            <PrimaryButton
              size="small"
              onClick={() => copyToClipboard(clientSecret, "secret")}
            >
              {copied.secret ? t("common.copied") : t("common.copy")}
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div style={classes.modalActions}>
        <PrimaryButton onClick={onContinue}>
          {t("common.done")}
        </PrimaryButton>
      </div>
    </div>
  );
};
