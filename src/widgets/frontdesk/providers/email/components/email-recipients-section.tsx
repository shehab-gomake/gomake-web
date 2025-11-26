import React from "react";
import {
  Box,
  Typography,
  InputBase,
  Button,
  Stack,
  Collapse,
  IconButton,
  Divider,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { EmailSenderOption } from "../types/email.types";
import { EmailRecipientsChipField } from "./EmailRecipientsChipField";

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
  fromOptions?: EmailSenderOption[];
  selectedFromOption?: EmailSenderOption | null;
  onFromChange?: (option: EmailSenderOption | null) => void;
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
  fromOptions,
  selectedFromOption,
  onFromChange,
}) => {
  const resolvedFromOptions = React.useMemo(() => {
    const map = new Map<string, EmailSenderOption>();
    (fromOptions ?? []).forEach((option) => {
      const key = `${option.inboxId}:${option.sourceId}`;
      if (!map.has(key)) {
        map.set(key, option);
      }
    });
    if (selectedFromOption) {
      const key = `${selectedFromOption.inboxId}:${selectedFromOption.sourceId}`;
      if (!map.has(key)) {
        map.set(key, selectedFromOption);
      }
    }
    return Array.from(map.values());
  }, [fromOptions, selectedFromOption]);

  return (
    <Box sx={{ px: 2, pt: 1 }}>
      {/* From Field */}
      {resolvedFromOptions.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", minHeight: 36, mb: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#777",
              minWidth: 50,
              fontSize: "14px",
            }}
          >
            From
          </Typography>
          <FormControl
            fullWidth
            size="small"
            sx={{
              ml: 1,
              "& .MuiSelect-select": {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d0d5dd",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#b7bec7",
              },
            }}
          >
            <Select
              value={
                selectedFromOption
                  ? `${selectedFromOption.inboxId}:${selectedFromOption.sourceId}`
                  : resolvedFromOptions[0]
                  ? `${resolvedFromOptions[0].inboxId}:${resolvedFromOptions[0].sourceId}`
                  : ""
              }
              onChange={(event) => {
                const [inboxId, sourceId] = String(event.target.value).split(":");
                const nextOption =
                  resolvedFromOptions.find(
                    (option) =>
                      option.inboxId === Number(inboxId) && option.sourceId === sourceId
                  ) ?? null;
                onFromChange?.(nextOption);
              }}
              displayEmpty
              renderValue={(value) => {
                if (!value) {
                  return <Typography sx={{ color: "#999" }}>Select sender</Typography>;
                }
                const [inboxIdValue, sourceIdValue] = String(value).split(":");
                const option = resolvedFromOptions.find(
                  (item) =>
                    item.inboxId === Number(inboxIdValue) && item.sourceId === sourceIdValue
                );
                if (!option) {
                  return <Typography sx={{ color: "#999" }}>Select sender</Typography>;
                }
                return (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.2, fontWeight: 500 }}>
                      {option.inboxName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#777" }}>
                      {option.sourceId}
                    </Typography>
                  </Box>
                );
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    zIndex: 1600,
                    mt: 1,
                    boxShadow:
                      "0px 10px 30px rgba(15, 23, 42, 0.15), 0px 4px 10px rgba(15, 23, 42, 0.08)",
                    borderRadius: 2,
                  },
                },
              }}
            >
              {resolvedFromOptions.map((option) => (
                <MenuItem
                  key={`${option.inboxId}:${option.sourceId}`}
                  value={`${option.inboxId}:${option.sourceId}`}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.25,
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.2, fontWeight: 500 }}>
                      {option.inboxName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#777" }}>
                      {option.sourceId}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

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
        <Box sx={{ flex: 1, ml: 1 }}>
          <EmailRecipientsChipField emails={to} onChange={onToChange} placeholder="Recipients" />
        </Box>
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
        <Box sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#777",
              minWidth: 50,
              fontSize: "14px",
            }}
          >
            Cc
          </Typography>
          <Box sx={{ flex: 1, ml: 1 }}>
            <EmailRecipientsChipField emails={cc} onChange={onCcChange} placeholder="Cc recipients" />
          </Box>
          <IconButton
            size="small"
            onClick={() => {
              onShowCc(false);
              onCcChange("");
            }}
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
        </Box>
      </Collapse>

      {/* BCC Field */}
      <Collapse in={showBcc}>
        <Box sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#777",
              minWidth: 50,
              fontSize: "14px",
            }}
          >
            Bcc
          </Typography>
          <Box sx={{ flex: 1, ml: 1 }}>
            <EmailRecipientsChipField emails={bcc} onChange={onBccChange} placeholder="Bcc recipients" />
          </Box>
          <IconButton
            size="small"
            onClick={() => {
              onShowBcc(false);
              onBccChange("");
            }}
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
        </Box>
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
