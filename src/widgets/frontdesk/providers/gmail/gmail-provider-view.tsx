import React, { useEffect, useState } from "react";
import { Stack, Paper, Typography, Button, Alert, Box } from "@mui/material";
import { Email as EmailIcon, Settings as SettingsIcon, Chat as ChatIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { GmailConversationList, MailItem } from "@/widgets/frontdesk/providers/gmail/gmail-conversation-list";
import { ConversationHeader } from "@/widgets/frontdesk/components/conversation/conversation-header";
import { ConversationMessage } from "@/widgets/frontdesk/components/conversation/conversation-types";
import { GmailAuthModal } from "@/widgets/frontdesk/providers/gmail/gmail-auth-modal";
import { GmailSidebar } from "@/widgets/frontdesk/providers/gmail/components/gmail-sidebar";
import { GmailMessageList } from "@/widgets/frontdesk/providers/gmail/components/gmail-message-list";
import { GmailCompose } from "@/widgets/frontdesk/providers/gmail/components/gmail-compose";
import { GmailInfoPanel } from "@/widgets/frontdesk/providers/gmail/components/gmail-info-panel";
import { useGmailAuth, useGmailConversationDetail, useGmailSend } from "@/hooks/frontdesk/providers/gmail";
import { useRecoilState } from "recoil";
import { gmailUIState } from "@/store/frontdesk/providers/gmail";

const GmailProviderView: React.FC = () => {
  console.log('📬 GmailProviderView component rendered'); // Debug log

  const { connectionState, isConnected, isLoading } = useGmailAuth();
  const { selectedConversation, fetchConversationDetail, clearSelectedConversation } = useGmailConversationDetail();
  const { sendReply, isSending } = useGmailSend();
  const [uiState, setUIState] = useRecoilState(gmailUIState);

  const [selected, setSelected] = useState<MailItem | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [activeFolderId, setActiveFolderId] = useState<string>('INBOX');

  // Load conversation details when selection changes
  useEffect(() => {
    if (selected?.id) {
      fetchConversationDetail(selected.id);
    } else {
      clearSelectedConversation();
    }
    setDraft("");
  }, [selected, fetchConversationDetail, clearSelectedConversation]);

  // Update messages when conversation details are loaded
  useEffect(() => {
    if (selectedConversation?.messages) {
      const conversationMessages: ConversationMessage[] = selectedConversation.messages.map((msg) => ({
        id: msg.id,
        from: msg.from === connectionState.email ? "me" : "them",
        text: msg.body || msg.snippet,
        at: new Date(msg.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
      setMessages(conversationMessages);
    } else {
      setMessages([]);
    }
  }, [selectedConversation, connectionState.email]);

  const handleSendReply = async (text: string): Promise<void> => {
    if (!text.trim() || !selected || !selectedConversation) return;

    const lastMessage = selectedConversation.messages[selectedConversation.messages.length - 1];
    const success = await sendReply({
      to: lastMessage.from,
      subject: lastMessage.subject,
      text,
      replyToMessageId: lastMessage.messageId,
    });

    if (success) {
      // Add the sent message to the thread immediately for better UX
      const newMsg: ConversationMessage = {
        id: `m-${Date.now()}`,
        from: "me",
        text,
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newMsg]);
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setActiveFolderId(folderId);
    // TODO: Filter conversations by folder/label
    console.log('Selected folder:', folderId);
  };

  const openAuthModal = () => {
    setUIState(prev => ({ ...prev, showAuthModal: true }));
  };

  const closeAuthModal = () => {
    setUIState(prev => ({ ...prev, showAuthModal: false }));
  };

  const handleRetryConnection = () => {
    // TODO: Implement retry logic
    console.log('Retrying Gmail connection...');
  };

  // Connection error state
  if (!isConnected && !isLoading) {
    return (
      <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
        <Alert
          severity="error"
          action={
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleRetryConnection}
                startIcon={<RefreshIcon />}
                disabled={isLoading}
              >
                Retry
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={openAuthModal}
                startIcon={<SettingsIcon />}
              >
                Connect Gmail
              </Button>
            </Stack>
          }
        >
          Connect your Gmail account to manage emails from the front desk
        </Alert>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            border: "1px solid #EAECF0",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <ChatIcon sx={{ fontSize: 64, color: '#D1D5DB' }} />
            <Typography variant="h6" sx={{ color: '#6B7280' }}>
              Gmail Not Connected
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center' }}>
              Connect your Gmail account to start managing emails from the front desk
            </Typography>
            <Button
              variant="contained"
              onClick={openAuthModal}
              startIcon={<EmailIcon />}
              disabled={isLoading}
            >
              Connect Gmail Account
            </Button>
          </Stack>
        </Paper>

        <GmailAuthModal open={uiState.showAuthModal} onClose={closeAuthModal} />
      </Stack>
    );
  }

  // Connecting state
  if (isLoading) {
    return (
      <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
        <Alert severity="info">
          Connecting to Gmail...
        </Alert>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            border: "1px solid #EAECF0",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <ChatIcon sx={{ fontSize: 64, color: '#D1D5DB' }} />
            <Typography variant="h6" sx={{ color: '#6B7280' }}>
              Connecting...
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              Establishing connection to Gmail
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
      {/* Connection status */}
      <Alert
        severity={isConnected ? "success" : "warning"}
        action={
          <Button
            size="small"
            variant="outlined"
            onClick={openAuthModal}
            startIcon={<SettingsIcon />}
            disabled={isLoading}
          >
            Settings
          </Button>
        }
      >
        {isConnected
          ? `Gmail connected: ${connectionState.email || 'Connected'}`
          : 'Gmail connection required'
        }
      </Alert>

      {/* Three-pane layout */}
      <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, height: "100%" }}>
        {/* Left: Gmail sidebar */}
        <div style={{ width: 280, minWidth: 280, height: "100%" }}>
          <GmailSidebar
            activeFolderId={activeFolderId}
            onFolderSelect={handleFolderSelect}
            onSettingsClick={openAuthModal}
          />
        </div>

        {/* Center: Message area */}
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
          {selected ? (
            <>
              {/* Message header */}
              <Box sx={{ p: 2, borderBottom: '1px solid #EAECF0' }}>
                <ConversationHeader
                  subject={selected.subject}
                  fromName={selected.from}
                  receivedAt={selected.receivedAt}
                  label={activeFolderId}
                />
              </Box>

              {/* Messages */}
              <GmailMessageList
                messages={messages}
                currentUserEmail={connectionState.email}
                senderName={selected.from}
              />

              {/* Compose area */}
              <GmailCompose
                value={draft}
                onChange={setDraft}
                onSend={handleSendReply}
                placeholder={`Reply to ${selected.from}`}
                disabled={false}
                isSending={isSending}
              />
            </>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stack alignItems="center" spacing={2}>
                <ChatIcon sx={{ fontSize: 64, color: '#D1D5DB' }} />
                <Typography variant="h6" sx={{ color: '#6B7280' }}>
                  Select an email
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center' }}>
                  Choose an email from your {activeFolderId.toLowerCase()} to start reading
                </Typography>
              </Stack>
            </Box>
          )}
        </Paper>

        {/* Right: Contact info panel */}
        <div style={{ width: 240, minWidth: 240, height: "100%" }}>
          <GmailInfoPanel
            selectedEmail={selected ? {
              from: selected.from,
              subject: selected.subject,
              receivedAt: selected.receivedAt
            } : undefined}
            onStar={() => console.log('Star email')}
            onArchive={() => console.log('Archive email')}
            onDelete={() => console.log('Delete email')}
            onMarkAsSpam={() => console.log('Mark as spam')}
          />
        </div>
      </Stack>

      {/* Hidden conversation list for data fetching */}
      <Box sx={{ display: 'none' }}>
        <GmailConversationList
          onSelect={setSelected}
          selectedId={selected?.id}
          onLoaded={(items) => {
            if (!selected && items?.length) setSelected(items[0]);
          }}
        />
      </Box>

      {/* Auth Modal */}
      <GmailAuthModal open={uiState.showAuthModal} onClose={closeAuthModal} />
    </Stack>
  );
};

export { GmailProviderView };
