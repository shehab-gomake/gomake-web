import React, { useState } from "react";
import { Stack, Paper, Divider } from "@mui/material";
import { ConversationToolbar } from "@/widgets/frontdesk/components/conversation/conversation-toolbar";
import { ConversationHeader } from "@/widgets/frontdesk/components/conversation/conversation-header";
import { ConversationThread } from "@/widgets/frontdesk/components/conversation/conversation-thread";
import { ConversationReplyBox } from "@/widgets/frontdesk/components/conversation/conversation-reply-box";
import { FrontdeskEmptyState } from "@/widgets/frontdesk/components/empty-state";
import { WhatsAppConversationList } from "./components/whatsapp-conversation-list";
import { useWhatsAppProvider } from "./hooks/use-whatsapp-provider";

const WhatsAppProviderView: React.FC = () => {
  const {
    isConnected,
    conversations,
    conversationsLoading,
    hasMore,
    loadMore,
    refresh,
    selectedConversation,
    handleConversationSelect,
    handleBack,
    messages,
    isSending,
    handleSendReply,
    searchQuery,
    onSearch,
  } = useWhatsAppProvider();

  const [draft, setDraft] = useState("");

  return (
    <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
      <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, height: "100%" }}>
        <div style={{ width: 360, minWidth: 320, height: "100%" }}>
          <WhatsAppConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            loading={conversationsLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onRefresh={refresh}
            onSearch={onSearch}
            searchQuery={searchQuery}
            onSelect={handleConversationSelect}
          />
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
          {selectedConversation ? (
            <>
              <ConversationToolbar onRefresh={refresh} />
              <ConversationHeader
                subject={selectedConversation.subject}
                fromName={selectedConversation.from}
                receivedAt={selectedConversation.receivedAt}
                label="WhatsApp"
              />
              <Divider />
              <ConversationThread messages={messages} themLabel={selectedConversation.from} />
              <Divider />
              <ConversationReplyBox
                placeholder="Message on WhatsApp"
                value={draft}
                onChange={setDraft}
                onSend={
                  isSending
                    ? () => {}
                    : async () => {
                        const ok = await handleSendReply(draft);
                        if (ok) setDraft("");
                      }
                }
              />
            </>
          ) : (
            <FrontdeskEmptyState title="No conversation selected" subtitle="Choose a conversation to preview" />
          )}
        </Paper>
      </Stack>
    </Stack>
  );
};

export { WhatsAppProviderView };
