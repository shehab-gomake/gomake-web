import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  List,
  ListItem,
  Collapse,
  ClickAwayListener,
  Paper,
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
  const toggleRef = useRef<HTMLDivElement>(null);

  const selectedAccount = accounts.find(account => account.id === selectedAccountId);

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      const currentIndex = accounts.findIndex(acc => acc.id === selectedAccountId);
      let nextIndex;

      if (event.key === "ArrowDown") {
        nextIndex = currentIndex < accounts.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : accounts.length - 1;
      }

      const nextAccount = accounts[nextIndex];
      if (nextAccount) {
        handleAccountSelection(nextAccount.id);
      }
    }
  };

  if (accounts.length === 0) {
    return null;
  }

  // Always show dropdown interface for consistency
  const singleAccount = accounts.length === 1 ? accounts[0] : null;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }}>
        <Box
          ref={toggleRef}
          sx={{
            px: 2,
            py: 1,
            cursor: "pointer",
            borderRadius: 1,
            mx: 1,
            mb: 1,
            backgroundColor: isOpen ? primaryColor(50) : "transparent",
            border: `1px solid ${isOpen ? primaryColor(200) : "transparent"}`,
            "&:hover": {
              backgroundColor: primaryColor(25),
              border: `1px solid ${primaryColor(100)}`,
            },
            transition: "all 0.2s ease-in-out",
          }}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Selected account: ${selectedAccount?.email || "None"}. Click to change account.`}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {selectedAccount && (
              <EmailAvatar
                email={selectedAccount.email}
                displayName={selectedAccount.displayName || selectedAccount.email}
                size={32}
              />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {selectedAccount ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: neutralColor(900),
                      fontSize: "0.875rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedAccount.displayName || selectedAccount.email.split("@")[0]}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: neutralColor(600),
                      fontSize: "0.75rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedAccount.email}
                  </Typography>
                </>
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
              )}
            </Box>
            <IconButton
              size="small"
              sx={{
                color: neutralColor(500),
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <ExpandMoreIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
        </Box>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Paper
            elevation={8}
            sx={{
              position: "absolute",
              top: "100%",
              left: 8,
              right: 8,
              zIndex: 1000,
              borderRadius: 2,
              border: `1px solid ${neutralColor(200)}`,
              backgroundColor: "white",
              maxHeight: 240,
              overflow: "auto",
            }}
          >
            <List sx={{ py: 0.5 }}>
              {accounts.length === 1 ? (
                // Single account: show disconnect option
                <ListItem
                  disablePadding
                  sx={{
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: neutralColor(50) }
                  }}
                  onClick={() => {
                    if (onDisconnectAccount && selectedAccount) {
                      onDisconnectAccount(selectedAccount.id);
                      setIsOpen(false);
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ color: "error.main" }}>
                    <Box sx={{
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Typography sx={{ fontSize: "1rem" }}>🔌</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: "error.main", fontWeight: 500 }}>
                      Disconnect Account
                    </Typography>
                  </Stack>
                </ListItem>
              ) : (
                // Multiple accounts: show account list
                accounts.map((account) => (
                  <ListItem key={account.id} disablePadding sx={{ px: 0 }}>
                    <AccountListItem
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
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};