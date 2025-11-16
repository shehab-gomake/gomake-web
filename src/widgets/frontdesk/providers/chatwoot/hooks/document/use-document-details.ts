/**
 * useDocumentDetails Hook
 *
 * Fetches and caches document details for linked documents.
 * Handles multiple document fetching and provides normalized results.
 */

import { useState, useCallback, useEffect } from 'react';
import { useGomakeAxios } from '@/hooks/use-gomake-axios';
import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';
import { getDocumentApi } from '@/services/api-service/generic-doc/documents-api';
import { DocumentDetailsInfo } from '../../types/document.types';
import { normalizeDocumentDetails } from '../../utils/document/normalizer.utils';

interface LinkedDocumentRef {
  id: string;
  type: DOCUMENT_TYPE;
}

interface UseDocumentDetailsResult {
  /** Map of document key to details */
  details: Record<string, DocumentDetailsInfo>;
  /** Set of document keys currently loading */
  loadingKeys: Set<string>;
  /** Whether any document is loading */
  isLoading: boolean;
  /** Fetch details for a single document */
  fetchDetails: (documentId: string, documentType: DOCUMENT_TYPE) => Promise<void>;
  /** Fetch details for multiple documents */
  fetchMultipleDetails: (documents: LinkedDocumentRef[]) => Promise<void>;
}

/**
 * Create a unique key for a document
 */
export function createDocumentKey(documentType: DOCUMENT_TYPE, documentId: string): string {
  return `${documentType}-${documentId}`;
}

export function useDocumentDetails(): UseDocumentDetailsResult {
  const { callApi } = useGomakeAxios();
  const [details, setDetails] = useState<Record<string, DocumentDetailsInfo>>({});
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());

  const fetchDetails = useCallback(
    async (documentId: string, documentType: DOCUMENT_TYPE) => {
      const key = createDocumentKey(documentType, documentId);

      // Skip if already fetched
      if (details[key]) {
        return;
      }

      setLoadingKeys((prev) => new Set(prev).add(key));

      try {
        await getDocumentApi(
          callApi,
          (res) => {
            if (res?.success && res?.data) {
              const normalizedDetails = normalizeDocumentDetails(res.data);
              setDetails((prev) => ({
                ...prev,
                [key]: normalizedDetails,
              }));
            }
          },
          {
            documentType,
            Id: documentId,
          },
          false // Don't show global loading spinner
        );
      } catch (error) {
        // Silently fail - details will just not be available
      } finally {
        setLoadingKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    },
    [callApi, details]
  );

  const fetchMultipleDetails = useCallback(
    async (documents: LinkedDocumentRef[]) => {
      // Set all as loading
      const keys = documents.map((doc) => createDocumentKey(doc.type, doc.id));
      setLoadingKeys(new Set(keys));

      const newDetails: Record<string, DocumentDetailsInfo> = {};

      // Fetch all in parallel
      const promises = documents.map(async (doc) => {
        const key = createDocumentKey(doc.type, doc.id);

        // Skip if already fetched
        if (details[key]) {
          return;
        }

        try {
          await getDocumentApi(
            callApi,
            (res) => {
              if (res?.success && res?.data) {
                const normalizedDetails = normalizeDocumentDetails(res.data);
                newDetails[key] = normalizedDetails;
              }
            },
            {
              documentType: doc.type,
              Id: doc.id,
            },
            false
          );
        } catch (error) {
          // Silently fail
        }
      });

      await Promise.all(promises);

      // Update state once with all new details
      setDetails((prev) => ({ ...prev, ...newDetails }));
      setLoadingKeys(new Set());
    },
    [callApi, details]
  );

  const isLoading = loadingKeys.size > 0;

  return {
    details,
    loadingKeys,
    isLoading,
    fetchDetails,
    fetchMultipleDetails,
  };
}
