/**
 * WhatsApp Template Selector Component
 *
 * Comprehensive template selector with search, filtering, variable input, and preview.
 * Follows Material-UI design patterns and accessibility best practices.
 *
 * Features:
 * - Template search and filtering by category
 * - Real-time template preview
 * - Dynamic variable input forms
 * - Media upload for header components
 * - Validation and error handling
 * - Keyboard navigation (Esc to close, Enter to select)
 * - Responsive design
 *
 * @example
 * ```tsx
 * <WhatsAppTemplateSelector
 *   open={showTemplateSelector}
 *   onClose={() => setShowTemplateSelector(false)}
 *   onSelect={(template, state) => {
 *     const params = convertToTemplateParams(template, state);
 *     sendTemplateMessage(params);
 *   }}
 * />
 * ```
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import type {
  WhatsAppTemplate,
  WhatsAppTemplateSelectorProps,
  TemplateSelectorState,
} from "../../types/whatsapp-templates.types";
import { TemplateCategory } from "../../types/whatsapp-templates.types";
import {
  WHATSAPP_TEMPLATES,
  TEMPLATE_CATEGORY_LABELS,
  searchTemplates,
  getTemplatesByCategory,
} from "../../constants/whatsapp-templates.constants";
import {
  validateTemplateInputs,
  extractVariables,
  getVariableLabels,
} from "../../utils/whatsapp-template.utils";

import { TemplateCard } from "./whatsapp-template-card";
import { TemplatePreview } from "./whatsapp-template-preview";
import { TemplateVariableForm } from "./whatsapp-template-variable-form";

/**
 * WhatsAppTemplateSelector Component
 */
