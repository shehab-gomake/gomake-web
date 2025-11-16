/**
 * useDocumentFetch Hook
 *
 * Centralized hook for fetching documents from the API.
 * Handles loading state, error handling, and document normalization.
 */

import { useState, useCallback, useEffect } from 'react';
import { useGomakeAxios } from '@/hooks/use-gomake-axios';
import { useTranslation } from 'react-i18next';
import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';
import { getAllDocumentsApi } from '@/services/api-service/generic-doc/documents-api';
import { NormalizedDocument } from '../../types/document.types';
import { normalizeApiDocument } from '../../utils/document/normalizer.utils';

interface UseDocumentFetchOptions {
  /** Document type to fetch */
  documentType: DOCUMENT_TYPE | undefined;
  /** Customer ID for filtering (optional) */
  customerId?: string;
  /** Whether customer ID is required */
  requiresCustomerId?: boolean;
  /** Search term for pattern matching */
  searchTerm?: string;
  /** Whether fetching is enabled */
  enabled?: boolean;
  /** Page size for pagination */
  pageSize?: number;
}

interface UseDocumentFetchResult {
  /** Normalized documents */
  documents: NormalizedDocument[];
  /** Loading state */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Function to refetch documents */
  refetch: () => Promise<void>;
  /** Clear error message */
  clearError: () => void;
}

export function useDocumentFetch({
  documentType,
  customerId,
  requiresCustomerId = false,
  searchTerm = '',
  enabled = true,
  pageSize = 100,
}: UseDocumentFetchOptions): UseDocumentFetchResult {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [documents, setDocuments] = useState<NormalizedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!documentType || !enabled) {
      setDocuments([]);
      return;
    }

    // Check if customer ID is required but not provided
    if (requiresCustomerId && !customerId) {
      setDocuments([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const handleResponse = (res: any) => {
        if (res?.success) {
          const rawDocuments = res?.data?.data || [];

          // Normalize all documents using the centralized normalizer
          const normalizedDocs: NormalizedDocument[] = rawDocuments.map((doc: any) =>
            normalizeApiDocument(doc, documentType)
          );

          setDocuments(normalizedDocs);
          setError(null);
        } else {
          const errorMessage =
            res.message ||
            res.data?.message ||
            res.errors?.message ||
            t('frontdesk.errorFetchingDocuments', {
              defaultValue: 'Failed to fetch documents',
            });

          setDocuments([]);
          setError(errorMessage);
        }
        setLoading(false);
      };

      // Build request data
      const requestData: any = {
        documentType,
        data: {
          model: {
            pageNumber: 1,
            pageSize,
            order: null,
          },
        },
      };

      // Add customer ID filter if required and available
      if (requiresCustomerId && customerId) {
        requestData.data.customerId = customerId;
      }

      // Add pattern search if search term is provided
      if (searchTerm && searchTerm.trim()) {
        requestData.data.patternSearch = searchTerm.trim();
      }

      await getAllDocumentsApi(callApi, handleResponse, requestData);
    } catch (err: any) {
      setDocuments([]);
      setError(
        err.message ||
          t('frontdesk.errorFetchingDocuments', {
            defaultValue: 'An error occurred while fetching documents',
          })
      );
      setLoading(false);
    }
  }, [documentType, customerId, callApi, requiresCustomerId, searchTerm, enabled, pageSize, t]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refetch when dependencies change
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
    clearError,
  };
}
