import React from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { Circle as OnlineIcon, Person as PersonIcon } from "@mui/icons-material";
import { PresenceData } from "../types";

interface UserPresenceProps {
  onlineUsers: string[];
  userPresence: Record<string, PresenceData>;
  currentUserId?: string;
  onUserClick?: (userId: string) => void;
}

const StatusChip: React.FC<{ status: "online" | "away" | "busy" | "offline" }> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return { color: "#10B981", label: "Online", textColor: "#065F46" };
      case "away":
        return { color: "#F59E0B", label: "Away", textColor: "#92400E" };
      case "busy":
        return { color: "#EF4444", label: "Busy", textColor: "#991B1B" };
      case "offline":
        return { color: "#6B7280", label: "Offline", textColor: "#374151" };
      default:
        return { color: "#6B7280", label: "Unknown", textColor: "#374151" };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      icon={<OnlineIcon sx={{ fontSize: 8, color: config.color }} />}
      label={config.label}
      size="small"
      variant="outlined"
      sx={{
        height: 20,
        fontSize: "0.6875rem",
        fontWeight: 500,
        color: config.textColor,
        borderColor: config.color,
        backgroundColor: `${config.color}08`, // 8% opacity
        "& .MuiChip-icon": {
          marginLeft: "4px",
          marginRight: "-2px",
        },
      }}
    />
  );
};

export const UserPresence: React.FC<UserPresenceProps> = ({ onlineUsers, userPresence, currentUserId, onUserClick }) => {
  const getDisplayName = (presence: PresenceData) => {
    const firstName = presence.firstName || "";
    const lastName = presence.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || presence.email || "Unknown User";
  };

  const getInitials = (presence: PresenceData) => {
    const name = getDisplayName(presence);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getLastSeenText = (presence: PresenceData) => {
    if (presence.status === "offline" && presence.lastSeen) {
      const lastSeenDate = new Date(presence.lastSeen);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

      if (diffMinutes < 1) {
        return "Just now";
      } else if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
      } else if (diffMinutes < 1440) {
        return `${Math.floor(diffMinutes / 60)}h ago`;
      } else {
        return `${Math.floor(diffMinutes / 1440)}d ago`;
      }
    }
    return null;
  };

  // Separate online and offline users (excluding current user)
  const onlineUsersData = onlineUsers
    .map((userId) => userPresence[userId])
    .filter(Boolean)
    .filter((presence) => presence.userId !== currentUserId) // Exclude current user
    .sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)));

  const offlineUsersData = Object.values(userPresence)
    .filter((presence) => !onlineUsers.includes(presence.userId) && presence.userId !== currentUserId) // Exclude current user
    .sort((a, b) => {
      // Sort by last seen (most recent first) then by name
      if (a.lastSeen && b.lastSeen) {
        return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
      }
      return getDisplayName(a).localeCompare(getDisplayName(b));
    })
    .slice(0, 10); // Limit offline users shown

  const totalOnline = onlineUsersData.length;
  const totalUsers = Object.keys(userPresence).length;

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
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #EAECF0" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#101828" }}>
            Team
          </Typography>
          <Chip
            label={`${totalOnline} online`}
            size="small"
            sx={{
              backgroundColor: "#ECFDF5",
              color: "#065F46",
              fontWeight: 500,
              fontSize: "0.75rem",
            }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
          {totalUsers} total members
        </Typography>
      </Box>

      {/* User List */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {/* Online Users */}
        {onlineUsersData.length > 0 && (
          <>
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", fontSize: "0.75rem" }}>
                ONLINE NOW ({totalOnline})
              </Typography>
            </Box>
            <List dense sx={{ py: 0 }}>
              {onlineUsersData.map((presence) => (
                <ListItem
                  key={presence.userId}
                  onClick={() => onUserClick?.(presence.userId)}
                  sx={{
                    py: 1,
                    px: 2,
                    cursor: onUserClick ? "pointer" : "default",
                    "&:hover": onUserClick
                      ? {
                          backgroundColor: "#F9FAFB",
                        }
                      : {},
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: "0.75rem",
                        bgcolor: "#3B82F6",
                      }}
                    >
                      {getInitials(presence)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#374151" }}>
                        {getDisplayName(presence)}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                        <StatusChip status={presence.status} />
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {/* Divider */}
        {onlineUsersData.length > 0 && offlineUsersData.length > 0 && <Divider sx={{ my: 1 }} />}

        {/* Offline Users */}
        {offlineUsersData.length > 0 && (
          <>
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", fontSize: "0.75rem" }}>
                OFFLINE
              </Typography>
            </Box>
            <List dense sx={{ py: 0 }}>
              {offlineUsersData.map((presence) => (
                <ListItem
                  key={presence.userId}
                  onClick={() => onUserClick?.(presence.userId)}
                  sx={{
                    py: 1,
                    px: 2,
                    opacity: 0.7,
                    cursor: onUserClick ? "pointer" : "default",
                    "&:hover": onUserClick
                      ? {
                          backgroundColor: "#F9FAFB",
                          opacity: 1,
                        }
                      : {},
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: "0.75rem",
                        bgcolor: "#6B7280",
                      }}
                    >
                      {getInitials(presence)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#374151" }}>
                        {getDisplayName(presence)}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                        <StatusChip status="offline" />
                        {getLastSeenText(presence) && (
                          <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                            {getLastSeenText(presence)}
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {/* Empty state */}
        {onlineUsersData.length === 0 && offlineUsersData.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <PersonIcon sx={{ fontSize: 48, color: "#D1D5DB", mb: 2 }} />
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              No team members found
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
