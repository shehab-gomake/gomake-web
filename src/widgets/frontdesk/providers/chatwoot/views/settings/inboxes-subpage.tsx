/**
 * Inboxes Subpage
 *
 * Displays and manages Chatwoot inboxes (channels) including
 * Email, WhatsApp, SMS, API, Web, and Twilio channels.
 *
 * RBAC: Only administrators can access this page.
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Alert,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WebIcon from "@mui/icons-material/Web";
import ApiIcon from "@mui/icons-material/Api";
import {
  BaseSettingsSubpage,
  SettingsSection,
} from "../../components/settings";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { useChatwootPermissions } from "../../hooks/use-chatwoot-permissions";
import { SETTINGS_PERMISSIONS } from "../../constants/permissions.constants";
import { useChatwootInboxes } from "../../hooks/use-chatwoot-inboxes";
import { AddChannelModal } from "../../components/add-channel-modal";
import { InboxDetailSettings } from "./inbox-detail-settings";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { chatwootService } from "@/services/frontdesk";

// Custom WhatsApp Icon Component
const WhatsAppIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: "100%", height: "100%" }}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Helper function to get icon for channel type
const getChannelIcon = (channelType: string) => {
  if (channelType?.includes("Email")) return <EmailIcon />;
  if (channelType?.includes("WhatsApp")) return <WhatsAppIcon />;
  if (channelType?.includes("Sms") || channelType?.includes("Twilio"))
    return <PhoneIcon />;
  if (channelType?.includes("WebWidget")) return <WebIcon />;
  if (channelType?.includes("Api")) return <ApiIcon />;
  return <InboxIcon />;
};

// Helper function to get readable channel type
const getChannelTypeLabel = (channelType: string) => {
  if (!channelType) return "Unknown";
  if (channelType?.includes("Email")) return "Email";
  if (channelType?.includes("WhatsApp")) return "WhatsApp";
  if (channelType?.includes("Sms") || channelType?.includes("Twilio"))
    return "SMS";
  if (channelType?.includes("WebWidget")) return "Web Widget";
  if (channelType?.includes("Api")) return "API";
  return channelType
    .replace("Channel::", "")
    .replace(/([A-Z])/g, " $1")
    .trim();
};

export const InboxesSubpage: React.FC = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { router: chatwootRouter, selectedAccountId } = useChatwootProvider();
  const { inboxes, loading, error, refresh } = useChatwootInboxes();
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [selectedInbox, setSelectedInbox] = useState<ChatwootInbox | null>(
    null
  );

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inboxToDelete, setInboxToDelete] = useState<ChatwootInbox | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  // Defense-in-depth: Check if user has permission to access Inboxes settings
  const { canAccess } = useChatwootPermissions();
  const canAccessInboxes = canAccess(SETTINGS_PERMISSIONS.inboxes);

  // Redirect unauthorized users to My Inbox
  useEffect(() => {
    if (!canAccessInboxes) {
      console.warn(
        "[InboxesSubpage] Unauthorized access attempt - redirecting to My Inbox"
      );
      chatwootRouter.navigateToMyInbox();
    }
  }, [canAccessInboxes, chatwootRouter]);

  // Auto-select inbox if coming from warnings (stored in sessionStorage)
  useEffect(() => {
    if (inboxes.length > 0 && !selectedInbox) {
      const selectInboxId = sessionStorage.getItem("chatwoot:selectInbox");
      if (selectInboxId) {
        const inboxId = parseInt(selectInboxId, 10);
        const inboxToSelect = inboxes.find((inbox) => inbox.id === inboxId);
        if (inboxToSelect) {
          setSelectedInbox(inboxToSelect);
          // Clear the sessionStorage after selecting
          sessionStorage.removeItem("chatwoot:selectInbox");
        }
      }
    }
  }, [inboxes, selectedInbox]);

  // Open delete confirmation
  const handleDeleteClick = (e: React.MouseEvent, inbox: ChatwootInbox) => {
    e.stopPropagation(); // Prevent navigation to detail settings
    setInboxToDelete(inbox);
    setDeleteDialogOpen(true);
  };

  // Confirm and execute delete
  const handleDeleteConfirm = async () => {
    if (!selectedAccountId || !inboxToDelete?.id || deleting) return;

    setDeleting(true);
    try {
      await chatwootService.inboxes.deleteInbox(
        selectedAccountId,
        inboxToDelete.id
      );
      await refresh(); // Refresh the inbox list
      setDeleteDialogOpen(false);
      setInboxToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete inbox:", error);
      alert(error.message || "Failed to delete inbox");
    } finally {
      setDeleting(false);
    }
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    if (!deleting) {
      setDeleteDialogOpen(false);
      setInboxToDelete(null);
    }
  };

  // If an inbox is selected, show detail view
  if (selectedInbox) {
    return (
      <InboxDetailSettings
        inbox={selectedInbox}
        onBack={() => setSelectedInbox(null)}
      />
    );
  }

  return (
    <>
      <BaseSettingsSubpage
        title={t("frontdesk.settings.inboxes")}
        description={t("frontdesk.settings.inboxesDescription")}
        isLoading={loading}
        headerActions={
          <Box
            sx={{
              display: "flex",
              gap: 0.75,
              alignItems: "center",
              direction: dir,
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => setShowAddChannelModal(true)}
              size="small"
              disabled={loading}
              sx={{
                fontSize: "0.813rem",
                fontWeight: 500,
                textTransform: "none",
                px: 1.5,
                py: 0.5,
                height: 30,
                backgroundColor: "#6366f1",
                "&:hover": {
                  backgroundColor: "#4f46e5",
                },
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {t("frontdesk.settings.inboxesAddChannel")}
            </Button>
            <IconButton
              onClick={refresh}
              size="small"
              disabled={loading}
              sx={{
                color: "#6b7280",
                p: 0.75,
                "&:hover": {
                  color: "#6366f1",
                  bgcolor: "rgba(99, 102, 241, 0.08)",
                },
              }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        }
      >
        {error ? (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: "6px", direction: dir }}
          >
            {error || t("frontdesk.settings.inboxesFailedToLoad")}
          </Alert>
        ) : inboxes.length === 0 ? (
          /* Empty State - Compact */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 260,
              textAlign: "center",
              gap: 1.5,
              direction: dir,
            }}
          >
            <InboxIcon sx={{ fontSize: 48, color: "#9ca3af", opacity: 0.6 }} />
            <Typography
              variant="subtitle1"
              sx={{ color: "#1f2937", fontWeight: 600, fontSize: "0.938rem" }}
            >
              {t("frontdesk.settings.inboxesEmptyTitle")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                maxWidth: 360,
                fontSize: "0.813rem",
                lineHeight: 1.5,
              }}
            >
              {t("frontdesk.settings.inboxesEmptyDescription")}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setShowAddChannelModal(true)}
              sx={{
                mt: 2,
                fontSize: "0.813rem",
                fontWeight: 500,
                textTransform: "none",
                px: 2,
                py: 0.75,
                backgroundColor: "#6366f1",
                "&:hover": {
                  backgroundColor: "#4f46e5",
                },
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {t("frontdesk.settings.inboxesAddFirstChannel")}
            </Button>
          </Box>
        ) : (
          /* Inboxes List - Compact High-Density Design */
          <SettingsSection
            title={t("frontdesk.settings.inboxesSectionTitle", {
              count: inboxes.length,
            })}
            description={t("frontdesk.settings.inboxesSectionDescription")}
          >
            <List
              sx={{
                width: "100%",
                bgcolor: "transparent",
                p: 0,
                m: 0,
                direction: dir,
              }}
            >
              {inboxes.map((inbox, index) => (
                <React.Fragment key={inbox.id}>
                  <ListItem
                    onClick={() => setSelectedInbox(inbox)}
                    sx={{
                      py: 1.25,
                      px: 1.5,
                      cursor: "pointer",
                      borderBottom:
                        index < inboxes.length - 1
                          ? "1px solid rgba(0,0,0,0.06)"
                          : "none",
                      "&:hover": {
                        bgcolor: "rgba(99, 102, 241, 0.02)",
                      },
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "4px",
                      transition: "background-color 0.15s ease",
                      direction: dir,
                    }}
                  >
                    <ListItemAvatar
                      sx={{ minWidth: 44, [dir === "rtl" ? "ml" : "mr"]: 1.5 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#6366f1",
                          color: "#ffffff",
                          width: 34,
                          height: 34,
                          "& svg": {
                            fontSize: 18,
                          },
                        }}
                      >
                        {getChannelIcon(inbox.channel_type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "#1f2937",
                            fontSize: "0.813rem",
                            lineHeight: 1.3,
                            direction: dir,
                            textAlign: dir === "rtl" ? "right" : "left",
                          }}
                        >
                          {inbox.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6b7280",
                            fontSize: "0.75rem",
                            mt: 0.25,
                            display: "block",
                            direction: dir,
                            textAlign: dir === "rtl" ? "right" : "left",
                          }}
                        >
                          {getChannelTypeLabel(inbox.channel_type)}
                        </Typography>
                      }
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      onClick={(e) => handleDeleteClick(e, inbox)}
                      size="small"
                      aria-label={t("frontdesk.settings.inboxesDeleteInbox", {
                        name: inbox.name,
                      })}
                      disabled={deleting || loading}
                      sx={{
                        color: "#6b7280",
                        p: 0.5,
                        [dir === "rtl" ? "mr" : "ml"]: 1,
                        "&:hover": {
                          color: "#ef4444",
                          bgcolor: "rgba(239, 68, 68, 0.08)",
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </SettingsSection>
        )}
      </BaseSettingsSubpage>

      {/* Add Channel Modal */}
      <AddChannelModal
        open={showAddChannelModal}
        onClose={() => setShowAddChannelModal(false)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            direction: dir,
          },
        }}
      >
        <DialogTitle sx={{ direction: dir }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t("frontdesk.settings.inboxesDeleteTitle")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ direction: dir }}>
          <Typography variant="body2" color="text.secondary">
            {t("frontdesk.settings.inboxesDeleteMessage", {
              name: inboxToDelete?.name || "",
            })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, direction: dir }}>
          <Button
            onClick={handleDeleteCancel}
            disabled={deleting}
            sx={{ textTransform: "none" }}
          >
            {t("frontdesk.common.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={deleting}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            {deleting
              ? t("frontdesk.settings.inboxesDeleting")
              : t("frontdesk.settings.inboxesDeleteButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
