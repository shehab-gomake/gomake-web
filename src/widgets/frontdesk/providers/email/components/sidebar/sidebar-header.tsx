import React from "react";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";

interface SidebarHeaderProps {
  onAddAccount: () => void;
  onRefresh?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onAddAccount, onRefresh }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(25),
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: neutralColor(900),
            fontSize: "1rem",
          }}
        >
          Email Accounts
        </Typography>

        <Stack direction="row" spacing={0.5}>
          {onRefresh && (
            <IconButton
              size="small"
              onClick={onRefresh}
              sx={{
                color: neutralColor(600),
                "&:hover": {
                  color: primaryColor(600),
                  backgroundColor: alpha(primaryColor(100), 0.5),
                },
              }}
            >
              <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}

          <IconButton
            size="small"
            onClick={onAddAccount}
            sx={{
              color: primaryColor(600),
              backgroundColor: alpha(primaryColor(100), 0.5),
              "&:hover": {
                backgroundColor: alpha(primaryColor(100), 0.8),
              },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};
