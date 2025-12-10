/**
 * Inbox Detail Settings View
 *
 * Displays detailed settings for a specific inbox with tabs for
 * Settings and Collaborators.
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Link,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from "@mui/material";
import { useSetRecoilState } from "recoil";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { chatwootService } from "@/services/frontdesk";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { chatwootInboxAgentsMapAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import {
  InboxSettingsTab,
  InboxCollaboratorsTab,
} from "./tabs";

interface InboxDetailSettingsProps {
  inbox: ChatwootInbox;
  onBack: () => void;
}

type SettingsTab = "settings" | "collaborators";

export const InboxDetailSettings: React.FC<InboxDetailSettingsProps> = ({
  inbox,
  onBack,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { selectedAccountId } = useChatwootProvider();
  const setInboxAgentsMap = useSetRecoilState(chatwootInboxAgentsMapAtom);
  const [activeTab, setActiveTab] = useState<SettingsTab>("settings");
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const accountId = selectedAccountId;
  const inboxDisplayName = inbox.name || inbox.email || t("frontdesk.settings.inboxesDetailUnknownInbox");
  const inboxEmail =
    inbox.email ||
    `${inbox.name?.toLowerCase().replace(/\s+/g, ".")}@gomake.net`;

  // Handle inbox settings save
  const handleSaveSettings = async (updates: Partial<ChatwootInbox>) => {
    if (!accountId) return;

    setIsSaving(true);
    try {
      await chatwootService.inboxes.updateInbox(accountId, inbox.id, updates);
      setNotification({
        open: true,
        message: t("frontdesk.settings.inboxesDetailSettingsSaved"),
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to save inbox settings:", error);
      setNotification({
        open: true,
        message: t("frontdesk.settings.inboxesDetailSettingsFailed"),
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle agent updates
  const handleUpdateAgents = async (agentIds: number[]) => {
    if (!accountId) return;

    setIsSaving(true);
    try {
      await chatwootService.inboxes.addAgentsToInbox(
        accountId,
        inbox.id,
        agentIds
      );
      
      // Fetch updated agents list and update Recoil state
      const response = await chatwootService.inboxes.getInboxAgents(
        accountId,
        inbox.id
      );
      const updatedAgents = response?.payload || [];
      
      // Update the agents map in Recoil state
      setInboxAgentsMap((prev) => ({
        ...prev,
        [inbox.id]: updatedAgents,
      }));
      
      setNotification({
        open: true,
        message: t("frontdesk.settings.inboxesDetailAgentsUpdated"),
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to update agents:", error);
      setNotification({
        open: true,
        message: t("frontdesk.settings.inboxesDetailAgentsFailed"),
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!accountId) {
    return (
      <Box sx={{ p: 3, direction: dir }}>
        <Alert severity="error">{t("frontdesk.settings.inboxesDetailNoAccount")}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8f9fa", // Muted background
        direction: dir,
      }}
    >
      {/* Compact Header */}
      <Box sx={{ px: 3, pt: 1.5, pb: 1, borderBottom: "1px solid rgba(0,0,0,0.06)", direction: dir }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1, direction: dir }}>
          <Link
            component="button"
            onClick={onBack}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#6b7280",
              textDecoration: "none",
              "&:hover": {
                color: "#6366f1",
                textDecoration: "underline",
              },
              cursor: "pointer",
              border: "none",
              background: "none",
              p: 0,
              direction: dir,
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: "0.813rem", fontWeight: 500 }}>
              {t("frontdesk.settings.inboxesDetailBack")}
            </Typography>
          </Link>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: "1.125rem", color: "#1f2937" }}>
          {t("frontdesk.settings.inboxesDetailTitle")}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mb: 1.5, fontSize: "0.813rem" }}>
          {inboxDisplayName} • {inbox.channel_type}
        </Typography>

        {/* Compact Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 36,
            direction: dir,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.813rem",
              minHeight: 36,
              py: 0.75,
              px: 2,
              color: "#6b7280",
            },
            "& .Mui-selected": {
              color: "#6366f1",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#6366f1",
              height: 2,
            },
          }}
        >
          <Tab label={t("frontdesk.settings.inboxesDetailTabSettings")} value="settings" />
          <Tab label={t("frontdesk.settings.inboxesDetailTabCollaborators")} value="collaborators" />
        </Tabs>
      </Box>

      {/* Content with White Card */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            p: 3,
            minHeight: "100%",
          }}
        >
          {activeTab === "settings" && (
            <InboxSettingsTab
              inbox={inbox}
              accountId={accountId}
              onSave={handleSaveSettings}
              isSaving={isSaving}
            />
          )}

          {activeTab === "collaborators" && (
            <InboxCollaboratorsTab
              inbox={inbox}
              accountId={accountId}
              onUpdateAgents={handleUpdateAgents}
              isSaving={isSaving}
            />
          )}
        </Box>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: dir === "rtl" ? "left" : "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ 
            width: "100%",
            borderRadius: "6px",
            fontSize: "0.813rem",
            direction: dir,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
