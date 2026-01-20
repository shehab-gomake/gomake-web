import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { GomakeTextInput } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { SecondaryButton } from "@/components/button/secondary-button";
import { SecretDisplay } from "./secret-display";
import { useStyle } from "../style";
import { FONT_FAMILY } from "@/utils/font-family";

interface CreateApiTokenModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const CreateApiTokenModal = ({
  onSuccess,
  onClose,
}: CreateApiTokenModalProps) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccess, alertFault } = useSnackBar();
  const { classes } = useStyle();

  // Calculate one year from now and format for datetime-local input
  const getOneYearFromNow = () => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    const year = oneYearFromNow.getFullYear();
    const month = String(oneYearFromNow.getMonth() + 1).padStart(2, '0');
    const day = String(oneYearFromNow.getDate()).padStart(2, '0');
    const hours = String(oneYearFromNow.getHours()).padStart(2, '0');
    const minutes = String(oneYearFromNow.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    expiresAt: getOneYearFromNow(),
  });
  const [loading, setLoading] = useState(false);
  const [createdToken, setCreatedToken] = useState<any>(null);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alertFault(t("apiTokens.nameRequired"));
      return;
    }

    setLoading(true);
    try {
      const requestData: any = {
        name: formData.name,
        description: formData.description || null,
      };

      if (formData.expiresAt) {
        requestData.expiresAt = new Date(formData.expiresAt).toISOString();
      }

      const res = await callApi("POST", "/v1/api-tokens/create", requestData, true);

      // Response structure: { success: true, data: { status: "success", message: "...", data: {...} } }
      // So the actual token data is at res.data.data
      const tokenData = res?.data?.data || res?.data;
      
      if (res?.success && tokenData && tokenData.clientId && tokenData.clientSecret) {
        setCreatedToken(tokenData);
        alertSuccess(t("apiTokens.tokenCreated"));
      } else {
        console.error("Failed to create token - response:", res);
        console.error("Token data:", tokenData);
        alertFault(tokenData?.error || res?.data?.error || t("apiTokens.createError"));
      }
    } catch (error: any) {
      alertFault(error?.response?.data?.error || t("apiTokens.createError"));
    } finally {
      setLoading(false);
    }
  };

  if (createdToken) {
    return (
      <SecretDisplay
        clientId={createdToken.clientId}
        clientSecret={createdToken.clientSecret}
        onClose={onClose}
        onContinue={onSuccess}
      />
    );
  }

  return (
    <div style={classes.modalContent}>
      <h3 style={classes.modalTitle}>{t("apiTokens.createToken")}</h3>
      
      <div style={classes.inputContainer}>
        <label style={classes.inputLabel}>
          {t("apiTokens.name")}
          <span style={classes.required}>*</span>
        </label>
        <GomakeTextInput
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t("apiTokens.name")}
          style={classes.input}
        />
      </div>

      <div style={classes.inputContainer}>
        <label style={classes.inputLabel}>
          {t("apiTokens.description")}
        </label>
        <GomakeTextInput
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          multiline
          rows={3}
          placeholder={t("apiTokens.description")}
          style={classes.input}
        />
      </div>

      <div style={classes.inputContainer}>
        <label style={classes.inputLabel}>
          {t("apiTokens.expiresAt")}
        </label>
        <GomakeTextInput
          type="datetime-local"
          value={formData.expiresAt}
          onChange={(e) =>
            setFormData({ ...formData, expiresAt: e.target.value })
          }
          style={classes.input}
        />
      </div>

      <div style={classes.modalActions}>
        <SecondaryButton onClick={onClose}>
          {t("common.cancel")}
        </SecondaryButton>
        <PrimaryButton onClick={handleSubmit} loading={loading}>
          {t("common.create")}
        </PrimaryButton>
      </div>
    </div>
  );
};
