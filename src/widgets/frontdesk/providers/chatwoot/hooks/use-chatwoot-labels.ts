/**
 * useChatwootLabels Hook
 *
 * Manages labels state and provides CRUD operations for Chatwoot labels.
 * Uses Recoil atoms for state management and chatwootService for API calls.
 */

import { useCallback, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import type { Label, CreateLabelPayload, UpdateLabelPayload } from "@/services/frontdesk/api/chatwoot";
import {
  chatwootLabelsAtom,
  chatwootLabelsLoadingAtom,
  chatwootLabelsErrorAtom,
  type ChatwootLabel,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useChatwootProvider } from "./use-chatwoot-provider";

export interface UseChatwootLabelsReturn {
  /** List of labels */
  labels: ChatwootLabel[];
  /** Loading state */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Fetch labels from API */
  fetchLabels: () => Promise<void>;
  /** Create a new label */
  createLabel: (payload: CreateLabelPayload) => Promise<ChatwootLabel>;
  /** Update an existing label */
  updateLabel: (labelId: number, payload: UpdateLabelPayload) => Promise<ChatwootLabel>;
  /** Delete a label */
  deleteLabel: (labelId: number) => Promise<void>;
  /** Refresh labels list */
  refresh: () => Promise<void>;
}

/**
 * Hook for managing Chatwoot labels
 *
 * @param accountId - The account ID (if not provided, uses selected account from provider)
 * @param autoFetch - Whether to automatically fetch labels on mount (default: true)
 * @returns Labels state and CRUD operations
 *
 * @example
 * ```typescript
 * const { labels, loading, createLabel, deleteLabel } = useChatwootLabels(accountId);
 *
 * // Create a new label
 * await createLabel({
 *   title: "Urgent",
 *   color: "#FF0000",
 *   show_on_sidebar: true
 * });
 * ```
 */
export const useChatwootLabels = (
  accountId?: number | null,
  autoFetch: boolean = true
): UseChatwootLabelsReturn => {
  const { selectedAccountId } = useChatwootProvider();
  const [labels, setLabels] = useRecoilState(chatwootLabelsAtom);
  const [loading, setLoading] = useRecoilState(chatwootLabelsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootLabelsErrorAtom);

  // Fetch deduplication
  const isFetchingRef = useRef(false);
  const hasAttemptedRef = useRef(false);

  // Use provided accountId or fall back to selected account
  const effectiveAccountId = accountId ?? selectedAccountId;

  const fetchLabels = useCallback(async () => {
    if (!effectiveAccountId) {
      setError("No account selected");
      return;
    }

    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const fetchedLabels = await chatwootService.labels.listLabels(effectiveAccountId);
      // Map API Label type to ChatwootLabel type
      const mappedLabels: ChatwootLabel[] = fetchedLabels.map((label) => ({
        id: label.id,
        title: label.title || "",
        description: label.description,
        color: label.color || "#000000",
        show_on_sidebar: label.show_on_sidebar ?? false,
      }));
      setLabels(mappedLabels);
      hasAttemptedRef.current = true;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch labels";
      setError(errorMessage);
      setLabels([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [effectiveAccountId, setLabels, setLoading, setError]);

  const createLabel = useCallback(
    async (payload: CreateLabelPayload): Promise<ChatwootLabel> => {
      if (!effectiveAccountId) {
        throw new Error("No account selected");
      }

      setLoading(true);
      setError(null);

      try {
        const newLabel = await chatwootService.labels.createLabel(effectiveAccountId, payload);
        const mappedLabel: ChatwootLabel = {
          id: newLabel.id,
          title: newLabel.title || "",
          description: newLabel.description,
          color: newLabel.color || "#000000",
          show_on_sidebar: newLabel.show_on_sidebar ?? false,
        };
        setLabels((prev) => [...prev, mappedLabel]);
        return mappedLabel;
      } catch (err: any) {
        const errorMessage = err?.message || "Failed to create label";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [effectiveAccountId, setLabels, setLoading, setError]
  );

  const updateLabel = useCallback(
    async (labelId: number, payload: UpdateLabelPayload): Promise<ChatwootLabel> => {
      if (!effectiveAccountId) {
        throw new Error("No account selected");
      }

      setLoading(true);
      setError(null);

      try {
        const updatedLabel = await chatwootService.labels.updateLabel(effectiveAccountId, labelId, payload);
        const mappedLabel: ChatwootLabel = {
          id: updatedLabel.id,
          title: updatedLabel.title || "",
          description: updatedLabel.description,
          color: updatedLabel.color || "#000000",
          show_on_sidebar: updatedLabel.show_on_sidebar ?? false,
        };
        setLabels((prev) => prev.map((label) => (label.id === labelId ? mappedLabel : label)));
        return mappedLabel;
      } catch (err: any) {
        const errorMessage = err?.message || "Failed to update label";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [effectiveAccountId, setLabels, setLoading, setError]
  );

  const deleteLabel = useCallback(
    async (labelId: number): Promise<void> => {
      if (!effectiveAccountId) {
        throw new Error("No account selected");
      }

      setLoading(true);
      setError(null);

      try {
        await chatwootService.labels.deleteLabel(effectiveAccountId, labelId);
        setLabels((prev) => prev.filter((label) => label.id !== labelId));
      } catch (err: any) {
        const errorMessage = err?.message || "Failed to delete label";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [effectiveAccountId, setLabels, setLoading, setError]
  );

  const refresh = useCallback(async () => {
    await fetchLabels();
  }, [fetchLabels]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && effectiveAccountId && !hasAttemptedRef.current && !isFetchingRef.current) {
      fetchLabels();
    }
  }, [autoFetch, effectiveAccountId, fetchLabels]);

  return {
    labels,
    loading,
    error,
    fetchLabels,
    createLabel,
    updateLabel,
    deleteLabel,
    refresh,
  };
};

