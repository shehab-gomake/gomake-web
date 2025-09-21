import React from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";
import { EmailLabel } from "../../types/email.types";

interface ConversationListHeaderProps {
  selectedLabel?: EmailLabel | null;
  onRefresh?: () => void;
}

export const ConversationListHeader: React.FC<ConversationListHeaderProps> = ({ selectedLabel, onRefresh }) => {
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

        {onRefresh && (
          <Button
            size="small"
            onClick={onRefresh}
            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: neutralColor(600),
              "&:hover": {
                color: primaryColor(600),
                backgroundColor: alpha(primaryColor(100), 0.5),
              },
            }}
          >
            Refresh
          </Button>
        )}
      </Stack>
    </Box>
  );
};
