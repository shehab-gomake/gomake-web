/**
 * Linked Documents Section Component
 *
 * Displays linked documents in the conversation detail panel
 * with clickable navigation to open documents.
 * Uses shared hooks and components for consistent behavior.
 */

import React, { useMemo, useEffect } from 'react';
import { Box, Typography, Stack, IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRecoilValue } from 'recoil';
import { useGomakeRouter } from '@/hooks/use-gomake-router';
import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';
import { CHATWOOT_CUSTOM_ATTRIBUTES } from '@/widgets/frontdesk/constants/chatwoot-attributes';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import { currencyUnitState } from '@/store/currency-units';
import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import { useTranslation } from 'react-i18next';
import { useDocumentDetails, createDocumentKey } from '../hooks/document/use-document-details';
import {
  getDocumentTypeTitle,
  getDocumentRoute,
  openDocumentInNewTab,
  formatDocumentDateShort,
  formatDocumentPriceCompact,
} from '../utils/document/formatting.utils';

interface LinkedDocument {
  id: string;
  type: DOCUMENT_TYPE;
  linkedAt: string;
}

interface LinkedDocumentsSectionProps {
  conversation: ChatwootConversation;
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

    // Handle document ID
    const documentId = documentIdRaw ? String(documentIdRaw) : undefined;

    // Handle document type
    let documentType: DOCUMENT_TYPE = type;
    if (documentTypeRaw !== undefined && documentTypeRaw !== null) {
      const parsedType =
        typeof documentTypeRaw === 'string' ? parseInt(documentTypeRaw, 10) : Number(documentTypeRaw);
      if (!isNaN(parsedType) && Object.values(DOCUMENT_TYPE).includes(parsedType)) {
        documentType = parsedType as DOCUMENT_TYPE;
      }
    }

    // Handle timestamp
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

export const LinkedDocumentsSection: React.FC<LinkedDocumentsSectionProps> = ({ conversation }) => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const currenciesUnits = useRecoilValue(currencyUnitState);
  const { details, loadingKeys, fetchMultipleDetails } = useDocumentDetails();

  // Extract linked documents from conversation
  const linkedDocuments = useMemo(() => extractLinkedDocuments(conversation), [conversation]);

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

  const handleDocumentClick = (documentType: DOCUMENT_TYPE, documentId: string) => {
    const route = getDocumentRoute(documentType, documentId);
    navigate(route);
  };

  const handleDocumentClickNewTab = (documentType: DOCUMENT_TYPE, documentId: string) => {
    openDocumentInNewTab(documentType, documentId);
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
            ? docDetails.sourceDocuments.map((s) => s.documentNumber).join(', ')
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
                  {docDetails?.number && ` #${docDetails.number}`}
                </Typography>
                <Stack spacing={0.25}>
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
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('frontdesk.sourceDocument', { defaultValue: 'Source' })}: {sourceDocText}
                    </Typography>
                  )}
                  {creationDate && (
                    <Typography
                      variant="caption"
                      sx={{ color: colorTokens.semantic.text.secondary, fontSize: 10 }}
                    >
                      {t('frontdesk.created', { defaultValue: 'Created' })}: {creationDate}
                    </Typography>
                  )}
                  {dueDate && (
                    <Typography
                      variant="caption"
                      sx={{ color: colorTokens.semantic.text.secondary, fontSize: 10 }}
                    >
                      {t('frontdesk.dueDate', { defaultValue: 'Due' })}: {dueDate}
                    </Typography>
                  )}
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
