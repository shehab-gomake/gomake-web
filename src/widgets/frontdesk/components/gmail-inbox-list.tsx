import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useGmailConversations, GmailConversation } from "@/hooks/use-gmail-conversations";
import { FrontdeskLoading } from "./loading-spinner";

export type MailItem = {
  id: string;
  from: string;
  subject: string;
  snippet?: string;
  receivedAt: string; // mock string timestamp
  unread?: boolean;
  body?: string;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const parseFromField = (fromField: string): string => {
  // Extract name from email format like "John Doe <john@example.com>"
  const match = fromField.match(/^(.*?)\s*<.*>$/);
  return match ? match[1].trim().replace(/"/g, '') : fromField;
};

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(parseInt(timestamp));
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  } catch {
    return timestamp;
  }
};

const decodeHtmlEntities = (str: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

const mapConversationToMailItem = (conversation: GmailConversation): MailItem => ({
  id: conversation.id,
  from: parseFromField(conversation.from),
  subject: conversation.subject,
  snippet: decodeHtmlEntities(conversation.snippet),
  receivedAt: formatTimestamp(conversation.latestDate),
  unread: conversation.hasUnread,
  body: decodeHtmlEntities(conversation.snippet), // Use snippet as body for now
});

interface GmailInboxListProps {
  onSelect?: (mail: MailItem) => void;
  onLoaded?: (mails: MailItem[]) => void;
  selectedId?: string;
}

const GmailInboxList: React.FC<GmailInboxListProps> = ({ onSelect, onLoaded, selectedId }) => {
  console.log('📧 GmailInboxList component rendered'); // Debug log

  const { primaryColor, neutralColor, secondColor } = useGomakeTheme();
  const { conversations, loading, error } = useGmailConversations();

  const mails: MailItem[] = useMemo(() => {
    console.log('Gmail conversations state:', { conversations, error, loading }); // Debug log

    if (!conversations || conversations.length === 0) {
      return [];
    }

    console.log('Mapping conversations to mail items:', conversations); // Debug log
    return conversations.map(mapConversationToMailItem);
  }, [conversations, error, loading]);

  useEffect(() => {
    if (mails.length > 0) {
      onLoaded?.(mails);
      if (!selectedId) {
        onSelect?.(mails[0]);
      }
    }
  }, [mails, selectedId, onLoaded, onSelect]);

  if (loading) {
    return (
      <Paper elevation={0} sx={{ border: "1px solid #EAECF0", borderRadius: 2, overflow: "hidden" }}>
        <FrontdeskLoading label="Loading conversations..." />
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: "1px solid #EAECF0", borderRadius: 2, overflow: "hidden" }}>
      {mails.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <Typography variant="body2" color="text.secondary">No conversations found</Typography>
        </Stack>
      ) : (
        <List disablePadding className="custom-scrollbar">
          {mails.map((mail, idx) => (
            <React.Fragment key={mail.id}>
              <ListItem disableGutters sx={{ px: 0 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                    gap: 1,
                    bgcolor: mail.unread ? primaryColor(50) : "transparent",
                    "&:hover": { bgcolor: primaryColor(100) },
                    "&.Mui-selected": {
                      bgcolor: primaryColor(100),
                      boxShadow: `inset 3px 0 0 ${secondColor(500)}`,
                    },
                  }}
                  selected={selectedId === mail.id}
                  onClick={() => onSelect?.(mail)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: neutralColor(200), color: neutralColor(700) }}>
                      {getInitials(mail.from)}
                    </Avatar>
                  </ListItemAvatar>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" gap={1}
                         sx={{ minWidth: 0 }}>
                    <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: mail.unread ? 700 : 500 }} noWrap>
                        {mail.from}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#475467", fontWeight: mail.unread ? 600 : 400 }} noWrap>
                        {mail.subject}
                      </Typography>
                      {!!mail.snippet && (
                        <Typography variant="caption" sx={{ color: "#667085" }} noWrap>
                          {mail.snippet}
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="caption" sx={{ color: "#667085", whiteSpace: "nowrap" }}>
                      {mail.receivedAt}
                    </Typography>
                  </Stack>
                </ListItemButton>
              </ListItem>
              {idx < mails.length - 1 && <Divider component="li" sx={{ ml: 7 }} />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export { GmailInboxList };
