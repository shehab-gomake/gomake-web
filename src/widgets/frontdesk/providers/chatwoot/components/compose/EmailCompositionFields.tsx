/**
 * Email Composition Fields Component
 *
 * Handles email-specific fields: subject, CC, and BCC.
 * Only displayed when composing email conversations.
 */

import React, { useState } from "react";
import { Box, Stack, TextField, Typography, Button } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { createFieldContainerStyles, createStandardTextFieldStyles } from "../../styles/compose-styles";
import type { ComposeValidationErrors } from "@/services/frontdesk/api/chatwoot/types/compose.types";

export interface EmailCompositionFieldsProps {
  /** Email subject value */
  subject: string;
  /** CC emails (comma-separated) */
  ccEmails: string;
  /** BCC emails (comma-separated) */
  bccEmails: string;
  /** Validation errors */
  errors: ComposeValidationErrors;
  /** Subject change handler */
  onSubjectChange: (value: string) => void;
  /** CC emails change handler */
  onCcChange: (value: string) => void;
  /** BCC emails change handler */
  onBccChange: (value: string) => void;
}

/**
 * Email Composition Fields
 * Renders subject, CC, and BCC fields for email conversations
 */
export const EmailCompositionFields = React.memo<EmailCompositionFieldsProps>(
  ({ subject, ccEmails, bccEmails, errors, onSubjectChange, onCcChange, onBccChange }) => {
    const { neutralColor, primaryColor } = useGomakeTheme();
    const [showBcc, setShowBcc] = useState(!!bccEmails);

    const textFieldStyles = createStandardTextFieldStyles(neutralColor);

    return (
      <>
        {/* Subject Field */}
        <Box sx={createFieldContainerStyles(neutralColor, { backgroundColor: "light" })}>
          <TextField
            fullWidth
            variant="standard"
            label="SUBJECT"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            error={!!errors.subject}
            helperText={errors.subject}
            {...textFieldStyles}
          />
        </Box>

        {/* CC Field */}
        <Box sx={createFieldContainerStyles(neutralColor, { backgroundColor: "white", padding: "compact" })}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ width: "100%" }}>
            <Typography
              sx={{
                minWidth: 50,
                fontSize: "0.75rem",
                color: neutralColor(700),
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              CC
            </Typography>
            <TextField
              fullWidth
              variant="standard"
              placeholder="email@example.com (optional)"
              value={ccEmails}
              onChange={(e) => onCcChange(e.target.value)}
              error={!!errors.ccEmails}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: "0.875rem", color: neutralColor(900) },
              }}
            />
            {!showBcc && (
              <Button
                size="small"
                onClick={() => setShowBcc(true)}
                sx={{
                  textTransform: "none",
                  fontSize: "0.8125rem",
                  color: primaryColor(600),
                  fontWeight: 500,
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: primaryColor(50),
                  },
                }}
              >
                + BCC
              </Button>
            )}
          </Stack>
        </Box>

        {/* BCC Field */}
        {showBcc && (
          <Box sx={createFieldContainerStyles(neutralColor, { backgroundColor: "white", padding: "compact" })}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ width: "100%" }}>
              <Typography
                sx={{
                  minWidth: 50,
                  fontSize: "0.75rem",
                  color: neutralColor(700),
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                BCC
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="email@example.com (optional)"
                value={bccEmails}
                onChange={(e) => onBccChange(e.target.value)}
                error={!!errors.bccEmails}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "0.875rem", color: neutralColor(900) },
                }}
              />
            </Stack>
          </Box>
        )}
      </>
    );
  }
);

EmailCompositionFields.displayName = "EmailCompositionFields";
