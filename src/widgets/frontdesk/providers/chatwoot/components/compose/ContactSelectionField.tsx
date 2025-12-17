/**
 * Contact Selection Field Component
 *
 * Handles contact selection for composing conversations.
 * Shows selected contact as a chip or contact selector if no contact is selected.
 */

import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ContactSelector } from "./ContactSelector";
import {
  createFieldContainerStyles,
  createFieldLabelStyles,
  createSelectedChipStyles,
} from "../../styles/compose-styles";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import type { ContactDetail } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import type { GomakeContact } from "../../hooks/use-compose-conversation";

export interface ContactSelectionFieldProps {
  /** Selected contact (null if none selected) */
  selectedContact: ContactDetail | null;
  /** Search results from contact search (GomakeContact from customer search) */
  searchResults: GomakeContact[];
  /** Loading state for search */
  isSearching: boolean;
  /** Search handler */
  onSearch: (query: string) => void;
  /** Select contact handler */
  onSelectContact: (contact: GomakeContact | null) => void;
  /** Validation error message */
  error?: string;
}

/**
 * Contact Selection Field
 * Displays selected contact or contact search input
 */
export const ContactSelectionField = React.memo<ContactSelectionFieldProps>(
  ({
    selectedContact,
    searchResults,
    isSearching,
    onSearch,
    onSelectContact,
    error,
  }) => {
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const isRTL = dir === "rtl";
    return (
      <Box sx={createFieldContainerStyles({ backgroundColor: "light" })}>
        <Typography sx={createFieldLabelStyles()}>
          {t("frontdesk.compose.contact")} *
        </Typography>
        <Box sx={{ flex: 1, direction: dir }}>
          {selectedContact ? (
            <Chip
              label={
                selectedContact.name ||
                selectedContact.email ||
                selectedContact.phone_number
              }
              onDelete={() => onSelectContact(null)}
              sx={{
                ...createSelectedChipStyles(),
                "& .MuiChip-deleteIcon": {
                  color: colorTokens.primary[400],
                  ...(isRTL
                    ? { marginLeft: "4px", marginRight: 0 }
                    : { marginRight: "4px", marginLeft: 0 }),
                  "&:hover": {
                    color: colorTokens.primary[600],
                  },
                },
                "& .MuiChip-label": {
                  direction: dir,
                },
              }}
            />
          ) : (
            <ContactSelector
              selectedContact={selectedContact}
              searchResults={searchResults}
              isSearching={isSearching}
              onSearch={onSearch}
              onSelectContact={onSelectContact}
              error={error}
            />
          )}
        </Box>
      </Box>
    );
  }
);

ContactSelectionField.displayName = "ContactSelectionField";
