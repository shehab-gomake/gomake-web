/**
 * Edit Agent Modal
 *
 * Modal for editing agent role and availability status.
 * Uses unified CompactModal component for consistency.
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  MenuItem,
  FormControl,
  Box,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import PersonIcon from "@mui/icons-material/Person";
import type { Agent, AgentUpdatePayload } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import { CompactModal } from "./CompactModal";
import {
  CompactLabel,
  CompactTextField,
  CompactFormSection,
  CompactModalActions,
  CompactSwitch,
} from "./CompactFormFields";

interface EditAgentModalProps {
  open: boolean;
  agent: Agent | null;
  onClose: () => void;
  onSave: (agentId: number, updates: AgentUpdatePayload) => Promise<void>;
  loading?: boolean;
}

export const EditAgentModal: React.FC<EditAgentModalProps> = ({
  open,
  agent,
  onClose,
  onSave,
  loading = false,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("agent");
  const [availabilityStatus, setAvailabilityStatus] = useState<string>("offline");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Initialize form values when agent changes
  useEffect(() => {
    if (agent) {
      setName(agent.name || agent.available_name || agent.email || "");
      setRole(agent.role || "agent");
      setAvailabilityStatus(agent.availability_status || "offline");
      setError(null);
    }
  }, [agent]);

  const handleSave = async () => {
    if (!agent?.id) return;

    setSaving(true);
    setError(null);

    try {
      await onSave(agent.id, {
        name,
        role,
        availability_status: availabilityStatus,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || t("frontdesk.settings.agentsEditFailedToUpdate"));
    } finally {
      setSaving(false);
    }
  };

  if (!agent) return null;

  const displayName = name || agent.name || agent.available_name || agent.email || t("frontdesk.settings.agentsUnknown");

  return (
    <CompactModal
      open={open}
      onClose={onClose}
      title={t("frontdesk.settings.agentsEditTitle", { name: displayName })}
      icon={<PersonIcon />}
      error={error}
      disabled={saving || loading}
      actions={
        <CompactModalActions
          onCancel={onClose}
          onSubmit={handleSave}
          submitLabel={t("frontdesk.settings.agentsEditSaveChanges")}
          isSubmitting={saving || loading}
        />
      }
    >
      <CompactFormSection>
        {/* Agent Name */}
        <CompactTextField
          label={t("frontdesk.settings.agentsEditName")}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={saving || loading}
          placeholder={t("frontdesk.settings.agentsEditNamePlaceholder")}
        />

        {/* Role */}
        <Box sx={{ direction: dir }}>
          <CompactLabel required>{t("frontdesk.settings.agentsEditRole")}</CompactLabel>
          <FormControl fullWidth size="small" sx={{ direction: dir }}>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={saving || loading}
              sx={{
                fontSize: "0.813rem",
              }}
            >
              <MenuItem value="administrator" sx={{ fontSize: "0.813rem" }}>
                {t("frontdesk.settings.agentsEditRoleAdministrator")}
              </MenuItem>
              <MenuItem value="agent" sx={{ fontSize: "0.813rem" }}>
                {t("frontdesk.settings.agentsEditRoleAgent")}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Availability */}
        <Box sx={{ direction: dir }}>
          <CompactLabel required>{t("frontdesk.settings.agentsEditAvailability")}</CompactLabel>
          <FormControl fullWidth size="small" sx={{ direction: dir }}>
            <Select
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
              disabled={saving || loading}
              sx={{
                fontSize: "0.813rem",
              }}
            >
              <MenuItem value="online" sx={{ fontSize: "0.813rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, direction: dir }}>
                  <CircleIcon sx={{ fontSize: 8, color: "#10b981" }} />
                  <span>{t("frontdesk.settings.agentsEditAvailabilityOnline")}</span>
                </Box>
              </MenuItem>
              <MenuItem value="busy" sx={{ fontSize: "0.813rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, direction: dir }}>
                  <CircleIcon sx={{ fontSize: 8, color: "#f59e0b" }} />
                  <span>{t("frontdesk.settings.agentsEditAvailabilityBusy")}</span>
                </Box>
              </MenuItem>
              <MenuItem value="offline" sx={{ fontSize: "0.813rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, direction: dir }}>
                  <CircleIcon sx={{ fontSize: 8, color: "#6b7280" }} />
                  <span>{t("frontdesk.settings.agentsEditAvailabilityOffline")}</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CompactFormSection>
    </CompactModal>
  );
};
