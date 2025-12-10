import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface FrontdeskEmptyStateProps {
  title?: string;
  subtitle?: string;
}

const FrontdeskEmptyState: React.FC<FrontdeskEmptyStateProps> = ({
  title,
  subtitle,
}) => {
  const { t } = useTranslation();
  const defaultTitle =
    title || t("frontdesk.emptyStates.noConversationSelected");
  const defaultSubtitle =
    subtitle || t("frontdesk.emptyStates.chooseConversationToPreview");
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={{ flex: 1, py: 6 }}
    >
      <Typography
        variant="subtitle1"
        color="text.primary"
        sx={{ fontWeight: 600 }}
      >
        {defaultTitle}
      </Typography>
      {defaultSubtitle && (
        <Typography variant="body2" color="text.secondary">
          {defaultSubtitle}
        </Typography>
      )}
    </Stack>
  );
};

export { FrontdeskEmptyState };
