import React, { useState } from "react";
import { Stack, Paper, Typography, Divider } from "@mui/material";
import { GmailInboxList, MailItem } from "@/widgets/frontdesk/components/gmail-inbox-list";

const GmailInboxView: React.FC = () => {
  const [selected, setSelected] = useState<MailItem | null>(null);

  return (
    <Stack direction="row" gap={2} sx={{ width: "100%", minHeight: 420 }}>
      {/* Left: mail list */}
      <div style={{ width: 380, minWidth: 320 }}>
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
            <div style={{ padding: 16 }}>
              <Typography variant="subtitle2" color="#667085">
                From
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {selected.from}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle2" color="#667085">
                Subject
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {selected.subject}
              </Typography>
              <Typography variant="caption" color="#667085">
                {selected.receivedAt}
              </Typography>
            </div>
            <Divider />
            <div style={{ padding: 16, whiteSpace: "pre-wrap", overflow: "auto" }} className="custom-scrollbar">
              <Typography variant="body2">{selected.body || selected.snippet}</Typography>
            </div>
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
  );
};

export { GmailInboxView };
