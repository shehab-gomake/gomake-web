import React from "react";
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import type { MentionCategory, MentionGroup, MentionItem } from "./types";

interface MentionsMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  query: string;
  category: MentionCategory;
  onCategoryChange: (c: MentionCategory) => void;
  results: MentionGroup[];
  loading: boolean;
  highlightedIndex: number;
  onHighlightChange: (next: number) => void;
  onPick: (item: MentionItem) => void;
  onClose: () => void;
}

const categories: { label: string; value: MentionCategory }[] = [
  { label: "All", value: "all" },
  { label: "Clients", value: "clients" },
  { label: "Suppliers", value: "suppliers" },
  { label: "Invoices", value: "invoices" },
  { label: "Receipts", value: "receipts" },
];

export const MentionsMenu: React.FC<MentionsMenuProps> = ({
  open,
  anchorEl,
  query,
  category,
  onCategoryChange,
  results,
  loading,
  highlightedIndex,
  onHighlightChange,
  onPick,
  onClose,
}) => {
  // Flatten items to help with index-based highlighting
  const flatItems: MentionItem[] = React.useMemo(
    () => results.flatMap((g) => g.items),
    [results]
  );

  const handleTabChange = (_: any, value: MentionCategory) => {
    onCategoryChange(value);
  };

  return (
    <Popper open={open} anchorEl={anchorEl} placement="top-start" style={{ zIndex: 1300 }}>
      <Paper elevation={4} sx={{ width: 360, maxHeight: 320, overflow: "auto" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={category}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((c) => (
              <Tab key={c.value} label={c.label} value={c.value} sx={{ minHeight: 36 }} />
            ))}
          </Tabs>
        </Box>

        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 2 }}>
            <CircularProgress size={20} />
          </Stack>
        ) : results.length === 0 ? (
          <Box sx={{ p: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              No results
            </Typography>
          </Box>
        ) : (
          <Box>
            {results.map((group, gi) => (
              <Box key={`${group.title}-${gi}`}>
                <Typography variant="caption" sx={{ px: 1.5, pt: gi === 0 ? 1 : 0.5, pb: 0.5, display: "block", color: "text.secondary" }}>
                  {group.title}
                </Typography>
                <List dense disablePadding>
                  {group.items.map((item, idx) => {
                    const globalIndex = results
                      .slice(0, gi)
                      .reduce((acc, g) => acc + g.items.length, 0) + idx;
                    const selected = globalIndex === highlightedIndex;
                    return (
                      <ListItem key={`${item.category}-${item.id}`} disablePadding>
                        <ListItemButton
                          selected={selected}
                          onMouseEnter={() => onHighlightChange(globalIndex)}
                          onClick={() => onPick(item)}
                       >
                          <ListItemText
                            primary={item.label}
                            secondary={item.sublabel}
                            primaryTypographyProps={{ noWrap: true }}
                            secondaryTypographyProps={{ noWrap: true }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
                {gi < results.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Popper>
  );
};
