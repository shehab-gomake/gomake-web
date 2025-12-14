/**
 * Linked Documents Section Component
 *
 * Displays linked documents in the conversation detail panel
 * with clickable navigation to open documents.
 * Uses shared hooks and components for consistent behavior.
 */

import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import { useRecoilValue } from "recoil";
import { useGomakeRouter } from "@/hooks/use-gomake-router";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { CHATWOOT_CUSTOM_ATTRIBUTES } from "@/widgets/frontdesk/constants/chatwoot-attributes";
import { chatwootService } from "@/services/frontdesk";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { useGomakeAxios } from "@/hooks";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import { currencyUnitState } from "@/store/currency-units";
import { userQuoteState } from "@/store/user-qoute-state";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { useTranslation } from "react-i18next";
import {
  useDocumentDetails,
  createDocumentKey,
} from "../hooks/document/use-document-details";
import {
  getDocumentTypeTitle,
  getDocumentRoute,
  openDocumentInNewTab,
  formatDocumentDateShort,
  formatDocumentPriceCompact,
} from "../utils/document/formatting.utils";
import { updateDocumentApi } from "@/services/api-service/generic-doc/documents-api";

interface LinkedDocument {
  id: string;
  type: DOCUMENT_TYPE;
  linkedAt: string;
}

interface LinkedDocumentsSectionProps {
  conversation: ChatwootConversation;
  accountId?: number | null;
  onConversationUpdate?: (updatedConversation: ChatwootConversation) => void;
}

/**
 * Get attribute keys for a document type
 */
function getDocumentAttributeKeysByType(
  documentType: DOCUMENT_TYPE
): { idKey: string; typeKey: string; timestampKey: string } | null {
  const typeMap: Record<
    number,
    { idKey: string; typeKey: string; timestampKey: string }
  > = {
    [DOCUMENT_TYPE.quote]: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_QUOTE_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_QUOTE_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_QUOTE_AT,
    },
    [DOCUMENT_TYPE.invoice]: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_INVOICE_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_INVOICE_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_INVOICE_AT,
    },
    [DOCUMENT_TYPE.order]: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_ORDER_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_ORDER_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_ORDER_AT,
    },
    [DOCUMENT_TYPE.receipt]: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_RECEIPT_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_RECEIPT_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_RECEIPT_AT,
    },
    [DOCUMENT_TYPE.deliveryNote]: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_DELIVERY_NOTE_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_DELIVERY_NOTE_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_DELIVERY_NOTE_AT,
    },
    [DOCUMENT_TYPE.purchaseOrder]: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_ORDER_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_ORDER_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_ORDER_AT,
    },
    [DOCUMENT_TYPE.purchaseInvoice]: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_INVOICE_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_INVOICE_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_INVOICE_AT,
    },
  };

  return typeMap[documentType] || null;
}

/**
 * Extract all linked documents from conversation custom attributes
 */
function extractLinkedDocuments(
  conversation: ChatwootConversation
): LinkedDocument[] {
  const customAttributes = conversation.custom_attributes || {};
  const documents: LinkedDocument[] = [];

  // Check each document type
  const documentTypes = [
    {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_QUOTE_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_QUOTE_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_QUOTE_AT,
      type: DOCUMENT_TYPE.quote,
    },
    {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_INVOICE_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_INVOICE_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_INVOICE_AT,
      type: DOCUMENT_TYPE.invoice,
    },
    {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_ORDER_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_ORDER_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_ORDER_AT,
      type: DOCUMENT_TYPE.order,
    },
    {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_RECEIPT_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_RECEIPT_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_RECEIPT_AT,
      type: DOCUMENT_TYPE.receipt,
    },
    {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_DELIVERY_NOTE_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_DELIVERY_NOTE_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_DELIVERY_NOTE_AT,
      type: DOCUMENT_TYPE.deliveryNote,
    },
    {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_ORDER_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_ORDER_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_ORDER_AT,
      type: DOCUMENT_TYPE.purchaseOrder,
    },
    {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_INVOICE_ID,
      typeKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_INVOICE_TYPE,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_INVOICE_AT,
      type: DOCUMENT_TYPE.purchaseInvoice,
    },
  ];

  documentTypes.forEach(({ idKey, typeKey, timestampKey, type }) => {
    const documentIdRaw = customAttributes[idKey];
    const documentTypeRaw = customAttributes[typeKey];
    const linkedAtRaw = customAttributes[timestampKey];

    // Handle document ID
    const documentId = documentIdRaw ? String(documentIdRaw) : undefined;

    // Handle document type
    let documentType: DOCUMENT_TYPE = type;
    if (documentTypeRaw !== undefined && documentTypeRaw !== null) {
      const parsedType =
        typeof documentTypeRaw === "string"
          ? parseInt(documentTypeRaw, 10)
          : Number(documentTypeRaw);
      if (
        !isNaN(parsedType) &&
        Object.values(DOCUMENT_TYPE).includes(parsedType)
      ) {
        documentType = parsedType as DOCUMENT_TYPE;
      }
    }

    // Handle timestamp
    const linkedAt = linkedAtRaw ? String(linkedAtRaw) : undefined;

    if (documentId) {
      documents.push({
        id: documentId,
        type: documentType,
        linkedAt: linkedAt || "",
      });
    }
  });

  return documents;
}

