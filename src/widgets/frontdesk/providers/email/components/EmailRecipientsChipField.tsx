/**
 * EmailRecipientsChipField Component
 *
 * Chip-based email recipient field with real-time validation.
 * Compact version for the email composer.
 */

import React, {
  useState,
  useCallback,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
  useMemo,
} from "react";
import { Box, Chip, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  isValidEmail,
  parseEmailString,
  emailArrayToString,
  deduplicateEmails,
  extractEmailsFromText,
} from "../utils/email-recipient-chip-utils";

export interface EmailRecipientsChipFieldProps {
  /** Comma-separated email string (for backend compatibility) */
  emails: string;
  /** Callback when emails change */
  onChange: (emails: string) => void;
  /** Placeholder text when no recipients */
  placeholder?: string;
  /** Whether field is read-only */
  readOnly?: boolean;
}

interface EmailChip {
  email: string;
  isValid: boolean;
}

export const EmailRecipientsChipField: React.FC<
  EmailRecipientsChipFieldProps
> = ({
  emails,
  onChange,
  placeholder = "Enter email addresses",
  readOnly = false,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Parse email string into chips
  const chips = useMemo((): EmailChip[] => {
    const emailArray = parseEmailString(emails);
    return emailArray.map((email) => ({
      email,
      isValid: isValidEmail(email),
    }));
  }, [emails]);

  // Convert chips back to comma-separated string
  const updateChips = useCallback(
    (newChips: EmailChip[]) => {
      const emailArray = newChips.map((chip) => chip.email);
      const deduped = deduplicateEmails(emailArray);
      const emailString = emailArrayToString(deduped);
      onChange(emailString);
    },
    [onChange]
  );

  // Add chip from input value
  const addChip = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;

      // Try to extract email if in "Name <email>" format
      const extracted = extractEmailsFromText(trimmed);
      const emailsToAdd = extracted.length > 0 ? extracted : [trimmed];

      const newChips: EmailChip[] = emailsToAdd.map((email) => ({
        email,
        isValid: isValidEmail(email),
      }));

      updateChips([...chips, ...newChips]);
      setInputValue("");
    },
    [chips, updateChips]
  );

  // Delete chip by index
  const deleteChip = useCallback(
    (index: number) => {
      const newChips = chips.filter((_, i) => i !== index);
      updateChips(newChips);
    },
    [chips, updateChips]
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;

      // Enter or comma: add chip
      if (key === "Enter" || key === ",") {
        event.preventDefault();
        if (inputValue.trim()) {
          addChip(inputValue);
        }
        return;
      }

      // Backspace: remove last chip if input is empty
      if (key === "Backspace" && !inputValue && chips.length > 0) {
        event.preventDefault();
        deleteChip(chips.length - 1);
        return;
      }

      // Semicolon: also add chip
      if (key === ";") {
        event.preventDefault();
        if (inputValue.trim()) {
          addChip(inputValue);
        }
        return;
      }
    },
    [inputValue, chips.length, addChip, deleteChip]
  );

  // Handle paste event
  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      const pastedText = event.clipboardData.getData("text");
      const extractedEmails = extractEmailsFromText(pastedText);

      if (extractedEmails.length > 0) {
        event.preventDefault();
        const newChips: EmailChip[] = extractedEmails.map((email) => ({
          email,
          isValid: isValidEmail(email),
        }));
        updateChips([...chips, ...newChips]);
        setInputValue("");
      }
    },
    [chips, updateChips]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      // Auto-add chip if comma or semicolon is typed
      if (value.endsWith(",") || value.endsWith(";")) {
        const email = value.slice(0, -1).trim();
        if (email) {
          addChip(email);
        }
        return;
      }

      setInputValue(value);
    },
    [addChip]
  );

  // Handle blur - add remaining input as chip
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (inputValue.trim()) {
      addChip(inputValue);
    }
  }, [inputValue, addChip]);

  // Focus input when container is clicked
  const handleContainerClick = useCallback(() => {
    if (!readOnly) {
      inputRef.current?.focus();
    }
  }, [readOnly]);

  return (
    <Box
      onClick={handleContainerClick}
      sx={{
        display: "flex",
        cursor: readOnly ? "default" : "text",
        width: "100%",
        "&:hover": readOnly
          ? undefined
          : {
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            },
      }}
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={0.5}
        flex={1}
        alignItems="center"
        sx={{
          py: 0.25,
        }}
      >
        {chips.map((chip, index) => (
          <Chip
            key={`${chip.email}-${index}`}
            label={chip.email}
            onDelete={readOnly ? undefined : () => deleteChip(index)}
            size="small"
            sx={{
              height: 24,
              fontSize: "13px",
              backgroundColor: chip.isValid ? "#e3f2fd" : "#ffebee",
              color: chip.isValid ? "#1565c0" : "#c62828",
              border: chip.isValid ? "1px solid #90caf9" : "1px solid #ef5350",
              "& .MuiChip-deleteIcon": {
                fontSize: 16,
                color: chip.isValid ? "#1565c0" : "#c62828",
                [dir === "rtl" ? "marginLeft" : "marginRight"]: "-4px",
                "&:hover": {
                  color: chip.isValid ? "#0d47a1" : "#b71c1c",
                },
              },
              "& .MuiChip-label": {
                px: 1,
                py: 0,
              },
            }}
          />
        ))}

        {!readOnly && (
          <Box
            component="input"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder={chips.length === 0 ? placeholder : ""}
            disabled={readOnly}
            sx={{
              flex: 1,
              minWidth: 120,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "14px",
              color: "#202124",
              padding: 0,
              textAlign: dir === "rtl" ? "right" : "left",
              "&::placeholder": {
                color: "#999",
              },
              "&:disabled": {
                cursor: "not-allowed",
              },
            }}
          />
        )}
      </Stack>
    </Box>
  );
};
