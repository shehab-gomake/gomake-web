import React from "react";
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DescriptionIcon from "@mui/icons-material/Description";
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
  const flatItems: MentionItem[] = React.useMemo(() => results.flatMap((g) => g.items), [results]);

  const renderItemIcon = (item: MentionItem) => {
    if (item.category === "clients") {
      const letter = (item.label || "?").charAt(0).toUpperCase();
      return (
        <ListItemAvatar>
          <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.light" }}>
            <Typography variant="body2" sx={{ color: "primary.dark" }}>
              {letter}
            </Typography>
          </Avatar>
        </ListItemAvatar>
      );
    }
    if (item.category === "suppliers") {
      return (
        <ListItemIcon>
          <BusinessIcon fontSize="small" color="action" />
        </ListItemIcon>
      );
    }
    if (item.category === "invoices") {
      return (
        <ListItemIcon>
          <RequestQuoteIcon fontSize="small" color="success" />
        </ListItemIcon>
      );
    }
    if (item.category === "receipts") {
      return (
        <ListItemIcon>
          <ReceiptLongIcon fontSize="small" color="info" />
        </ListItemIcon>
      );
    }
    return (
      <ListItemIcon>
        <PersonIcon fontSize="small" color="action" />
      </ListItemIcon>
    );
  };

  const renderCategoryIcon = (categoryTitle: string) => {
    switch (categoryTitle) {
      case "Clients":
        return <PersonIcon fontSize="small" color="primary" />;
      case "Suppliers":
        return <BusinessIcon fontSize="small" color="secondary" />;
      case "Invoices":
        return <RequestQuoteIcon fontSize="small" color="success" />;
      case "Receipts":
        return <ReceiptLongIcon fontSize="small" color="info" />;
      default:
        return <DescriptionIcon fontSize="small" color="action" />;
    }
  };

  const getChevronCategory = (title: string): MentionCategory | null => {
    switch (title) {
      case "Clients":
        return "clients";
      case "Suppliers":
        return "suppliers";
      case "Invoices":
        return "invoices";
      case "Receipts":
        return "receipts";
      default:
        return null; // e.g., People, Files
    }
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
      style={{ zIndex: 1300 }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 420,
          maxHeight: 440,
          overflow: "auto",
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[8],
        }}
      >
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
                  {/* Category header */}
                  <Stack direction="row" alignItems="center" sx={{ px: 2, pt: gi === 0 ? 1.5 : 1, pb: 0.5 }}>
                    <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 0.6 }}>
                      {group.title.toUpperCase()}
                    </Typography>
                    <Box flex={1} />
                    {(() => {
                      const cat = getChevronCategory(group.title);
                      if (!cat) return null;
                      return (
                        <ChevronRightIcon
                          fontSize="small"
                          sx={{ color: "text.disabled", cursor: "pointer" }}
                          onClick={() => onCategoryChange(cat)}
                        />
                      );
                    })()}
                  </Stack>

                  {/* Category items */}
                  <List dense disablePadding>
                    {group.items.map((item, idx) => {
                      // Calculate global index
                      let globalIndex = 0;
                      for (let i = 0; i < gi; i++) {
                        globalIndex += results[i].items.length;
                      }
                      globalIndex += idx;
                      const selected = globalIndex === highlightedIndex;
                      return (
                        <ListItem key={`${item.category}-${item.id}`} disablePadding>
                          <ListItemButton
                            selected={selected}
                            onMouseEnter={() => onHighlightChange(globalIndex)}
                            onClick={() => onPick(item)}
                            sx={{
                              py: 1,
                              px: 2,
                              borderRadius: 0,
                              "&.Mui-selected": {
                                backgroundColor: (theme) => (theme.palette.action.selected as any) || "rgba(0,0,0,0.04)",
                              },
                              "&:hover": {
                                backgroundColor: (theme) => (theme.palette.action.hover as any) || "rgba(0,0,0,0.03)",
                              },
                            }}
                          >
                            {renderItemIcon(item)}
                            <ListItemText
                              primary={item.label}
                              secondary={item.sublabel}
                              primaryTypographyProps={{ noWrap: true }}
                              secondaryTypographyProps={{ noWrap: true, color: "text.secondary" }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                  {gi < results.length - 1 && <Divider sx={{ my: 0.5 }} />}
                </Box>
              ))}
          </Box>
        )}
      </Paper>
    </Popper>
  );
};
