import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "../style";

interface ApiTokenCardProps {
  token: any;
  onRevoke: () => void;
}

export const ApiTokenCard = ({ token, onRevoke }: ApiTokenCardProps) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccess, alertFault } = useSnackBar();
  const { classes } = useStyle();

  const handleRevoke = async () => {
    if (!confirm(t("apiTokens.confirmRevoke"))) return;

    try {
      const tokenId = token.apiTokenId || token.clientId;
      const res = await callApi(
        "DELETE",
        `/v1/api-tokens/${tokenId}`,
        {},
        true
      );

      if (res?.success) {
        alertSuccess(t("apiTokens.tokenRevoked"));
        onRevoke();
      } else {
        alertFault(res?.data?.error || t("apiTokens.revokeError"));
      }
    } catch (error: any) {
      alertFault(error?.response?.data?.error || t("apiTokens.revokeError"));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div style={classes.card}>
      <div style={classes.cardHeader}>
        <h4 style={{ margin: 0, ...classes.modalTitle }}>
          {token.name || t("apiTokens.unnamedToken")}
        </h4>
        <span
          style={{
            ...classes.statusBadge,
            backgroundColor: token.isActive !== false ? "#D1FAE5" : "#FEE2E2",
            color: token.isActive !== false ? "#059669" : "#DC2626",
          }}
        >
          {token.isActive !== false ? t("apiTokens.active") : t("apiTokens.revoked")}
        </span>
      </div>

      {token.description && (
        <p style={classes.cardDescription}>{token.description}</p>
      )}

      <div style={classes.cardInfo}>
        <div>
          <strong>{t("apiTokens.clientId")}:</strong>{" "}
          <code style={classes.code}>{token.clientId || token.client_id}</code>
        </div>
        {token.createdAt && (
          <div>
            <strong>{t("apiTokens.created")}:</strong>{" "}
            {formatDate(token.createdAt || token.created_at)}
          </div>
        )}
        {token.lastUsedAt && (
          <div>
            <strong>{t("apiTokens.lastUsed")}:</strong>{" "}
            {formatDate(token.lastUsedAt || token.last_used_at)}
          </div>
        )}
        {token.expiresAt && (
          <div>
            <strong>{t("apiTokens.expiresAt")}:</strong>{" "}
            {formatDate(token.expiresAt || token.expires_at)}
          </div>
        )}
      </div>

      {token.isActive !== false && (
        <div style={classes.cardActions}>
          <PrimaryButton
            variant="outlined"
            color="error"
            onClick={handleRevoke}
          >
            {t("apiTokens.revoke")}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
