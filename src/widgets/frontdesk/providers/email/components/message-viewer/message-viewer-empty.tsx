import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export const MessageViewerEmpty: React.FC = () => {
  const { neutralColor } = useGomakeTheme();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <Typography variant="h6" sx={{ color: neutralColor(600) }}>
          No conversation selected
        </Typography>
        <Typography variant="body2" sx={{ color: neutralColor(500) }}>
          Choose a conversation from the list to view messages
        </Typography>
      </Stack>
    </Box>
  );
};
