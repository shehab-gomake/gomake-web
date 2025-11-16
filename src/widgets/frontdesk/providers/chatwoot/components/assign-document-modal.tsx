import React, { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
} from "@mui/material";
import { GoMakeAutoComplate } from "@/components";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuickActionConfig } from "@/widgets/frontdesk/providers/tickets/types/quick-actions.types";
import { useDocumentTitle } from "@/pages-components/quote-new/use-document-title";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import AddIcon from "@mui/icons-material/Add";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import { DocumentAutocompleteOption, NormalizedDocument } from "../types/document.types";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useDocumentFetch } from "../hooks/document/use-document-fetch";
import { _renderStatus } from "@/utils/constants";
import { DocumentIcon } from "./document/DocumentIcon";
import { DocumentInfoDisplay } from "./document/DocumentInfoDisplay";
import { SourceDocumentLinks } from "./document/SourceDocumentLinks";
import {
  formatDocumentDate,
  formatDocumentPrice,
  createDocumentLabel,
} from "../utils/document/formatting.utils";

interface AssignDocumentModalProps {
  open: boolean;
  onClose: () => void;
  actionConfig: QuickActionConfig | null;
  customerId?: string;
  customerName?: string;
  onConnectToExisting: (documentId: string) => void;
  onCreateNew: () => void;
}

