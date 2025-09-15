import React, { useMemo } from "react";
import { Avatar, Chip, Divider, Stack, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

type Props = {
  subject: string;
  fromName: string;
  receivedAt?: string;
  label?: string; // e.g., Inbox
};

export const ConversationHeader: React.FC<Props> = ({ subject, fromName, receivedAt, label = "Inbox" }) => {
  const { neutralColor, primaryColor } = useGomakeTheme();

  const getInitials = useMemo(
    () => (name: string) =>
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    []
  );

  return (
    <div style={{ padding: 16 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {subject}
        </Typography>
        {!!receivedAt && (
          <Typography variant="caption" color={neutralColor(600)}>
            {receivedAt}
          </Typography>
        )}
      </Stack>
      <Divider sx={{ my: 1.5 }} />
      <Stack direction="row" alignItems="center" gap={1.5}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: neutralColor(200), color: neutralColor(700) }}>
          {getInitials(fromName)}
        </Avatar>
        <Stack>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {fromName}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <Chip size="small" label={label} sx={{ bgcolor: primaryColor(50), color: primaryColor(700) }} />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

