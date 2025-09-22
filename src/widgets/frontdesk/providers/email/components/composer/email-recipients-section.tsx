import React from "react";
import { Box, Typography, InputBase, Button, Stack, Collapse, IconButton, Divider } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface EmailRecipientsSectionProps {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  showCc: boolean;
  showBcc: boolean;
  onToChange: (value: string) => void;
  onCcChange: (value: string) => void;
  onBccChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onShowCc: (show: boolean) => void;
  onShowBcc: (show: boolean) => void;
}

export const EmailRecipientsSection: React.FC<EmailRecipientsSectionProps> = ({
  to,
  cc,
  bcc,
  subject,
  showCc,
  showBcc,
  onToChange,
  onCcChange,
  onBccChange,
  onSubjectChange,
  onShowCc,
  onShowBcc,
}) => {
  const RecipientField: React.FC<{
    label: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    showClose?: boolean;
    onClose?: () => void;
  }> = ({ label, value, placeholder, onChange, showClose = false, onClose }) => (
    <Box sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
      <Typography
        variant="body2"
        sx={{
          color: "#777",
          minWidth: 50,
          fontSize: "14px",
        }}
      >
        {label}
      </Typography>
      <InputBase
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        sx={{
          fontSize: "14px",
          ml: 1,
          "& input": {
            p: 0,
          },
        }}
      />
      {showClose && (
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            p: 0.5,
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "#f1f3f4",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box sx={{ px: 2, pt: 1 }}>
      {/* To Field */}
      <Box sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
        <Typography
          variant="body2"
          sx={{
            color: "#777",
            minWidth: 50,
            fontSize: "14px",
          }}
        >
          To
        </Typography>
        <InputBase
          fullWidth
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          placeholder="Recipients"
          sx={{
            fontSize: "14px",
            ml: 1,
            "& input": {
              p: 0,
            },
          }}
        />
        <Stack direction="row" spacing={0.5}>
          {!showCc && (
            <Button
              size="small"
              onClick={() => onShowCc(true)}
              sx={{
                minWidth: "auto",
                color: "#777",
                fontSize: "13px",
                p: "2px 8px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#f1f3f4",
                },
              }}
            >
              Cc
            </Button>
          )}
          {!showBcc && (
            <Button
              size="small"
              onClick={() => onShowBcc(true)}
              sx={{
                minWidth: "auto",
                color: "#777",
                fontSize: "13px",
                p: "2px 8px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#f1f3f4",
                },
              }}
            >
              Bcc
            </Button>
          )}
        </Stack>
      </Box>

      {/* CC Field */}
      <Collapse in={showCc}>
        <RecipientField
          label="Cc"
          value={cc}
          placeholder="Cc recipients"
          onChange={onCcChange}
          showClose
          onClose={() => {
            onShowCc(false);
            onCcChange("");
          }}
        />
      </Collapse>

      {/* BCC Field */}
      <Collapse in={showBcc}>
        <RecipientField
          label="Bcc"
          value={bcc}
          placeholder="Bcc recipients"
          onChange={onBccChange}
          showClose
          onClose={() => {
            onShowBcc(false);
            onBccChange("");
          }}
        />
      </Collapse>

      <Divider sx={{ my: 1 }} />

      {/* Subject Field */}
      <Box sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
        <InputBase
          fullWidth
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Subject"
          sx={{
            fontSize: "14px",
            "& input": {
              p: 0,
            },
          }}
        />
      </Box>

      <Divider sx={{ my: 1 }} />
    </Box>
  );
};
