/**
 * ContactSelector Component
 *
 * Searchable dropdown for selecting or creating contacts using Material-UI components.
 * Supports debounced search by name, email, or phone number.
 */

import React from "react";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import StarIcon from "@mui/icons-material/Star";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Chip from "@mui/material/Chip";
import {
  colorTokens,
  radiusTokens,
  shadowTokens,
  semanticTypography,
} from "@/widgets/frontdesk/design-system";
import { generateAvatarData } from "@/widgets/frontdesk/utils/avatar.utils";
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

  /** Validation error message */
  error?: string;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
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
    <Autocomplete
      fullWidth
      openOnFocus
      options={searchResults}
      loading={isSearching}
      filterOptions={(options) => options} // Don't filter - we already filtered via API search
      getOptionKey={(option) => {
        const contact = option as GomakeContact;
        // Ensure we always return a unique key
        const key =
          contact.gomake_contact_id ||
          contact.id?.toString() ||
          contact.email ||
          contact.phone_number ||
          `${contact.gomake_customer_id}-${
            contact.email || contact.phone_number || Math.random()
          }`;
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
          if (
            contact.gomake_customer_name &&
            contact.gomake_customer_name !== contact.name
          ) {
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
        return (
          contact.gomake_customer_name || t("frontdesk.compose.unnamedContact")
        );
      }}
      noOptionsText={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("frontdesk.compose.noContactsFound")}
          </Typography>
        </Box>
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("frontdesk.compose.searchContactsPlaceholder")}
          variant="outlined"
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <SearchIcon
                sx={{
                  color: colorTokens.neutral[500],
                  marginRight: isRTL ? 0 : 1,
                  marginLeft: isRTL ? 1 : 0,
                }}
              />
            ),
            endAdornment: (
              <>
                {isSearching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              direction: isRTL ? "rtl" : "ltr",
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        const contact = option as GomakeContact;
        const hasClientInfo =
          contact.gomake_customer_name ||
          contact.gomake_client_code ||
          contact.gomake_agent_id ||
          contact.gomake_is_main_contact;
        const isNewContact =
          !contact.id &&
          !contact.gomake_contact_id &&
          (contact.email || contact.phone_number);

        // Generate avatar data using the shared utility
        const avatarData = generateAvatarData({
          id: contact.gomake_contact_id || contact.id?.toString(),
          email: contact.email || undefined,
          name: contact.name || undefined,
        });

        return (
          <ListItem
            {...props}
            key={
              contact.gomake_contact_id ||
              contact.id ||
              contact.email ||
              contact.phone_number
            }
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              borderBottom: `1px solid ${colorTokens.neutral[200]}`,
              "&:last-child": {
                borderBottom: "none",
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={contact.thumbnail || undefined}
                sx={{
                  bgcolor: avatarData.backgroundColor,
                  color: "white",
                }}
              >
                {avatarData.initials}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {contact.name || t("frontdesk.compose.unnamedContact")}
                  </Typography>
                  {isNewContact && (
                    <Chip
                      icon={
                        <PersonAddIcon sx={{ fontSize: "0.7rem !important" }} />
                      }
                      label={t("frontdesk.compose.new")}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.65rem",
                        "& .MuiChip-icon": {
                          fontSize: "0.7rem",
                          marginLeft: "4px",
                        },
                        "& .MuiChip-label": { padding: "0 6px" },
                      }}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              }
              secondary={
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {contact.email && (
                    <>
                      <MailIcon sx={{ fontSize: "0.875rem" }} />
                      <Typography variant="caption">{contact.email}</Typography>
                    </>
                  )}
                  {contact.phone_number && (
                    <>
                      <PhoneIcon sx={{ fontSize: "0.875rem" }} />
                      <Typography variant="caption">
                        {contact.phone_number}
                      </Typography>
                    </>
                  )}
                </Box>
              }
              sx={{ flex: 1, minWidth: 0 }}
            />
            {hasClientInfo && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 0.5,
                  flexShrink: 0,
                }}
              >
                {contact.gomake_is_main_contact && (
                  <Chip
                    icon={<StarIcon sx={{ fontSize: "0.7rem !important" }} />}
                    label={t("frontdesk.compose.main")}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      "& .MuiChip-icon": {
                        fontSize: "0.7rem",
                        marginLeft: "4px",
                      },
                      "& .MuiChip-label": { padding: "0 6px" },
                    }}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {contact.gomake_customer_name && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      color: "text.secondary",
                      textAlign: "right",
                      maxWidth: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {contact.gomake_customer_name}
                  </Typography>
                )}
                {contact.gomake_client_code && (
                  <Chip
                    icon={
                      <BusinessIcon sx={{ fontSize: "0.7rem !important" }} />
                    }
                    label={contact.gomake_client_code}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      "& .MuiChip-icon": {
                        fontSize: "0.7rem",
                        marginLeft: "4px",
                      },
                      "& .MuiChip-label": { padding: "0 6px" },
                    }}
                    variant="outlined"
                  />
                )}
                {contact.gomake_agent_id && (
                  <Chip
                    icon={<BadgeIcon sx={{ fontSize: "0.7rem !important" }} />}
                    label={contact.gomake_agent_id}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      "& .MuiChip-icon": {
                        fontSize: "0.7rem",
                        marginLeft: "4px",
                      },
                      "& .MuiChip-label": { padding: "0 6px" },
                    }}
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </ListItem>
        );
      }}
    />
  );
};
