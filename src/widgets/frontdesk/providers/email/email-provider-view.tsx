import React, { useState } from "react";
import { Stack, Paper, Box, Typography, Fab, Tooltip } from "@mui/material";
import { Edit as ComposeIcon } from "@mui/icons-material";
import {
  EmptyState,
  Panel,
  PanelContent,
} from "@/widgets/frontdesk/design-system";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailComposer } from "./components/email-composer";
import { EmailAuthModal } from "./components/email-auth-modal";
import { EmailSidebar } from "./components/email-sidebar";
import { EmailConversationList } from "./components/email-conversation-list";
import { EmailMessageViewer } from "./components/email-message-viewer";
import { useEmailProvider } from "./hooks/use-email-provider";
import { useFabPositioning } from "@/widgets/frontdesk/hooks/use-fab-positioning";

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
    createTicket,
  } = useEmailProvider();

  const fabPositioning = useFabPositioning({
    isConversationSelected: !!selectedConversation,
    hasMessageInput: !!selectedConversation, // Message input (reply box) is present when conversation is selected
  });

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
    // lastMessage.from is now an array, take first sender
    const replyDraft = {
      to: selectedConversation.lastMessage?.from || [],
      cc: replyAll && selectedConversation.lastMessage?.to ? selectedConversation.lastMessage.to : [],
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
  };

  const handlePrint = (conversation: any) => {
    // TODO: Implement print functionality
  };

  const handleAddLabel = (conversationId: string, label: string) => {
    // TODO: Implement add label functionality
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
            />
          </div>

          {/* Empty state for conversations */}
          <div style={{ width: 320, minWidth: 320, height: "100%" }}>
            <Panel elevation={0} border="default">
              <PanelContent padding="lg">
                <EmptyState
                  title="Connect an account"
                  description="Add an email account to view conversations"
                />
              </PanelContent>
            </Panel>
          </div>

          {/* Empty state for message viewer */}
          <Panel
            elevation={0}
            border="default"
            sx={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100%",
            }}
          >
            <PanelContent padding="lg">
              <EmptyState
                title="No email account connected"
                description="Connect your email account to start managing messages"
              />
            </PanelContent>
          </Panel>
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
              onSearch={onSearch}
              searchQuery={searchQuery}
              searchDisabled={conversationsLoading}
            />
          ) : (
            <Panel elevation={0} border="default" sx={{ height: "100%" }}>
              <PanelContent padding="lg">
                <EmptyState
                  title="Select an account"
                  description="Choose an email account to view conversations"
                />
              </PanelContent>
            </Panel>
          )}
        </div>

        {/* Message Viewer */}
        <Panel
          elevation={0}
          border="default"
          sx={{
            flex: 1,
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
              onCreateTicket={createTicket}
              onSendReply={handleInlineReply}
              isSending={isSending}
            />
          ) : (
            <PanelContent padding="lg">
              <EmptyState
                title="No conversation selected"
                description="Choose a conversation from the list to start viewing messages"
              />
            </PanelContent>
          )}
        </Panel>
      </Stack>

      {/* Compose Button - Floating Action Button */}
      {isConnected && selectedAccountId && (
        <Tooltip title="Compose new email" placement="left">
          <Fab
            color="primary"
            onClick={handleCompose}
            sx={{
              ...fabPositioning.sx,
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
