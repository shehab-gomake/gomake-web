/**
 * Inbox CSAT Tab
 *
 * Configure customer satisfaction surveys for this inbox.
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import {
  SettingsSection,
  RichTextEditor,
  CSATDisplayTypeSelector,
  type CSATDisplayType,
} from "../../../components/settings";
import { useChatwootLabels } from "../../../hooks/use-chatwoot-labels";

interface CSATConfig {
  enabled: boolean;
  display_type: CSATDisplayType;
  custom_message: string;
  survey_rules: {
    operator: "contains" | "does_not_contain";
    label_ids: number[];
  };
}

interface InboxCSATTabProps {
  inbox: ChatwootInbox;
  accountId: number;
  onSave: (config: CSATConfig) => Promise<void>;
  isSaving: boolean;
}

export const InboxCSATTab: React.FC<InboxCSATTabProps> = ({
  inbox,
  accountId,
  onSave,
  isSaving,
}) => {
  const theme = useTheme();
  const { labels } = useChatwootLabels(accountId);

  const [config, setConfig] = useState<CSATConfig>({
    enabled: inbox.csat_survey_enabled ?? false,
    display_type: "emoji",
    custom_message: "",
    survey_rules: {
      operator: "contains",
      label_ids: [],
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleRuleChange = (field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      survey_rules: { ...prev.survey_rules, [field]: value },
    }));
    setHasChanges(true);
  };

  const handleAddLabel = (labelId: number) => {
    if (!config.survey_rules.label_ids.includes(labelId)) {
      handleRuleChange("label_ids", [...config.survey_rules.label_ids, labelId]);
    }
  };

  const handleRemoveLabel = (labelId: number) => {
    handleRuleChange(
      "label_ids",
      config.survey_rules.label_ids.filter((id) => id !== labelId)
    );
  };

  const handleSave = async () => {
    await onSave(config);
    setHasChanges(false);
  };

  const availableLabels = labels.filter(
    (label) => !config.survey_rules.label_ids.includes(label.id)
  );

  return (
    <Box sx={{ maxWidth: 800 }}>
      {/* Enable CSAT */}
      <SettingsSection
        title="Customer Satisfaction Survey"
        description="Collect feedback from customers after conversations are resolved"
      >
        <FormControlLabel
          control={
            <Switch
              checked={config.enabled}
              onChange={(e) => handleFieldChange("enabled", e.target.checked)}
              disabled={isSaving}
            />
          }
          label="Enable CSAT surveys"
        />
      </SettingsSection>

      {config.enabled && (
        <>
          {/* Display Type */}
          <SettingsSection
            title="Display Type"
            description="Choose how the rating scale is displayed to customers"
          >
            <CSATDisplayTypeSelector
              value={config.display_type}
              onChange={(type) => handleFieldChange("display_type", type)}
              disabled={isSaving}
            />
          </SettingsSection>

          {/* Custom Message */}
          <SettingsSection
            title="Custom Message"
            description="Add a personalized message to your CSAT survey"
          >
            <RichTextEditor
              value={config.custom_message}
              onChange={(value) => handleFieldChange("custom_message", value)}
              placeholder="e.g., How would you rate your experience with our support team?"
              maxLength={200}
              minRows={2}
              disabled={isSaving}
            />
          </SettingsSection>

          {/* Survey Rules */}
          <SettingsSection
            title="Survey Rules"
            description="Control when CSAT surveys are shown based on conversation labels"
            showDivider={false}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Show survey{" "}
                <Select
                  value={config.survey_rules.operator}
                  onChange={(e) =>
                    handleRuleChange(
                      "operator",
                      e.target.value as "contains" | "does_not_contain"
                    )
                  }
                  size="small"
                  disabled={isSaving}
                  sx={{ mx: 1, minWidth: 180 }}
                >
                  <MenuItem value="contains">contains</MenuItem>
                  <MenuItem value="does_not_contain">does not contain</MenuItem>
                </Select>{" "}
                labels:
              </Typography>

              {/* Selected Labels */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {config.survey_rules.label_ids.map((labelId) => {
                  const label = labels.find((l) => l.id === labelId);
                  if (!label) return null;

                  return (
                    <Chip
                      key={labelId}
                      label={label.title}
                      onDelete={() => handleRemoveLabel(labelId)}
                      disabled={isSaving}
                      sx={{
                        bgcolor: label.color + "20",
                        borderLeft: `4px solid ${label.color}`,
                      }}
                    />
                  );
                })}

                {/* Add Label Dropdown */}
                {availableLabels.length > 0 && (
                  <Select
                    value=""
                    onChange={(e) => handleAddLabel(Number(e.target.value))}
                    displayEmpty
                    size="small"
                    disabled={isSaving}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="" disabled>
                      + Add label
                    </MenuItem>
                    {availableLabels.map((label) => (
                      <MenuItem key={label.id} value={label.id}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: label.color,
                            }}
                          />
                          {label.title}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Box>

              {config.survey_rules.label_ids.length === 0 && (
                <Alert severity="info">
                  No label filters applied. Survey will be shown for all
                  conversations.
                </Alert>
              )}
            </Box>
          </SettingsSection>
        </>
      )}

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
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </Box>
    </Box>
  );
};
