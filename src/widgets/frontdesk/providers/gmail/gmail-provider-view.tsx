import React, { useEffect, useState } from "react";
import { Stack, Paper, Typography, Divider, Button, Alert, Box } from "@mui/material";
import { Email as EmailIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { GmailConversationList, MailItem } from "@/widgets/frontdesk/providers/gmail/gmail-conversation-list";
import { ConversationToolbar } from "@/widgets/frontdesk/components/conversation/conversation-toolbar";
import { ConversationHeader } from "@/widgets/frontdesk/components/conversation/conversation-header";
import { ConversationThread } from "@/widgets/frontdesk/components/conversation/conversation-thread";
import { ConversationReplyBox } from "@/widgets/frontdesk/components/conversation/conversation-reply-box";
import { ConversationMessage } from "@/widgets/frontdesk/components/conversation/conversation-types";
import { FrontdeskEmptyState } from "@/widgets/frontdesk/components/empty-state";
import { GmailAuthModal } from "@/widgets/frontdesk/providers/gmail/gmail-auth-modal";
import { useGmailAuth, useGmailConversationDetail, useGmailSend } from "@/hooks/frontdesk/providers/gmail";
import { useRecoilState } from "recoil";
import { gmailUIState } from "@/store/frontdesk/providers/gmail";
import { DensityToggleIcon } from "@/widgets/frontdesk/components/providers/density-toggle";

const GmailProviderView: React.FC = () => {
  console.log('📬 GmailProviderView component rendered'); // Debug log

  const { connectionState, isConnected, isLoading } = useGmailAuth();
  const { selectedConversation, fetchConversationDetail, clearSelectedConversation } = useGmailConversationDetail();
  const { sendReply, isSending } = useGmailSend();
  const [uiState, setUIState] = useRecoilState(gmailUIState);

  const [selected, setSelected] = useState<MailItem | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");

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

  const handleSendReply = async () => {
    const text = draft.trim();
    if (!text || !selected || !selectedConversation) return;

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
      setDraft("");
    }
  };

  const openAuthModal = () => {
    setUIState(prev => ({ ...prev, showAuthModal: true }));
  };

  const closeAuthModal = () => {
    setUIState(prev => ({ ...prev, showAuthModal: false }));
  };

  // Show connection required state if not connected
  if (!isConnected) {
    return (
      <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
        {/* Connection status */}
        <Alert
          severity="info"
          action={
            <Button
              size="small"
              variant="outlined"
              onClick={openAuthModal}
              startIcon={<SettingsIcon />}
              disabled={isLoading}
            >
              Connect Gmail
            </Button>
          }
        >
          Connect your Gmail account to manage emails from the front desk
        </Alert>

        {/* Empty state */}
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
            <FrontdeskEmptyState
              title="Gmail Not Connected"
              subtitle="Connect your Gmail account to start managing emails"
            />
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={openAuthModal}
              disabled={isLoading}
            >
              Connect Gmail Account
            </Button>
          </Stack>
        </Paper>

        {/* Auth Modal */}
        <GmailAuthModal open={uiState.showAuthModal} onClose={closeAuthModal} />
      </Stack>
    );
  }

  return (
    <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
      {/* Connection status bar */}
      {connectionState.email && (
        <Alert
          severity="success"
          action={
            <Button
              size="small"
              variant="text"
              onClick={openAuthModal}
              startIcon={<SettingsIcon />}
            >
              Settings
            </Button>
          }
        >
          Gmail connected: {connectionState.email}
        </Alert>
      )}

      {/* Two-pane area */}
      <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, height: "100%" }}>
        {/* Left: mail list */}
        <Stack sx={{ width: 360, minWidth: 320, height: "100%" }} spacing={1}>
          {/* Density toggle above the list */}
          <Stack direction="row" justifyContent="flex-end" sx={{ px: 1 }}>
            <DensityToggleIcon />
          </Stack>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <GmailConversationList
              onSelect={setSelected}
              selectedId={selected?.id}
              onLoaded={(items) => {
                if (!selected && items?.length) setSelected(items[0]);
              }}
            />
          </Box>
        </Stack>

        {/* Right: preview */}
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
              {/* Provider-agnostic toolbar (left-aligned) */}
              <ConversationToolbar />

              {/* Header */}
              <ConversationHeader
                subject={selected.subject}
                fromName={selected.from}
                receivedAt={selected.receivedAt}
                label="Inbox"
              />
              <Divider />
              {/* Conversation thread */}
              <ConversationThread messages={messages} themLabel={selected.from} />

              {/* Reply box */}
              <Divider />
              <ConversationReplyBox
                value={draft}
                onChange={setDraft}
                onSend={isSending ? () => {} : handleSendReply}
              />
            </>
          ) : (
            <FrontdeskEmptyState
              title="No conversation selected"
              subtitle="Choose a conversation from the left to preview"
            />
          )}
        </Paper>
      </Stack>

      {/* Auth Modal */}
      <GmailAuthModal open={uiState.showAuthModal} onClose={closeAuthModal} />
    </Stack>
  );
};

export { GmailProviderView };
