import { useCallback, useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { chatwootProfileAtom, chatwootProfileLoadingAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useApiWithRetry } from "./core/use-api-with-retry";
import { useFetchLock, FETCH_LOCK_KEYS } from "./core/use-fetch-lock";

/**
 * Custom hook for managing Chatwoot profile state
 * Follows the Email provider pattern to prevent multiple API calls
 * Includes error handling for network issues
 *
 * Production-ready pattern: Uses centralized fetch lock for deduplication across all component instances
 * This prevents duplicate API calls during initial page load when multiple components mount
 */
export const useChatwootProfile = () => {
  const [profile, setProfile] = useRecoilState(chatwootProfileAtom);
  const [loading, setLoading] = useRecoilState(chatwootProfileLoadingAtom);
  const [error, setError] = useState<Error | null>(null);
  const hasAttemptedRef = useRef(false);

  // Centralized fetch lock
  const { acquireLock, releaseLock, isLocked } = useFetchLock();

  // Setup retryable fetch
  const { execute: fetchProfileWithRetry } = useApiWithRetry(useCallback(() => chatwootService.profile.getProfile(), []));

  const fetchProfile = useCallback(async () => {
    // Centralized deduplication check - prevents duplicate calls across ALL component instances
    if (!acquireLock(FETCH_LOCK_KEYS.PROFILE)) {
      console.log("[useChatwootProfile] ⏭️ Fetch already in progress, skipping duplicate call");
      return;
    }

    console.log("[useChatwootProfile] 🚀 Starting profile fetch...");
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
      releaseLock(FETCH_LOCK_KEYS.PROFILE);
    }
  }, [setProfile, setLoading, fetchProfileWithRetry, acquireLock, releaseLock]);

  // Initial fetch on mount - only if not already loaded/attempted
  useEffect(() => {
    // Guard: Only fetch if profile is not already loaded, not currently loading, and haven't attempted yet
    const profileLocked = isLocked(FETCH_LOCK_KEYS.PROFILE);
    if (profile === null && !loading && !hasAttemptedRef.current && !profileLocked) {
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
