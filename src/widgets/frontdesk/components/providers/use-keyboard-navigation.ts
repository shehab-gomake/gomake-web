import { useEffect, useCallback } from "react";
import { ConversationItem } from "./provider-types";
import { VirtualizedListHandle } from "./virtualized-conversation-list";

interface UseKeyboardNavigationProps {
  items: ConversationItem[];
  selectedId?: string;
  onSelect?: (item: ConversationItem) => void;
  virtualListRef?: React.RefObject<VirtualizedListHandle>;
  enabled?: boolean;
}

export const useKeyboardNavigation = ({
  items,
  selectedId,
  onSelect,
  virtualListRef,
  enabled = true,
}: UseKeyboardNavigationProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || !items.length || !onSelect) return;

    const currentIndex = items.findIndex(item => item.id === selectedId);
    let nextIndex = -1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : currentIndex;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        break;
      case 'Home':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          nextIndex = 0;
        }
        break;
      case 'End':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          nextIndex = items.length - 1;
        }
        break;
      case 'PageDown':
        e.preventDefault();
        nextIndex = Math.min(currentIndex + 10, items.length - 1);
        break;
      case 'PageUp':
        e.preventDefault();
        nextIndex = Math.max(currentIndex - 10, 0);
        break;
      case 'Enter':
      case ' ':
        if (currentIndex >= 0) {
          e.preventDefault();
          // Trigger a more prominent action like opening the conversation
          // This can be customized based on the application's needs
        }
        return;
      default:
        return;
    }

    if (nextIndex >= 0 && nextIndex < items.length) {
      onSelect(items[nextIndex]);

      // Scroll virtualized list to the selected item
      if (virtualListRef?.current) {
        virtualListRef.current.scrollToItem(nextIndex, 'smart');
      }
    }
  }, [items, selectedId, onSelect, virtualListRef, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  // Return a method to programmatically navigate
  return {
    navigateToIndex: useCallback((index: number) => {
      if (index >= 0 && index < items.length && onSelect) {
        onSelect(items[index]);
        if (virtualListRef?.current) {
          virtualListRef.current.scrollToItem(index, 'smart');
        }
      }
    }, [items, onSelect, virtualListRef]),

    navigateToFirst: useCallback(() => {
      if (items.length > 0 && onSelect) {
        onSelect(items[0]);
        if (virtualListRef?.current) {
          virtualListRef.current.scrollToItem(0, 'start');
        }
      }
    }, [items, onSelect, virtualListRef]),

    navigateToLast: useCallback(() => {
      if (items.length > 0 && onSelect) {
        const lastIndex = items.length - 1;
        onSelect(items[lastIndex]);
        if (virtualListRef?.current) {
          virtualListRef.current.scrollToItem(lastIndex, 'end');
        }
      }
    }, [items, onSelect, virtualListRef]),
  };
};