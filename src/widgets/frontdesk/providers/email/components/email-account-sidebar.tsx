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
  Button,
  Badge,
  Avatar,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Inbox as InboxIcon,
  Send as SendIcon,
  Drafts as DraftsIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Label as LabelIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { EmailAccount } from "../types/email.types";

interface EmailAccountSidebarProps {
  accounts: EmailAccount[];
  selectedAccountId: string | null;
  activeFolder: string;
  onAccountSelect: (accountId: string) => void;
  onFolderSelect: (folder: string) => void;
  onAddAccount: () => void;
  unreadCounts: Record<string, number>;
}

const folderItems = [
  { id: "inbox", label: "Inbox", icon: <InboxIcon /> },
  { id: "sent", label: "Sent", icon: <SendIcon /> },
  { id: "drafts", label: "Drafts", icon: <DraftsIcon /> },
  { id: "starred", label: "Starred", icon: <StarIcon /> },
  { id: "archive", label: "Archive", icon: <ArchiveIcon /> },
  { id: "trash", label: "Trash", icon: <DeleteIcon /> },
];

export const EmailAccountSidebar: React.FC<EmailAccountSidebarProps> = ({
  accounts,
  selectedAccountId,
  activeFolder,
  onAccountSelect,
  onFolderSelect,
  onAddAccount,
  unreadCounts,
}) => {
  const [accountsExpanded, setAccountsExpanded] = useState(true);
  const [foldersExpanded, setFoldersExpanded] = useState(true);

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

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
              <Chip
                label={totalUnread}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
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
            "&:hover": { backgroundColor: "action.hover" }
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
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>

      <Divider />

      {/* Folders Section */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        <ListItemButton
          onClick={() => setFoldersExpanded(!foldersExpanded)}
          sx={{
            py: 0.5,
            px: 1,
            borderRadius: 1,
            "&:hover": { backgroundColor: "action.hover" }
          }}
        >
          <ListItemText
            primary={
              <Typography variant="subtitle2" color="text.secondary">
                FOLDERS
              </Typography>
            }
          />
          {foldersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>

        <Collapse in={foldersExpanded}>
          <List dense sx={{ py: 0 }}>
            {folderItems.map((folder) => {
              const unread = selectedAccount && unreadCounts[`${selectedAccountId}_${folder.id}`] || 0;

              return (
                <ListItem key={folder.id} disablePadding>
                  <ListItemButton
                    selected={folder.id === activeFolder}
                    onClick={() => onFolderSelect(folder.id)}
                    disabled={!selectedAccountId}
                    sx={{
                      py: 0.75,
                      px: 2,
                      borderRadius: 1,
                      my: 0.25,
                      "&.Mui-selected": {
                        backgroundColor: "action.selected",
                      },
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: "text.secondary" }}>
                      {folder.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={folder.label}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                    {unread > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          backgroundColor: "primary.main",
                          color: "white",
                        }}
                      >
                        {unread}
                      </Typography>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </Box>

      {/* Settings Button */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<SettingsIcon />}
          size="small"
        >
          Email Settings
        </Button>
      </Box>
    </Paper>
  );
};