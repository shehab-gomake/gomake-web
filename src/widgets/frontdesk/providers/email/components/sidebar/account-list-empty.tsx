import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface AccountListEmptyProps {
  onAddAccount: () => void;
}

export const AccountListEmpty: React.FC<AccountListEmptyProps> = ({ onAddAccount }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="body2" sx={{ color: neutralColor(500), mb: 2 }}>
        No email accounts connected
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddAccount}
        size="small"
        sx={{
          backgroundColor: primaryColor(500),
          "&:hover": {
            backgroundColor: primaryColor(600),
          },
        }}
      >
        Add Email Account
      </Button>
    </Box>
  );
};
