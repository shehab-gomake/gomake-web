/**
 * Contact Selection Field Component
 *
 * Handles contact selection for composing conversations.
 * Shows selected contact as a chip or contact selector if no contact is selected.
 */

import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ContactSelector } from "./ContactSelector";
import { createFieldContainerStyles, createFieldLabelStyles, createSelectedChipStyles } from "../../styles/compose-styles";
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
  /** Create new contact handler */
  onCreateContact: () => void;
  /** Validation error message */
  error?: string;
}

/**
 * Contact Selection Field
 * Displays selected contact or contact search input
 */
export const ContactSelectionField = React.memo<ContactSelectionFieldProps>(
  ({ selectedContact, searchResults, isSearching, onSearch, onSelectContact, onCreateContact, error }) => {
    const { neutralColor, primaryColor } = useGomakeTheme();

    return (
      <Box sx={createFieldContainerStyles(neutralColor, { backgroundColor: "light" })}>
        <Typography sx={createFieldLabelStyles(neutralColor)}>Contact *</Typography>
        <Box sx={{ flex: 1 }}>
          {selectedContact ? (
            <Chip
              label={selectedContact.name || selectedContact.email || selectedContact.phone_number}
              onDelete={() => onSelectContact(null)}
              sx={createSelectedChipStyles(primaryColor)}
            />
          ) : (
            <ContactSelector
              selectedContact={selectedContact}
              searchResults={searchResults}
              isSearching={isSearching}
              onSearch={onSearch}
              onSelectContact={onSelectContact}
              onCreateContact={onCreateContact}
              error={error}
            />
          )}
        </Box>
      </Box>
    );
  }
);

ContactSelectionField.displayName = "ContactSelectionField";
