import React from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Divider,
  Collapse,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Circle as CircleIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Inbox as InboxIcon,
  Send as SentIcon,
  Drafts as DraftsIcon,
  Delete as TrashIcon,
  Report as SpamIcon,
  Label as LabelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Archive as ArchiveIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailAccount, EmailLabel } from "../types/email.types";

interface EmailSidebarProps {
  accounts: EmailAccount[];
  selectedAccountId?: string;
  onAccountSelect: (accountId: string) => void;
  onAddAccount: () => void;
  onDisconnectAccount?: (accountId: string) => void;
  onRefresh?: () => void;
  labels: EmailLabel[];
  systemLabels: EmailLabel[];
  userLabels: EmailLabel[];
  selectedLabelId?: string | null;
  labelsLoading?: boolean;
  labelsError?: string;
  onLabelSelect: (labelId: string | null) => void;
}

export const EmailSidebar: React.FC<EmailSidebarProps> = ({
  accounts,
  selectedAccountId,
  onAccountSelect,
  onAddAccount,
  onDisconnectAccount,
  onRefresh,
  labels,
  systemLabels,
  userLabels,
  selectedLabelId,
  labelsLoading,
  labelsError,
  onLabelSelect,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();
  const [showUserLabels, setShowUserLabels] = React.useState(true);

  const getInitials = (account: EmailAccount) => {
    if (account.displayName) {
      return account.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return account.email.split("@")[0].slice(0, 2).toUpperCase();
  };

  const getSystemLabelIcon = (labelId: string, labelName: string) => {
    const lowerId = labelId.toLowerCase();
    const lowerName = labelName.toLowerCase();

    if (lowerId.includes("inbox") || lowerName.includes("inbox")) return InboxIcon;
    if (lowerId.includes("sent") || lowerName.includes("sent")) return SentIcon;
    if (lowerId.includes("draft") || lowerName.includes("draft")) return DraftsIcon;
    if (lowerId.includes("trash") || lowerName.includes("trash") || lowerName.includes("bin")) return TrashIcon;
    if (lowerId.includes("spam") || lowerName.includes("spam") || lowerName.includes("junk")) return SpamIcon;
    if (lowerId.includes("starred") || lowerName.includes("starred")) return StarIcon;
    if (lowerId.includes("archive") || lowerName.includes("archive")) return ArchiveIcon;

    return InboxIcon;
  };

  const AccountListItem: React.FC<{ account: EmailAccount }> = ({ account }) => {
    const isSelected = account.id === selectedAccountId;

    return (
      <ListItem
        disablePadding
        sx={{
          borderRadius: 1,
          mb: 0.5,
          mx: 1,
        }}
      >
        <ListItemButton
          selected={isSelected}
          onClick={() => onAccountSelect(account.id)}
          sx={{
            borderRadius: 1,
            py: 1.5,
            "&.Mui-selected": {
              backgroundColor: alpha(primaryColor(100), 0.8),
              borderLeft: `3px solid ${primaryColor(500)}`,
              "&:hover": {
                backgroundColor: alpha(primaryColor(100), 0.9),
              },
            },
            "&:hover": {
              backgroundColor: alpha(neutralColor(100), 0.5),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={account.isActive ? <CircleIcon sx={{ fontSize: 8, color: "success.main" }} /> : null}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.75rem",
                  backgroundColor: isSelected ? primaryColor(500) : neutralColor(400),
                  color: "white",
                }}
              >
                {getInitials(account)}
              </Avatar>
            </Badge>
          </ListItemIcon>

          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? primaryColor(700) : neutralColor(700),
                  fontSize: "0.875rem",
                }}
                noWrap
              >
                {account.displayName || account.email.split("@")[0]}
              </Typography>
            }
            secondary={
              <Typography
                variant="caption"
                sx={{
                  color: isSelected ? primaryColor(600) : neutralColor(500),
                  fontSize: "0.75rem",
                }}
                noWrap
              >
                {account.email}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const LabelListItem: React.FC<{ label: EmailLabel; isSystem?: boolean }> = ({ label, isSystem = false }) => {
    const isSelected = label.id === selectedLabelId;
    const IconComponent = isSystem ? getSystemLabelIcon(label.id, label.name) : LabelIcon;

    return (
      <ListItem disablePadding>
        <ListItemButton
          selected={isSelected}
          onClick={() => onLabelSelect(isSelected ? null : label.id)}
          sx={{
            borderRadius: 1,
            mx: 0.5,
            py: 0.75,
            "&.Mui-selected": {
              backgroundColor: alpha(primaryColor(100), 0.8),
              borderLeft: `3px solid ${primaryColor(500)}`,
              "&:hover": {
                backgroundColor: alpha(primaryColor(100), 0.9),
              },
            },
            "&:hover": {
              backgroundColor: alpha(neutralColor(100), 0.5),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <IconComponent
              sx={{
                fontSize: 16,
                color: isSelected ? primaryColor(600) : neutralColor(500),
              }}
            />
          </ListItemIcon>

          <ListItemText
            primary={
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? primaryColor(700) : neutralColor(700),
                  }}
                  noWrap
                >
                  {label.name}
                </Typography>

                {label.unreadCount && label.unreadCount > 0 && (
                  <Badge
                    badgeContent={label.unreadCount > 99 ? "99+" : label.unreadCount}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.65rem",
                        height: 16,
                        minWidth: 16,
                      },
                    }}
                  />
                )}
              </Stack>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${neutralColor(200)}`,
          backgroundColor: neutralColor(25),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: neutralColor(900),
              fontSize: "1rem",
            }}
          >
            Email Accounts
          </Typography>

          <Stack direction="row" spacing={0.5}>
            {onRefresh && (
              <IconButton
                size="small"
                onClick={onRefresh}
                sx={{
                  color: neutralColor(600),
                  "&:hover": {
                    color: primaryColor(600),
                    backgroundColor: alpha(primaryColor(100), 0.5),
                  },
                }}
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}

            <IconButton
              size="small"
              onClick={onAddAccount}
              sx={{
                color: primaryColor(600),
                backgroundColor: alpha(primaryColor(100), 0.5),
                "&:hover": {
                  backgroundColor: alpha(primaryColor(100), 0.8),
                },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Accounts List */}
      <Box sx={{ overflow: "auto" }}>
        {accounts.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500), mb: 2 }}>
              No email accounts connected
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddAccount}
              size="small"
              sx={{
                backgroundColor: primaryColor(500),
                "&:hover": {
                  backgroundColor: primaryColor(600),
                },
              }}
            >
              Add Email Account
            </Button>
          </Box>
        ) : (
          <List sx={{ py: 1 }}>
            {accounts.map((account) => (
              <AccountListItem key={account.id} account={account} />
            ))}
          </List>
        )}
      </Box>

      {/* Labels Section */}
      {selectedAccountId && accounts.length > 0 && (
        <Box
          sx={{
            borderTop: `1px solid ${neutralColor(200)}`,
            backgroundColor: neutralColor(25),
            overflow: "auto",
            flexShrink: 0,
            maxHeight: "50%",
          }}
        >
          {labelsLoading ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ color: neutralColor(600), mt: 1 }}>
                Loading labels...
              </Typography>
            </Box>
          ) : labelsError ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "error.main" }}>
                Failed to load labels
              </Typography>
            </Box>
          ) : (
            <Box sx={{ px: 1 }}>
              {/* System Labels */}
              {systemLabels.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: neutralColor(600),
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      px: 1,
                      py: 0.5,
                      display: "block",
                    }}
                  >
                    FOLDERS
                  </Typography>
                  <List dense sx={{ py: 0 }}>
                    {systemLabels.map((label) => (
                      <LabelListItem key={label.id} label={label} isSystem />
                    ))}
                  </List>
                </Box>
              )}

              {/* User Labels */}
              {userLabels.length > 0 && (
                <Box>
                  {systemLabels.length > 0 && <Divider sx={{ my: 1 }} />}

                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: neutralColor(600),
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        py: 0.5,
                      }}
                    >
                      LABELS
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setShowUserLabels(!showUserLabels)}
                      sx={{
                        color: neutralColor(500),
                        "&:hover": { color: neutralColor(700) },
                      }}
                    >
                      {showUserLabels ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                    </IconButton>
                  </Stack>

                  <Collapse in={showUserLabels}>
                    <List dense sx={{ py: 0 }}>
                      {userLabels.map((label) => (
                        <LabelListItem key={label.id} label={label} />
                      ))}
                    </List>
                  </Collapse>
                </Box>
              )}

              {labels.length === 0 && (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: neutralColor(500) }}>
                    No labels found
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};
