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
  IconButton,
  Tooltip,
} from "@mui/material";
import { Circle as OnlineIcon, Person as PersonIcon, Close as CloseIcon } from "@mui/icons-material";
import { DMPresenceData as PresenceData } from "../types";

interface UserPresenceProps {
  onlineUsers: string[];
  userPresence: Record<string, PresenceData>;
  currentUserId?: string;
  onUserClick?: (userId: string) => void;
  onToggleVisibility?: () => void;
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

export const UserPresence: React.FC<UserPresenceProps> = ({
  onlineUsers,
  userPresence,
  currentUserId,
  onUserClick,
  onToggleVisibility,
}) => {
  const getDisplayName = (presence: PresenceData) => {
    // Prefer explicit name field when provided
    if (presence.name && presence.name.trim()) return presence.name.trim();

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

  const seenUserIds = new Set<string>();
  const onlineUsersData = onlineUsers
    .map((userId) => userPresence[userId])
    .filter(Boolean)
    .filter((presence) => {
      if (!presence || presence.status === "offline") return false;
      if (presence.userId === currentUserId || seenUserIds.has(presence.userId)) {
        return false;
      }
      seenUserIds.add(presence.userId);
      return true;
    })
    .sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)));

  const totalOnline = onlineUsersData.length;

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
          <Stack direction="row" spacing={1} alignItems="center">
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
            {onToggleVisibility && (
              <Tooltip title="Hide Team Panel">
                <IconButton size="small" onClick={onToggleVisibility}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
        <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
          {totalOnline} active now
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
        {/* Empty state */}
        {onlineUsersData.length === 0 && (
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
