import React from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import { Remove as RemoveIcon, OpenInFull as MaximizeIcon, Close as CloseIcon } from "@mui/icons-material";

interface EmailComposerHeaderProps {
  subject: string;
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export const EmailComposerHeader: React.FC<EmailComposerHeaderProps> = ({ subject, isMinimized, onMinimize, onClose }) => {
  return (
    <Box
      sx={{
        height: 40,
        backgroundColor: "#404040",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        cursor: isMinimized ? "pointer" : "default",
      }}
      onClick={isMinimized ? onMinimize : undefined}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          fontSize: "14px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {subject || "New Message"}
      </Typography>

      <Stack direction="row" spacing={0.5}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          sx={{
            p: 0.5,
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          {isMinimized ? <MaximizeIcon sx={{ fontSize: 18 }} /> : <RemoveIcon sx={{ fontSize: 18 }} />}
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          sx={{
            p: 0.5,
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </Box>
  );
};
