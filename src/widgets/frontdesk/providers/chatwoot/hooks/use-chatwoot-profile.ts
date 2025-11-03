import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import {
  chatwootProfileAtom,
  chatwootProfileLoadingAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

/**
 * Custom hook for managing Chatwoot profile state
 * Follows the Email provider pattern to prevent multiple API calls
 * Includes error handling for network issues
 */
export const useChatwootProfile = () => {
  const [profile, setProfile] = useRecoilState(chatwootProfileAtom);
  const [loading, setLoading] = useRecoilState(chatwootProfileLoadingAtom);
  const [error, setError] = useState<Error | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const fetchProfile = useCallback(async () => {
    // Prevent duplicate calls
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const profileData = await chatwootService.profile.getProfile();
      setProfile(profileData);
      setHasAttempted(true);
      return profileData;
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to load Chatwoot profile");
      console.error("[useChatwootProfile] Failed to load profile:", err.message);
      setError(err);
      setHasAttempted(true);
      // Don't throw - let the component handle the error state
      return null;
    } finally {
      setLoading(false);
    }
  }, [setProfile, setLoading, loading]);

  // Initial fetch on mount - only if not already loaded/attempted
  useEffect(() => {
    // Guard: Only fetch if profile is not already loaded, not currently loading, and haven't attempted yet
    if (profile === null && !loading && !hasAttempted) {
      fetchProfile();
    }
  }, []); // Empty dependency array - runs only once on mount

  return {
    profile,
    loading,
    error,
    fetchProfile, // Expose for manual refresh if needed
    hasAttempted, // Expose to check if we've tried fetching
  };
};
