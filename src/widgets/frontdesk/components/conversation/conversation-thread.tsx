import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Avatar,
  useTheme,
  alpha
} from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationMessage } from "./conversation-types";

type Props = {
  messages: ConversationMessage[];
  themLabel?: string;
};

export const ConversationThread: React.FC<Props> = ({ messages, themLabel = "Them" }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();

  const getMessageBubbleStyles = (isMe: boolean) => ({
    bgcolor: isMe ? primaryColor(100) : neutralColor(50),
    color: isMe ? primaryColor(900) : neutralColor(800),
    border: `1px solid ${isMe ? primaryColor(200) : neutralColor(200)}`,
    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    px: 2,
    py: 1.5,
    position: "relative",
    boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
    transition: theme.transitions.create(["box-shadow", "transform"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`,
      transform: "translateY(-1px)",
    },
  });

  const getAvatarStyles = (isMe: boolean) => ({
    width: 32,
    height: 32,
    bgcolor: isMe ? primaryColor(500) : neutralColor(400),
    fontSize: "0.75rem",
    fontWeight: 600,
  });

  return (
    <Box
      sx={{
        p: 2,
        overflow: "auto",
        flex: 1,
        background: `linear-gradient(to bottom, ${neutralColor(25)}, ${neutralColor(50)})`,
      }}
      className="custom-scrollbar"
    >
      <Stack spacing={2}>
        {messages.map((message, index) => {
          const isMe = message.from === "me";
          const showAvatar = index === 0 || messages[index - 1]?.from !== message.from;

          return (
            <Stack
              key={message.id}
              direction="row"
              spacing={1}
              justifyContent={isMe ? "flex-end" : "flex-start"}
              alignItems="flex-end"
            >
              {!isMe && (
                <Avatar sx={getAvatarStyles(false)}>
                  {showAvatar ? themLabel?.[0]?.toUpperCase() || "T" : ""}
                </Avatar>
              )}

              <Stack
                maxWidth="70%"
                alignItems={isMe ? "flex-end" : "flex-start"}
                spacing={0.5}
              >
                {showAvatar && (
                  <Chip
                    label={isMe ? "You" : themLabel}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      borderColor: isMe ? primaryColor(300) : neutralColor(300),
                      color: isMe ? primaryColor(700) : neutralColor(700),
                      bgcolor: "transparent",
                    }}
                  />
                )}

                <Paper
                  elevation={0}
                  sx={getMessageBubbleStyles(isMe)}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {message.text}
                  </Typography>
                </Paper>

                <Typography
                  variant="caption"
                  sx={{
                    color: neutralColor(500),
                    fontSize: "0.7rem",
                    px: 0.5,
                  }}
                >
                  {message.at}
                </Typography>
              </Stack>

              {isMe && (
                <Avatar sx={getAvatarStyles(true)}>
                  {showAvatar ? "Y" : ""}
                </Avatar>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

