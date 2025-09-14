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
import { useGomakeAxios } from "@/hooks";
import { getGmailInboxApi } from "@/services/api-service/frontdesk/frontdesk-endpoints";

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

interface GmailInboxListProps {
  onSelect?: (mail: MailItem) => void;
  onLoaded?: (mails: MailItem[]) => void;
  selectedId?: string;
}

const GmailInboxList: React.FC<GmailInboxListProps> = ({ onSelect, onLoaded, selectedId }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const { callApi } = useGomakeAxios();

  const mockMails: MailItem[] = useMemo(
    () => [
      {
        id: "1",
        from: "John Doe",
        subject: "Order status inquiry",
        snippet: "Hi, could you update me on order #123...",
        receivedAt: "09:42",
        unread: true,
        body: "Hi, could you update me on order #123? We'd like to confirm delivery time and packaging details. Thanks!",
      },
      {
        id: "2",
        from: "Acme Corp",
        subject: "Invoice #4532",
        snippet: "Please find attached invoice #4532...",
        receivedAt: "09:21",
        body: "Attached is invoice #4532 for your records. Please let us know if you need any changes.",
      },
      {
        id: "3",
        from: "Jane Smith",
        subject: "Quote follow-up",
        snippet: "Circling back on the quote we discussed...",
        receivedAt: "08:55",
        unread: true,
        body: "Just following up to see if you had any questions about the quote I sent last week.",
      },
      { id: "4", from: "Support Bot", subject: "Daily summary", snippet: "Today you have 5 tasks due...", receivedAt: "08:01", body: "Here is your daily summary. You have 5 tasks due today and 3 pending approvals." },
      { id: "5", from: "Widgets Inc.", subject: "PO Confirmation", snippet: "Your PO has been approved...", receivedAt: "07:45", body: "Your PO has been approved and is now being processed." },
      { id: "6", from: "Mary Johnson", subject: "Artwork approval", snippet: "Attached is the final artwork...", receivedAt: "07:12", body: "Please review the attached final artwork and confirm." },
      { id: "7", from: "No-Reply", subject: "Password reset", snippet: "Click here to reset your password...", receivedAt: "06:38", body: "To reset your password, click the link below." },
      { id: "8", from: "Sales Team", subject: "New lead assigned", snippet: "A new lead has been assigned...", receivedAt: "06:10", unread: true, body: "A new lead has been assigned to you. Please review and follow up." },
      { id: "9", from: "Printing House", subject: "Material update", snippet: "We have updated material pricing...", receivedAt: "05:55", body: "We have updated our material pricing effective next month." },
      { id: "10", from: "Billing", subject: "Payment received", snippet: "Payment for invoice #4532 received...", receivedAt: "05:30", body: "Payment for invoice #4532 has been received. Thank you!" },
    ],
    []
  );

  const [mails, setMails] = useState<MailItem[]>(mockMails);

  useEffect(() => {
    const fetchMails = async () => {
      const callback = (res) => {
        if (res.success && Array.isArray(res?.data)) {
          // Expecting an array of items; map to MailItem shape if needed
          const normalized: MailItem[] = res.data.slice(0, 10).map((it: any, idx: number) => ({
            id: String(it.id ?? idx),
            from: String(it.from ?? it.sender ?? "Unknown"),
            subject: String(it.subject ?? "(no subject)"),
            snippet: String(it.snippet ?? it.preview ?? ""),
            receivedAt: String(it.receivedAt ?? it.date ?? ""),
            unread: Boolean(it.unread ?? false),
            body: String(it.body ?? it.text ?? ""),
          }));
          setMails(normalized);
          onLoaded?.(normalized);
          if (normalized.length && !selectedId) onSelect?.(normalized[0]);
        } else {
          // Keep mock data if API fails or shape unexpected
          setMails(mockMails);
          onLoaded?.(mockMails);
          if (mockMails.length && !selectedId) onSelect?.(mockMails[0]);
        }
      };
      try {
        await getGmailInboxApi(callApi, callback, { limit: 10 });
      } catch {
        setMails(mockMails);
        onLoaded?.(mockMails);
        if (mockMails.length && !selectedId) onSelect?.(mockMails[0]);
      }
    };
    fetchMails();
  }, [callApi, mockMails]);

  return (
    <Paper elevation={0} sx={{ border: "1px solid #EAECF0", borderRadius: 2, overflow: "hidden" }}>
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
    </Paper>
  );
};

export { GmailInboxList };
