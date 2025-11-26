import { useCallback, useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { chatwootProfileAtom, chatwootProfileLoadingAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useApiWithRetry } from "./core/use-api-with-retry";

/**
 * Custom hook for managing Chatwoot profile state
 * Follows the Email provider pattern to prevent multiple API calls
 * Includes error handling for network issues
 *
 * Production-ready pattern: Uses useRef instead of global flag for fetch deduplication
 * This ensures proper isolation across multiple component instances and SSR compatibility
 */
export const useChatwootProfile = () => {
  const [profile, setProfile] = useRecoilState(chatwootProfileAtom);
  const [loading, setLoading] = useRecoilState(chatwootProfileLoadingAtom);
  const [error, setError] = useState<Error | null>(null);
  const hasAttemptedRef = useRef(false);
  const isFetchingRef = useRef(false);

  // Setup retryable fetch
  const { execute: fetchProfileWithRetry } = useApiWithRetry(useCallback(() => chatwootService.profile.getProfile(), []));

  const fetchProfile = useCallback(async () => {
    // Atomic check-and-set to prevent race conditions
    // Using ref instead of global flag for better isolation and SSR compatibility
    // Note: We only check isFetchingRef here (not loading state) to keep callback stable
    if (isFetchingRef.current) {
      console.log("[useChatwootProfile] ⏭️ Fetch already in progress, skipping duplicate call");
      return;
    }

    console.log("[useChatwootProfile] 🚀 Starting profile fetch...");
    isFetchingRef.current = true;
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
      isFetchingRef.current = false;
    }
  }, [setProfile, setLoading, fetchProfileWithRetry]);

  // Initial fetch on mount - only if not already loaded/attempted
  useEffect(() => {
    // Guard: Only fetch if profile is not already loaded, not currently loading, and haven't attempted yet
    if (profile === null && !loading && !hasAttemptedRef.current && !isFetchingRef.current) {
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
