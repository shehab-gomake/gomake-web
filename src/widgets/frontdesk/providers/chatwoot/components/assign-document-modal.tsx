import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Divider,
  Alert,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import { GoMakeAutoComplate } from "@/components";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuickActionConfig } from "@/widgets/frontdesk/providers/tickets/types/quick-actions.types";
import { getAllDocumentsApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios } from "@/hooks";
import { useDocumentTitle } from "@/pages-components/quote-new/use-document-title";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { DocumentListItem, DocumentApiResponse, DocumentAutocompleteOption } from "../types/document.types";
import { searchDocuments, formatDocumentForDisplay } from "../utils/document-search.utils";
import { useDebouncedValue } from "../hooks/use-debounced-value";

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
  customerName,
  onConnectToExisting,
  onCreateNew,
}) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [selectedDocument, setSelectedDocument] = useState<DocumentAutocompleteOption | null>(null);
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search term for better performance (300ms delay)
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const { documentTitle } = useDocumentTitle(actionConfig?.documentType || DOCUMENT_TYPE.quote, false);

  // Check if customer ID is required for this document type
  const requiresCustomerId = actionConfig?.requiresCustomerId ?? false;
  const canConnectToExisting = requiresCustomerId ? !!customerId : true;

  // Fetch documents when modal opens
  const fetchDocuments = useCallback(async () => {
    if (!actionConfig?.documentType) return;

    // For documents that require customer ID, we need customerId
    if (requiresCustomerId && !customerId) {
      setDocuments([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const callBack = (res: any) => {
        console.log("[AssignDocumentModal] API Response:", res);

        if (res?.success) {
          // Handle different response structures
          // The API might return data directly or nested in data.data.data
          // getSetApiData extracts data from result.data.data.data
          let documentsData: DocumentListItem[] = [];

          if (Array.isArray(res.data)) {
            documentsData = res.data;
          } else if (res.data?.data && Array.isArray(res.data.data)) {
            documentsData = res.data.data;
          } else if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
            documentsData = res.data.data.data;
          }

          // Filter documents by type
          const filteredDocs = documentsData.filter((doc) => doc.documentType === actionConfig.documentType);

          console.log("[AssignDocumentModal] Filtered documents:", filteredDocs);
          setDocuments(filteredDocs);
          setError(null);
        } else {
          // API returned error
          const errorMessage =
            res.message ||
            (res.data as any)?.message ||
            (res as any).errors?.message ||
            t("frontdesk.errorFetchingDocuments", {
              defaultValue: "Failed to fetch documents",
            });

          console.error("[AssignDocumentModal] API Error:", {
            success: res?.success,
            message: errorMessage,
            fullResponse: res,
          });

          setDocuments([]);
          setError(errorMessage);
        }
        setLoading(false);
      };

      // Use getAllDocumentsApi with filters (same pattern as use-quote.tsx)
      // This is the standard way to fetch filtered documents
      const requestData: any = {
        documentType: actionConfig.documentType,
        data: {
          model: {
            pageNumber: 1,
            pageSize: 100, // Get more documents for search
          },
        },
      };

      // Add customerId filter if required and available
      if (requiresCustomerId && customerId) {
        requestData.data.customerId = customerId;
      }

      console.log("[AssignDocumentModal] Fetching documents with params:", requestData);

      await getAllDocumentsApi(callApi, callBack, requestData);
    } catch (err: any) {
      console.error("[AssignDocumentModal] Exception fetching documents:", err);
      setDocuments([]);
      setError(
        err.message ||
          t("frontdesk.errorFetchingDocuments", {
            defaultValue: "An error occurred while fetching documents",
          })
      );
      setLoading(false);
    }
  }, [actionConfig?.documentType, customerId, callApi, requiresCustomerId, t]);

  useEffect(() => {
    if (open && actionConfig?.documentType) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setSelectedDocument(null);
      setSearchTerm("");
      setError(null);
    }
  }, [open, actionConfig?.documentType, fetchDocuments]);

  // Search and rank documents by relevance using advanced search utility
  const documentOptions = useMemo((): DocumentAutocompleteOption[] => {
    if (!documents.length) return [];

    // Use advanced search with relevance scoring
    const scoredDocs = searchDocuments(documents, debouncedSearchTerm);

    // Return top 50 results (sorted by relevance)
    return scoredDocs.slice(0, 50).map((doc) => ({
      id: doc.id,
      label: doc.label,
      value: doc.value,
      documentNumber: doc.documentNumber,
      documentId: doc.documentId,
    }));
  }, [documents, debouncedSearchTerm]);

  const handleConnect = () => {
    if (selectedDocument?.documentId) {
      onConnectToExisting(selectedDocument.documentId);
      onClose();
    }
  };

  const handleCreateNew = () => {
    onCreateNew();
    onClose();
  };

  const { primaryColor, neutralColor } = useGomakeTheme();
  const modalTitle = actionConfig
    ? `${t("frontdesk.assignTo", { defaultValue: "Assign to" })} ${documentTitle || actionConfig.label.replace("Assign to ", "")}`
    : "Assign Document";

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          onClick={onClose}
          size="small"
          disabled={loading}
          aria-label="Close assign document modal"
          sx={{
            color: neutralColor(600),
            "&:hover": {
              bgcolor: neutralColor(100),
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, px: 3, pb: 2 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Customer Info - Only show if customer exists */}
          {customerName && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                backgroundColor: neutralColor(50),
                borderRadius: "6px",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: primaryColor(50),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: primaryColor(600),
                }}
              >
                <PersonIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: neutralColor(700),
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 0.5,
                  }}
                >
                  {t("frontdesk.customer", { defaultValue: "Customer" })}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: neutralColor(900),
                    fontSize: "1rem",
                  }}
                >
                  {customerName}
                </Typography>
              </Box>
            </Box>
          )}

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
                  sx={{
                    mt: 2.5,
                    fontSize: "0.875rem",
                    color: neutralColor(600),
                  }}
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
                    value={selectedDocument}
                    onChange={(_e: React.SyntheticEvent, value: DocumentAutocompleteOption | null) => {
                      setSelectedDocument(value);
                    }}
                    onInputChange={(_e: React.SyntheticEvent, value: string) => {
                      setSearchTerm(value || "");
                    }}
                    getOptionLabel={(option: DocumentAutocompleteOption) => option?.label || ""}
                    renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: DocumentAutocompleteOption) => {
                      const displayInfo = formatDocumentForDisplay(option.value);

                      return (
                        <Box
                          component="li"
                          {...props}
                          key={option.id}
                          sx={{
                            py: 1.75,
                            px: 2,
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            borderBottom: `1px solid ${neutralColor(200)}`,
                            "&:last-child": {
                              borderBottom: "none",
                            },
                            "&:hover": {
                              backgroundColor: neutralColor(50),
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              backgroundColor: neutralColor(100),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              mt: 0.25,
                            }}
                          >
                            <DescriptionOutlinedIcon sx={{ fontSize: 18, color: neutralColor(600) }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: neutralColor(900),
                                  fontSize: "0.9375rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flex: 1,
                                }}
                              >
                                {displayInfo.number}
                              </Typography>
                              {displayInfo.hasStatus && (
                                <Chip
                                  label={displayInfo.status}
                                  size="small"
                                  icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    fontWeight: 500,
                                    "& .MuiChip-icon": {
                                      fontSize: 14,
                                      marginLeft: "4px",
                                    },
                                  }}
                                />
                              )}
                            </Stack>
                            <Typography
                              variant="caption"
                              sx={{
                                color: neutralColor(600),
                                fontSize: "0.8125rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block",
                                mb: 0.5,
                              }}
                            >
                              {displayInfo.clientName}
                            </Typography>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                              {displayInfo.date && (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <CalendarTodayIcon sx={{ fontSize: 12, color: neutralColor(600) }} />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: neutralColor(600),
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    {displayInfo.date}
                                  </Typography>
                                </Stack>
                              )}
                              {displayInfo.hasAmount && (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <AttachMoneyIcon sx={{ fontSize: 12, color: neutralColor(600) }} />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: neutralColor(600),
                                      fontSize: "0.75rem",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {displayInfo.amount}
                                  </Typography>
                                </Stack>
                              )}
                            </Stack>
                          </Box>
                        </Box>
                      );
                    }}
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
                  />
                  {!loading && documents.length > 0 && (
                    <Box
                      sx={{
                        mt: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SearchIcon sx={{ fontSize: 16, color: neutralColor(600) }} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.8125rem",
                            color: neutralColor(600),
                          }}
                        >
                          {debouncedSearchTerm
                            ? `${documentOptions.length} ${documentOptions.length === 1 ? "result" : "results"} found`
                            : `${documents.length} ${documents.length === 1 ? "document" : "documents"} available`}
                        </Typography>
                      </Box>
                      {debouncedSearchTerm && documentOptions.length > 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.75rem",
                            fontStyle: "italic",
                            color: neutralColor(600),
                          }}
                        >
                          Sorted by relevance
                        </Typography>
                      )}
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
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        color: neutralColor(600),
                      }}
                    >
                      {requiresCustomerId
                        ? t("frontdesk.noDocumentsFound", { defaultValue: "No documents found for this customer" })
                        : t("frontdesk.connectToExistingNotAvailable", {
                            defaultValue: "Connecting to existing documents is not available for this document type",
                          })}
                    </Typography>
                  </Box>
                )}

                {selectedDocument &&
                  (() => {
                    const displayInfo = formatDocumentForDisplay(selectedDocument.value);

                    return (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          borderRadius: "6px",
                          backgroundColor: primaryColor(50),
                          border: `1px solid ${primaryColor(200)}`,
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              backgroundColor: primaryColor(50),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: primaryColor(600),
                              flexShrink: 0,
                            }}
                          >
                            <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                color: primaryColor(600),
                                fontWeight: 600,
                                display: "block",
                                mb: 0.5,
                                fontSize: "0.75rem",
                              }}
                            >
                              {t("frontdesk.selectedDocument", { defaultValue: "Selected Document" })}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: neutralColor(900),
                                fontSize: "0.9375rem",
                                mb: 0.5,
                              }}
                            >
                              {displayInfo.number}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: neutralColor(600),
                                fontSize: "0.8125rem",
                                display: "block",
                                mb: 0.75,
                              }}
                            >
                              {displayInfo.clientName}
                            </Typography>
                            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                              {displayInfo.date && (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <CalendarTodayIcon sx={{ fontSize: 12, color: neutralColor(600) }} />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: neutralColor(600),
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    {displayInfo.date}
                                  </Typography>
                                </Stack>
                              )}
                              {displayInfo.hasAmount && (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <AttachMoneyIcon sx={{ fontSize: 12, color: neutralColor(600) }} />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: neutralColor(600),
                                      fontSize: "0.75rem",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {displayInfo.amount}
                                  </Typography>
                                </Stack>
                              )}
                              {displayInfo.hasStatus && (
                                <Chip
                                  label={displayInfo.status}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    fontWeight: 500,
                                  }}
                                />
                              )}
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    );
                  })()}
              </>
            )}
          </Box>

          {/* Divider */}
          <Divider />

          {/* Create New Section */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: neutralColor(800),
                fontWeight: 600,
                mb: 1.5,
              }}
            >
              {t("frontdesk.createNew", { defaultValue: "Create new" })} {documentTitle}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: neutralColor(600),
                fontSize: "0.875rem",
              }}
            >
              {customerName
                ? t("frontdesk.createForCustomer", { defaultValue: "Create for {{customer}}", customer: customerName })
                : t("frontdesk.startFresh", { defaultValue: "Start with a blank document" })}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${neutralColor(200)}`, gap: 1.5 }}>
        <Button onClick={onClose} disabled={loading}>
          {t("frontdesk.cancel", { defaultValue: "Cancel" })}
        </Button>
        <Stack direction="row" spacing={1.5}>
          {canConnectToExisting && (
            <Button onClick={handleConnect} disabled={!selectedDocument || loading} variant="contained" startIcon={<LinkIcon />}>
              {selectedDocument
                ? t("frontdesk.linkDocument", { defaultValue: "Link Document" })
                : t("frontdesk.selectDocumentFirst", { defaultValue: "Select Document" })}
            </Button>
          )}
          <Button onClick={handleCreateNew} variant="contained" startIcon={<AddIcon />} disabled={loading}>
            {t("frontdesk.createNewDocument", { defaultValue: "Create New Document" })}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
