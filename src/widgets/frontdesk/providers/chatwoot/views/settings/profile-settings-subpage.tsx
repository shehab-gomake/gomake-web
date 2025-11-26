/**
 * Profile Settings Subpage
 *
 * Displays and manages user profile settings including
 * personal information, display preferences, and notification settings.
 *
 * RBAC: Only administrators can access Settings, but all users can view their own profile.
 */

import React, { useEffect } from "react";
import { Box, Typography, Avatar, Alert } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { BaseSettingsSubpage, SettingsSection } from "../../components/settings";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { useChatwootPermissions } from "../../hooks/use-chatwoot-permissions";
import { VIEW_PERMISSIONS } from "../../constants/permissions.constants";

export const ProfileSettingsSubpage: React.FC = () => {
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
      title="Profile Settings"
      description="Manage your personal information and preferences"
      isLoading={profileLoading}
    >
      {!profile ? (
        /* No Profile State */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            textAlign: "center",
            gap: 2,
          }}
        >
          <PersonIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            No Profile Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            Unable to load profile information. Please try refreshing the page.
          </Typography>
        </Box>
      ) : (
        /* Profile Display - Placeholder for future implementation */
        <SettingsSection
          title="Profile Information"
          description="Your basic profile details"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              mb: 3,
            }}
          >
            <Avatar
              src={profile.avatar_url}
              alt={profile.name || "User"}
              sx={{ width: 80, height: 80 }}
            >
              {profile.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {profile.name || "Unknown User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
              {profile.role && (
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                  Role: {profile.role}
                </Typography>
              )}
            </Box>
          </Box>

          <Typography variant="caption" color="text.disabled">
            Profile editing and notification preferences UI are under development.
          </Typography>
        </SettingsSection>
      )}
    </BaseSettingsSubpage>
  );
};

