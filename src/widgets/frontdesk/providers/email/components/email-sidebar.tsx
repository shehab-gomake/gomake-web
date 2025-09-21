import React from "react";
import { Box, Paper, List, CircularProgress, Divider, Collapse, IconButton, Typography, Stack } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailAccount, EmailLabel } from "../types/email.types";
import { getLabelIcon } from "../utils/icon-utils";
import { SidebarHeader } from "./sidebar/sidebar-header";
import { AccountListItem } from "./sidebar/account-list-item";
import { AccountListEmpty } from "./sidebar/account-list-empty";
import { EmailListItem } from "./ui/email-list-item";
import { EmailAccountMenu } from "./email-account-menu";

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
  const [showUserLabels, setShowUserLabels] = React.useState(true);
  const [showAllSystemLabels, setShowAllSystemLabels] = React.useState(false);
  const [showAllUserLabels, setShowAllUserLabels] = React.useState(false);

  const LabelListItem: React.FC<{ label: EmailLabel; isSystem?: boolean }> = ({ label, isSystem = false }) => {
    const isSelected = label.id === selectedLabelId;
    const IconComponent = getLabelIcon(label.id, label.name, isSystem);

    return (
      <EmailListItem
        icon={<IconComponent sx={{ fontSize: 16, color: isSelected ? primaryColor(600) : neutralColor(500) }} />}
        primary={label.name}
        badgeCount={label.unreadCount}
        isSelected={isSelected}
        onClick={() => onLabelSelect(isSelected ? null : label.id)}
      />
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
      <SidebarHeader onAddAccount={onAddAccount} onRefresh={onRefresh} />

      {/* Accounts List */}
      <Box sx={{ overflow: "auto" }}>
        {accounts.length === 0 ? (
          <AccountListEmpty onAddAccount={onAddAccount} />
        ) : (
          <List sx={{ py: 1 }}>
            {accounts.map((account) => (
              <AccountListItem
                key={account.id}
                account={account}
                isSelected={account.id === selectedAccountId}
                onSelect={onAccountSelect}
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
                    {(showAllSystemLabels ? systemLabels : systemLabels.slice(0, 5)).map((label) => (
                      <LabelListItem key={label.id} label={label} isSystem />
                    ))}
                  </List>
                  {systemLabels.length > 5 && (
                    <Box sx={{ px: 1, py: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => setShowAllSystemLabels(!showAllSystemLabels)}
                        sx={{
                          color: neutralColor(500),
                          "&:hover": { color: neutralColor(700) },
                          width: "100%",
                          justifyContent: "flex-start",
                          py: 0.5,
                        }}
                      >
                        {showAllSystemLabels ? (
                          <ExpandLessIcon sx={{ fontSize: 16, mr: 1 }} />
                        ) : (
                          <ExpandMoreIcon sx={{ fontSize: 16, mr: 1 }} />
                        )}
                        <Typography variant="caption" sx={{ color: neutralColor(600) }}>
                          {showAllSystemLabels ? "Show less" : `Show ${systemLabels.length - 5} more`}
                        </Typography>
                      </IconButton>
                    </Box>
                  )}
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
                      {(showAllUserLabels ? userLabels : userLabels.slice(0, 5)).map((label) => (
                        <LabelListItem key={label.id} label={label} />
                      ))}
                    </List>
                    {userLabels.length > 5 && (
                      <Box sx={{ px: 1, py: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => setShowAllUserLabels(!showAllUserLabels)}
                          sx={{
                            color: neutralColor(500),
                            "&:hover": { color: neutralColor(700) },
                            width: "100%",
                            justifyContent: "flex-start",
                            py: 0.5,
                          }}
                        >
                          {showAllUserLabels ? (
                            <ExpandLessIcon sx={{ fontSize: 16, mr: 1 }} />
                          ) : (
                            <ExpandMoreIcon sx={{ fontSize: 16, mr: 1 }} />
                          )}
                          <Typography variant="caption" sx={{ color: neutralColor(600) }}>
                            {showAllUserLabels ? "Show less" : `Show ${userLabels.length - 5} more`}
                          </Typography>
                        </IconButton>
                      </Box>
                    )}
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
