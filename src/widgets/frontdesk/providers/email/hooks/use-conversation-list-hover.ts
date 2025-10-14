import { useState, useRef, useEffect, useCallback } from "react";

interface UseConversationListHoverProps {
  onShowProfile: (email: string, element: HTMLElement) => void;
  onHideProfile: () => void;
}

export const useConversationListHover = ({ onShowProfile, onHideProfile }: UseConversationListHoverProps) => {
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(
    (email: string, element: HTMLElement) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setHoveredEmail(email);
      setHoveredElement(element);
      setShowProfile(true);
      onShowProfile(email, element);
    },
    [onShowProfile]
  );

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowProfile(false);
      setHoveredEmail(null);
      setHoveredElement(null);
      onHideProfile();
    }, 300); // 300ms delay before hiding
  }, [onHideProfile]);

  const handleProfileMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  const handleProfileMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowProfile(false);
      setHoveredEmail(null);
      setHoveredElement(null);
      onHideProfile();
    }, 300);
  }, [onHideProfile]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    hoveredEmail,
    hoveredElement,
    showProfile,
    handleMouseEnter,
    handleMouseLeave,
    handleProfileMouseEnter,
    handleProfileMouseLeave,
  };
};
