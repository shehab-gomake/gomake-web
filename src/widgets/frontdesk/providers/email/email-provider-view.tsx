import React, { useState } from "react";
import { Stack, Paper, Box, Typography, Fab, Tooltip } from "@mui/material";
import { Edit as ComposeIcon } from "@mui/icons-material";
import { FrontdeskEmptyState } from "@/widgets/frontdesk/components/empty-state";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailComposer } from "./components/email-composer";
import { EmailAuthModal } from "./components/email-auth-modal";
import { EmailSidebar } from "./components/email-sidebar";
import { EmailConversationList } from "./components/email-conversation-list";
import { EmailMessageViewer } from "./components/email-message-viewer";
import { useEmailProvider } from "./hooks/use-email-provider";

export const EmailProviderView: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { primaryColor } = useGomakeTheme();

  const {
    isConnected,
    accounts,
    selectedAccountId,
    accountsLoading,
    accountsError,
    selectAccount,
    disconnectAccount,
    refreshAccounts,
    authenticate,
    isAuthenticating,
    authError,
    labels,
    systemLabels,
    userLabels,
    selectedLabel,
    selectedLabelId,
    labelsLoading,
    labelsError,
    selectLabel,
    conversations,
    conversationsLoading,
    conversationsError,
    hasMore,
    loadMore,
    refresh,
    starConversation,
    deleteConversation,
    archiveConversation,
    selectedConversation,
    handleConversationSelect,
    handleBack,
    handleSendReply,
    showComposer,
    composerDraft,
    isSending,
    handleCompose,
    handleCloseComposer,
    handleSendEmail,
    handleReplyWithComposer,
    searchQuery,
    onSearch,
  } = useEmailProvider();

  const handleAuthenticate = async (provider: string) => {
    try {
      await authenticate(provider);
      setShowAuthModal(false);
    } catch (error) {
      console.error("Auth failed:", error);
    }
  };

  // Handle inline reply - send directly without opening modal
  const handleInlineReply = async (text: string, replyAll?: boolean) => {
    if (!selectedConversation) return false;

    // Create a simple reply draft
    const replyDraft = {
      to: [{ email: selectedConversation.lastMessage?.from || "", name: "" }],
      cc:
        replyAll && selectedConversation.lastMessage?.to
          ? selectedConversation.lastMessage.to.map((email) => ({ email, name: "" }))
          : [],
      bcc: [],
      subject: `Re: ${selectedConversation.subject.replace(/^Re:\s*/i, "")}`,
      text: text,
      html: text,
      replyToMessageId: selectedConversation.lastMessage?.id,
      threadId: selectedConversation.lastMessage?.threadId || selectedConversation.id,
    };

    return await handleSendEmail(replyDraft);
  };

  // Handle reply with modal composer (for complex replies)
  const handleReply = (conversation: any) => {
    handleReplyWithComposer(conversation);
  };

  const handleReplyAll = (conversation: any) => {
    // TODO: Implement reply all functionality with modal
    handleReplyWithComposer(conversation);
  };

  const handleForward = (conversation: any) => {
    // TODO: Implement forward functionality
    console.log("Forward:", conversation);
  };

  const handlePrint = (conversation: any) => {
    // TODO: Implement print functionality
    console.log("Print:", conversation);
  };

  const handleAddLabel = (conversationId: string, label: string) => {
    // TODO: Implement add label functionality
    console.log("Add label:", conversationId, label);
  };

  // Render empty state when not connected
  if (!isConnected) {
    return (
      <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
        <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, height: "100%" }}>
          {/* Email Sidebar */}
          <div style={{ width: 260, minWidth: 260, height: "100%" }}>
            <EmailSidebar
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onAccountSelect={selectAccount}
              onAddAccount={() => setShowAuthModal(true)}
              onDisconnectAccount={disconnectAccount}
              onRefresh={refreshAccounts}
              labels={labels}
              systemLabels={systemLabels}
              userLabels={userLabels}
              selectedLabelId={selectedLabelId}
              labelsLoading={labelsLoading}
              labelsError={labelsError}
              onLabelSelect={selectLabel}
              onSearch={onSearch}
              searchQuery={searchQuery}
            />
          </div>

          {/* Empty state for conversations */}
          <div style={{ width: 320, minWidth: 320, height: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #EAECF0",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Typography variant="h6" sx={{ color: "#6B7280" }}>
                  Connect an account
                </Typography>
                <Typography variant="body2" sx={{ color: "#9CA3AF", textAlign: "center" }}>
                  Add an email account to view conversations
                </Typography>
              </Stack>
            </Paper>
          </div>

          {/* Empty state for message viewer */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #EAECF0",
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100%",
            }}
          >
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FrontdeskEmptyState
                title="No email account connected"
                subtitle="Connect your email account to start managing messages"
              />
            </Box>
          </Paper>
        </Stack>

        <EmailAuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticate={handleAuthenticate}
          error={authError}
        />
      </Stack>
    );
  }

  return (
    <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
      <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, height: "100%" }}>
        {/* Email Sidebar */}
        <div style={{ width: 260, minWidth: 260, height: "100%" }}>
          <EmailSidebar
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSelect={selectAccount}
            onAddAccount={() => setShowAuthModal(true)}
            onDisconnectAccount={disconnectAccount}
            onRefresh={refreshAccounts}
            labels={labels}
            systemLabels={systemLabels}
            userLabels={userLabels}
            selectedLabelId={selectedLabelId}
            labelsLoading={labelsLoading}
            labelsError={labelsError}
            onLabelSelect={selectLabel}
            onSearch={onSearch}
            searchQuery={searchQuery}
          />
        </div>

        {/* Conversations List */}
        <div style={{ width: 320, minWidth: 320, height: "100%" }}>
          {selectedAccountId ? (
            <EmailConversationList
              conversations={conversations}
              selectedConversationId={selectedConversation?.id}
              onConversationSelect={handleConversationSelect}
              loading={conversationsLoading}
              error={conversationsError}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onRefresh={refresh}
              selectedLabel={selectedLabel}
            />
          ) : (
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #EAECF0",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Typography variant="h6" sx={{ color: "#6B7280" }}>
                  Select an account
                </Typography>
                <Typography variant="body2" sx={{ color: "#9CA3AF", textAlign: "center" }}>
                  Choose an email account to view conversations
                </Typography>
              </Stack>
            </Paper>
          )}
        </div>

        {/* Message Viewer */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            border: "1px solid #EAECF0",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100%",
          }}
        >
          {selectedConversation ? (
            <EmailMessageViewer
              conversation={selectedConversation}
              accountId={selectedAccountId}
              onBack={handleBack}
              onReply={handleReply}
              onReplyAll={handleReplyAll}
              onForward={handleForward}
              onDelete={deleteConversation}
              onArchive={archiveConversation}
              onStar={starConversation}
              onPrint={handlePrint}
              onAddLabel={handleAddLabel}
              onSendReply={handleInlineReply}
              isSending={isSending}
            />
          ) : (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FrontdeskEmptyState
                title="No conversation selected"
                subtitle="Choose a conversation from the list to start viewing messages"
              />
            </Box>
          )}
        </Paper>
      </Stack>

      {/* Compose Button - Floating Action Button */}
      {isConnected && selectedAccountId && (
        <Tooltip title="Compose new email" placement="left">
          <Fab
            color="primary"
            onClick={handleCompose}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              backgroundColor: primaryColor(600),
              "&:hover": {
                backgroundColor: primaryColor(700),
              },
            }}
          >
            <ComposeIcon />
          </Fab>
        </Tooltip>
      )}

      {/* Composer Modal - Only for new messages */}
      <EmailComposer
        open={showComposer}
        onClose={handleCloseComposer}
        onSend={handleSendEmail}
        draft={composerDraft || undefined}
        isSending={isSending}
      />

      <EmailAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticate={handleAuthenticate}
        error={authError}
      />
    </Stack>
  );
};
