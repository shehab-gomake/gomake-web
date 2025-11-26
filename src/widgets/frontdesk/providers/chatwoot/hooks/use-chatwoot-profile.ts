import { useCallback, useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { chatwootProfileAtom, chatwootProfileLoadingAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useApiWithRetry } from "./core/use-api-with-retry";

// Global deduplication flag to prevent concurrent profile fetches across ALL component instances
// This prevents duplicate API calls when multiple components mount simultaneously
let globalProfileFetchInProgress = false;

/**
 * Custom hook for managing Chatwoot profile state
 * Follows the Email provider pattern to prevent multiple API calls
 * Includes error handling for network issues
 *
 * Production-ready pattern: Uses global flag for fetch deduplication across all component instances
 * This prevents duplicate API calls during initial page load when multiple components mount
 */
export const useChatwootProfile = () => {
  const [profile, setProfile] = useRecoilState(chatwootProfileAtom);
  const [loading, setLoading] = useRecoilState(chatwootProfileLoadingAtom);
  const [error, setError] = useState<Error | null>(null);
  const hasAttemptedRef = useRef(false);

  // Setup retryable fetch
  const { execute: fetchProfileWithRetry } = useApiWithRetry(useCallback(() => chatwootService.profile.getProfile(), []));

  const fetchProfile = useCallback(async () => {
    // Global deduplication check - prevents duplicate calls across ALL component instances
    if (globalProfileFetchInProgress) {
      console.log("[useChatwootProfile] ⏭️ Global fetch already in progress, skipping duplicate call");
      return;
    }

    console.log("[useChatwootProfile] 🚀 Starting profile fetch...");
    globalProfileFetchInProgress = true;
    setLoading(true);
    setError(null);
    try {
      const profileData = await fetchProfileWithRetry();
      console.log("[useChatwootProfile] ✅ Profile fetched successfully");
      setProfile(profileData);
      hasAttemptedRef.current = true;
      return profileData;
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to load Chatwoot profile");
      console.error("[useChatwootProfile] ❌ Failed to load profile:", err.message);
      setError(err);
      hasAttemptedRef.current = true;
      // Don't throw - let the component handle the error state
      return null;
    } finally {
      setLoading(false);
      globalProfileFetchInProgress = false;
    }
  }, [setProfile, setLoading, fetchProfileWithRetry]);

  // Initial fetch on mount - only if not already loaded/attempted
  useEffect(() => {
    // Guard: Only fetch if profile is not already loaded, not currently loading, and haven't attempted yet
    if (profile === null && !loading && !hasAttemptedRef.current && !globalProfileFetchInProgress) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - runs only once on mount per component instance

  return {
    profile,
    loading,
    error,
    fetchProfile, // Expose for manual refresh if needed
    hasAttempted: hasAttemptedRef.current, // Expose to check if we've tried fetching
    profileError: error, // Explicit alias for clarity
  };
};
