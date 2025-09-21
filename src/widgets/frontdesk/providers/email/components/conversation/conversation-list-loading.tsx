import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export const ConversationListLoading: React.FC = () => {
  const { neutralColor } = useGomakeTheme();

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <CircularProgress size={32} />
      <Typography variant="body2" sx={{ color: neutralColor(600), mt: 2 }}>
        Loading conversations...
      </Typography>
    </Box>
  );
};
