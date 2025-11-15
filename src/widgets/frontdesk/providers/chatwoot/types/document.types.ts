/**
 * Document Types for Quick Actions
 *
 * Defines type-safe interfaces for documents fetched from the API
 * and used in the Quick Actions feature.
 */

import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';

/**
 * Client information in document
 */
export interface DocumentClient {
  id?: string;
  name?: string;
  code?: string;
  mail?: string;
  phone?: string;
}

/**
 * Source document reference information
 */
export interface SourceDocumentInfo {
  documentId: string;
  documentNumber: string;
  sourceDocumentType: DOCUMENT_TYPE;
}

/**
 * Document from API response
 */
export interface DocumentListItem {
  /** Unique document identifier */
  id: string;

  /** Document number/reference */
  number?: string;

  /** Document type (quote, invoice, order, etc.) */
  documentType: DOCUMENT_TYPE;

  /** Client/customer information */
  client?: DocumentClient;

  /** Document creation date */
  createDate?: string;

  /** Document total amount */
  total?: number;

  /** Document currency */
  currency?: string;

  /** Document status */
  status?: string;

  /** Any additional properties */
  [key: string]: any;
}

/**
 * Normalized document structure with all possible API fields explicitly typed
 * This eliminates the need for type casts across the codebase
 */
export interface NormalizedDocument {
  /** Unique document identifier */
  id: string;

  /** Document number/reference - normalized from various API field names */
  number: string;

  /** Document type */
  documentType: DOCUMENT_TYPE;

  /** Normalized client information */
  client: {
    id: string;
    name: string;
    code?: string;
  };

  /** Document creation date (ISO string) */
  createdDate: string;

  /** Document total price */
  totalPrice: number;

  /** Total price without VAT */
  totalPriceWithoutVat?: number;

  /** Currency code */
  currency: string;

  /** Document status */
  status: string;

  /** Status display text */
  statusTitleText?: string;

  /** Whether document is a draft */
  isDraft?: boolean;

  /** Source documents (for invoices, delivery notes, etc.) */
  sourceDocuments: SourceDocumentInfo[];

  /** User who created the document */
  userName?: string;

  /** Additional document number fields for display */
  documentNumbers?: string;
  secondDocumentNumbers?: string;
  thirdDocumentNumbers?: string;
  titleDocumentNumber?: string;
  titleSecondDocumentNumber?: string;
  titleThirdDocumentNumber?: string;
  externalDocumentNumber?: string;
  titleExternalDocumentNumber?: string;

  /** Approval status */
  approvalStatus?: string;

  /** Due date for payment */
  dueDate?: string;
}

/**
 * Document details fetched for linked documents display
 */
export interface DocumentDetailsInfo {
  /** Document number */
  number: string;

  /** Source documents */
  sourceDocuments: SourceDocumentInfo[];

  /** Total price */
  totalPrice: number;

  /** Total price without VAT */
  totalPriceWithoutVat?: number;

  /** Currency code */
  currency: string;

  /** Creation date */
  createdDate: string;

  /** Due date */
  dueDate?: string;

  /** Document status */
  status: string;
}

/**
 * API response for client documents
 */
export interface DocumentApiResponse {
  /** Indicates if the request was successful */
  success: boolean;

  /** Array of documents */
  data: DocumentListItem[];

  /** Optional error message */
  message?: string;

  /** Optional metadata */
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

/**
 * Autocomplete option for document selection
 */
export interface DocumentAutocompleteOption {
  /** Unique identifier */
  id: string;

  /** Display label for autocomplete */
  label: string;

  /** Full document object */
  value: DocumentListItem;

  /** Document number for quick reference */
  documentNumber?: string;

  /** Document ID (same as id, kept for compatibility) */
  documentId: string;
}

/**
 * API request params for fetching client documents
 */
export interface GetClientDocumentsParams {
  /** Client ID */
  clientId: string;

  /** Optional document type filter */
  documentType?: DOCUMENT_TYPE;

  /** Optional page number */
  page?: number;

  /** Optional page size */
  pageSize?: number;
}
