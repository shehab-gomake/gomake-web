import React, { useEffect, useState } from "react";
import { Stack, Paper, Typography, Divider, Button, Alert, Box } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { ConversationToolbar } from "@/widgets/frontdesk/components/conversation/conversation-toolbar";
import { ConversationHeader } from "@/widgets/frontdesk/components/conversation/conversation-header";
import { ConversationThread } from "@/widgets/frontdesk/components/conversation/conversation-thread";
import { ConversationReplyBox } from "@/widgets/frontdesk/components/conversation/conversation-reply-box";
import { ConversationMessage } from "@/widgets/frontdesk/components/conversation/conversation-types";
import { FrontdeskEmptyState } from "@/widgets/frontdesk/components/empty-state";
import { ConversationItem } from "./provider-types";

interface BaseProviderViewProps {
  providerName: string;
  providerIcon: React.ReactNode;
  connectionEmail?: string;
  isConnected: boolean;
  isLoading?: boolean;
  onOpenSettings: () => void;
  onConnect: () => void;

  conversations: ConversationItem[];
  conversationsLoading?: boolean;
  conversationsError?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;

  selectedConversation?: any;
  onSelectConversation: (item: ConversationItem) => void;
  onFetchDetail?: (id: string) => void;

  messages: ConversationMessage[];
  onSendReply: (text: string) => Promise<boolean>;
  isSending?: boolean;

  conversationListComponent: React.ReactNode;
  authModalComponent: React.ReactNode;
}

export const BaseProviderView: React.FC<BaseProviderViewProps> = ({
  providerName,
  providerIcon,
  connectionEmail,
  isConnected,
  isLoading = false,
  onOpenSettings,
  onConnect,

  conversations,
  selectedConversation,
  onSelectConversation,
  onFetchDetail,

  messages,
  onSendReply,
  isSending = false,

  conversationListComponent,
  authModalComponent,
}) => {
  const [selected, setSelected] = useState<ConversationItem | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (selected?.id && onFetchDetail) {
      onFetchDetail(selected.id);
    }
    setDraft("");
  }, [selected, onFetchDetail]);

  const handleSelect = (item: ConversationItem) => {
    setSelected(item);
    onSelectConversation(item);
  };

  const handleSendReply = async () => {
    const text = draft.trim();
    if (!text || !selected) return;

    const success = await onSendReply(text);
    if (success) {
      setDraft("");
    }
  };

  if (!isConnected) {
    return (
      <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
        <Alert
          severity="info"
          action={
            <Button
              size="small"
              variant="outlined"
              onClick={onConnect}
              startIcon={<SettingsIcon />}
              disabled={isLoading}
            >
              Connect {providerName}
            </Button>
          }
        >
          Connect your {providerName} account to manage messages from the front desk
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
            <FrontdeskEmptyState
              title={`${providerName} Not Connected`}
              subtitle={`Connect your ${providerName} account to start managing messages`}
            />
            <Button variant="contained" startIcon={providerIcon} onClick={onConnect} disabled={isLoading}>
              Connect {providerName} Account
            </Button>
          </Stack>
        </Paper>

        {authModalComponent}
      </Stack>
    );
  }

  return (
    <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
      {connectionEmail && (
        <Alert
          severity="success"
          action={
            <Button size="small" variant="text" onClick={onOpenSettings} startIcon={<SettingsIcon />}>
              Settings
            </Button>
          }
        >
          {providerName} connected: {connectionEmail}
        </Alert>
      )}

      <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, height: "100%" }}>
        <div style={{ width: 360, minWidth: 320, height: "100%" }}>
          {conversationListComponent}
        </div>

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
              <ConversationToolbar />
              <ConversationHeader
                subject={selected.subject}
                fromName={selected.from}
                receivedAt={selected.receivedAt}
                label="Inbox"
              />
              <Divider />
              <ConversationThread messages={messages} themLabel={selected.from} />
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

      {authModalComponent}
    </Stack>
  );
};