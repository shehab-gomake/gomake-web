import React from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";

interface FrontdeskLoadingProps {
  label?: string;
}

const FrontdeskLoading: React.FC<FrontdeskLoadingProps> = ({ label = "Loading..." }) => {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }} spacing={2}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
};

export { FrontdeskLoading };

