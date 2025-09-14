import React, { useEffect, useState } from "react";
import { Stack, Paper, Typography, Divider } from "@mui/material";
import { GmailInboxList, MailItem } from "@/widgets/frontdesk/components/gmail-inbox-list";
import { ConversationToolbar } from "@/widgets/frontdesk/components/conversation/conversation-toolbar";
import { ConversationHeader } from "@/widgets/frontdesk/components/conversation/conversation-header";
import { ConversationThread } from "@/widgets/frontdesk/components/conversation/conversation-thread";
import { ConversationReplyBox } from "@/widgets/frontdesk/components/conversation/conversation-reply-box";
import { ConversationMessage } from "@/widgets/frontdesk/components/conversation/conversation-types";

const GmailInboxView: React.FC = () => {
  const [selected, setSelected] = useState<MailItem | null>(null);

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");

  // Reset mock conversation whenever a new email is selected
  useEffect(() => {
    if (!selected) {
      setMessages([]);
      return;
    }
    const initial: ConversationMessage[] = [
      {
        id: "m1",
        from: "them",
        text: selected.body?.slice(0, 160) || selected.snippet || "Hi there! I had a quick question about my booking.",
        at: selected.receivedAt || "10:05 AM",
      },
      {
        id: "m2",
        from: "me",
        text: "Hello! Sure—happy to help. What do you need?",
        at: "10:07 AM",
      },
    ];
    setMessages(initial);
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
    <Stack sx={{ width: "100%", gap: 2, minHeight: 520 }}>
      {/* Two-pane area */}
      <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, minHeight: 420 }}>
        {/* Left: mail list */}
        <div style={{ width: 360, minWidth: 320 }}>
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
            <div style={{ padding: 16 }}>
              <Typography variant="body2" color="#667085">
                Select an email to preview
              </Typography>
            </div>
          )}
        </Paper>
      </Stack>
    </Stack>
  );
};

export { GmailInboxView };
