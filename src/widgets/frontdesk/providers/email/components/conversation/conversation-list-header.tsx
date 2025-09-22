import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailLabel } from "../../types/email.types";

interface ConversationListHeaderProps {
  selectedLabel?: EmailLabel | null;
}

export const ConversationListHeader: React.FC<ConversationListHeaderProps> = ({ selectedLabel }) => {
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
          {selectedLabel ? selectedLabel.name : "Conversations"}
        </Typography>
      </Stack>
    </Box>
  );
};
