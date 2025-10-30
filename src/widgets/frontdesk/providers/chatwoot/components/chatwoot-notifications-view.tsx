import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Select,
  FormControl,
  Paper,
  List,
  ListItem,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useChatwootNotifications } from "../hooks/use-chatwoot-notifications";

export const ChatwootNotificationsView: React.FC = () => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const { notifications, loading, error, filters, updateFilters } = useChatwootNotifications();
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [displayValue, setDisplayValue] = useState<string>("unread");

  // Get notification sender info
  const getNotificationSender = (notification: any) => {
    const primaryActor = notification.primary_actor;
    if (!primaryActor) return { name: "System", initials: "S", color: neutralColor(400) };
    
    const name = primaryActor.name || primaryActor.email || "Unknown";
    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    
    // Generate color based on name
    const colors = [
      primaryColor(500),
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    
    return { name, initials, color: colors[colorIndex] };
  };

  // Format timestamp
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const handleDisplayChange = (event: any) => {
    const value = event.target.value;
    setDisplayValue(value);
    
    // Update filters based on display selection
    if (value === "unread") {
      updateFilters({ snoozed: false, read: false, includes: undefined });
    } else if (value === "all") {
      updateFilters({ snoozed: true, read: true, includes: ["snoozed", "read"] });
    } else if (value === "read") {
      updateFilters({ read: true, snoozed: false, includes: ["read"] });
    } else if (value === "snoozed") {
      updateFilters({ snoozed: true, read: false, includes: ["snoozed"] });
    }
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
        backgroundColor: neutralColor(0), // Light background, not dark gray
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: neutralColor(0), // Light background
          borderBottom: `1px solid ${neutralColor(200)}`,
          px: 2,
          py: 1.5,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              color: neutralColor(900),
            }}
          >
            My Inbox
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            {/* Display Dropdown */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={displayValue}
                onChange={handleDisplayChange}
                sx={{
                  fontSize: "0.875rem",
                  backgroundColor: neutralColor(0),
                  "& .MuiSelect-select": {
                    py: 0.75,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: neutralColor(300),
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: neutralColor(400),
                  },
                }}
              >
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="snoozed">Snoozed</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>

            {/* Filter Icon */}
            <IconButton
              size="small"
              onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
              sx={{
                color: neutralColor(600),
                backgroundColor: neutralColor(100),
                "&:hover": {
                  backgroundColor: neutralColor(200),
                },
                width: 32,
                height: 32,
              }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 250,
              backgroundColor: neutralColor(0),
              border: `1px solid ${neutralColor(200)}`,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.688rem",
                fontWeight: 600,
                color: neutralColor(500),
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Filter Options
            </Typography>
          </Box>
          <MenuItem
            onClick={() => {
              updateFilters({ snoozed: !filters.snoozed });
              setFilterMenuAnchor(null);
            }}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemText
              primary="Include Snoozed"
              secondary={filters.snoozed ? "Enabled" : "Disabled"}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              updateFilters({ read: !filters.read });
              setFilterMenuAnchor(null);
            }}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemText
              primary="Include Read"
              secondary={filters.read ? "Enabled" : "Disabled"}
            />
          </MenuItem>
        </Menu>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: neutralColor(0), // Light background
          px: 1,
        }}
      >
        {error ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ color: "error.main" }}>
              {error}
            </Typography>
          </Box>
        ) : loading && notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              Loading notifications...
            </Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              No notifications found
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 1 }}>
            {notifications.map((notification) => {
              const sender = getNotificationSender(notification);
              const isUnread = !notification.read_at;
              
              return (
                <ListItem
                  key={notification.id}
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    backgroundColor: isUnread ? neutralColor(50) : neutralColor(0),
                    "&:hover": {
                      backgroundColor: isUnread ? neutralColor(100) : neutralColor(50),
                    },
                    borderBottom: `1px solid ${neutralColor(100)}`,
                  }}
                >
                  <Stack direction="row" spacing={2} sx={{ width: "100%", alignItems: "flex-start" }}>
                    {/* Avatar */}
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: sender.color,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {sender.initials}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isUnread ? 600 : 400,
                              color: neutralColor(900),
                              mb: 0.5,
                            }}
                          >
                            {sender.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: neutralColor(700),
                              fontSize: "0.875rem",
                            }}
                          >
                            {notification.notification_type || "Notification"}
                          </Typography>
                        </Box>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {/* New Message Button */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Handle new message action
                            }}
                            sx={{
                              color: neutralColor(600),
                              "&:hover": {
                              color: primaryColor(600),
                              backgroundColor: primaryColor(50),
                            },
                              width: 28,
                              height: 28,
                            }}
                          >
                            <AddCommentIcon fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="caption"
                            sx={{
                              color: neutralColor(500),
                              fontSize: "0.75rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatTimeAgo(notification.created_at)}
                          </Typography>
                        </Stack>
                      </Stack>
                      {isUnread && (
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label="Unread"
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.688rem",
                              backgroundColor: primaryColor(100),
                              color: primaryColor(700),
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Paper>
  );
};

