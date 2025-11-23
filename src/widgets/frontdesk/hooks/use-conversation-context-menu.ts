import { useState, useCallback } from 'react';

export interface MousePosition {
  top: number;
  left: number;
}

export interface UseConversationContextMenuReturn {
  contextMenuPosition: MousePosition | null;
  handleContextMenu: (event: React.MouseEvent) => void;
  handleCloseContextMenu: () => void;
  isOpen: boolean;
}

/**
 * Hook for managing conversation context menu state
 * 
 * Captures mouse position for precise context menu placement at cursor location
 */
export const useConversationContextMenu = (): UseConversationContextMenuReturn => {
  const [contextMenuPosition, setContextMenuPosition] = useState<MousePosition | null>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Use mouse coordinates for precise positioning
    setContextMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenuPosition(null);
  }, []);

  return {
    contextMenuPosition,
    handleContextMenu,
    handleCloseContextMenu,
    isOpen: Boolean(contextMenuPosition),
  };
};

