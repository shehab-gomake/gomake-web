import React from "react";
import { Box, Stack, Button, IconButton, Tooltip, Divider } from "@mui/material";
import {
  Send as SendIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  AttachFile as AttachIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface EmailComposerToolbarProps {
  onSend: () => void;
  onClose: () => void;
  onFormatText: (command: string) => void;
  onAttach?: () => void;
  canSend: boolean;
  isSending: boolean;
}

export const EmailComposerToolbar: React.FC<EmailComposerToolbarProps> = ({
  onSend,
  onClose,
  onFormatText,
  onAttach,
  canSend,
  isSending,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="contained"
          size="small"
          onClick={onSend}
          disabled={!canSend || isSending}
          sx={{
            backgroundColor: "#1a73e8",
            color: "white",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "14px",
            px: 3,
            py: 0.75,
            borderRadius: "4px",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#1765cc",
              boxShadow: "0 1px 2px 0 rgba(26,115,232,0.45)",
            },
            "&:disabled": {
              backgroundColor: "#f8f9fa",
              color: "#aaa",
            },
          }}
        >
          Send
        </Button>

        <Stack direction="row" spacing={0} divider={<Divider orientation="vertical" flexItem />}>
          <Tooltip title="Bold">
            <IconButton
              size="small"
              onClick={() => onFormatText("bold")}
              sx={{
                p: 1,
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "#e8eaed",
                },
              }}
            >
              <BoldIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton
              size="small"
              onClick={() => onFormatText("italic")}
              sx={{
                p: 1,
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "#e8eaed",
                },
              }}
            >
              <ItalicIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton
              size="small"
              onClick={() => onFormatText("underline")}
              sx={{
                p: 1,
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "#e8eaed",
                },
              }}
            >
              <UnderlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {onAttach && (
          <Tooltip title="Attach files">
            <IconButton
              size="small"
              onClick={onAttach}
              sx={{
                p: 1,
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "#e8eaed",
                },
              }}
            >
              <AttachIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Tooltip title="Discard draft">
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            p: 1,
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "#e8eaed",
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
