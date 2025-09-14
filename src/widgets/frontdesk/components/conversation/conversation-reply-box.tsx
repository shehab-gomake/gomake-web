import React from "react";
import { Avatar, Button, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder?: string;
  meInitial?: string;
};

export const ConversationReplyBox: React.FC<Props> = ({
  value,
  onChange,
  onSend,
  placeholder = "Type a reply...",
  meInitial = "Y",
}) => {
  const { primaryColor } = useGomakeTheme();

  return (
    <div style={{ padding: 12 }}>
      <Stack direction="row" alignItems="flex-end" gap={1}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: primaryColor(600) }}>{meInitial}</Avatar>
        <TextField
          fullWidth
          size="small"
          placeholder={placeholder}
          multiline
          maxRows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <Button variant="contained" size="small" endIcon={<SendIcon />} onClick={onSend} disabled={!value.trim()}>
          Send
        </Button>
      </Stack>
    </div>
  );
};
