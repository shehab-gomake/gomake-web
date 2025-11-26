import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { colorTokens } from "@/widgets/frontdesk/design-system/tokens";

interface DashboardHeaderProps {
  type: "admin" | "agent";
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ type }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          fontSize: "1.5rem",
          color: colorTokens.neutral[900],
        }}
      >
        FrontDesk
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: colorTokens.neutral[600],
          mt: 0.5,
          fontSize: "0.875rem",
        }}
      >
        {type === "admin" ? "Team performance and operational overview" : "Your personal performance and tasks"}
      </Typography>
    </Box>
  );
};
