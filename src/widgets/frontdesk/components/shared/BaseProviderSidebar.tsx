import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  IconButton,
  Collapse,
  Stack,
  Button,
} from "@mui/material";
import {
  Tag as ChannelIcon,
  Person as PersonIcon,
  Add as AddIcon,
  ExpandLess,
  ExpandMore,
  Circle as OnlineIcon,
  Refresh as RefreshIcon,
  Label as TagIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export interface BaseSidebarItem {
  id: string;
  name: string;
  type: "channel" | "direct" | "account" | "label";
  unreadCount?: number;
  isSelected?: boolean;
  icon?: React.ReactNode;
  status?: "online" | "away" | "busy" | "offline";
  lastSeen?: string;
  email?: string;
}

interface BaseProviderSidebarProps {
  title: string;
  items: BaseSidebarItem[];
  selectedItemId?: string;
  onItemSelect: (item: BaseSidebarItem) => void;
  onAddItem?: () => void;
  onRefresh?: () => void;
  showSections?: boolean;
  sections?: {
    channels?: string;
    directMessages?: string;
    accounts?: string;
    labels?: string;
  };
  emptyMessage?: string;
  loading?: boolean;
}

const StatusIndicator: React.FC<{ status: "online" | "away" | "busy" | "offline" }> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case "online":
        return "#10B981"; // green
      case "away":
        return "#F59E0B"; // yellow
      case "busy":
        return "#EF4444"; // red
      case "offline":
        return "#6B7280"; // gray
      default:
        return "#6B7280";
    }
  };

  return (
    <OnlineIcon
      sx={{
        fontSize: 8,
        color: getColor(),
        mr: 0.5,
      }}
    />
  );
};

export const BaseProviderSidebar: React.FC<BaseProviderSidebarProps> = ({
  title,
  items,
  selectedItemId,
  onItemSelect,
  onAddItem,
  onRefresh,
  showSections = true,
  sections = {
    channels: "CHANNELS",
    directMessages: "DIRECT MESSAGES",
    accounts: "ACCOUNTS",
    labels: "LABELS",
  },
  emptyMessage = "No items available",
  loading = false,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true);
  const [accountsExpanded, setAccountsExpanded] = useState(true);
  const [labelsExpanded, setLabelsExpanded] = useState(true);

  const channelItems = items.filter((item) => item.type === "channel");
  const directItems = items.filter((item) => item.type === "direct");
  const accountItems = items.filter((item) => item.type === "account");
  const labelItems = items.filter((item) => item.type === "label");

  const getDisplayName = (item: BaseSidebarItem) => {
    return item.name || item.email || "Unknown";
  };

  const getLastSeenText = (lastSeen?: string) => {
    if (!lastSeen) return null;
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
  };

  const renderSection = (
    title: string,
    items: BaseSidebarItem[],
    expanded: boolean,
    onToggle: () => void,
    icon: React.ReactNode
  ) => {
    if (!showSections || items.length === 0) return null;

    return (
      <>
        <ListItem sx={{ px: 2, py: 1 }}>
          <ListItemButton onClick={onToggle} sx={{ p: 0, minHeight: "auto" }}>
            <ListItemText
              primary={
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: neutralColor(700), fontSize: "0.75rem" }}>
                  {title}
                </Typography>
              }
            />
            {expanded ? (
              <ExpandLess sx={{ fontSize: 16, color: neutralColor(500) }} />
            ) : (
              <ExpandMore sx={{ fontSize: 16, color: neutralColor(500) }} />
            )}
          </ListItemButton>
        </ListItem>

        <Collapse in={expanded}>
          {items.map((item) => (
            <ListItem key={item.id} sx={{ py: 0, px: 1 }}>
              <ListItemButton
                selected={selectedItemId === item.id}
                onClick={() => onItemSelect(item)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  "&.Mui-selected": {
                    backgroundColor: primaryColor(50),
                    "&:hover": {
                      backgroundColor: primaryColor(100),
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {item.type === "direct" && item.status ? (
                    <Stack direction="row" alignItems="center">
                      <StatusIndicator status={item.status} />
                      <PersonIcon sx={{ fontSize: 16, color: neutralColor(500) }} />
                    </Stack>
                  ) : (
                    item.icon ||
                    (item.type === "channel" ? (
                      <ChannelIcon sx={{ fontSize: 16, color: neutralColor(500) }} />
                    ) : (
                      <PersonIcon sx={{ fontSize: 16, color: neutralColor(500) }} />
                    ))
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ color: neutralColor(800) }}>
                        {getDisplayName(item)}
                      </Typography>
                      {item.unreadCount && item.unreadCount > 0 && (
                        <Badge
                          badgeContent={item.unreadCount}
                          color="error"
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "0.625rem",
                              minWidth: 16,
                              height: 16,
                            },
                          }}
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    item.type === "direct" &&
                    item.status !== "online" && (
                      <Typography variant="caption" sx={{ color: neutralColor(500) }}>
                        {item.status === "offline" ? getLastSeenText(item.lastSeen) : item.status}
                      </Typography>
                    )
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}

          {onAddItem && (
            <ListItem sx={{ py: 0, px: 1 }}>
              <ListItemButton
                onClick={onAddItem}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  color: neutralColor(500),
                  "&:hover": {
                    backgroundColor: neutralColor(50),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <AddIcon sx={{ fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      Add {title.slice(0, -1)}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          )}
        </Collapse>
      </>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${neutralColor(200)}` }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 600, color: neutralColor(900) }}>
            {title}
          </Typography>
          {onRefresh && (
            <Button
              size="small"
              onClick={onRefresh}
              startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: neutralColor(600),
                "&:hover": {
                  color: primaryColor(600),
                  backgroundColor: primaryColor(50),
                },
              }}
            >
              Refresh
            </Button>
          )}
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(600) }}>
              Loading...
            </Typography>
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ py: 0 }}>
            {renderSection(
              sections.channels || "CHANNELS",
              channelItems,
              channelsExpanded,
              () => setChannelsExpanded(!channelsExpanded),
              <ChannelIcon />
            )}
            {channelItems.length > 0 && directItems.length > 0 && <Divider sx={{ my: 1 }} />}
            {renderSection(
              sections.directMessages || "DIRECT MESSAGES",
              directItems,
              directMessagesExpanded,
              () => setDirectMessagesExpanded(!directMessagesExpanded),
              <PersonIcon />
            )}
            {directItems.length > 0 && accountItems.length > 0 && <Divider sx={{ my: 1 }} />}
            {renderSection(
              sections.accounts || "ACCOUNTS",
              accountItems,
              accountsExpanded,
              () => setAccountsExpanded(!accountsExpanded),
              <PersonIcon />
            )}
            {accountItems.length > 0 && labelItems.length > 0 && <Divider sx={{ my: 1 }} />}
            {renderSection(
              sections.labels || "LABELS",
              labelItems,
              labelsExpanded,
              () => setLabelsExpanded(!labelsExpanded),
              <TagIcon />
            )}
          </List>
        )}
      </Box>
    </Paper>
  );
};
