import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  MenuItem,
  Menu,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Chip,
  PriorityBadge,
  TicketTypeBadge,
  TagInput,
  PopularTags,
  TagList,
  colorTokens,
} from "@/widgets/frontdesk/design-system";
import { GoMakeAutoComplate } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { TicketPriority, TicketStatus, TicketWithDetails, Tag } from "../types/api.types";
import { formatTicketStatus, apiPriorityToUi, uiPriorityToApi } from "../types/transformers";

interface TicketFormModalProps {
  mode: "create" | "edit";
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => Promise<void>;
  ticket?: TicketWithDetails; // For edit mode

  // Client/Customer search
  clients: Array<{ id: string; label: string }>;
  onClientSearch: (query: string) => void;
  clientsLoading: boolean;

  // Assignee search
  assignees: Array<{ id: string; label: string }>;
  onAssigneeSearch: (query: string) => void;
  assigneesLoading: boolean;

  // Tags
  popularTags?: Tag[];
  onSuggestTags?: (query: string) => Promise<Tag[]>;

  // State
  isSubmitting: boolean;
  error?: string | null;
}

export interface TicketFormData {
  // Create mode fields
  customerId?: string;
  priority: TicketPriority;
  assigneeId?: string;
  tags?: string[]; // Tag names

  // Edit mode fields
  status?: TicketStatus;
  categoryId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

const PRIORITY_OPTIONS: Array<{ id: TicketPriority; label: string }> = [
  { id: "LOW", label: "Low" },
  { id: "MEDIUM", label: "Medium" },
  { id: "HIGH", label: "High" },
  { id: "URGENT", label: "Urgent" },
];

const STATUS_OPTIONS: Array<{ id: TicketStatus; label: string }> = [
  { id: "OPEN", label: "Open" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "PENDING", label: "Pending" },
  { id: "RESOLVED", label: "Resolved" },
  { id: "CLOSED", label: "Closed" },
];

const TYPE_OPTIONS = [
  { id: "Bug", label: "Bug" },
  { id: "Feature", label: "Feature" },
  { id: "Task", label: "Task" },
  { id: "Support", label: "Support" },
];

export const TicketFormModal: React.FC<TicketFormModalProps> = ({
  mode,
  open,
  onClose,
  onSubmit,
  ticket,
  clients,
  onClientSearch,
  clientsLoading,
  assignees,
  onAssigneeSearch,
  assigneesLoading,
  popularTags = [],
  onSuggestTags,
  isSubmitting,
  error,
}) => {
  // Form state
  const [selectedClient, setSelectedClient] = useState<{ id: string; label: string } | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<{ id: string; label: string } | null>(
    null
  );
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority>("MEDIUM");
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("OPEN");
  const [selectedType, setSelectedType] = useState<string>("Support");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Menu anchors
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
  const [priorityMenuAnchor, setPriorityMenuAnchor] = useState<null | HTMLElement>(null);

  // Initialize form with ticket data in edit mode
  useEffect(() => {
    if (mode === "edit" && ticket && open) {
      setSelectedPriority(ticket.priority);
      setSelectedStatus(ticket.status);
      setSelectedTags(ticket.tags?.map((t) => t.name) || []);

      // Find and set assignee if exists
      if (ticket.assigneeId && ticket.assignee) {
        setSelectedAssignee({
          id: ticket.assigneeId,
          label: `${ticket.assignee.name} - ${ticket.assignee.email}`,
        });
      }

      // Set customer if exists
      if (ticket.customerId && ticket.customerName) {
        setSelectedClient({
          id: ticket.customerId,
          label: ticket.customerName,
        });
      }
    } else if (mode === "create" && open) {
      // Reset form for create mode
      resetForm();
    }
  }, [mode, ticket, open]);

  const resetForm = () => {
    setSelectedClient(null);
    setSelectedAssignee(null);
    setSelectedPriority("MEDIUM");
    setSelectedStatus("OPEN");
    setSelectedType("Support");
    setSelectedTags([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    // Validation
    if (mode === "create" && !selectedClient) {
      return;
    }

    const data: TicketFormData = {
      priority: selectedPriority,
      assigneeId: selectedAssignee?.id,
      tags: selectedTags,
    };

    if (mode === "create") {
      data.customerId = selectedClient!.id;
    } else {
      // Edit mode
      data.status = selectedStatus;
      data.customerId = selectedClient?.id;
      data.customerName = ticket?.customerName;
      data.customerEmail = ticket?.customerEmail;
      data.customerPhone = ticket?.customerPhone;
    }

    await onSubmit(data);

    // Reset form on success
    if (!error) {
      resetForm();
    }
  };

  const handleAddTags = (tagNames: string[]) => {
    setSelectedTags((prev) => {
      const combined = [...prev, ...tagNames];
      return Array.from(new Set(combined));
    });
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagName));
  };

  const isCreateMode = mode === "create";
  const title = isCreateMode ? "Create New Ticket" : `Edit Ticket #${ticket?.ticketNumber}`;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
          pb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: colorTokens.error[50],
              borderRadius: "8px",
              border: `1px solid ${colorTokens.error[200]}`,
            }}
          >
            <Typography variant="body2" sx={{ color: colorTokens.error[800] }}>
              {error}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Customer Section */}
          <Box>
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
              Customer {isCreateMode && <span style={{ color: colorTokens.error[600] }}>*</span>}
            </Typography>
            <GoMakeAutoComplate
              options={clients}
              value={selectedClient}
              onChange={(e: any, value: any) => setSelectedClient(value)}
              onInputChange={(e: any, value: string) => onClientSearch(value)}
              getOptionLabel={(option: any) => option?.label || ""}
              placeholder="Search for a customer..."
              loading={clientsLoading}
              withArrow
              style={{
                height: 48,
                borderRadius: "8px",
                border: `1px solid ${colorTokens.semantic.border.default}`,
                backgroundColor: colorTokens.neutral[50],
              }}
            />
          </Box>

          {/* Status Section (Edit mode only) */}
          {!isCreateMode && (
            <Box>
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
                Status
              </Typography>
              <Box
                onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  backgroundColor: colorTokens.neutral[50],
                  borderRadius: "8px",
                  border: `1px solid ${colorTokens.semantic.border.default}`,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: colorTokens.neutral[100],
                  },
                }}
              >
                <Chip
                  label={formatTicketStatus(selectedStatus)}
                  color={
                    selectedStatus === "OPEN"
                      ? "primary"
                      : selectedStatus === "IN_PROGRESS"
                      ? "warning"
                      : selectedStatus === "RESOLVED"
                      ? "success"
                      : selectedStatus === "PENDING"
                      ? "error"
                      : "neutral"
                  }
                  variant="soft"
                  size="small"
                  sx={{ fontSize: 12, fontWeight: 600 }}
                />
              </Box>
              <Menu
                anchorEl={statusMenuAnchor}
                open={Boolean(statusMenuAnchor)}
                onClose={() => setStatusMenuAnchor(null)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem
                    key={status.id}
                    onClick={() => {
                      setSelectedStatus(status.id);
                      setStatusMenuAnchor(null);
                    }}
                  >
                    {status.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* Priority Section */}
          <Box>
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
              Priority
            </Typography>
            <Box
              onClick={(e) => setPriorityMenuAnchor(e.currentTarget)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1.5,
                backgroundColor: colorTokens.neutral[50],
                borderRadius: "8px",
                border: `1px solid ${colorTokens.semantic.border.default}`,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: colorTokens.neutral[100],
                },
              }}
            >
              <PriorityBadge
                priority={apiPriorityToUi(selectedPriority) as "Urgent" | "High" | "Medium" | "Low"}
                mode="both"
                size="sm"
                showBackground={false}
              />
            </Box>
            <Menu
              anchorEl={priorityMenuAnchor}
              open={Boolean(priorityMenuAnchor)}
              onClose={() => setPriorityMenuAnchor(null)}
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <MenuItem
                  key={priority.id}
                  onClick={() => {
                    setSelectedPriority(priority.id);
                    setPriorityMenuAnchor(null);
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PriorityBadge
                      priority={apiPriorityToUi(priority.id) as "Urgent" | "High" | "Medium" | "Low"}
                      mode="both"
                      size="sm"
                      showBackground={false}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Assignee Section */}
          <Box>
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
              Assigned To (Optional)
            </Typography>
            {selectedAssignee ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  backgroundColor: colorTokens.neutral[50],
                  borderRadius: "8px",
                  border: `1px solid ${colorTokens.semantic.border.default}`,
                }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {selectedAssignee.label.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
                    {selectedAssignee.label.split(" - ")[0]}
                  </Typography>
                  {selectedAssignee.label.includes(" - ") && (
                    <Typography
                      variant="caption"
                      sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}
                    >
                      {selectedAssignee.label.split(" - ")[1]}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setSelectedAssignee(null)}
                  sx={{ ml: "auto" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <GoMakeAutoComplate
                options={assignees}
                value={selectedAssignee}
                onChange={(e: any, value: any) => setSelectedAssignee(value)}
                onInputChange={(e: any, value: string) => onAssigneeSearch(value)}
                getOptionLabel={(option: any) => option?.label || ""}
                placeholder="Search for an employee..."
                loading={assigneesLoading}
                withArrow
                style={{
                  height: 48,
                  borderRadius: "8px",
                  border: `1px solid ${colorTokens.semantic.border.default}`,
                  backgroundColor: colorTokens.neutral[50],
                }}
              />
            )}
          </Box>

          {/* Tags Section */}
          <Box>
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
              Tags
            </Typography>
            <Box
              sx={{
                p: 1.5,
                backgroundColor: colorTokens.neutral[50],
                borderRadius: "8px",
                border: `1px solid ${colorTokens.semantic.border.default}`,
              }}
            >
              {/* Popular Tags Quick-Add */}
              {popularTags.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <PopularTags
                    tags={popularTags}
                    selectedTags={selectedTags.map((name) => ({
                      id: name,
                      name,
                      displayName: name,
                      printHouseId: "",
                      color: null,
                      category: "GENERAL" as const,
                      description: null,
                      usageCount: 0,
                      isSystem: false,
                      createdBy: null,
                      createdAt: new Date().toISOString(),
                      updatedAt: null,
                    }))}
                    onTagClick={(tagName) => {
                      if (!selectedTags.includes(tagName)) {
                        handleAddTags([tagName]);
                      }
                    }}
                    maxDisplay={6}
                    showTitle={true}
                  />
                </Box>
              )}

              {/* Show existing tags */}
              {selectedTags.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <TagList
                    tags={selectedTags.map((name) => ({
                      id: name,
                      name,
                      displayName: name,
                      printHouseId: "",
                      color: null,
                      category: "GENERAL" as const,
                      description: null,
                      usageCount: 0,
                      isSystem: false,
                      createdBy: null,
                      createdAt: new Date().toISOString(),
                      updatedAt: null,
                    }))}
                    onRemoveTag={(tagId) => handleRemoveTag(tagId)}
                    size="small"
                    variant="filled"
                  />
                </Box>
              )}

              {/* Tag Input */}
              {onSuggestTags && (
                <TagInput
                  tags={selectedTags.map((name) => ({
                    id: name,
                    name,
                    displayName: name,
                    printHouseId: "",
                    color: null,
                    category: "GENERAL" as const,
                    description: null,
                    usageCount: 0,
                    isSystem: false,
                    createdBy: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: null,
                  }))}
                  onSuggest={onSuggestTags}
                  onAdd={(tagNames) => handleAddTags(tagNames)}
                  onRemove={(tagId) => handleRemoveTag(tagId)}
                  popularTags={popularTags}
                  maxTags={10}
                />
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <PrimaryButton
              variant="outlined"
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                minWidth: "100px",
                height: "40px",
                borderRadius: "8px",
              }}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              onClick={handleSubmit}
              disabled={(isCreateMode && !selectedClient) || isSubmitting}
              style={{
                minWidth: "140px",
                height: "40px",
                borderRadius: "8px",
              }}
            >
              {isSubmitting
                ? isCreateMode
                  ? "Creating..."
                  : "Saving..."
                : isCreateMode
                ? "Create Ticket"
                : "Save Changes"}
            </PrimaryButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
