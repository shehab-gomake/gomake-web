import React from "react";
import { Box, Button } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";

interface ConversationListLoadMoreProps {
  onLoadMore: () => void;
}

export const ConversationListLoadMore: React.FC<ConversationListLoadMoreProps> = ({ onLoadMore }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  return (
    <Box sx={{ p: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        onClick={onLoadMore}
        sx={{
          borderColor: neutralColor(300),
          color: neutralColor(700),
          "&:hover": {
            borderColor: primaryColor(300),
            backgroundColor: alpha(primaryColor(100), 0.5),
          },
        }}
      >
        Load More
      </Button>
    </Box>
  );
};
