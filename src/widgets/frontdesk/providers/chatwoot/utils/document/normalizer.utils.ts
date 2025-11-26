/**
 * Document Normalizer Utilities
 *
 * Centralizes API response normalization to eliminate type casts
 * and provide consistent document structure across the codebase.
 */

import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';
import {
  NormalizedDocument,
  SourceDocumentInfo,
  DocumentDetailsInfo,
} from '../../types/document.types';

/**
 * Normalize a raw API document response into a consistent structure
 * Eliminates the need for type casts by handling all field variations
 */
export function normalizeApiDocument(
  rawDoc: Record<string, any>,
  defaultDocumentType?: DOCUMENT_TYPE
): NormalizedDocument {
  // Extract document number from various possible fields
  const number =
    rawDoc.number ||
    rawDoc.documentNumber ||
    rawDoc.invoiceNumber ||
    rawDoc.quoteNumber ||
    rawDoc.orderNumber ||
    rawDoc.receiptNumber ||
    'N/A';

  // Extract client information
  const clientId =
    rawDoc.client?.id ||
    rawDoc.clientId ||
    rawDoc.customerId ||
    '';
  const clientName =
    rawDoc.client?.name ||
    rawDoc.clientName ||
    rawDoc.customerName ||
    'Unknown';
  const clientCode =
    rawDoc.client?.code ||
    rawDoc.clientCode ||
    rawDoc.customerCode;

  // Extract date - handle various API field names
  const createdDate =
    rawDoc.createdDate ||
    rawDoc.creationDate ||
    rawDoc.createDate ||
    '';

  // Extract price - handle various API field names
  const totalPrice =
    rawDoc.totalPrice !== undefined
      ? rawDoc.totalPrice
      : rawDoc.total !== undefined
      ? rawDoc.total
      : 0;

  // Extract source documents and normalize
  const sourceDocuments: SourceDocumentInfo[] = [];
  if (Array.isArray(rawDoc.sourceDocumentNumber)) {
    rawDoc.sourceDocumentNumber.forEach((item: any) => {
      if (item && item.documentId && item.documentNumber) {
        sourceDocuments.push({
          documentId: String(item.documentId),
          documentNumber: String(item.documentNumber),
          sourceDocumentType: item.sourceDocumentType as DOCUMENT_TYPE,
        });
      }
    });
  }

  return {
    id: String(rawDoc.id),
    number: String(number),
    documentType: rawDoc.documentType || defaultDocumentType || DOCUMENT_TYPE.quote,
    client: {
      id: String(clientId),
      name: String(clientName),
      code: clientCode ? String(clientCode) : undefined,
    },
    createdDate: String(createdDate),
    totalPrice: Number(totalPrice),
    totalPriceWithoutVat: rawDoc.totalPriceWithoutVat,
    currency: rawDoc.currency || '',
    status: rawDoc.status || '',
    statusTitleText: rawDoc.statusTitleText,
    isDraft: rawDoc.isDraft,
    sourceDocuments,
    userName: rawDoc.userName,
    documentNumbers: rawDoc.documentNumbers,
    secondDocumentNumbers: rawDoc.secondDocumentNumbers,
    thirdDocumentNumbers: rawDoc.thirdDocumentNumbers,
    titleDocumentNumber: rawDoc.titleDocumentNumber,
    titleSecondDocumentNumber: rawDoc.titleSecondDocumentNumber,
    titleThirdDocumentNumber: rawDoc.titleThirdDocumentNumber,
    externalDocumentNumber: rawDoc.externalDocumentNumber,
    titleExternalDocumentNumber: rawDoc.titleExternalDocumentNumber,
    approvalStatus: rawDoc.approvalStatus,
    dueDate: rawDoc.dueDate,
  };
}

/**
 * Normalize document details from API response
 * Used for linked documents section
 */
export function normalizeDocumentDetails(
  rawData: Record<string, any>
): DocumentDetailsInfo {
  // Extract source documents
  const sourceDocuments: SourceDocumentInfo[] = [];
  if (Array.isArray(rawData.sourceDocumentNumber)) {
    rawData.sourceDocumentNumber.forEach((item: any) => {
      if (item && item.documentNumber) {
        sourceDocuments.push({
          documentId: String(item.documentId || ''),
          documentNumber: String(item.documentNumber),
          sourceDocumentType: item.sourceDocumentType as DOCUMENT_TYPE,
        });
      }
    });
  }

  return {
    number: String(rawData.number || 'N/A'),
    sourceDocuments,
    totalPrice: Number(rawData.totalPrice || rawData.total || 0),
    totalPriceWithoutVat: rawData.totalPriceWithoutVat,
    currency: rawData.currency || '',
    createdDate: String(rawData.creationDate || rawData.createdDate || rawData.createDate || ''),
    dueDate: rawData.dueDate,
    status: rawData.status || '',
  };
}

/**
 * Extract client name from a raw document (handles all field variations)
 */
export function extractClientName(doc: Record<string, any>): string {
  return (
    doc.client?.name ||
    doc.clientName ||
    doc.customerName ||
    'Unknown'
  );
}

/**
 * Extract creation date from a raw document (handles all field variations)
 */
export function extractCreatedDate(doc: Record<string, any>): string {
  return (
    doc.createdDate ||
    doc.creationDate ||
    doc.createDate ||
    ''
  );
}

/**
 * Extract total price from a raw document (handles all field variations)
 */
export function extractTotalPrice(doc: Record<string, any>): number {
  if (doc.totalPrice !== undefined) return doc.totalPrice;
  if (doc.total !== undefined) return doc.total;
  return 0;
}
