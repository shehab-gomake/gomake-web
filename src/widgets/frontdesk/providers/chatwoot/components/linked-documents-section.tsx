/**
 * Linked Documents Section Component
 * 
 * Displays linked documents in the conversation detail panel
 * with clickable navigation to open documents.
 */

import React, { useMemo } from 'react';
import { Box, Typography, Stack, IconButton, Tooltip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { useGomakeRouter } from '@/hooks/use-gomake-router';
import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';
import { CHATWOOT_CUSTOM_ATTRIBUTES } from '@/widgets/frontdesk/constants/chatwoot-attributes';
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
  const { primaryColor, neutralColor } = useGomakeTheme();
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();

  // Extract linked documents from conversation
  const linkedDocuments = useMemo(() => {
    return extractLinkedDocuments(conversation);
  }, [conversation]);

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
    <Box
      sx={{
        mb: 2.5,
        px: 2,
        py: 2,
        backgroundColor: neutralColor(0),
        borderRadius: 1,
        border: `1px solid ${neutralColor(200)}`,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: neutralColor(700),
          mb: 1.5,
          display: 'block',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: 10,
          letterSpacing: '0.05em',
        }}
      >
        {t('frontdesk.linkedDocuments', { defaultValue: 'Linked Documents' })}
      </Typography>

      <Stack spacing={1.5}>
        {linkedDocuments.map((doc) => {
          const documentTitle = getDocumentTitle(doc.type);
          // Safely format date, handle invalid dates
          let formattedDate = '';
          if (doc.linkedAt) {
            try {
              const date = new Date(doc.linkedAt);
              if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString();
              }
            } catch (error) {
              // Invalid date, leave formattedDate empty
            }
          }

          return (
            <Box
              key={`${doc.type}-${doc.id}`}
              sx={{
                p: 1.5,
                borderRadius: 1,
                backgroundColor: neutralColor(25),
                border: `1px solid ${neutralColor(200)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: primaryColor(25),
                  borderColor: primaryColor(300),
                },
              }}
              onClick={() => handleDocumentClick(doc.type, doc.id)}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    backgroundColor: primaryColor(50),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: primaryColor(600),
                    flexShrink: 0,
                  }}
                >
                  <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: neutralColor(900),
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      mb: 0.25,
                    }}
                  >
                    {documentTitle}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="caption"
                      sx={{
                        color: neutralColor(600),
                        fontSize: '0.75rem',
                      }}
                    >
                      ID: {doc.id}
                    </Typography>
                    {formattedDate && (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            color: neutralColor(400),
                            fontSize: '0.75rem',
                          }}
                        >
                          •
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: neutralColor(600),
                            fontSize: '0.75rem',
                          }}
                        >
                          {formattedDate}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
              </Stack>
              <Tooltip title={t('frontdesk.openInNewTab', { defaultValue: 'Open in new tab' })}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDocumentClickNewTab(doc.type, doc.id);
                  }}
                  sx={{
                    color: neutralColor(600),
                    '&:hover': {
                      backgroundColor: primaryColor(50),
                      color: primaryColor(600),
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

