import React from "react";
import { Stack, Typography } from "@mui/material";

interface FrontdeskEmptyStateProps {
  title?: string;
  subtitle?: string;
}

const FrontdeskEmptyState: React.FC<FrontdeskEmptyStateProps> = ({
  title = "No conversation selected",
  subtitle = "Choose a conversation from the list to preview",
}) => {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ flex: 1, py: 6 }}>
      <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
};

export { FrontdeskEmptyState };

