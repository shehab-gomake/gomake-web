import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useStyle } from "../style";
import { Box } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface ApiTokenCardProps {
  token: any;
  onRevoke: () => void;
}

export const ApiTokenCard = ({ token, onRevoke }: ApiTokenCardProps) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccess, alertFault } = useSnackBar();
  const { successColor, errorColor } = useGomakeTheme();
  const { classes } = useStyle();
  const isActive = token.isActive !== false;

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
    <Box
      sx={{
        ...classes.card,
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <div style={classes.cardContent}>
        {/* Header Section */}
        <div style={classes.cardHeader}>
          <div style={classes.cardTitleSection}>
            <div style={classes.cardIconContainer}>
              <VpnKeyIcon style={classes.cardIcon} />
            </div>
            <div style={classes.cardTitleWrapper}>
              <h4 style={classes.cardTitle}>
                {token.name || t("apiTokens.unnamedToken")}
              </h4>
              <div style={classes.statusBadgeContainer}>
                {isActive ? (
                  <CheckCircleOutlineIcon style={classes.statusIcon(successColor)} />
                ) : (
                  <CancelOutlinedIcon style={classes.statusIcon(errorColor)} />
                )}
                <span style={classes.statusBadge(isActive)}>
                  {isActive ? t("apiTokens.active") : t("apiTokens.revoked")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {token.description && (
          <p style={classes.cardDescription}>{token.description}</p>
        )}

        {/* Client ID Section */}
        <div style={classes.clientIdSection}>
          <div style={classes.clientIdLabel}>{t("apiTokens.clientId")}</div>
          <code style={classes.code}>{token.clientId || token.client_id}</code>
        </div>

        {/* Info Grid */}
        <div style={classes.cardInfoGrid}>
          {token.createdAt && (
            <div style={classes.infoItem}>
              <CalendarTodayIcon style={classes.infoIcon} />
              <div style={classes.infoContent}>
                <div style={classes.infoLabel}>{t("apiTokens.created")}</div>
                <div style={classes.infoValue}>
                  {formatDate(token.createdAt || token.created_at)}
                </div>
              </div>
            </div>
          )}
          {token.lastUsedAt && (
            <div style={classes.infoItem}>
              <AccessTimeIcon style={classes.infoIcon} />
              <div style={classes.infoContent}>
                <div style={classes.infoLabel}>{t("apiTokens.lastUsed")}</div>
                <div style={classes.infoValue}>
                  {formatDate(token.lastUsedAt || token.last_used_at)}
                </div>
              </div>
            </div>
          )}
          {token.expiresAt && (
            <div style={classes.infoItem}>
              <CalendarTodayIcon style={classes.infoIcon} />
              <div style={classes.infoContent}>
                <div style={classes.infoLabel}>{t("apiTokens.expiresAt")}</div>
                <div style={classes.infoValue}>
                  {formatDate(token.expiresAt || token.expires_at)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {isActive && (
          <div style={classes.cardActions}>
            <PrimaryButton
              style={classes.revokeButton}
              variant="outlined"
              color="error"
              onClick={handleRevoke}
            >
              {t("apiTokens.revoke")}
            </PrimaryButton>
          </div>
        )}
      </div>
    </Box>
  );
};
