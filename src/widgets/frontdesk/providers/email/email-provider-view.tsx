import React, { useState, useEffect, useCallback } from "react";
import { Stack, Paper, Typography, Alert, Button, Box } from "@mui/material";
import { Email as EmailIcon, Refresh as RefreshIcon, Add as AddIcon } from "@mui/icons-material";
import { EmailAccountSidebar } from "./components/email-account-sidebar";
import { EmailMessageList } from "./components/email-message-list";
import { EmailMessageViewer } from "./components/email-message-viewer";
import { EmailComposer } from "./components/email-composer";
import { EmailAuthModal } from "./components/email-auth-modal";
import { EmailConnectionStatus } from "./components/email-connection-status";
import { EmailInfoPanel } from "./components/email-info-panel";
import { useEmailAccounts } from "./hooks/use-email-accounts";
import { useEmailMessages } from "./hooks/use-email-messages";
import { useEmailSend } from "./hooks/use-email-send";
import { useEmailAuth } from "./hooks/use-email-auth";
import { EmailMessage, EmailDraft } from "./types/email.types";

export const EmailProviderView: React.FC = () => {
  const {
    accounts,
    selectedAccountId,
    loading: accountsLoading,
    error: accountsError,
    selectAccount,
    fetchAccounts,
  } = useEmailAccounts();

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    hasMore,
    loadMore,
    refresh,
    starMessage,
    deleteMessage,
    archiveMessage,
  } = useEmailMessages();

  const { authenticate, isAuthenticating, error: authError } = useEmailAuth();
  const { sendEmail, isSending } = useEmailSend();

  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [composerDraft, setComposerDraft] = useState<EmailDraft | null>(null);

  // Connection states
  const connectionStatus =
    accounts.length === 0 ? "disconnected" : accountsLoading ? "connecting" : accountsError ? "error" : "connected";

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleMessageSelect = useCallback((message: EmailMessage) => {
    setSelectedMessage(message);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  const handleAuthenticate = useCallback(
    async (provider: string) => {
      try {
        await authenticate(provider);
        await fetchAccounts();
        setShowAuthModal(false);
      } catch (error) {
        console.error("Auth failed:", error);
      }
    },
    [authenticate, fetchAccounts]
  );

  const handleSendEmail = useCallback(
    async (draft: EmailDraft) => {
      const success = await sendEmail(draft);
      if (success) {
        setShowComposer(false);
        setComposerDraft(null);
        refresh();
      }
    },
    [sendEmail, refresh]
  );

  const handleReply = useCallback((message: EmailMessage) => {
    setComposerDraft({
      to: [message.from],
      cc: [],
      bcc: [],
      subject: `Re: ${message.subject}`,
      text: `\n\n---\nOn ${message.createdAt}, ${message.from.email} wrote:\n${message.text}`,
      html: "",
      replyToMessageId: message.id,
      threadId: message.threadId,
    });
    setShowComposer(true);
  }, []);

  const handleCompose = useCallback(() => {
    setComposerDraft(null);
    setShowComposer(true);
  }, []);

  // Simple unread counts for demo
  const unreadCounts = accounts.reduce((acc, account) => {
    acc[account.id] = 0; // Would come from backend
    return acc;
  }, {} as Record<string, number>);

  return (
    <Stack sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Connection Status Bar */}
      {connectionStatus !== "connected" && (
        <Box sx={{ p: 2 }}>
          <EmailConnectionStatus
            status={connectionStatus}
            error={accountsError}
            accountCount={accounts.length}
            onRetry={fetchAccounts}
            onConnect={() => setShowAuthModal(true)}
          />
        </Box>
      )}

      {/* Main Layout */}
      <Stack direction="row" sx={{ flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <EmailAccountSidebar
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={selectAccount}
          onAddAccount={() => setShowAuthModal(true)}
          unreadCounts={unreadCounts}
        />

        {/* Message Area */}
        <Stack sx={{ flex: 1, overflow: "hidden" }}>
          {selectedMessage ? (
            <EmailMessageViewer
              messages={[selectedMessage]}
              onBack={handleBack}
              onReply={handleReply}
              onDelete={(id) => {
                deleteMessage(id);
                handleBack();
              }}
              onArchive={(id) => {
                archiveMessage(id);
                handleBack();
              }}
              onStar={(id, starred) => starMessage(id, starred)}
            />
          ) : (
            <>
              {/* Header */}
              <Paper elevation={0} sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">{selectedAccountId ? "Messages" : "Select an account"}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleCompose} disabled={!selectedAccountId}>
                      Compose
                    </Button>
                    <Button startIcon={<RefreshIcon />} onClick={refresh} disabled={!selectedAccountId}>
                      Refresh
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              {/* Message List */}
              {selectedAccountId ? (
                <EmailMessageList
                  messages={messages}
                  loading={messagesLoading}
                  hasMore={hasMore}
                  onSelect={handleMessageSelect}
                  onLoadMore={loadMore}
                  onStar={starMessage}
                  onDelete={deleteMessage}
                  onArchive={archiveMessage}
                />
              ) : (
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {accounts.length === 0 ? "Connect an email account to get started" : "Select an account from the sidebar"}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Stack>

        {/* Info Panel (optional - can be hidden) */}
        {selectedMessage && (
          <EmailInfoPanel
            email={selectedMessage}
            onStar={(starred) => starMessage(selectedMessage.id, starred)}
            onArchive={() => archiveMessage(selectedMessage.id)}
            onDelete={() => {
              deleteMessage(selectedMessage.id);
              handleBack();
            }}
          />
        )}
      </Stack>

      {/* Composer */}
      {showComposer && (
        <EmailComposer
          draft={composerDraft || undefined}
          onSend={handleSendEmail}
          onClose={() => {
            setShowComposer(false);
            setComposerDraft(null);
          }}
          isSending={isSending}
        />
      )}

      {/* Auth Modal */}
      <EmailAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticate={handleAuthenticate}
        error={authError}
      />
    </Stack>
  );
};
