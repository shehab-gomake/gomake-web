/**
 * Linked Documents Section Component
 * 
 * Displays linked documents in the conversation detail panel
 * with clickable navigation to open documents.
 * Fetches and displays document details: number, source document, price, dates.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography, Stack, IconButton, Tooltip, CircularProgress } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRecoilValue } from 'recoil';
import { useGomakeRouter } from '@/hooks/use-gomake-router';
import { useGomakeAxios } from '@/hooks/use-gomake-axios';
import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';
import { CHATWOOT_CUSTOM_ATTRIBUTES } from '@/widgets/frontdesk/constants/chatwoot-attributes';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import { getDocumentApi } from '@/services/api-service/generic-doc/documents-api';
import { currencyUnitState } from '@/store/currency-units';
import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import { useTranslation } from 'react-i18next';

/**
 * Get document title for display
 */
function getDocumentTitle(documentType: DOCUMENT_TYPE): string {
  const titles: Record<DOCUMENT_TYPE, string> = {
    [DOCUMENT_TYPE.quote]: 'Quote',
    [DOCUMENT_TYPE.invoice]: 'Invoice',
    [DOCUMENT_TYPE.order]: 'Order',
    [DOCUMENT_TYPE.receipt]: 'Receipt',
    [DOCUMENT_TYPE.deliveryNote]: 'Delivery Note',
    [DOCUMENT_TYPE.purchaseOrder]: 'Purchase Order',
    [DOCUMENT_TYPE.purchaseInvoice]: 'Purchase Invoice',
    [DOCUMENT_TYPE.deliveryNoteRefund]: 'Delivery Note Refund',
    [DOCUMENT_TYPE.invoiceRefund]: 'Invoice Refund',
    [DOCUMENT_TYPE.generalLedgerReport]: 'General Ledger Report',
    [DOCUMENT_TYPE.purchaseInvoiceRefund]: 'Purchase Invoice Refund',
    [DOCUMENT_TYPE.boardMission]: 'Board Mission',
    [DOCUMENT_TYPE.customerChat]: 'Customer Chat',
    [DOCUMENT_TYPE.supplierPayments]: 'Supplier Payments',
  };
  return titles[documentType] || 'Document';
}

interface LinkedDocument {
  id: string;
  type: DOCUMENT_TYPE;
  linkedAt: string;
}

interface DocumentDetails {
  number?: string;
  sourceDocumentNumber?: Array<{ documentNumber: string; sourceDocumentType?: number }>;
  totalPrice?: number;
  totalPriceWithoutVat?: number;
  currency?: string;
  creationDate?: string | number;
  createdDate?: string | number;
  dueDate?: string | number;
  status?: string;
}

interface LinkedDocumentsSectionProps {
  conversation: ChatwootConversation;
}

/**
 * Get document route based on document type
 */
function getDocumentRoute(documentType: DOCUMENT_TYPE, documentId: string): string {
  switch (documentType) {
    case DOCUMENT_TYPE.quote:
      return `/quote?Id=${documentId}`;
    case DOCUMENT_TYPE.invoice:
      return `/invoice?Id=${documentId}`;
    case DOCUMENT_TYPE.order:
      return `/orders?Id=${documentId}`;
    case DOCUMENT_TYPE.receipt:
      return `/receipts?Id=${documentId}`;
    case DOCUMENT_TYPE.deliveryNote:
      return `/deliveryNote?Id=${documentId}`;
    case DOCUMENT_TYPE.purchaseOrder:
      return `/purchaseOrders?Id=${documentId}`;
    case DOCUMENT_TYPE.purchaseInvoice:
      return `/purchaseInvoices?Id=${documentId}`;
    default:
      return '/quotes';
  }
}

/**
 * Extract all linked documents from conversation custom attributes
 */
function extractLinkedDocuments(conversation: ChatwootConversation): LinkedDocument[] {
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

    // Handle document ID - can be string or number
    const documentId = documentIdRaw ? String(documentIdRaw) : undefined;
    
    // Handle document type - convert string to number if needed (JSON serialization)
    let documentType: DOCUMENT_TYPE = type;
    if (documentTypeRaw !== undefined && documentTypeRaw !== null) {
      const parsedType = typeof documentTypeRaw === 'string' 
        ? parseInt(documentTypeRaw, 10) 
        : Number(documentTypeRaw);
      if (!isNaN(parsedType) && Object.values(DOCUMENT_TYPE).includes(parsedType)) {
        documentType = parsedType as DOCUMENT_TYPE;
      }
    }
    
    // Handle timestamp - ensure it's a valid string
    const linkedAt = linkedAtRaw ? String(linkedAtRaw) : undefined;

    if (documentId) {
      documents.push({
        id: documentId,
        type: documentType,
        linkedAt: linkedAt || '',
      });
    }
  });

  return documents;
}

