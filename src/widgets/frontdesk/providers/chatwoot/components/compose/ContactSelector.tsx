/**
 * ContactSelector Component
 *
 * Searchable dropdown for selecting or creating contacts using Material-UI components.
 * Supports debounced search by name, email, or phone number.
 */

import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import type { ContactDetail } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import type { GomakeContact } from "../../hooks/use-compose-conversation";

export interface ContactSelectorProps {
  /** Currently selected contact */
  selectedContact: ContactDetail | null;

  /** Contact search results (GomakeContact from customer search) */
  searchResults: GomakeContact[];

  /** Loading state for search */
  isSearching: boolean;

  /** Callback for search query change */
  onSearch: (query: string) => void;

  /** Callback when contact is selected */
  onSelectContact: (contact: GomakeContact) => void;

  /** Callback to open create contact modal */
  onCreateContact: () => void;

  /** Validation error message */
  error?: string;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
  selectedContact,
  searchResults,
  isSearching,
  onSearch,
  onSelectContact,
  onCreateContact,
  error,
}) => {
  const { neutralColor, primaryColor } = useGomakeTheme();
  const [query, setQuery] = useState("");

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <Autocomplete
      fullWidth
      openOnFocus
      options={searchResults}
      loading={isSearching}
      filterOptions={(options) => options} // Don't filter - we already filtered via API search
      getOptionKey={(option) => {
        const contact = option as GomakeContact;
        // Ensure we always return a unique key
        const key = contact.gomake_contact_id || 
                   contact.id?.toString() || 
                   contact.email || 
                   contact.phone_number || 
                   `${contact.gomake_customer_id}-${contact.email || contact.phone_number || Math.random()}`;
        return key;
      }}
      isOptionEqualToValue={(option, value) => {
        const opt = option as GomakeContact;
        const val = value as GomakeContact;
        // Compare by gomake_contact_id first, then by email or phone
        if (opt.gomake_contact_id && val.gomake_contact_id) {
          return opt.gomake_contact_id === val.gomake_contact_id;
        }
        if (opt.email && val.email) {
          return opt.email === val.email;
        }
        if (opt.phone_number && val.phone_number) {
          return opt.phone_number === val.phone_number;
        }
        return false;
      }}
      onInputChange={(event, newInputValue) => {
        onSearch(newInputValue);
      }}
      onChange={(event, value) => {
        if (value) {
          onSelectContact(value as GomakeContact);
        }
      }}
      getOptionLabel={(option) => {
        const contact = option as GomakeContact;
        // Ensure we always return a non-empty string for MUI Autocomplete
        if (contact.name && contact.name.trim()) {
          // Show customer name if available
          if (contact.gomake_customer_name && contact.gomake_customer_name !== contact.name) {
            return `${contact.name} (${contact.gomake_customer_name})`;
          }
          return contact.name;
        }
        // Fallback to email or phone if name is empty
        if (contact.email && contact.email.trim()) {
          return contact.email;
        }
        if (contact.phone_number && contact.phone_number.trim()) {
          return contact.phone_number;
        }
        // Last resort - use customer name or "Unnamed Contact"
        return contact.gomake_customer_name || "Unnamed Contact";
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search by customer name..."
          variant="outlined"
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            startAdornment: <SearchIcon sx={{ color: neutralColor(500), mr: 1 }} />,
            endAdornment: (
              <>
                {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const contact = option as GomakeContact;
        return (
          <ListItem {...props} key={contact.gomake_contact_id || contact.id || contact.email || contact.phone_number}>
            <ListItemAvatar>
              <Avatar src={contact.thumbnail}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box>
                  <Typography variant="body2">{contact.name || "Unnamed Contact"}</Typography>
                  {contact.gomake_customer_name && contact.gomake_customer_name !== contact.name && (
                    <Typography variant="caption" color="text.secondary">
                      {contact.gomake_customer_name}
                    </Typography>
                  )}
                </Box>
              }
              secondary={
                <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {contact.email && (
                    <>
                      <MailIcon sx={{ fontSize: "0.875rem" }} />
                      <Typography variant="caption">{contact.email}</Typography>
                    </>
                  )}
                  {contact.phone_number && (
                    <>
                      <PhoneIcon sx={{ fontSize: "0.875rem" }} />
                      <Typography variant="caption">{contact.phone_number}</Typography>
                    </>
                  )}
                </Box>
              }
            />
          </ListItem>
        );
      }}
      ListboxComponent={(props) => (
        <List {...props}>
          {props.children}
          <ListItem>
            <Button
              fullWidth
              startIcon={<PersonAddIcon />}
              onClick={onCreateContact}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                color: primaryColor(600),
              }}
            >
              Create New Contact
            </Button>
          </ListItem>
        </List>
      )}
    />
  );
};