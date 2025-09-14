import React, { useRef, useEffect, useState } from "react";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FrontdeskLoading } from "@/widgets/frontdesk/components/loading-spinner";
import { ConversationItem } from "./provider-types";
import { VirtualizedConversationList, VirtualizedListHandle } from "./virtualized-conversation-list";
import { ConversationListRow } from "./conversation-list-row";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

interface BaseConversationListProps {
  items: ConversationItem[];
  loading?: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onSelect?: (item: ConversationItem) => void;
  selectedId?: string;
  density?: 'comfortable' | 'compact';
  enableVirtualization?: boolean;
}

export const BaseConversationList: React.FC<BaseConversationListProps> = ({
  items,
  loading = false,
  error,
  hasMore = false,
  onLoadMore,
  onRefresh,
  onSelect,
  selectedId,
  density = 'comfortable',
  enableVirtualization = true,
}) => {
  const { primaryColor, neutralColor, secondColor } = useGomakeTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const virtualListRef = useRef<VirtualizedListHandle>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  // Measure container height for virtualization
  useEffect(() => {
    const measureHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerHeight(rect.height);
      }
    };

    measureHeight();
    const resizeObserver = new ResizeObserver(measureHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!items.length || !onSelect) return;

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
        default:
          return;
      }

      if (nextIndex >= 0 && nextIndex < items.length) {
        onSelect(items[nextIndex]);
        if (enableVirtualization && virtualListRef.current) {
          virtualListRef.current.scrollToItem(nextIndex, 'smart');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedId, onSelect, enableVirtualization]);

  if (loading && items.length === 0) {
    return (
      <Paper elevation={0} sx={{ border: "1px solid #EAECF0", borderRadius: 2, overflow: "hidden" }}>
        <FrontdeskLoading label="Loading conversations..." />
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: "1px solid #EAECF0", borderRadius: 2, overflow: "hidden", height: "100%" }}>
      {error && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
          {onRefresh && (
            <Button size="small" onClick={onRefresh} disabled={loading}>
              Retry
            </Button>
          )}
        </Box>
      )}

      {items.length === 0 && !loading && !error ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <Typography variant="body2" color="text.secondary">
            No conversations found
          </Typography>
        </Stack>
      ) : (
        <Box ref={containerRef} sx={{ height: "100%", overflow: "hidden" }}>
          {enableVirtualization && items.length > 50 ? (
            <>
              <VirtualizedConversationList
                ref={virtualListRef}
                items={items}
                selectedId={selectedId}
                density={density}
                onSelect={onSelect}
                height={containerHeight - (hasMore && onLoadMore ? 50 : 0)}
                overscanCount={5}
              />
              {hasMore && onLoadMore && (
                <Box sx={{ p: 2, textAlign: "center", borderTop: 1, borderColor: "divider" }}>
                  <Button size="small" onClick={onLoadMore} disabled={loading} variant="outlined">
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <List disablePadding className="custom-scrollbar" sx={{ height: "100%", overflowY: "auto" }}>
              {items.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <ConversationListRow
                    item={item}
                    isSelected={selectedId === item.id}
                    density={density}
                    onSelect={onSelect || (() => {})}
                  />
                  {idx < items.length - 1 && <Divider component="li" sx={{ ml: 7 }} />}
                </React.Fragment>
              ))}

              {hasMore && onLoadMore && (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Button size="small" onClick={onLoadMore} disabled={loading} variant="outlined">
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </Box>
              )}
            </List>
          )}
        </Box>
      )}
    </Paper>
  );
};