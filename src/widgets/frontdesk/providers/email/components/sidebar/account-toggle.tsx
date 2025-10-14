import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Collapse,
  ClickAwayListener,
  Paper,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailAccount } from "../../types/email.types";
import { EmailAvatar } from "../ui/email-avatar";
import { AccountListItem } from "./account-list-item";
import { EmailAccountMenu } from "../email-account-menu";

interface AccountToggleProps {
  accounts: EmailAccount[];
  selectedAccountId?: string;
  onAccountSelect: (accountId: string) => void;
  onDisconnectAccount?: (accountId: string) => void;
}

export const AccountToggle: React.FC<AccountToggleProps> = ({
  accounts,
  selectedAccountId,
  onAccountSelect,
  onDisconnectAccount,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Safety check: ensure accounts is an array
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const selectedAccount = safeAccounts.find(account => account.id === selectedAccountId);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAccountSelection = (accountId: string) => {
    onAccountSelect(accountId);
    setIsOpen(false);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  if (safeAccounts.length === 0) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }}>
        <ListItem
          disablePadding
          sx={{
            borderRadius: 1,
            mb: 0.5,
            mx: 1,
          }}
        >
          <ListItemButton
            selected={isOpen}
            onClick={handleToggle}
            sx={{
              borderRadius: 1,
              py: 1,
              "&.Mui-selected": {
                backgroundColor: primaryColor(100),
                "&:hover": {
                  backgroundColor: primaryColor(200),
                },
              },
              "&:hover": {
                backgroundColor: neutralColor(50),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {selectedAccount && (
                <EmailAvatar
                  email={selectedAccount.email}
                  displayName={selectedAccount.displayName}
                  size={32}
                  isSelected={isOpen}
                />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                selectedAccount ? (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isOpen ? 600 : 400,
                      color: isOpen ? primaryColor(700) : neutralColor(700),
                      fontSize: "0.875rem",
                    }}
                    noWrap
                  >
                    {selectedAccount.displayName || selectedAccount.email.split("@")[0]}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: neutralColor(600),
                      fontSize: "0.875rem",
                    }}
                  >
                    Select an account
                  </Typography>
                )
              }
              secondary={
                selectedAccount && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: isOpen ? primaryColor(600) : neutralColor(500),
                      fontSize: "0.75rem",
                    }}
                    noWrap
                  >
                    {selectedAccount.email}
                  </Typography>
                )
              }
            />

            <IconButton
              size="small"
              sx={{
                color: isOpen ? primaryColor(600) : neutralColor(500),
              }}
            >
              {isOpen ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </ListItemButton>
        </ListItem>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Paper
            elevation={2}
            sx={{
              position: "absolute",
              top: "100%",
              left: 8,
              right: 8,
              zIndex: 1000,
              borderRadius: 1,
              border: `1px solid ${neutralColor(200)}`,
              backgroundColor: "white",
              maxHeight: 280,
              overflow: "auto",
              mt: 0.5,
            }}
          >
            <List sx={{ py: 0.5 }}>
              {safeAccounts.map((account) => (
                <AccountListItem
                  key={account.id}
                  account={account}
                  isSelected={account.id === selectedAccountId}
                  onSelect={handleAccountSelection}
                >
                  {onDisconnectAccount && (
                    <EmailAccountMenu
                      accountId={account.id}
                      isSelected={account.id === selectedAccountId}
                      onDisconnect={onDisconnectAccount}
                    />
                  )}
                </AccountListItem>
              ))}
            </List>
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};