export const WhatsAppTemplateSelector: React.FC<WhatsAppTemplateSelectorProps> = ({
  open,
  onClose,
  onSelect,
  templates = WHATSAPP_TEMPLATES,
  initialTemplate,
  required = false,
}) => {
  // State management
  const [state, setState] = useState<TemplateSelectorState>({
    selectedTemplate: initialTemplate || null,
    bodyVariables: {},
    buttonVariables: {},
    headerMedia: undefined,
    searchQuery: "",
    categoryFilter: "ALL",
    showPreview: true,
    isValid: false,
    errors: [],
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open && !initialTemplate) {
      setState({
        selectedTemplate: null,
        bodyVariables: {},
        buttonVariables: {},
        headerMedia: undefined,
        searchQuery: "",
        categoryFilter: "ALL",
        showPreview: true,
        isValid: false,
        errors: [],
      });
    }
  }, [open, initialTemplate]);

  // Filtered templates based on search and category
  const filteredTemplates = useMemo(() => {
    let results = templates;

    // Filter by category
    if (state.categoryFilter !== "ALL") {
      results = results.filter((t) => t.category === state.categoryFilter);
    }

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          t.components.body.text.toLowerCase().includes(query)
      );
    }

    return results;
  }, [templates, state.categoryFilter, state.searchQuery]);

  // Validate inputs when template or variables change
  useEffect(() => {
    if (state.selectedTemplate) {
      const validation = validateTemplateInputs(state.selectedTemplate, state);
      setState((prev) => ({
        ...prev,
        isValid: validation.isValid,
        errors: validation.errors,
      }));
    }
  }, [state.selectedTemplate, state.bodyVariables, state.buttonVariables, state.headerMedia]);

  // Handle template selection
  const handleSelectTemplate = useCallback((template: WhatsAppTemplate) => {
    setState((prev) => ({
      ...prev,
      selectedTemplate: template,
      bodyVariables: {},
      buttonVariables: {},
      headerMedia: undefined,
      errors: [],
      isValid: false,
    }));
  }, []);

  // Handle variable update
  const handleVariableChange = useCallback((key: string, value: string, type: "body" | "button") => {
    setState((prev) => ({
      ...prev,
      [type === "body" ? "bodyVariables" : "buttonVariables"]: {
        ...prev[type === "body" ? "bodyVariables" : "buttonVariables"],
        [key]: value,
      },
    }));
  }, []);

  // Handle header media update
  const handleHeaderMediaChange = useCallback(
    (media: { url: string; type: "image" | "video" | "document"; file?: File } | undefined) => {
      setState((prev) => ({
        ...prev,
        headerMedia: media,
      }));
    },
    []
  );

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (state.selectedTemplate && state.isValid) {
      onSelect(state.selectedTemplate, state);
      onClose();
    }
  }, [state, onSelect, onClose]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      // Esc to close
      if (e.key === "Escape") {
        onClose();
      }

      // Enter to submit (only if valid and not typing in input)
      if (
        e.key === "Enter" &&
        e.metaKey &&
        state.isValid &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, state.isValid, handleSubmit, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          maxHeight: "90vh",
          backgroundColor: "#1e293b",
          color: "#e2e8f0",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #334155",
          pb: 2,
          pt: 2.5,
          px: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#f1f5f9", fontSize: "1.375rem" }}>
          Select WhatsApp Template
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#94a3b8",
            "&:hover": {
              backgroundColor: "#334155",
              color: "#f1f5f9",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", height: 600 }}>
          {/* Left Panel - Template List */}
          <Box
            sx={{
              width: state.selectedTemplate ? "40%" : "100%",
              borderRight: state.selectedTemplate ? "1px solid #334155" : "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Search and Filter */}
            <Box sx={{ p: 2, borderBottom: "1px solid #334155" }}>
              <Stack spacing={2}>
                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Search templates..."
                  value={state.searchQuery}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, searchQuery: e.target.value }))
                  }
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "#94a3b8" }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      backgroundColor: "#0f172a",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#334155",
                      },
                      "&:hover fieldset": {
                        borderColor: "#475569",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                      },
                    },
                  }}
                />

                {/* Category Filter */}
                <ToggleButtonGroup
                  value={state.categoryFilter}
                  exclusive
                  onChange={(_, value) => {
                    if (value !== null) {
                      setState((prev) => ({ ...prev, categoryFilter: value }));
                    }
                  }}
                  size="small"
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    flexWrap: "wrap",
                    "& .MuiToggleButton-root": {
                      color: "#94a3b8",
                      border: "1px solid #334155",
                      borderRadius: "6px",
                      textTransform: "none",
                      fontSize: "0.813rem",
                      "&.Mui-selected": {
                        backgroundColor: "#3b82f6",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#2563eb",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "#334155",
                      },
                    },
                  }}
                >
                  {(["ALL", ...Object.values(TemplateCategory)] as const).map((category) => (
                    <ToggleButton key={category} value={category}>
                      {TEMPLATE_CATEGORY_LABELS[category]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
            </Box>

            {/* Template List */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {filteredTemplates.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="#64748b">
                    No templates found. Try adjusting your search or filter.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      selected={state.selectedTemplate?.id === template.id}
                      onClick={() => handleSelectTemplate(template)}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Box>

          {/* Right Panel - Template Details & Preview */}
          {state.selectedTemplate && (
            <Box sx={{ width: "60%", display: "flex", flexDirection: "column" }}>
              {/* Template Info */}
              <Box sx={{ p: 2, borderBottom: "1px solid #334155" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Chip
                    label={state.selectedTemplate.category}
                    size="small"
                    sx={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                    }}
                  />
                  <Typography variant="body2" color="#94a3b8">
                    Language: {state.selectedTemplate.language}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
                  {state.selectedTemplate.name.replace(/_/g, " ").toUpperCase()}
                </Typography>
                {state.selectedTemplate.description && (
                  <Typography variant="body2" color="#94a3b8" sx={{ mt: 0.5 }}>
                    {state.selectedTemplate.description}
                  </Typography>
                )}
              </Box>

              {/* Variable Form & Preview */}
              <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                <Stack spacing={3}>
                  {/* Errors */}
                  {state.errors.length > 0 && (
                    <Alert severity="error" sx={{ backgroundColor: "#7f1d1d", color: "#fecaca" }}>
                      <Stack spacing={0.5}>
                        {state.errors.map((error, index) => (
                          <Typography key={index} variant="body2">
                            • {error}
                          </Typography>
                        ))}
                      </Stack>
                    </Alert>
                  )}

                  {/* Variable Form */}
                  <TemplateVariableForm
                    template={state.selectedTemplate}
                    bodyVariables={state.bodyVariables}
                    buttonVariables={state.buttonVariables}
                    headerMedia={state.headerMedia}
                    onBodyVariableChange={handleVariableChange}
                    onButtonVariableChange={handleVariableChange}
                    onHeaderMediaChange={handleHeaderMediaChange}
                  />

                  <Divider sx={{ borderColor: "#334155" }} />

                  {/* Preview */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#f1f5f9", fontWeight: 600, mb: 1.5 }}
                    >
                      Preview
                    </Typography>
                    <TemplatePreview
                      template={state.selectedTemplate}
                      bodyVariables={state.bodyVariables}
                      buttonVariables={state.buttonVariables}
                      headerMedia={state.headerMedia}
                    />
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          borderTop: "1px solid #334155",
          px: 3,
          py: 2,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => {
            if (state.selectedTemplate) {
              setState((prev) => ({
                ...prev,
                selectedTemplate: null,
                bodyVariables: {},
                buttonVariables: {},
                headerMedia: undefined,
              }));
            }
          }}
          disabled={!state.selectedTemplate}
          sx={{
            textTransform: "none",
            color: "#94a3b8",
            "&:hover": {
              backgroundColor: "#334155",
            },
          }}
          startIcon={<RefreshIcon />}
        >
          Clear Selection
        </Button>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
              color: "#94a3b8",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#334155",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!state.isValid || !state.selectedTemplate}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              textTransform: "none",
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: 600,
              px: 3,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#2563eb",
              },
              "&:disabled": {
                backgroundColor: "#475569",
                color: "#64748b",
              },
            }}
          >
            Use Template
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