export const LinkedDocumentsSection: React.FC<LinkedDocumentsSectionProps> = ({
  conversation,
  accountId,
  onConversationUpdate,
}) => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const currenciesUnits = useRecoilValue(currencyUnitState);
  // const userQuoteIfExist = useRecoilValue(userQuoteState);
  const { details, loadingKeys, fetchMultipleDetails } = useDocumentDetails();
  const { alertSuccess, alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const [unlinkingDocId, setUnlinkingDocId] = useState<string | null>(null);

  // Use ref to prevent duplicate calls during async operations
  const unlinkingRef = useRef<string | null>(null);

  // Extract linked documents from conversation
  const linkedDocuments = useMemo(
    () => extractLinkedDocuments(conversation),
    [conversation]
  );

  // Fetch document details when linked documents change
  useEffect(() => {
    if (linkedDocuments.length > 0) {
      fetchMultipleDetails(linkedDocuments);
    }
  }, [linkedDocuments, fetchMultipleDetails]);

  // Don't render if no linked documents
  if (linkedDocuments.length === 0) {
    return null;
  }

  const handleEditQuote = useCallback(
    async (documentId: string) => {
      // Update quote status first, then navigate to the specific quote
      const callBack = (res: any) => {
        if (res?.success) {
          navigate(`/quote`);
        } else {
          if (res?.statusCode === 85) {
            alertFault(res?.message);
          } else {
            alertFault(
              t("frontdesk.editQuoteFailed", {
                defaultValue: "Failed to edit quote",
              })
            );
          }
        }
      };

      try {
        await updateDocumentApi(callApi, callBack, {
          documentType: DOCUMENT_TYPE.quote,
          document: {
            documentId: documentId,
          },
        });
      } catch (error: any) {
        console.error("[LinkedDocumentsSection] Error editing quote:", error);
        alertFault(
          error.message ||
            t("frontdesk.editQuoteFailed", {
              defaultValue: "Failed to edit quote",
            })
        );
      }
    },
    [navigate, callApi, alertFault, t]
  );

  const handleDocumentClick = (
    documentType: DOCUMENT_TYPE,
    documentId: string
  ) => {
    // Special handling for quotes - use edit logic
    if (documentType === DOCUMENT_TYPE.quote) {
      handleEditQuote(documentId);
      return;
    }
    // For other document types, navigate normally
    const route = getDocumentRoute(documentType, documentId);
    navigate(route);
  };

  const handleDocumentClickNewTab = (
    documentType: DOCUMENT_TYPE,
    documentId: string
  ) => {
    // Special handling for quotes - use edit logic but open in new tab
    if (documentType === DOCUMENT_TYPE.quote) {
      // For quotes, update quote status first, then open in new tab
      const callBack = (res: any) => {
        if (res?.success) {
          window.open(`/quote`, "_blank");
        } else {
          if (res?.statusCode === 85) {
            alertFault(res?.message);
          } else {
            alertFault(
              t("frontdesk.editQuoteFailed", {
                defaultValue: "Failed to edit quote",
              })
            );
          }
        }
      };

      updateDocumentApi(callApi, callBack, {
        documentType: DOCUMENT_TYPE.quote,
        document: {
          documentId: documentId,
        },
      }).catch((error: any) => {
        console.error("[LinkedDocumentsSection] Error editing quote:", error);
        alertFault(
          error.message ||
            t("frontdesk.editQuoteFailed", {
              defaultValue: "Failed to edit quote",
            })
        );
      });
      return;
    }
    // For other document types, open normally in new tab
    openDocumentInNewTab(documentType, documentId);
  };

  // const handleUnlinkDocument = useCallback(
  //   async (
  //     documentType: DOCUMENT_TYPE,
  //     documentId: string
  //     // e: React.MouseEvent<HTMLButtonElement>
  //   ) => {
  //     // e.stopPropagation();
  //     // e.preventDefault();

  //     // Validation
  //     if (!accountId || !conversation.id) {
  //       alertFault("frontdesk.accountRequired");
  //       return;
  //     }

  //     // Prevent duplicate calls
  //     if (unlinkingRef.current === documentId) {
  //       return;
  //     }

  //     // Get attribute keys
  //     const attributeKeys = getDocumentAttributeKeysByType(documentType);
  //     if (!attributeKeys) {
  //       alertFault("frontdesk.unknownDocumentType");
  //       return;
  //     }

  //     // Set loading state
  //     setUnlinkingDocId(documentId);
  //     unlinkingRef.current = documentId;

  //     try {
  //       const conversationId = conversation.id;
  //       const currentAttributes = conversation.custom_attributes || {};

  //       // Create new attributes object WITHOUT the document keys
  //       const updatedAttributes: Record<string, unknown> = {};
  //       Object.keys(currentAttributes).forEach((key) => {
  //         if (
  //           key !== attributeKeys.idKey &&
  //           key !== attributeKeys.typeKey &&
  //           key !== attributeKeys.timestampKey
  //         ) {
  //           updatedAttributes[key] = currentAttributes[key];
  //         }
  //       });

  //       // Call API
  //       const updatedConversation =
  //         await chatwootService.conversations.updateConversationCustomAttributes(
  //           accountId,
  //           conversationId,
  //           updatedAttributes
  //         );

  //       // Show success
  //       alertSuccess("frontdesk.documentUnlinkedSuccess");

  //       // Notify parent
  //       if (onConversationUpdate) {
  //         onConversationUpdate(updatedConversation);
  //       }
  //     } catch (error: any) {
  //       console.error("[LinkedDocumentsSection] Error unlinking:", error);
  //       const errorMessage =
  //         error.message ||
  //         t("frontdesk.documentUnlinkFailed", {
  //           defaultValue: "Failed to unlink document",
  //         });
  //       alertFault(errorMessage);
  //     } finally {
  //       setUnlinkingDocId(null);
  //       unlinkingRef.current = null;
  //     }
  //   },
  //   [accountId, conversation, alertSuccess, alertFault, t, onConversationUpdate]
  // );

  return (
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
        {t("frontdesk.linkedDocuments", { defaultValue: "Linked Documents" })}
      </Typography>

      <Stack gap={1}>
        {linkedDocuments.map((doc) => {
          const documentTitle = getDocumentTypeTitle(doc.type);
          const key = createDocumentKey(doc.type, doc.id);
          const docDetails = details[key];
          const isLoading = loadingKeys.has(key);

          // Format display values
          const creationDate = formatDocumentDateShort(docDetails?.createdDate);
          const dueDate = formatDocumentDateShort(docDetails?.dueDate);
          const priceText = formatDocumentPriceCompact(
            docDetails?.totalPrice,
            docDetails?.currency,
            currenciesUnits
          );
          const sourceDocText = docDetails?.sourceDocuments?.length
            ? docDetails.sourceDocuments.map((s) => s.documentNumber).join(", ")
            : "";

          return (
            <Box
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                backgroundColor: colorTokens.neutral[50],
                borderRadius: "6px",
                border: `1px solid ${colorTokens.semantic.border.default}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: colorTokens.neutral[100],
                },
              }}
              onClick={() => handleDocumentClick(doc.type, doc.id)}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: 13,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    mb: 0.25,
                  }}
                >
                  {documentTitle}
                  {docDetails?.number && ` #${docDetails.number}`}
                </Typography>
                <Stack gap={0.25}>
                  {priceText && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colorTokens.semantic.text.secondary,
                        fontSize: 10,
                        fontWeight: 500,
                      }}
                    >
                      {priceText}
                    </Typography>
                  )}
                  {sourceDocText && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colorTokens.semantic.text.secondary,
                        fontSize: 10,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t("frontdesk.sourceDocument", {
                        defaultValue: "Source",
                      })}
                      : {sourceDocText}
                    </Typography>
                  )}
                  {creationDate && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colorTokens.semantic.text.secondary,
                        fontSize: 10,
                      }}
                    >
                      {t("frontdesk.created", { defaultValue: "Created" })}:{" "}
                      {creationDate}
                    </Typography>
                  )}
                  {dueDate && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colorTokens.semantic.text.secondary,
                        fontSize: 10,
                      }}
                    >
                      {t("frontdesk.dueDate", { defaultValue: "Due" })}:{" "}
                      {dueDate}
                    </Typography>
                  )}
                </Stack>
              </Box>
              <Stack direction="row" gap={0.5}>
                <Tooltip
                  title={t("frontdesk.openInNewTab", {
                    defaultValue: "Open in new tab",
                  })}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentClickNewTab(doc?.type, doc?.id);
                    }}
                    sx={{
                      color: colorTokens.semantic.text.secondary,
                      "&:hover": {
                        backgroundColor: colorTokens.primary[50],
                        color: colorTokens.primary[600],
                      },
                    }}
                  >
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                {/* {accountId && (
                  <Tooltip
                    title={t("frontdesk.unlinkDocument", {
                      defaultValue: "Remove linked document",
                    })}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnlinkDocument(doc.type, doc.id);
                      }}
                      disabled={unlinkingDocId === doc.id}
                    >
                      {unlinkingDocId === doc.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <CloseIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                )} */}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};
