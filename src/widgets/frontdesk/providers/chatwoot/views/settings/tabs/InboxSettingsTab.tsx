/**
 * Inbox Settings Tab
 *
 * Main settings for inbox: name, greeting, avatar, features, etc.
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Card,
  CardContent,
  Avatar,
  Button,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import {
  AvatarUploader,
  RichTextEditor,
  SettingsSection,
} from "../../../components/settings";

interface InboxSettingsTabProps {
  inbox: ChatwootInbox;
  accountId: number;
  onSave: (updates: Partial<ChatwootInbox>) => Promise<void>;
  onAvatarUpload: (file: File) => Promise<void>;
  onAvatarDelete: () => Promise<void>;
  isSaving: boolean;
}

export const InboxSettingsTab: React.FC<InboxSettingsTabProps> = ({
  inbox,
  accountId,
  onSave,
  onAvatarUpload,
  onAvatarDelete,
  isSaving,
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: inbox.name || "",
    greeting_enabled: inbox.greeting_enabled || false,
    greeting_message: inbox.greeting_message || "",
    enable_email_collect: inbox.enable_email_collect || false,
    sender_name_type: inbox.sender_name_type || "friendly",
    enable_auto_assignment: inbox.enable_auto_assignment || true,
    allow_messages_after_resolved: inbox.allow_messages_after_resolved || true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSave(formData);
    setHasChanges(false);
  };

  const isEmail = inbox.channel_type?.includes("Email");
  const isWebWidget = inbox.channel_type?.includes("WebWidget");

  return (
    <Box sx={{ maxWidth: 800 }}>
      {/* Avatar Section */}
      <SettingsSection
        title="Channel Avatar"
        description="Upload a custom avatar for this inbox"
      >
        <AvatarUploader
          currentAvatar={inbox.avatar_url}
          fallbackText={inbox.name?.[0]}
          onUpload={onAvatarUpload}
          onDelete={inbox.avatar_url ? onAvatarDelete : undefined}
          isLoading={isSaving}
          size={100}
        />
      </SettingsSection>

      {/* Inbox Name */}
      <SettingsSection
        title="Inbox Name"
        description="A friendly name to identify this inbox"
      >
        <TextField
          fullWidth
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder="Enter inbox name"
          disabled={isSaving}
          sx={{ maxWidth: 500 }}
        />
      </SettingsSection>

      {/* Greeting Message */}
      <SettingsSection
        title="Channel Greeting"
        description="Auto-send greeting messages when customers start a conversation"
      >
        <FormControlLabel
          control={
            <Switch
              checked={formData.greeting_enabled}
              onChange={(e) =>
                handleFieldChange("greeting_enabled", e.target.checked)
              }
              disabled={isSaving}
            />
          }
          label="Enable greeting message"
          sx={{ mb: 2 }}
        />

        {formData.greeting_enabled && (
          <RichTextEditor
            value={formData.greeting_message}
            onChange={(value) => handleFieldChange("greeting_message", value)}
            placeholder="Enter your greeting message..."
            maxLength={isWebWidget ? 500 : 200}
            minRows={3}
            disabled={isSaving}
          />
        )}
      </SettingsSection>

      {/* Email Collection (Web Widget only) */}
      {isWebWidget && (
        <SettingsSection
          title="Collect Email"
          description="Ask visitors for their email before starting a conversation"
        >
          <FormControlLabel
            control={
              <Switch
                checked={formData.enable_email_collect}
                onChange={(e) =>
                  handleFieldChange("enable_email_collect", e.target.checked)
                }
                disabled={isSaving}
              />
            }
            label="Enable email collection"
          />
        </SettingsSection>
      )}

      {/* Sender Name Type (Email only) */}
      {isEmail && (
        <SettingsSection
          title="Sender Name"
          description="Select the name shown to your customer in email headers"
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Friendly Card */}
            <Card
              onClick={() =>
                !isSaving && handleFieldChange("sender_name_type", "friendly")
              }
              sx={{
                flex: 1,
                cursor: isSaving ? "not-allowed" : "pointer",
                border:
                  formData.sender_name_type === "friendly"
                    ? "2px solid"
                    : "1px solid",
                borderColor:
                  formData.sender_name_type === "friendly"
                    ? "primary.main"
                    : "divider",
                bgcolor:
                  formData.sender_name_type === "friendly"
                    ? "primary.50"
                    : "background.paper",
                transition: "all 0.2s",
                opacity: isSaving ? 0.6 : 1,
                "&:hover": isSaving
                  ? {}
                  : {
                      borderColor: "primary.main",
                    },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Friendly
                  </Typography>
                  {formData.sender_name_type === "friendly" && (
                    <CheckCircleIcon
                      sx={{ color: "primary.main", fontSize: 20 }}
                    />
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Add agent name in the sender field
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>A</Avatar>
                  <Typography variant="caption">
                    <strong>Agent Name</strong> from {inbox.name}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Professional Card */}
            <Card
              onClick={() =>
                !isSaving &&
                handleFieldChange("sender_name_type", "professional")
              }
              sx={{
                flex: 1,
                cursor: isSaving ? "not-allowed" : "pointer",
                border:
                  formData.sender_name_type === "professional"
                    ? "2px solid"
                    : "1px solid",
                borderColor:
                  formData.sender_name_type === "professional"
                    ? "primary.main"
                    : "divider",
                bgcolor:
                  formData.sender_name_type === "professional"
                    ? "primary.50"
                    : "background.paper",
                transition: "all 0.2s",
                opacity: isSaving ? 0.6 : 1,
                "&:hover": isSaving
                  ? {}
                  : {
                      borderColor: "primary.main",
                    },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Professional
                  </Typography>
                  {formData.sender_name_type === "professional" && (
                    <CheckCircleIcon
                      sx={{ color: "primary.main", fontSize: 20 }}
                    />
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Use only the configured business name
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                    {inbox.name?.[0]}
                  </Avatar>
                  <Typography variant="caption">
                    <strong>{inbox.name}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </SettingsSection>
      )}

      {/* Feature Toggles */}
      <SettingsSection
        title="Features"
        description="Enable or disable inbox features"
        showDivider={false}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.enable_auto_assignment}
                onChange={(e) =>
                  handleFieldChange("enable_auto_assignment", e.target.checked)
                }
                disabled={isSaving}
              />
            }
            label="Enable auto assignment"
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
            Automatically assign new conversations to available agents
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={formData.allow_messages_after_resolved}
                onChange={(e) =>
                  handleFieldChange(
                    "allow_messages_after_resolved",
                    e.target.checked
                  )
                }
                disabled={isSaving}
              />
            }
            label="Allow messages after resolved"
            sx={{ mt: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
            Customers can send messages even after conversation is resolved
          </Typography>
        </Box>
      </SettingsSection>

      {/* Save Button */}
      <Box
        sx={{
          mt: 4,
          pt: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          sx={{ minWidth: 120 }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};
