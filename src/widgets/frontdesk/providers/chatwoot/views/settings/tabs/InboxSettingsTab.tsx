/**
 * Inbox Settings Tab
 *
 * Main settings for inbox: name, features, etc.
 * Note: Channel Greeting is disabled by GoMake policy.
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { 
  SettingsSection,
  CompactTextField,
  CompactPrimaryButton,
  CompactSwitch,
} from "../../../components/settings";

interface InboxSettingsTabProps {
  inbox: ChatwootInbox;
  accountId: number;
  onSave: (updates: Partial<ChatwootInbox>) => Promise<void>;
  isSaving: boolean;
}

export const InboxSettingsTab: React.FC<InboxSettingsTabProps> = ({ inbox, accountId, onSave, isSaving }) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const [formData, setFormData] = useState({
    name: inbox.name || "",
    enable_email_collect: inbox.enable_email_collect || false,
    sender_name_type: inbox.sender_name_type || "friendly",
    business_name: inbox.business_name || "",
    allow_messages_after_resolved: inbox.allow_messages_after_resolved || true,
    lock_to_single_conversation: inbox.lock_to_single_conversation || false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Note: GoMake always disables channel greeting
    await onSave({
      ...formData,
      greeting_enabled: false,
      greeting_message: "",
    });
    setHasChanges(false);
  };

  const isEmail = inbox.channel_type?.includes("Email");
  const isWebWidget = inbox.channel_type?.includes("WebWidget");
  const isWhatsApp = inbox.channel_type?.includes("WhatsApp");

  return (
    <Box sx={{ direction: dir }}>
      {/* Inbox Name - Compact */}
      <SettingsSection title={t("frontdesk.settings.inboxesSettingsNameTitle")} description={t("frontdesk.settings.inboxesSettingsNameDescription")}>
        <CompactTextField
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder={t("frontdesk.settings.inboxesSettingsNamePlaceholder")}
          disabled={isSaving}
          sx={{ maxWidth: 500 }}
        />
      </SettingsSection>

      {/* Email Collection (Web Widget only) - Compact */}
      {isWebWidget && (
        <SettingsSection title={t("frontdesk.settings.inboxesSettingsCollectEmailTitle")} description={t("frontdesk.settings.inboxesSettingsCollectEmailDescription")}>
          <CompactSwitch
            label={t("frontdesk.settings.inboxesSettingsCollectEmailLabel")}
            checked={formData.enable_email_collect}
            onChange={(e) => handleFieldChange("enable_email_collect", e.target.checked)}
            disabled={isSaving}
          />
        </SettingsSection>
      )}

      {/* WhatsApp Provider Name (WhatsApp only) - Compact */}
      {isWhatsApp && (
        <SettingsSection title={t("frontdesk.settings.inboxesSettingsApiProviderTitle")} description={t("frontdesk.settings.inboxesSettingsApiProviderDescription")}>
          <CompactTextField
            value={
              (inbox.provider as string) === "whatsapp_cloud"
                ? "WhatsApp Cloud"
                : (inbox.provider as string) === "twilio"
                ? "Twilio"
                : (inbox.provider as string) === "default"
                ? "360 Dialog"
                : (inbox.provider as string) || "Unknown"
            }
            disabled
            sx={{ maxWidth: 500 }}
          />
        </SettingsSection>
      )}

      {/* Sender Name Type (Email only) - Compact */}
      {isEmail && (
        <SettingsSection title={t("frontdesk.settings.inboxesSettingsSenderNameTitle")} description={t("frontdesk.settings.inboxesSettingsSenderNameDescription")}>
          <Box sx={{ display: "flex", gap: 1.5, direction: dir }}>
            {/* Friendly Card - Compact */}
            <Card
              onClick={() => !isSaving && handleFieldChange("sender_name_type", "friendly")}
              sx={{
                flex: 1,
                cursor: isSaving ? "not-allowed" : "pointer",
                border: formData.sender_name_type === "friendly" ? "2px solid #6366f1" : "1px solid rgba(0,0,0,0.12)",
                bgcolor: formData.sender_name_type === "friendly" ? "rgba(99, 102, 241, 0.04)" : "#ffffff",
                transition: "all 0.15s",
                opacity: isSaving ? 0.6 : 1,
                borderRadius: "6px",
                boxShadow: "none",
                "&:hover": isSaving
                  ? {}
                  : {
                      borderColor: "#6366f1",
                      boxShadow: "0 1px 3px rgba(99, 102, 241, 0.1)",
                    },
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#1f2937" }}>
                    {t("frontdesk.settings.inboxesSettingsSenderFriendly")}
                  </Typography>
                  {formData.sender_name_type === "friendly" && <CheckCircleIcon sx={{ color: "#6366f1", fontSize: 16 }} />}
                </Box>
                <Typography variant="body2" sx={{ mb: 1.5, color: "#6b7280", fontSize: "0.75rem", lineHeight: 1.4 }}>
                  {t("frontdesk.settings.inboxesSettingsSenderFriendlyDescription")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    p: 1,
                    bgcolor: "#f9fafb",
                    borderRadius: "4px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    direction: dir,
                  }}
                >
                  <Avatar sx={{ width: 20, height: 20, fontSize: "0.688rem", bgcolor: "#6366f1" }}>A</Avatar>
                  <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#1f2937" }}>
                    <strong>Agent Name</strong> {t("frontdesk.common.from")} {inbox.name}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Professional Card - Compact */}
            <Card
              onClick={() => !isSaving && handleFieldChange("sender_name_type", "professional")}
              sx={{
                flex: 1,
                cursor: isSaving ? "not-allowed" : "pointer",
                border: formData.sender_name_type === "professional" ? "2px solid #6366f1" : "1px solid rgba(0,0,0,0.12)",
                bgcolor: formData.sender_name_type === "professional" ? "rgba(99, 102, 241, 0.04)" : "#ffffff",
                transition: "all 0.15s",
                opacity: isSaving ? 0.6 : 1,
                borderRadius: "6px",
                boxShadow: "none",
                "&:hover": isSaving
                  ? {}
                  : {
                      borderColor: "#6366f1",
                      boxShadow: "0 1px 3px rgba(99, 102, 241, 0.1)",
                    },
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#1f2937" }}>
                    {t("frontdesk.settings.inboxesSettingsSenderProfessional")}
                  </Typography>
                  {formData.sender_name_type === "professional" && (
                    <CheckCircleIcon sx={{ color: "#6366f1", fontSize: 16 }} />
                  )}
                </Box>
                <Typography variant="body2" sx={{ mb: 1.5, color: "#6b7280", fontSize: "0.75rem", lineHeight: 1.4 }}>
                  {t("frontdesk.settings.inboxesSettingsSenderProfessionalDescription")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    p: 1,
                    bgcolor: "#f9fafb",
                    borderRadius: "4px",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <Avatar sx={{ width: 20, height: 20, fontSize: "0.688rem", bgcolor: "#6366f1" }}>
                    {formData.business_name?.[0] || inbox.name?.[0]}
                  </Avatar>
                  <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#1f2937" }}>
                    <strong>{formData.business_name || inbox.name}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Business Name Input - Compact */}
          <Box sx={{ mt: 2, direction: dir }}>
            <Typography variant="body2" sx={{ mb: 1, color: "#6b7280", fontSize: "0.813rem" }}>
              {t("frontdesk.settings.inboxesSettingsBusinessNameLabel")}
            </Typography>
            <CompactTextField
              value={formData.business_name}
              onChange={(e) => handleFieldChange("business_name", e.target.value)}
              placeholder={t("frontdesk.settings.inboxesSettingsBusinessNamePlaceholder")}
              disabled={isSaving}
              sx={{ maxWidth: 500 }}
            />
            <Typography sx={{ mt: 0.5, fontSize: "0.75rem", color: "#9ca3af", lineHeight: 1.4 }}>
              {t("frontdesk.settings.inboxesSettingsBusinessNameHint")}
            </Typography>
          </Box>
        </SettingsSection>
      )}

      {/* Lock to Single Conversation (WhatsApp only) - Compact */}
      {isWhatsApp && (
        <SettingsSection
          title={t("frontdesk.settings.inboxesSettingsLockSingleTitle")}
          description={t("frontdesk.settings.inboxesSettingsLockSingleDescription")}
        >
          <FormControl fullWidth size="small" sx={{ maxWidth: 500, direction: dir }}>
            <InputLabel sx={{ fontSize: "0.813rem" }}>{t("frontdesk.settings.inboxesSettingsLockSingleLabel")}</InputLabel>
            <Select
              value={formData.lock_to_single_conversation ? "enabled" : "disabled"}
              onChange={(e) => handleFieldChange("lock_to_single_conversation", e.target.value === "enabled")}
              label={t("frontdesk.settings.inboxesSettingsLockSingleLabel")}
              disabled={isSaving}
              sx={{ fontSize: "0.813rem" }}
            >
              <MenuItem value="enabled" sx={{ fontSize: "0.813rem" }}>{t("frontdesk.settings.inboxesSettingsLockSingleEnabled")}</MenuItem>
              <MenuItem value="disabled" sx={{ fontSize: "0.813rem" }}>{t("frontdesk.settings.inboxesSettingsLockSingleDisabled")}</MenuItem>
            </Select>
          </FormControl>
        </SettingsSection>
      )}

      {/* Feature Toggles - Compact */}
      <SettingsSection title={t("frontdesk.settings.inboxesSettingsFeaturesTitle")} description={t("frontdesk.settings.inboxesSettingsFeaturesDescription")} showDivider={false}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: "6px",
            bgcolor: "#f9fafb",
            border: "1px solid rgba(0,0,0,0.06)",
            direction: dir,
          }}
        >
          <CompactSwitch
            label={t("frontdesk.settings.inboxesSettingsAllowMessagesLabel")}
            description={t("frontdesk.settings.inboxesSettingsAllowMessagesDescription")}
            checked={formData.allow_messages_after_resolved}
            onChange={(e) => handleFieldChange("allow_messages_after_resolved", e.target.checked)}
            disabled={isSaving}
          />
        </Box>
      </SettingsSection>

      {/* Compact Save Button */}
      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: dir === "rtl" ? "flex-start" : "flex-end",
          direction: dir,
        }}
      >
        <CompactPrimaryButton 
          onClick={handleSave} 
          disabled={!hasChanges || isSaving}
          loading={isSaving}
        >
          {isSaving ? t("frontdesk.settings.inboxesSettingsSaving") : t("frontdesk.settings.inboxesSettingsSaveChanges")}
        </CompactPrimaryButton>
      </Box>
    </Box>
  );
};
