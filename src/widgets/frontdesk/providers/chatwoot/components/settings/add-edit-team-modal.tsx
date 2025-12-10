/**
 * Add/Edit Team Modal
 *
 * Modal for creating a new team or editing an existing one.
 * Uses unified CompactModal system for consistency.
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import type { Team } from "@/services/frontdesk/api/chatwoot/services/chatwoot-teams.service";
import type { Agent } from "@/services/frontdesk/api/chatwoot/services/chatwoot-agents.service";
import { useChatwootAgents } from "../../hooks/resources/use-chatwoot-agents";
import { CompactModal } from "./CompactModal";
import {
  CompactFormSection,
  CompactTextField,
  CompactModalActions,
  CompactSwitch,
} from "./CompactFormFields";

export interface AddEditTeamData {
  name: string;
  description?: string;
  member_ids?: number[];
}

interface AddEditTeamModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddEditTeamData, teamId?: number) => Promise<void>;
  isSubmitting: boolean;
  accountId: number;
  editingTeam?: Team | null;
  initialMembers?: Agent[];
}

export const AddEditTeamModal: React.FC<AddEditTeamModalProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  accountId,
  editingTeam,
  initialMembers = [],
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { agents, loading: loadingAgents } = useChatwootAgents(accountId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditMode = !!editingTeam;

  // Initialize form
  useEffect(() => {
    if (open) {
      if (editingTeam) {
        setName(editingTeam.name || "");
        setDescription(editingTeam.description || "");
        setSelectedAgentIds(initialMembers.map((m) => m.id));
      } else {
        setName("");
        setDescription("");
        setSelectedAgentIds([]);
      }
      setError(null);
      setSaving(false);
    }
  }, [open, editingTeam, initialMembers]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t("frontdesk.teams.teamNameRequired"));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSubmit(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          member_ids: selectedAgentIds,
        },
        editingTeam?.id
      );
      onClose();
    } catch (err: any) {
      setError(err.message || t("frontdesk.teams.failedToSaveTeam"));
    } finally {
      setSaving(false);
    }
  };

  const handleAgentChange = (event: any) => {
    const value = event.target.value;
    setSelectedAgentIds(typeof value === "string" ? value.split(",").map(Number) : value);
  };

  const canSubmit = !saving && !isSubmitting && name.trim().length > 0;

  return (
    <CompactModal
      open={open}
      onClose={onClose}
      title={isEditMode ? t("frontdesk.teams.editTeam") : t("frontdesk.teams.createTeam")}
      icon={<GroupsIcon />}
      error={error}
      isLoading={loadingAgents}
      disabled={saving || isSubmitting}
      actions={
        <CompactModalActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel={isEditMode ? t("frontdesk.teams.saveChanges") : t("frontdesk.teams.createTeam")}
          isSubmitting={saving || isSubmitting}
          submitDisabled={!canSubmit}
          cancelDisabled={saving || isSubmitting}
        />
      }
    >
      <CompactFormSection>
        {/* Team Name */}
        <CompactTextField
          label={t("frontdesk.teams.teamName")}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("frontdesk.teams.teamNamePlaceholder")}
          disabled={saving || isSubmitting}
          autoFocus
        />

        {/* Description */}
        <CompactTextField
          label={t("frontdesk.teams.description")}
          optional
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("frontdesk.teams.descriptionPlaceholder")}
          multiline
          rows={2}
          disabled={saving || isSubmitting}
        />

        {/* Team Members */}
        <Box sx={{ direction: dir }}>
          <Typography
            sx={{
              mb: 0.75,
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#4b5563",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
            }}
          >
            {t("frontdesk.teams.teamMembers")} <span style={{ fontSize: "0.688rem", color: "#9ca3af", fontWeight: 400 }}>({t("frontdesk.teams.optional")})</span>
          </Typography>
          <FormControl fullWidth size="small" sx={{ direction: dir }}>
            <InputLabel sx={{ fontSize: "0.813rem" }}>{t("frontdesk.teams.selectTeamMembers")}</InputLabel>
            <Select
              multiple
              value={selectedAgentIds}
              onChange={handleAgentChange}
              input={<OutlinedInput label={t("frontdesk.teams.selectTeamMembers")} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((agentId) => {
                    const agent = agents.find((a) => a.id === agentId);
                    return (
                      <Chip
                        key={agentId}
                        label={agent?.name || `Agent ${agentId}`}
                        size="small"
                        sx={{
                          fontSize: "0.75rem",
                          height: 22,
                          backgroundColor: "rgba(99, 102, 241, 0.1)",
                          color: "#6366f1",
                          border: "none",
                        }}
                      />
                    );
                  })}
                </Box>
              )}
              disabled={saving || isSubmitting || loadingAgents}
              sx={{
                fontSize: "0.813rem",
              }}
            >
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id} sx={{ fontSize: "0.813rem", py: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: agent.availability_status === "online" ? "#10b981" : "#d1d5db",
                      }}
                    />
                    <Typography sx={{ fontSize: "0.813rem" }}>{agent.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </CompactFormSection>
    </CompactModal>
  );
};
