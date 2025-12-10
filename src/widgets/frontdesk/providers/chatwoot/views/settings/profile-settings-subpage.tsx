/**
 * Profile Settings Subpage
 *
 * Displays and manages user profile settings including
 * personal information, display preferences, and notification settings.
 *
 * RBAC: Only administrators can access Settings, but all users can view their own profile.
 */

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, Avatar, Alert, Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { BaseSettingsSubpage, SettingsSection } from "../../components/settings";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { useChatwootPermissions } from "../../hooks/use-chatwoot-permissions";
import { VIEW_PERMISSIONS } from "../../constants/permissions.constants";

export const ProfileSettingsSubpage: React.FC = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { profile, profileLoading, router: chatwootRouter } = useChatwootProvider();

  // Defense-in-depth: Check if user has permission to access Settings
  // (Profile is within Settings, so must have Settings access)
  const { canAccess } = useChatwootPermissions();
  const canAccessSettings = canAccess(VIEW_PERMISSIONS.settings);

  // Redirect unauthorized users to My Inbox
  useEffect(() => {
    if (!canAccessSettings) {
      console.warn("[ProfileSettingsSubpage] Unauthorized access attempt - redirecting to My Inbox");
      chatwootRouter.navigateToMyInbox();
    }
  }, [canAccessSettings, chatwootRouter]);

  return (
    <BaseSettingsSubpage
      title={t("frontdesk.settings.profileSettings")}
      description={t("frontdesk.settings.profileSettingsDescription")}
      isLoading={profileLoading}
    >
      {!profile ? (
        /* No Profile State - Compact */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 260,
            textAlign: "center",
            gap: 1.5,
            direction: dir,
          }}
        >
          <PersonIcon sx={{ fontSize: 48, color: "#9ca3af", opacity: 0.6 }} />
          <Typography variant="subtitle1" sx={{ color: "#1f2937", fontWeight: 600, fontSize: "0.938rem" }}>
            {t("frontdesk.settings.profileSettingsNoDataTitle")}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", maxWidth: 360, fontSize: "0.813rem", lineHeight: 1.5 }}>
            {t("frontdesk.settings.profileSettingsNoDataDescription")}
          </Typography>
        </Box>
      ) : (
        /* Profile Display - Compact High-Density Design */
        <SettingsSection
          title={t("frontdesk.settings.profileSettingsSectionTitle")}
          description={t("frontdesk.settings.profileSettingsSectionDescription")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2.5,
              p: 2,
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
              border: "1px solid rgba(0,0,0,0.06)",
              direction: dir,
            }}
          >
            <Avatar
              src={profile.avatar_url}
              alt={profile.name || t("frontdesk.settings.profileSettingsUnknownUser")}
              sx={{ 
                width: 56, 
                height: 56,
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              {profile.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.938rem", color: "#1f2937", mb: 0.5 }}>
                {profile.name || t("frontdesk.settings.profileSettingsUnknownUser")}
              </Typography>
              {profile.role && (
                <Chip
                  label={profile.role}
                  size="small"
                  sx={{
                    fontSize: "0.688rem",
                    fontWeight: 500,
                    height: 20,
                    textTransform: "capitalize",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    color: "#6366f1",
                    border: "none",
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />
              )}
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: "0.75rem", fontStyle: "italic", direction: dir }}>
            {t("frontdesk.settings.profileSettingsUnderDevelopment")}
          </Typography>
        </SettingsSection>
      )}
    </BaseSettingsSubpage>
  );
};

