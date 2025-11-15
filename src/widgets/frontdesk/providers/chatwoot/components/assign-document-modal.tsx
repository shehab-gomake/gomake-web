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
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloseIcon from "@mui/icons-material/Close";
import { DocumentListItem, DocumentApiResponse, DocumentAutocompleteOption } from "../types/document.types";
import { searchDocuments, formatDocumentForDisplay } from "../utils/document-search.utils";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { _renderStatus } from "@/utils/constants";
import { renderDocumentTypeForSourceDocumentNumber, renderURLDocumentType } from "@/widgets/settings-documenting/documentDesign/enums/document-type";

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
          // Use the same response structure as invoice page (use-quote.tsx line 1616)
          // The API already filters by documentType when passed in the request
          const rawDocuments = res?.data?.data || [];

          // Map API response to match invoice page field structure
          // API returns: clientName/customerName, totalPrice, createdDate/creationDate, statusTitleText
          // We need to normalize these fields for consistent display
          const documentsData: DocumentListItem[] = rawDocuments.map((doc: any) => {
            // Debug: Log first document to see structure
            if (rawDocuments.indexOf(doc) === 0) {
              console.log("[AssignDocumentModal] Sample document from API:", doc);
              console.log("[AssignDocumentModal] Available number fields:", {
                number: doc.number,
                documentNumber: doc.documentNumber,
                invoiceNumber: doc.invoiceNumber,
                quoteNumber: doc.quoteNumber,
                orderNumber: doc.orderNumber,
              });
            }
            
            // Spread original doc first, then override with normalized fields
            return {
            ...doc,
            id: doc.id,
            // Document number - check multiple possible fields (same as invoice page uses doc.number)
            // This must come after spread to ensure our mapping takes precedence
            number: doc.number || doc.documentNumber || doc.invoiceNumber || doc.quoteNumber || doc.orderNumber || doc.receiptNumber || null,
            documentType: doc.documentType || actionConfig?.documentType,
            // Map client/customer fields (same as invoice page line 1631)
            client: {
              id: doc.clientId || doc.customerId,
              name: doc.clientName || doc.customerName,
              code: doc.clientCode || doc.customerCode,
            },
            // Map date fields (same as invoice page line 1621-1622)
            createDate: doc.createdDate || doc.creationDate,
            // Map price fields (same as invoice page line 1662-1663)
            total: doc.totalPrice !== undefined ? doc.totalPrice : doc.total,
            totalPriceWithoutVat: doc.totalPriceWithoutVat,
            currency: doc.currency,
            // Map status fields (same as invoice page line 1665)
            status: doc.status,
            statusTitleText: doc.statusTitleText, // Required for _renderStatus function
            approvalStatus: doc.approvalStatus,
            userName: doc.userName,
            isDraft: doc.isDraft,
            externalDocumentNumber: doc.externalDocumentNumber,
            documentNumbers: doc.documentNumbers,
            secondDocumentNumbers: doc.secondDocumentNumbers,
            thirdDocumentNumbers: doc.thirdDocumentNumbers,
            titleDocumentNumber: doc.titleDocumentNumber,
            titleSecondDocumentNumber: doc.titleSecondDocumentNumber,
            titleThirdDocumentNumber: doc.titleThirdDocumentNumber,
            titleExternalDocumentNumber: doc.titleExternalDocumentNumber,
            // Source document fields (for invoices/delivery notes)
            sourceDocumentNumber: doc.sourceDocumentNumber,
          };
          });

          console.log("[AssignDocumentModal] Documents received:", documentsData);
          setDocuments(documentsData);
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

      // Use getAllDocumentsApi with filters (same pattern as invoice page - use-quote.tsx line 1923)
      // The API filters by documentType automatically, no need for client-side filtering
      const requestData: any = {
        documentType: actionConfig.documentType,
        data: {
          model: {
            pageNumber: 1,
            pageSize: 100, // Get more documents for search
            order: null,
          },
        },
      };

      // Add customerId filter if required and available (same pattern as use-quote.tsx line 2426)
      if (requiresCustomerId && customerId) {
        requestData.data.customerId = customerId;
      }

      // Add patternSearch if user has typed a search term (same pattern as useMentionSearch.ts line 74)
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        requestData.data.patternSearch = debouncedSearchTerm.trim();
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
  }, [actionConfig?.documentType, customerId, callApi, requiresCustomerId, debouncedSearchTerm, t]);

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

  // Document options for autocomplete
  // When patternSearch is used, API already filters results, so we use them directly
  // Otherwise, use client-side search for additional filtering
  const documentOptions = useMemo((): DocumentAutocompleteOption[] => {
    if (!documents.length) return [];

    // If we have a search term and API filtered results, use them directly
    // Otherwise, use client-side search for additional filtering
    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      // API already filtered by patternSearch, use results directly
      return documents.map((doc) => ({
        id: doc.id,
        label: `${doc.number || 'N/A'} - ${doc.client?.name || (doc as any).clientName || (doc as any).customerName || 'Unknown'}`,
        value: doc,
        documentNumber: doc.number,
        documentId: doc.id,
      }));
    }

    // No search term - use client-side search for sorting/ranking
    const scoredDocs = searchDocuments(documents, "");

    // Return top 50 results (sorted by date, newest first)
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
                      const document = option.value;
                      // Use same status rendering logic as invoice page (use-quote.tsx line 905-910)
                      const statusElement = actionConfig?.documentType
                        ? (actionConfig.documentType === DOCUMENT_TYPE.invoice && document.isDraft
                            ? <span style={{ color: "#e77676" }}>{t("sales.quote.draft")}</span>
                            : _renderStatus(actionConfig.documentType, document, t))
                        : null;
                      
                      // Source documents (same as invoice page line 884-891)
                      const sourceDocuments = document.sourceDocumentNumber && document.sourceDocumentNumber.length > 0
                        ? document.sourceDocumentNumber.slice(0, 2).map((item: any, index: number) => (
                            <a
                              key={index}
                              href={renderURLDocumentType(item?.sourceDocumentType, item.documentId)}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                cursor: "pointer",
                                color: "#5859A8",
                                textDecoration: "none",
                                fontSize: "0.75rem",
                                marginRight: index < Math.min(document.sourceDocumentNumber.length, 2) - 1 ? "4px" : "0",
                              }}
                            >
                              {t(renderDocumentTypeForSourceDocumentNumber(item?.sourceDocumentType))}: {item?.documentNumber}
                            </a>
                          ))
                        : null;

                      return (
                        <Box
                          component="li"
                          {...props}
                          key={option.id}
                          sx={{
                            py: 1.25,
                            px: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
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
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              backgroundColor: neutralColor(100),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <DescriptionOutlinedIcon sx={{ fontSize: 16, color: neutralColor(600) }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: neutralColor(900),
                                  fontSize: "0.875rem",
                                  minWidth: "80px",
                                }}
                              >
                                {displayInfo.number}
                              </Typography>
                              {displayInfo.hasAmount && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: neutralColor(700),
                                    fontSize: "0.8125rem",
                                    fontWeight: 500,
                                    minWidth: "100px",
                                  }}
                                >
                                  {displayInfo.amount}
                                </Typography>
                              )}
                              {displayInfo.date && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: neutralColor(600),
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {displayInfo.date}
                                </Typography>
                              )}
                            </Stack>
                            {sourceDocuments && (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center" }}>
                                {sourceDocuments}
                                {document.sourceDocumentNumber.length > 2 && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: neutralColor(600),
                                      fontSize: "0.7rem",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    +{document.sourceDocumentNumber.length - 2} more
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                          {statusElement && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexShrink: 0,
                                // Let _renderStatus use its default styles (same as invoice page)
                                // No fontSize/fontWeight overrides to maintain consistency
                              }}
                            >
                              {statusElement}
                            </Box>
                          )}
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
                    const document = selectedDocument.value;
                    // Use same status rendering logic as invoice page (use-quote.tsx line 905-910)
                    const statusElement = actionConfig?.documentType
                      ? (actionConfig.documentType === DOCUMENT_TYPE.invoice && document.isDraft
                          ? <span style={{ color: "#e77676" }}>{t("sales.quote.draft")}</span>
                          : _renderStatus(actionConfig.documentType, document, t))
                      : null;
                    
                    // Source documents for selected document
                    const selectedSourceDocuments = document.sourceDocumentNumber && document.sourceDocumentNumber.length > 0
                      ? document.sourceDocumentNumber.map((item: any, index: number) => (
                          <a
                            key={index}
                            href={renderURLDocumentType(item?.sourceDocumentType, item.documentId)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              cursor: "pointer",
                              color: "#5859A8",
                              textDecoration: "none",
                              fontSize: "0.75rem",
                              display: "block",
                              marginBottom: index < document.sourceDocumentNumber.length - 1 ? "2px" : "0",
                            }}
                          >
                            {t(renderDocumentTypeForSourceDocumentNumber(item?.sourceDocumentType))}: {item?.documentNumber}
                          </a>
                        ))
                      : null;

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
                                mb: 1,
                                fontSize: "0.75rem",
                              }}
                            >
                              {t("frontdesk.selectedDocument", { defaultValue: "Selected Document" })}
                            </Typography>
                            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: neutralColor(900),
                                  fontSize: "0.875rem",
                                }}
                              >
                                {displayInfo.number}
                              </Typography>
                              {displayInfo.hasAmount && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: neutralColor(700),
                                    fontSize: "0.8125rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {displayInfo.amount}
                                </Typography>
                              )}
                              {displayInfo.date && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: neutralColor(600),
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {displayInfo.date}
                                </Typography>
                              )}
                            </Stack>
                            {selectedSourceDocuments && (
                              <Box sx={{ mb: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: neutralColor(600),
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    display: "block",
                                    mb: 0.5,
                                  }}
                                >
                                  {t("sales.quote.sourceDocument", { defaultValue: "Source Document" })}:
                                </Typography>
                                {selectedSourceDocuments}
                              </Box>
                            )}
                            {statusElement && (
                              <Box>
                                {statusElement}
                              </Box>
                            )}
                          </Box>
                        </Stack>
                      </Box>
                    );
                  })()}
              </>
            )}
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
