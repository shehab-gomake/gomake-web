import { useCallback, useEffect, useState } from "react";
import { useRecoilState, atom } from "recoil";
import { EmailLabel } from "../types/email.types";
import { emailApiClient } from "../utils/email-api-client";
import { useSnackBar } from "@/hooks/use-snack-bar";

const selectedLabelState = atom<string | null>({
  key: "selected_email_label_state",
  default: null,
});

export const useEmailLabels = (accountId?: string) => {
  const [labels, setLabels] = useState<EmailLabel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [selectedLabel, setSelectedLabel] = useRecoilState(selectedLabelState);
  const { alertFault } = useSnackBar();

  // Fetch labels when account changes
  useEffect(() => {
    if (!accountId) {
      setLabels([]);
      return;
    }

    const fetchLabels = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const response = await emailApiClient.getAccountLabels(accountId, { limit: 50 });
        setLabels(response.labels);
      } catch (err: any) {
        console.error("Error fetching email labels:", err);
        const errorMessage = err.message || "Failed to fetch email labels";
        setError(errorMessage);
        alertFault(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  // Clear selected label when account changes
  useEffect(() => {
    if (accountId && selectedLabel) {
      // Check if the selected label exists in the current account's labels
      const labelExists = labels.some(label => label.id === selectedLabel);
      if (!labelExists) {
        setSelectedLabel(null);
      }
    }
  }, [accountId, labels, selectedLabel, setSelectedLabel]);

  const selectLabel = useCallback((labelId: string | null) => {
    setSelectedLabel(labelId);
  }, [setSelectedLabel]);

  const systemLabels = labels.filter(label => label.type === 'system');
  const userLabels = labels.filter(label => label.type === 'user');
  const selectedLabelObj = selectedLabel ? labels.find(label => label.id === selectedLabel) || null : null;

  return {
    labels,
    systemLabels,
    userLabels,
    selectedLabel: selectedLabelObj,
    selectedLabelId: selectedLabel,
    loading,
    error,
    selectLabel,
  };
};