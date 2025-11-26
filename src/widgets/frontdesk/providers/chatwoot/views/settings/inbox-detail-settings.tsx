/**
 * Inbox Detail Settings View
 *
 * Displays detailed settings for a specific inbox with tabs for
 * Settings and Collaborators.
 */

import React, { useState } from "react";
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
  const inboxDisplayName = inbox.name || inbox.email || "Unknown Inbox";
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
        message: "Settings saved successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to save inbox settings:", error);
      setNotification({
        open: true,
        message: "Failed to save settings. Please try again.",
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
        message: "Agents updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to update agents:", error);
      setNotification({
        open: true,
        message: "Failed to update agents. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!accountId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">No account selected</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, pt: 2, pb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Link
            component="button"
            onClick={onBack}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">Back</Typography>
          </Link>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Inbox Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {inboxDisplayName} • {inbox.channel_type}
        </Typography>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              minHeight: 48,
            },
            "& .Mui-selected": {
              color: "primary.main",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
            },
          }}
        >
          <Tab label="Settings" value="settings" />
          <Tab label="Collaborators" value="collaborators" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3, bgcolor: "background.default" }}>
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
            onSave={handleSaveSettings}
            onUpdateAgents={handleUpdateAgents}
            isSaving={isSaving}
          />
        )}
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
