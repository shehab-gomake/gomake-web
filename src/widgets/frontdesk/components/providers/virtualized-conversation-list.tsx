import React, { useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
import { Box, Divider } from "@mui/material";
import { ConversationItem } from "./provider-types";
import { ConversationListRow } from "./conversation-list-row";

interface VirtualizedConversationListProps {
  items: ConversationItem[];
  selectedId?: string;
  density: 'comfortable' | 'compact';
  onSelect?: (item: ConversationItem) => void;
  height: number;
  width?: number | string;
  overscanCount?: number;
}

export interface VirtualizedListHandle {
  scrollToItem: (index: number, align?: "start" | "center" | "end" | "smart" | "auto") => void;
}

const ITEM_HEIGHT = {
  comfortable: 80,
  compact: 56,
};

const InnerElementType = forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} {...props} className="custom-scrollbar" />
));
InnerElementType.displayName = 'InnerElementType';

export const VirtualizedConversationList = forwardRef<
  VirtualizedListHandle,
  VirtualizedConversationListProps
>(
  (
    {
      items,
      selectedId,
      density,
      onSelect,
      height,
      width = "100%",
      overscanCount = 5,
    },
    ref
  ) => {
    const listRef = useRef<List>(null);
    const itemHeight = ITEM_HEIGHT[density];

    useImperativeHandle(ref, () => ({
      scrollToItem: (index: number, align = "smart") => {
        listRef.current?.scrollToItem(index, align);
      },
    }));

    const Row = useCallback(
      ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const item = items[index];
        const isLast = index === items.length - 1;

        return (
          <Box style={style}>
            <ConversationListRow
              item={item}
              isSelected={selectedId === item.id}
              density={density}
              onSelect={onSelect || (() => {})}
            />
            {!isLast && (
              <Divider
                component="div"
                sx={{
                  ml: density === 'compact' ? 6 : 7,
                  mr: 1.5,
                }}
              />
            )}
          </Box>
        );
      },
      [items, selectedId, density, onSelect]
    );

    const itemKey = useCallback((index: number) => items[index].id, [items]);

    return (
      <List
        ref={listRef}
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width={width}
        overscanCount={overscanCount}
        innerElementType={InnerElementType}
        itemKey={itemKey}
      >
        {Row}
      </List>
    );
  }
);

VirtualizedConversationList.displayName = "VirtualizedConversationList";