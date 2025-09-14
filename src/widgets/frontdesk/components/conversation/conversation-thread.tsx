import React from "react";
import { Paper, Stack, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationMessage } from "./conversation-types";

type Props = {
  messages: ConversationMessage[];
  themLabel?: string; // display name of the other side
};

export const ConversationThread: React.FC<Props> = ({ messages, themLabel = "Them" }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  return (
    <div style={{ padding: 16, overflow: "auto", flex: 1 }} className="custom-scrollbar">
      <Stack gap={1.5}>
        {messages.map((m) => {
          const isMe = m.from === "me";
          return (
            <Stack key={m.id} direction="row" justifyContent={isMe ? "flex-end" : "flex-start"}>
              <Stack maxWidth="75%" alignItems={isMe ? "flex-end" : "flex-start"}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: isMe ? primaryColor(50) : neutralColor(100),
                    color: isMe ? primaryColor(900) : "inherit",
                    border: `1px solid ${isMe ? primaryColor(200) : "#EAECF0"}`,
                    px: 1.5,
                    py: 1,
                    borderRadius: isMe ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </Typography>
                </Paper>
                <Typography variant="caption" color={neutralColor(600)} sx={{ mt: 0.25 }}>
                  {isMe ? "You" : themLabel} • {m.at}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </div>
  );
};

