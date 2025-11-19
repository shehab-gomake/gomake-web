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

export interface ContactSelectorProps {
  /** Currently selected contact */
  selectedContact: ContactDetail | null;

  /** Contact search results */
  searchResults: ContactDetail[];

  /** Loading state for search */
  isSearching: boolean;

  /** Callback for search query change */
  onSearch: (query: string) => void;

  /** Callback when contact is selected */
  onSelectContact: (contact: ContactDetail) => void;

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
      onInputChange={(event, newInputValue) => {
        onSearch(newInputValue);
      }}
      onChange={(event, value) => {
        if (value) {
          onSelectContact(value as ContactDetail);
        }
      }}
      getOptionLabel={(option) => (option as ContactDetail).name || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search by name, email, or phone..."
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
      renderOption={(props, option) => (
        <ListItem {...props} key={option.id}>
          <ListItemAvatar>
            <Avatar src={option.thumbnail}>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={option.name || "Unnamed Contact"}
            secondary={
              <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {option.email && (
                  <>
                    <MailIcon sx={{ fontSize: "0.875rem" }} />
                    <Typography variant="caption">{option.email}</Typography>
                  </>
                )}
                {option.phone_number && (
                  <>
                    <PhoneIcon sx={{ fontSize: "0.875rem" }} />
                    <Typography variant="caption">{option.phone_number}</Typography>
                  </>
                )}
              </Box>
            }
          />
        </ListItem>
      )}
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