import React, { useMemo, useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { GmailInboxList, MailItem } from "@/widgets/frontdesk/components/gmail-inbox-list";

const GmailInboxView: React.FC = () => {
  const [selected, setSelected] = useState<MailItem | null>(null);
  const { neutralColor, primaryColor } = useGomakeTheme();

  const getInitials = useMemo(
    () => (name: string) =>
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    []
  );

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
            {/* Toolbar inside preview */}
            <div style={{ padding: 12, borderBottom: '1px solid #EAECF0' }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <TextField
                  size="small"
                  placeholder="Search mail"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: neutralColor(500) }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton aria-label="refresh">
                  <RefreshIcon />
                </IconButton>
                <IconButton aria-label="mark-read">
                  <MarkEmailReadOutlinedIcon />
                </IconButton>
                <IconButton aria-label="archive">
                  <ArchiveOutlinedIcon />
                </IconButton>
                <IconButton aria-label="more">
                  <MoreVertIcon />
                </IconButton>
              </Stack>
            </div>

            {/* Preview header */}
            <div style={{ padding: 16 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selected.subject}
                </Typography>
                <Typography variant="caption" color={neutralColor(600)}>
                  {selected.receivedAt}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: neutralColor(200), color: neutralColor(700) }}>
                  {getInitials(selected.from)}
                </Avatar>
                <Stack>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {selected.from}
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Chip size="small" label="Inbox" sx={{ bgcolor: primaryColor(50), color: primaryColor(700) }} />
                  </Stack>
                </Stack>
              </Stack>
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
    </Stack>
  );
};

export { GmailInboxView };
