import React from "react";
import { Paper, Typography, Stack, Avatar, Box, useTheme, alpha } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface EmailHoverProfileProps {
  email: string;
  visible: boolean;
  anchorEl?: HTMLElement | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const EmailHoverProfile: React.FC<EmailHoverProfileProps> = ({ email, visible, anchorEl, onMouseEnter, onMouseLeave }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();

  if (!visible || !anchorEl) {
    return null;
  }

  const getAvatarColor = (email: string) => {
    const colors = [primaryColor(500), "#388e3c", "#f57c00", "#7b1fa2", "#c62828", "#1976d2"];
    const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getInitials = (email: string) => {
    const name = email.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };

  const rect = anchorEl.getBoundingClientRect();

  return (
    <Paper
      elevation={8}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        position: "fixed",
        top: rect.top - 10,
        left: rect.right + 10,
        zIndex: 9999,
        p: 2,
        minWidth: 200,
        maxWidth: 300,
        backgroundColor: "white",
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        boxShadow: theme.shadows[8],
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: getAvatarColor(email),
              color: "white",
              fontWeight: 600,
            }}
          >
            {getInitials(email)}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: neutralColor(900),
                fontSize: "0.875rem",
              }}
            >
              {email.split("@")[0]}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: neutralColor(600),
                fontSize: "0.75rem",
              }}
            >
              {email}
            </Typography>
          </Box>
        </Stack>

        {/* Placeholder for future profile information */}
        <Box
          sx={{
            p: 1,
            backgroundColor: alpha(neutralColor(100), 0.5),
            borderRadius: 1,
            border: `1px dashed ${neutralColor(300)}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: neutralColor(500),
              fontStyle: "italic",
            }}
          >
            Profile information will be implemented here
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
