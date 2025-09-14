import React from "react";
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
}) => {
  const { primaryColor, neutralColor, secondColor } = useGomakeTheme();

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
        <List disablePadding className="custom-scrollbar" sx={{ height: "100%", overflowY: "auto" }}>
          {items.map((item, idx) => (
            <React.Fragment key={item.id}>
              <ListItem disableGutters sx={{ px: 0 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                    gap: 1,
                    bgcolor: item.unread ? primaryColor(50) : "transparent",
                    "&:hover": { bgcolor: primaryColor(100) },
                    "&.Mui-selected": {
                      bgcolor: primaryColor(100),
                      boxShadow: `inset 3px 0 0 ${secondColor(500)}`,
                    },
                  }}
                  selected={selectedId === item.id}
                  onClick={() => onSelect?.(item)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: neutralColor(200), color: neutralColor(700) }}>
                      {getInitials(item.from)}
                    </Avatar>
                  </ListItemAvatar>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    gap={1}
                    sx={{ minWidth: 0 }}
                  >
                    <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: item.unread ? 700 : 500 }} noWrap>
                        {item.from}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#475467", fontWeight: item.unread ? 600 : 400 }} noWrap>
                        {item.subject}
                      </Typography>
                      {!!item.snippet && (
                        <Typography variant="caption" sx={{ color: "#667085" }} noWrap>
                          {item.snippet}
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="caption" sx={{ color: "#667085", whiteSpace: "nowrap" }}>
                      {item.receivedAt}
                    </Typography>
                  </Stack>
                </ListItemButton>
              </ListItem>
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
    </Paper>
  );
};