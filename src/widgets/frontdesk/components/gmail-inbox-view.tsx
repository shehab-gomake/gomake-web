import React, { useEffect, useState } from "react";
import { Stack, Paper, Typography, Divider } from "@mui/material";
import { GmailInboxList, MailItem } from "@/widgets/frontdesk/components/gmail-inbox-list";
import { ConversationToolbar } from "@/widgets/frontdesk/components/conversation/conversation-toolbar";
import { ConversationHeader } from "@/widgets/frontdesk/components/conversation/conversation-header";
import { ConversationThread } from "@/widgets/frontdesk/components/conversation/conversation-thread";
import { ConversationReplyBox } from "@/widgets/frontdesk/components/conversation/conversation-reply-box";
import { ConversationMessage } from "@/widgets/frontdesk/components/conversation/conversation-types";
import { FrontdeskEmptyState } from "@/widgets/frontdesk/components/empty-state";

const GmailInboxView: React.FC = () => {
  console.log('📬 GmailInboxView component rendered'); // Debug log

  const [selected, setSelected] = useState<MailItem | null>(null);

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");

  // Clear thread when selection changes; real data should populate from API
  useEffect(() => {
    setMessages([]);
    setDraft("");
  }, [selected]);

  const sendReply = () => {
    const text = draft.trim();
    if (!text) return;
    const newMsg: ConversationMessage = {
      id: `m-${Date.now()}`,
      from: "me",
      text,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setDraft("");
  };

  return (
    <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
      {/* Two-pane area */}
      <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, height: "100%" }}>
        {/* Left: mail list */}
        <div style={{ width: 360, minWidth: 320, height: "100%" }}>
          <GmailInboxList
            onSelect={setSelected}
            selectedId={selected?.id}
            onLoaded={(items) => {
              if (!selected && items?.length) setSelected(items[0]);
            }}
          />
        </div>

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
              <ConversationReplyBox value={draft} onChange={setDraft} onSend={sendReply} />
            </>
          ) : (
            <FrontdeskEmptyState
              title="No conversation selected"
              subtitle="Choose a conversation from the left to preview"
            />
          )}
        </Paper>
      </Stack>
    </Stack>
  );
};

export { GmailInboxView };
