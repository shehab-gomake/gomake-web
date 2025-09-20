import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Paper,
  Badge,
  Avatar,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { EmailAccount } from "../types/email.types";
import { EmailAccountMenu } from "./email-account-menu";
import { DisconnectAccountDialog } from "./disconnect-account-dialog";

interface EmailAccountSidebarProps {
  accounts: EmailAccount[];
  selectedAccountId: string | null;
  onAccountSelect: (accountId: string) => void;
  onAddAccount: () => void;
  onDisconnectAccount: (accountId: string) => void;
  unreadCounts: Record<string, number>;
}

export const EmailAccountSidebar: React.FC<EmailAccountSidebarProps> = ({
  accounts,
  selectedAccountId,
  onAccountSelect,
  onAddAccount,
  onDisconnectAccount,
  unreadCounts,
}) => {
  const [accountsExpanded, setAccountsExpanded] = useState(true);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<EmailAccount | null>(null);

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  const handleDisconnectRequest = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    if (account) {
      setAccountToDisconnect(account);
      setDisconnectDialogOpen(true);
    }
  };

  const handleDisconnectConfirm = () => {
    if (accountToDisconnect) {
      onDisconnectAccount(accountToDisconnect.id);
    }
    setDisconnectDialogOpen(false);
    setAccountToDisconnect(null);
  };

  const handleDisconnectCancel = () => {
    setDisconnectDialogOpen(false);
    setAccountToDisconnect(null);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <EmailIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" fontWeight="bold">
              Email
            </Typography>
            {totalUnread > 0 && (
              <Chip label={totalUnread} size="small" color="primary" sx={{ height: 20, fontSize: "0.75rem" }} />
            )}
          </Stack>
          <IconButton size="small" onClick={onAddAccount}>
            <AddIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Accounts Section */}
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={() => setAccountsExpanded(!accountsExpanded)}
          sx={{
            py: 0.5,
            px: 1,
            borderRadius: 1,
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <ListItemText
            primary={
              <Typography variant="subtitle2" color="text.secondary">
                ACCOUNTS ({accounts.length})
              </Typography>
            }
          />
          {accountsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>

        <Collapse in={accountsExpanded}>
          <List dense sx={{ py: 0 }}>
            {accounts.map((account) => (
              <ListItem key={account.id} disablePadding>
                <ListItemButton
                  selected={account.id === selectedAccountId}
                  onClick={() => onAccountSelect(account.id)}
                  sx={{
                    py: 0.75,
                    px: 2,
                    borderRadius: 1,
                    my: 0.25,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "& .MuiTypography-root": {
                        color: "white",
                      },
                      "& .MuiBadge-badge": {
                        backgroundColor: "white",
                        color: "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.875rem",
                        backgroundColor: account.id === selectedAccountId ? "white" : "primary.main",
                        color: account.id === selectedAccountId ? "primary.main" : "white",
                      }}
                    >
                      {account.email[0].toUpperCase()}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={account.displayName}
                    secondary={account.email}
                    primaryTypographyProps={{
                      variant: "body2",
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{
                      variant: "caption",
                      noWrap: true,
                    }}
                  />
                  {unreadCounts[account.id] > 0 && (
                    <Badge
                      badgeContent={unreadCounts[account.id]}
                      color={account.id === selectedAccountId ? "default" : "primary"}
                      sx={{ mr: 1 }}
                    />
                  )}
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {account.isPrimary && (
                      <Chip
                        label="Primary"
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: "0.65rem",
                          backgroundColor: account.id === selectedAccountId ? "white" : "primary.light",
                          color: account.id === selectedAccountId ? "primary.main" : "white",
                        }}
                      />
                    )}
                    <EmailAccountMenu
                      accountId={account.id}
                      isSelected={account.id === selectedAccountId}
                      onDisconnect={handleDisconnectRequest}
                    />
                  </Stack>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>

      {/* Disconnect Confirmation Dialog */}
      <DisconnectAccountDialog
        open={disconnectDialogOpen}
        accountEmail={accountToDisconnect?.email}
        onConfirm={handleDisconnectConfirm}
        onCancel={handleDisconnectCancel}
      />
    </Paper>
  );
};