export const LinkedDocumentsSection: React.FC<LinkedDocumentsSectionProps> = ({
  conversation,
}) => {
  const { navigate } = useGomakeRouter();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const currenciesUnits = useRecoilValue(currencyUnitState);
  const [documentDetails, setDocumentDetails] = useState<Record<string, DocumentDetails>>({});
  const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set());

  // Helper to get currency text
  const getCurrencyUnitText = (currency: string | undefined): string => {
    if (!currency) return '';
    const foundCurrency = currenciesUnits?.find((c: any) => c.value === currency);
    return foundCurrency?.text || currency;
  };

  // Extract linked documents from conversation
  const linkedDocuments = useMemo(() => {
    return extractLinkedDocuments(conversation);
  }, [conversation]);

  // Fetch document details for each linked document
  useEffect(() => {
    const fetchDocumentDetails = async () => {
      const newDetails: Record<string, DocumentDetails> = {};
      setLoadingDocuments(new Set(linkedDocuments.map(doc => `${doc.type}-${doc.id}`)));

      const promises = linkedDocuments.map(async (doc) => {
        const key = `${doc.type}-${doc.id}`;
        try {
          await getDocumentApi(
            callApi,
            (res) => {
              if (res?.success && res?.data) {
                const data = res.data;
                newDetails[key] = {
                  number: data.number,
                  sourceDocumentNumber: data.sourceDocumentNumber,
                  totalPrice: data.totalPrice,
                  totalPriceWithoutVat: data.totalPriceWithoutVat,
                  currency: data.currency,
                  creationDate: data.creationDate || data.createdDate,
                  dueDate: data.dueDate,
                  status: data.status,
                };
              }
            },
            {
              documentType: doc.type,
              Id: doc.id,
            },
            false // Don't show loading spinner
          );
        } catch (error) {
          console.error(`[LinkedDocumentsSection] Error fetching document ${doc.id}:`, error);
        }
      });

      await Promise.all(promises);
      setDocumentDetails((prev) => ({ ...prev, ...newDetails }));
      setLoadingDocuments(new Set());
    };

    if (linkedDocuments.length > 0) {
      fetchDocumentDetails();
    }
  }, [linkedDocuments, callApi]);

  // Don't render if no linked documents
  if (linkedDocuments.length === 0) {
    return null;
  }

  const handleDocumentClick = (documentType: DOCUMENT_TYPE, documentId: string) => {
    try {
      const route = getDocumentRoute(documentType, documentId);
      navigate(route);
    } catch (error) {
      console.error('[LinkedDocumentsSection] Navigation error:', error);
      // Could show a toast notification here
    }
  };

  const handleDocumentClickNewTab = (documentType: DOCUMENT_TYPE, documentId: string) => {
    try {
      const route = getDocumentRoute(documentType, documentId);
      window.open(route, '_blank');
    } catch (error) {
      console.error('[LinkedDocumentsSection] Navigation error (new tab):', error);
      // Could show a toast notification here
    }
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: colorTokens.semantic.text.secondary,
          mb: 1,
          display: 'block',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: 10,
        }}
      >
        {t('frontdesk.linkedDocuments', { defaultValue: 'Linked Documents' })}
      </Typography>

      <Stack spacing={1}>
        {linkedDocuments.map((doc) => {
          const documentTitle = getDocumentTitle(doc.type);
          const key = `${doc.type}-${doc.id}`;
          const details = documentDetails[key];
          const isLoading = loadingDocuments.has(key);

          // Format dates
          const formatDate = (dateValue: string | number | undefined): string => {
            if (!dateValue) return '';
            try {
              const date = typeof dateValue === 'number' 
                ? new Date(dateValue * 1000) // Unix timestamp in seconds
                : new Date(dateValue);
              if (!isNaN(date.getTime())) {
                return date.toLocaleDateString();
              }
            } catch (error) {
              // Invalid date
            }
            return '';
          };

          const creationDate = formatDate(details?.creationDate || details?.createdDate);
          const dueDate = formatDate(details?.dueDate);

          // Format price
          const formatPrice = (price: number | undefined, currency: string | undefined): string => {
            if (price === undefined || price === null) return '';
            const currencyText = getCurrencyUnitText(currency);
            return currencyText ? `${currencyText} ${price.toLocaleString()}` : price.toLocaleString();
          };

          const priceText = formatPrice(details?.totalPrice, details?.currency);

          // Format source document
          const sourceDocText = details?.sourceDocumentNumber?.length
            ? details.sourceDocumentNumber.map(s => s.documentNumber).join(', ')
            : '';

          return (
            <Box
              key={key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                backgroundColor: colorTokens.neutral[50],
                borderRadius: '6px',
                border: `1px solid ${colorTokens.semantic.border.default}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: colorTokens.neutral[100],
                },
              }}
              onClick={() => handleDocumentClick(doc.type, doc.id)}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '6px',
                  backgroundColor: colorTokens.primary[50],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colorTokens.primary[600],
                  flexShrink: 0,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={16} sx={{ color: colorTokens.primary[600] }} />
                ) : (
                  <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: 13,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 0.25,
                  }}
                >
                  {documentTitle}
                  {details?.number && ` #${details.number}`}
                </Typography>
                <Stack spacing={0.25}>
                  {sourceDocText && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colorTokens.semantic.text.secondary,
                        fontSize: 10,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('frontdesk.sourceDocument', { defaultValue: 'Source' })}: {sourceDocText}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
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
                    {creationDate && (
                      <>
                        {priceText && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: colorTokens.semantic.text.tertiary,
                              fontSize: 10,
                            }}
                          >
                            •
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            color: colorTokens.semantic.text.secondary,
                            fontSize: 10,
                          }}
                        >
                          {t('frontdesk.created', { defaultValue: 'Created' })}: {creationDate}
                        </Typography>
                      </>
                    )}
                    {dueDate && (
                      <>
                        {(priceText || creationDate) && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: colorTokens.semantic.text.tertiary,
                              fontSize: 10,
                            }}
                          >
                            •
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            color: colorTokens.semantic.text.secondary,
                            fontSize: 10,
                          }}
                        >
                          {t('frontdesk.dueDate', { defaultValue: 'Due' })}: {dueDate}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Stack>
              </Box>
              <Tooltip title={t('frontdesk.openInNewTab', { defaultValue: 'Open in new tab' })}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDocumentClickNewTab(doc.type, doc.id);
                  }}
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    '&:hover': {
                      backgroundColor: colorTokens.primary[50],
                      color: colorTokens.primary[600],
                    },
                  }}
                >
                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

