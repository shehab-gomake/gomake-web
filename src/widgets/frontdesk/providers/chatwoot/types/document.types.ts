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
