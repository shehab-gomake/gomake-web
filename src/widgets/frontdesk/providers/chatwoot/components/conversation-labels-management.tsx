/**
 * Conversation Labels Management
 *
 * Component for managing conversation labels (tags) in Chatwoot.
 * Allows adding and removing labels from a conversation.
 * Upgraded to use autocomplete with existing labels and inline label creation.
 */

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import { chatwootService } from "@/services/frontdesk";
import { extractErrorMessage } from "../utils/api-response-extractors";
import { useChatwootLabels } from "../hooks/use-chatwoot-labels";
import { AddEditLabelModal } from "./settings/add-edit-label-modal";
import type { ChatwootLabel } from "@/store/frontdesk/atoms/chatwoot.atoms";
import type { CreateLabelPayload } from "@/services/frontdesk/api/chatwoot";

interface ConversationLabelsManagementProps {
  /** Current labels */
  labels?: string[];
  /** Account ID for API calls */
  accountId?: number;
  /** Conversation ID for API calls */
  conversationId?: number;
  /** Callback when labels are updated */
  onLabelsChanged?: (newLabels: string[]) => void;
}

export const ConversationLabelsManagement: React.FC<
  ConversationLabelsManagementProps
> = ({ labels = [], accountId, conversationId, onLabelsChanged }) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  // Fetch account labels (only when accountId is available)
  const {
    labels: accountLabels = [],
    loading: labelsLoading,
    createLabel,
  } = useChatwootLabels(accountId ?? undefined, !!accountId);

  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<ChatwootLabel | null>(
    null
  );
  const [updating, setUpdating] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newLabelTitle, setNewLabelTitle] = useState("");

  // Get labels that are not already added to the conversation
  const availableLabels = useMemo(() => {
    if (!Array.isArray(accountLabels)) return [];
    return accountLabels.filter((label) => !labels.includes(label.title));
  }, [accountLabels, labels]);

  // Get label objects for current conversation labels
  const conversationLabelObjects = useMemo(() => {
    if (!Array.isArray(accountLabels))
      return labels.map((title) => ({ title, color: "#6B7280" }));
    return labels.map((labelTitle) => {
      const found = accountLabels.find((al) => al.title === labelTitle);
      return found || { title: labelTitle, color: "#6B7280" };
    });
  }, [labels, accountLabels]);

  const handleSelectLabel = async (label: ChatwootLabel | null) => {
    if (!label || !accountId || !conversationId) return;

    // Prevent duplicate labels
    if (labels.includes(label.title)) {
      setSelectedValue(null);
      setInputValue("");
      return;
    }

    // Optimistic update
    const updatedLabels = [...labels, label.title];
    onLabelsChanged?.(updatedLabels);
    setSelectedValue(null);
    setInputValue("");
    setUpdating(true);

    try {
      await chatwootService.conversations.addConversationLabels(
        accountId,
        conversationId,
        [label.title]
      );
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("[handleSelectLabel] Failed to add label:", errorMessage);
      // Revert optimistic update on error
      onLabelsChanged?.(labels);
      // TODO: Show error toast with message: errorMessage
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateNewLabel = (title: string) => {
    setNewLabelTitle(title);
    setCreateModalOpen(true);
  };

  const handleCreateLabelSubmit = async (payload: CreateLabelPayload) => {
    try {
      const newLabel = await createLabel(payload);
      setCreateModalOpen(false);
      setNewLabelTitle("");

      // Add the newly created label to the conversation
      if (accountId && conversationId) {
        const updatedLabels = [...labels, newLabel.title];
        onLabelsChanged?.(updatedLabels);
        setUpdating(true);

        try {
          await chatwootService.conversations.addConversationLabels(
            accountId,
            conversationId,
            [newLabel.title]
          );
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          console.error(
            "[handleCreateLabelSubmit] Failed to add new label to conversation:",
            errorMessage
          );
          // Revert optimistic update on error
          onLabelsChanged?.(labels);
        } finally {
          setUpdating(false);
        }
      }
    } catch (error) {
      // Error is handled by the modal
      console.error("[handleCreateLabelSubmit] Failed to create label:", error);
    }
  };

  const handleRemoveLabel = async (labelToRemove: string) => {
    if (!accountId || !conversationId) return;

    // Optimistic update
    const remainingLabels = labels.filter((l) => l !== labelToRemove);
    onLabelsChanged?.(remainingLabels);
    setUpdating(true);

    try {
      // Chatwoot API: Remove by posting the remaining labels
      // Update by setting all labels (workaround since there's no direct remove endpoint)
      await chatwootService.conversations.updateConversation(
        accountId,
        conversationId,
        { labels: remainingLabels }
      );
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error(
        "[handleRemoveLabel] Failed to remove label:",
        errorMessage
      );
      // Revert optimistic update on error
      onLabelsChanged?.(labels);
      // TODO: Show error toast with message: errorMessage
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: colorTokens.semantic.text.secondary,
            mb: 1,
            display: "block",
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: 10,
          }}
        >
          {t("frontdesk.detailPanel.labels")}
        </Typography>

        <Box
          sx={{
            p: 1.5,
            backgroundColor: colorTokens.neutral[50],
            borderRadius: "6px",
            border: `1px solid ${colorTokens.semantic.border.default}`,
            minHeight: 60,
          }}
        >
          {/* Existing Labels */}
          {conversationLabelObjects.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
              {conversationLabelObjects.map((label, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    backgroundColor: `${label.color}15`,
                    borderRadius: "12px",
                    padding: "4px 8px",
                    border: `1px solid ${label.color}40`,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: label.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: colorTokens.semantic.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {label.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => !updating && handleRemoveLabel(label.title)}
                    disabled={updating}
                    sx={{
                      p: 0,
                      ml: 0.5,
                      width: 14,
                      height: 14,
                      color: colorTokens.semantic.text.secondary,
                      "&:hover": {
                        color: colorTokens.semantic.text.primary,
                        backgroundColor: `${label.color}25`,
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {/* Add Label Autocomplete */}
          <Autocomplete<ChatwootLabel, false, false, true>
            fullWidth
            size="small"
            value={selectedValue}
            inputValue={inputValue}
            onChange={(_, newValue) => {
              if (
                newValue &&
                typeof newValue === "object" &&
                "id" in newValue
              ) {
                // User selected an existing label
                handleSelectLabel(newValue);
              }
            }}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={availableLabels}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.title;
            }}
            disabled={updating || labelsLoading}
            loading={labelsLoading}
            freeSolo
            filterOptions={(options, params) => {
              // Safety check
              if (!Array.isArray(options)) return [];

              const filtered = options.filter((option) =>
                option.title
                  .toLowerCase()
                  .includes(params.inputValue.toLowerCase())
              );

              // Show "Create new label" option if input doesn't match any existing label
              const inputValue = params.inputValue.trim();
              const isExisting = options.some(
                (option) =>
                  option.title.toLowerCase() === inputValue.toLowerCase()
              );

              if (inputValue !== "" && !isExisting) {
                // Add a special option for creating a new label
                return [
                  ...filtered,
                  { title: inputValue, color: "#6B7280", id: -1 } as any,
                ];
              }

              return filtered;
            }}
            renderOption={(props, option) => {
              const isCreateNew = option.id === -1;
              return (
                <Box
                  component="li"
                  {...props}
                  onClick={(e) => {
                    if (isCreateNew) {
                      e.preventDefault();
                      handleCreateNewLabel(option.title);
                    } else {
                      props.onClick?.(e);
                    }
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 1,
                    px: 1.5,
                    "&:hover": {
                      backgroundColor: isCreateNew
                        ? colorTokens.neutral[100]
                        : undefined,
                    },
                  }}
                >
                  {isCreateNew ? (
                    <>
                      <AddIcon
                        sx={{
                          fontSize: 16,
                          color: colorTokens.semantic.text.secondary,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 13, fontStyle: "italic" }}
                      >
                        Create new label: &quot;{option.title}&quot;
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: option.color,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontSize: 13 }}>
                        {option.title}
                      </Typography>
                    </>
                  )}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("frontdesk.detailPanel.addOrSearchLabels")}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {labelsLoading ? <CircularProgress size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                  sx: {
                    fontSize: 12,
                    "& input": {
                      py: 0.75,
                    },
                  },
                }}
              />
            )}
          />

          {labels.length === 0 && !inputValue && (
            <Typography
              variant="caption"
              sx={{
                color: colorTokens.semantic.text.secondary,
                fontSize: 11,
                display: "block",
                textAlign: "center",
                mt: 1,
              }}
            >
              {t("frontdesk.detailPanel.noLabelsYet")}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Create Label Modal */}
      <AddEditLabelModal
        open={createModalOpen}
        label={
          newLabelTitle
            ? ({
                title: newLabelTitle,
                color: "#FF0000",
                show_on_sidebar: true,
              } as any)
            : null
        }
        onClose={() => {
          setCreateModalOpen(false);
          setNewLabelTitle("");
        }}
        onCreate={handleCreateLabelSubmit}
        onUpdate={async () => {}} // Not used for creation
        loading={labelsLoading}
      />
    </>
  );
};
