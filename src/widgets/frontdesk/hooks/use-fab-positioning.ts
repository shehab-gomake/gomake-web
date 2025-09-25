import { useState, useEffect } from 'react';
import { SxProps, Theme, useTheme, useMediaQuery } from '@mui/material';

interface UseFabPositioningProps {
  isConversationSelected: boolean;
  hasMessageInput: boolean;
}

interface FabPositioning {
  sx: SxProps<Theme>;
}

export const useFabPositioning = ({
  isConversationSelected,
  hasMessageInput,
}: UseFabPositioningProps): FabPositioning => {
  const [fabSx, setFabSx] = useState<SxProps<Theme>>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const baseSx = {
      position: "fixed" as const,
      right: isMobile ? 16 : 24,
      zIndex: 1000,
      transition: 'bottom 0.3s ease-in-out', // Smooth transition
    };

    // When conversation is selected and has message input, move FAB higher to avoid overlap
    if (isConversationSelected && hasMessageInput) {
      setFabSx({
        ...baseSx,
        bottom: isMobile ? 140 : 120, // Higher position to clear message input area
      });
    } else {
      // Default position when no conversation selected or no message input
      setFabSx({
        ...baseSx,
        bottom: 24,
      });
    }
  }, [isConversationSelected, hasMessageInput, isMobile]);

  return { sx: fabSx };
};