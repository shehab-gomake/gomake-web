import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  emailAccountsState,
  selectedEmailAccountIdState,
  emailAccountsLoadingState,
  emailAccountsErrorState,
} from "../store/email-store";
import { emailApiClient } from "../utils/email-api-client";
import { useSnackBar } from "@/hooks/use-snack-bar";

export const useEmailAccounts = () => {
  const [accounts, setAccounts] = useRecoilState(emailAccountsState);
  const [selectedAccountId, setSelectedAccountId] = useRecoilState(selectedEmailAccountIdState);
  const [isLoading, setIsLoading] = useRecoilState(emailAccountsLoadingState);
  const [error, setError] = useRecoilState(emailAccountsErrorState);
  const { alertSuccess, alertFault } = useSnackBar();

  // Fetch all connected accounts
  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedAccounts = await emailApiClient.getAccounts();
      setAccounts(fetchedAccounts);

      // Auto-select first account if none selected
      if (fetchedAccounts.length > 0 && !selectedAccountId) {
        const primaryAccount = fetchedAccounts.find((a) => a.isPrimary) || fetchedAccounts[0];
        setSelectedAccountId(primaryAccount.id);
      }

      return fetchedAccounts;
    } catch (err: any) {
      console.error("Error fetching email accounts:", err);
      const errorMessage = err.message || "Failed to fetch email accounts";
      setError(errorMessage);
      alertFault(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [setAccounts, setSelectedAccountId, setIsLoading, setError, alertFault]);

  // Select an account
  const selectAccount = useCallback(
    (accountId: string) => {
      const account = accounts.find((a) => a.id === accountId);
      if (account) {
        setSelectedAccountId(accountId);
      }
    },
    [accounts, setSelectedAccountId]
  );

  // Disconnect an account
  const disconnectAccount = useCallback(
    async (accountId: string) => {
      try {
        await emailApiClient.disconnectAccount(accountId);

        // Remove from state
        setAccounts((prev) => prev.filter((a) => a.id !== accountId));

        // If disconnected account was selected, select another
        if (selectedAccountId === accountId) {
          const remainingAccounts = accounts.filter((a) => a.id !== accountId);
          if (remainingAccounts.length > 0) {
            const primaryAccount = remainingAccounts.find((a) => a.isPrimary) || remainingAccounts[0];
            setSelectedAccountId(primaryAccount.id);
          } else {
            setSelectedAccountId(null);
          }
        }

        alertSuccess("Email account disconnected successfully");
        return true;
      } catch (err: any) {
        console.error("Error disconnecting account:", err);
        const errorMessage = err.message || "Failed to disconnect account";
        alertFault(errorMessage);
        return false;
      }
    },
    [accounts, selectedAccountId, setAccounts, setSelectedAccountId, alertSuccess, alertFault]
  );

  // Get selected account
  const getSelectedAccount = useCallback(() => {
    return accounts.find((a) => a.id === selectedAccountId);
  }, [accounts, selectedAccountId]);

  // Refresh accounts
  const refreshAccounts = useCallback(() => {
    return fetchAccounts();
  }, [fetchAccounts]);

  // Initial fetch on mount
  useEffect(() => {
    if (accounts.length === 0 && !isLoading && !error) {
      fetchAccounts();
    }
  }, []); // Only run once on mount

  return {
    accounts,
    selectedAccountId,
    selectedAccount: getSelectedAccount(),
    loading: isLoading,
    error,
    selectAccount,
    fetchAccounts: refreshAccounts,
    disconnectAccount,
  };
};
