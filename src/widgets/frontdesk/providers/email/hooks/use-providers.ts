/**
 * Providers Hook (Simplified API)
 *
 * Fetches and manages providers from the unified ticketing system.
 * Maps email accounts to their corresponding provider IDs.
 *
 * This is the simplified replacement for useProviderChannels.
 */

import { useCallback, useEffect, useState } from "react";
import { ticketsService } from "@/services/frontdesk";
import { Provider } from "@/widgets/frontdesk/providers/tickets/types";
import { EmailAccount } from "../types/email.types";

interface ProviderMapping {
  [emailAddress: string]: string; // email -> providerId
}

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [mapping, setMapping] = useState<ProviderMapping>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all providers from backend
   */
  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("[Providers] Fetching from GET /providers");
      const fetchedProviders = await ticketsService.getProviders();

      console.log("[Providers] Received providers:", fetchedProviders);
      console.log("[Providers] Type:", typeof fetchedProviders, "IsArray:", Array.isArray(fetchedProviders));

      // Debug: Log each provider in detail
      if (Array.isArray(fetchedProviders)) {
        console.log("[Providers] 🔍 Provider details:");
        fetchedProviders.forEach((provider, index) => {
          console.log(`[Providers] Provider ${index}:`, {
            id: provider.id,
            type: provider.type,
            name: provider.name,
            metadata: provider.metadata,
          });
        });
      }

      // Handle undefined or null response
      if (!fetchedProviders) {
        console.warn("[Providers] ⚠️ Received undefined/null response from GET /providers");
        console.warn("[Providers] ⚠️ Backend must return an array of providers");
        setProviders([]);
        setMapping({});
        return [];
      }

      // Ensure it's an array
      if (!Array.isArray(fetchedProviders)) {
        console.error("[Providers] ❌ Response is not an array:", typeof fetchedProviders, fetchedProviders);
        setProviders([]);
        setMapping({});
        return [];
      }

      // Filter EMAIL providers only
      const emailProviders = fetchedProviders.filter((provider) => provider.type === "EMAIL");

      console.log("[Providers] Email providers:", emailProviders);

      setProviders(fetchedProviders);

      // Create mapping: email address -> provider ID (for backwards compatibility)
      const newMapping: ProviderMapping = {};
      emailProviders.forEach((provider) => {
        // Email is stored in metadata.email
        const email = provider.metadata?.email;
        if (email) {
          newMapping[email.toLowerCase()] = provider.id;
        }
      });

      console.log("[Providers] Email to provider mapping:", newMapping);
      setMapping(newMapping);

      return fetchedProviders;
    } catch (err: any) {
      console.error("[Providers] Error fetching providers:", err);
      const errorMessage = err.message || "Failed to fetch providers";
      setError(errorMessage);

      // Set empty state on error to prevent crashes
      setProviders([]);
      setMapping({});

      // Don't throw - allow app to continue
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get provider ID for an email account
   */
  const getProviderId = useCallback(
    (emailAccount: EmailAccount): string | null => {
      const email = emailAccount.email.toLowerCase();
      const providerId = mapping[email];

      if (!providerId) {
        console.warn(`[Providers] No provider found for email: ${emailAccount.email}`);
        console.warn("[Providers] Available mappings:", Object.keys(mapping));
        return null;
      }

      console.log(`[Providers] Found provider ID for ${emailAccount.email}:`, providerId);
      return providerId;
    },
    [mapping]
  );

  /**
   * Get provider details by ID
   */
  const getProviderById = useCallback(
    (providerId: string): Provider | undefined => {
      return providers.find((p) => p.id === providerId);
    },
    [providers]
  );

  /**
   * Get all email providers
   */
  const getEmailProviders = useCallback((): Provider[] => {
    return providers.filter((p) => p.type === "EMAIL");
  }, [providers]);

  // Fetch on mount
  useEffect(() => {
    if (providers.length === 0 && !isLoading && !error) {
      console.log("[Providers] Auto-fetching on mount");
      fetchProviders();
    }
  }, []); // Only on mount

  return {
    providers,
    mapping,
    isLoading,
    error,
    fetchProviders,
    getProviderId,
    getProviderById,
    getEmailProviders,
  };
};
