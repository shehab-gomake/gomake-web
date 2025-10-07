import React from "react";
import { Box, Paper, Stack, Typography, IconButton, Tooltip, Divider, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { ConversationItem } from "@/widgets/frontdesk/components/providers/provider-types";

interface WhatsAppConversationListProps {
  title?: string;
  conversations: ConversationItem[];
  selectedConversationId?: string;
  loading?: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onSearch?: (q: string) => void;
  searchQuery?: string;
  onSelect: (item: ConversationItem) => void;
}

export const WhatsAppConversationList: React.FC<WhatsAppConversationListProps> = ({
  title = "WhatsApp Chats",
  conversations,
  selectedConversationId,
  loading,
  error,
  hasMore,
  onLoadMore,
  onRefresh,
  onSearch,
  searchQuery,
  onSelect,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #EAECF0",
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #EAECF0" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#101828" }}>
            {title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {onSearch && (
              <TextField
                size="small"
                placeholder="Search"
                value={searchQuery || ""}
                onChange={(e) => onSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "#6B7280" }} />,
                }}
              />
            )}
            {onRefresh && (
              <Tooltip title="Refresh">
                <IconButton size="small" onClick={onRefresh}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        {conversations.map((item) => {
          const selected = item.id === selectedConversationId;
          return (
            <Box
              key={item.id}
              sx={{
                px: 2,
                py: 1.5,
                cursor: "pointer",
                bgcolor: selected ? "#F9FAFB" : undefined,
                "&:hover": { bgcolor: "#F3F4F6" },
              }}
              onClick={() => onSelect(item)}
            >
              <Stack spacing={0.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ color: "#101828", fontWeight: 600 }} noWrap>
                    {item.subject}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                    {new Date(item.receivedAt).toLocaleTimeString()}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "#6B7280" }} noWrap>
                  {item.snippet || item.from}
                </Typography>
              </Stack>
              <Divider sx={{ mt: 1.5 }} />
            </Box>
          );
        })}
      </Box>

      {hasMore && (
        <Box sx={{ p: 1.5, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "primary.main", cursor: "pointer" }} onClick={onLoadMore}>
            Load more
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