export const AssignDocumentModal: React.FC<AssignDocumentModalProps> = ({
  open,
  onClose,
  actionConfig,
  customerId,
  onConnectToExisting,
  onCreateNew,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search term for better performance (300ms delay)
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const { documentTitle } = useDocumentTitle(actionConfig?.documentType || DOCUMENT_TYPE.quote, false);

  // Check if customer ID is required for this document type
  const requiresCustomerId = actionConfig?.requiresCustomerId ?? false;
  const canConnectToExisting = requiresCustomerId ? !!customerId : true;

  // Use the new hook for fetching documents
  const {
    documents,
    loading,
    error,
    clearError,
  } = useDocumentFetch({
    documentType: actionConfig?.documentType,
    customerId,
    requiresCustomerId,
    searchTerm: debouncedSearchTerm,
    enabled: open && !!actionConfig?.documentType,
    pageSize: 100,
  });

  // Reset state when modal closes
  const handleClose = useCallback(() => {
    setSearchTerm("");
    onClose();
  }, [onClose]);

  // Convert normalized documents to autocomplete options
  const documentOptions = useMemo((): DocumentAutocompleteOption[] => {
    if (!documents.length) return [];

    // Sort by date (newest first) and limit to 50
    const sortedDocs = [...documents].sort((a, b) => {
      const dateA = new Date(a.createdDate || 0).getTime();
      const dateB = new Date(b.createdDate || 0).getTime();
      return dateB - dateA;
    });

    return sortedDocs.slice(0, 50).map((doc) => ({
      id: doc.id,
      label: createDocumentLabel(doc),
      value: doc as any, // Cast to DocumentListItem for compatibility
      documentNumber: doc.number,
      documentId: doc.id,
    }));
  }, [documents]);

  const handleDocumentSelect = useCallback((documentId: string) => {
    onConnectToExisting(documentId);
    handleClose();
  }, [onConnectToExisting, handleClose]);

  const handleCreateNew = () => {
    onCreateNew();
    handleClose();
  };

  const { primaryColor, neutralColor } = useGomakeTheme();
  const modalTitle = actionConfig
    ? `${t("frontdesk.assignTo", { defaultValue: "Assign to" })} ${documentTitle || actionConfig.label.replace("Assign to ", "")}`
    : "Assign Document";

  // Render document option in autocomplete dropdown
  const renderDocumentOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: DocumentAutocompleteOption) => {
      const doc = option.value as unknown as NormalizedDocument;

      // Status rendering
      const statusElement = actionConfig?.documentType
        ? actionConfig.documentType === DOCUMENT_TYPE.invoice && doc.isDraft
          ? <span style={{ color: "#e77676" }}>{t("sales.quote.draft")}</span>
          : _renderStatus(actionConfig.documentType, doc, t)
        : null;

      return (
        <Box
          component="li"
          {...props}
          key={option.id}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDocumentSelect(option.documentId);
          }}
          sx={{
            py: 1.25,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: `1px solid ${neutralColor(200)}`,
            "&:last-child": { borderBottom: "none" },
            "&:hover": { backgroundColor: neutralColor(50) },
            cursor: "pointer",
          }}
        >
          <DocumentIcon
            size="medium"
            variant="neutral"
            neutralColor={neutralColor}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <DocumentInfoDisplay
              number={doc.number}
              amount={doc.totalPrice > 0 ? formatDocumentPrice(doc.totalPrice, doc.currency) : undefined}
              date={formatDocumentDate(doc.createdDate)}
              neutralColor={neutralColor}
            >
              {doc.sourceDocuments.length > 0 && (
                <SourceDocumentLinks
                  sourceDocuments={doc.sourceDocuments}
                  maxDisplay={2}
                  layout="inline"
                  neutralColor={neutralColor}
                />
              )}
            </DocumentInfoDisplay>
          </Box>
          {statusElement && (
            <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {statusElement}
            </Box>
          )}
        </Box>
      );
    },
    [actionConfig?.documentType, neutralColor, t, handleDocumentSelect]
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="assign-document-modal-title"
      PaperProps={{
        sx: {
          borderRadius: "8px",
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          pt: 2.5,
          px: 3,
          borderBottom: `1px solid ${neutralColor(200)}`,
        }}
      >
        <Typography
          id="assign-document-modal-title"
          variant="h6"
          sx={{ fontWeight: 600, fontSize: "1.125rem", color: neutralColor(900) }}
        >
          {modalTitle}
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          disabled={loading}
          aria-label="Close assign document modal"
          sx={{
            color: neutralColor(600),
            "&:hover": { bgcolor: neutralColor(100) },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, px: 3, pb: 2 }}>
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          {/* Connect to Existing Section */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: neutralColor(800),
                fontWeight: 600,
                mb: 1.5,
              }}
            >
              {t("frontdesk.connectToExisting", { defaultValue: "Connect to existing" })} {documentTitle}
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 5 }}>
                <CircularProgress size={36} sx={{ color: primaryColor(600) }} />
                <Typography
                  variant="body2"
                  sx={{ mt: 2.5, fontSize: "0.875rem", color: neutralColor(600) }}
                >
                  {t("frontdesk.loadingDocuments", { defaultValue: "Loading documents..." })}
                </Typography>
              </Box>
            ) : !canConnectToExisting ? (
              <Alert severity="warning" icon={<ErrorOutlineIcon />}>
                {t("frontdesk.customerRequired", { defaultValue: "Customer must be linked to conversation first" })}
              </Alert>
            ) : (
              <>
                <Box sx={{ position: "relative" }}>
                  <GoMakeAutoComplate
                    options={documentOptions}
                    placeholder={t("frontdesk.searchDocuments", {
                      defaultValue: "Search by number, customer, date, status, or amount...",
                    })}
                    value={null}
                    onChange={() => {}}
                    onInputChange={(_e: React.SyntheticEvent, value: string) => {
                      setSearchTerm(value || "");
                    }}
                    getOptionLabel={(option: DocumentAutocompleteOption) => option?.label || ""}
                    renderOption={renderDocumentOption}
                    noOptionsText={
                      debouncedSearchTerm
                        ? t("frontdesk.noResultsFound", {
                            defaultValue:
                              "No matching documents found. Try searching by document number, customer name, date, status, or amount.",
                          })
                        : t("frontdesk.startTypingToSearch", {
                            defaultValue: "Start typing to search by number, customer, date, status, or amount...",
                          })
                    }
                    loading={loading}
                    disabled={!canConnectToExisting || !!error}
                    style={{ width: "100%" }}
                    clearOnBlur={false}
                    blurOnSelect={false}
                  />
                  {!loading && documents.length > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "8px",
                        right: "12px",
                        zIndex: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.75rem",
                          color: neutralColor(600),
                          fontWeight: 500,
                          backgroundColor: neutralColor(0),
                          px: 1,
                          py: 0.5,
                          borderRadius: "4px",
                        }}
                      >
                        {debouncedSearchTerm
                          ? `${documentOptions.length} ${documentOptions.length === 1 ? "result" : "results"}`
                          : `${documents.length} ${documents.length === 1 ? "document" : "documents"}`}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {documents.length === 0 && !loading && canConnectToExisting && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      textAlign: "center",
                      backgroundColor: neutralColor(50),
                      borderRadius: "6px",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: "0.875rem", color: neutralColor(600) }}>
                      {requiresCustomerId
                        ? t("frontdesk.noDocumentsFound", { defaultValue: "No documents found for this customer" })
                        : t("frontdesk.connectToExistingNotAvailable", {
                            defaultValue: "Connecting to existing documents is not available for this document type",
                          })}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${neutralColor(200)}`, gap: 1.5 }}>
        <Button onClick={handleCreateNew} variant="contained" startIcon={<AddIcon />} disabled={loading}>
          {t("frontdesk.createNewDocument", { defaultValue: "Create New Document" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
