import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import {
  chatwootProfileAtom,
  chatwootProfileLoadingAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

/**
 * Custom hook for managing Chatwoot profile state
 * Follows the Email provider pattern to prevent multiple API calls
 */
export const useChatwootProfile = () => {
  const [profile, setProfile] = useRecoilState(chatwootProfileAtom);
  const [loading, setLoading] = useRecoilState(chatwootProfileLoadingAtom);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const profileData = await chatwootService.profile.getProfile();
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Failed to load Chatwoot profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setProfile, setLoading]);

  // Initial fetch on mount - only if not already loaded
  useEffect(() => {
    // Guard: Only fetch if profile is not already loaded and not currently loading
    if (profile === null && !loading) {
      fetchProfile();
    }
  }, []); // Empty dependency array - runs only once on mount

  return {
    profile,
    loading,
    fetchProfile, // Expose for manual refresh if needed
  };
};
