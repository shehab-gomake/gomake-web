import React from "react";
import { Stack, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type Props = {
  onRefresh?: () => void;
  onMarkRead?: () => void;
  onArchive?: () => void;
  onMore?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: "small" | "medium";
  dense?: boolean;
};

export const ConversationToolbar: React.FC<Props> = ({
  onRefresh,
  onMarkRead,
  onArchive,
  onMore,
  size = "small",
  dense = true,
}) => {
  return (
    <div style={{ padding: dense ? 8 : 12, borderBottom: '1px solid #EAECF0' }}>
      <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={0.5}>
        <IconButton aria-label="refresh" size={size} onClick={onRefresh}>
          <RefreshIcon fontSize={size === 'small' ? 'small' : 'medium'} />
        </IconButton>
        <IconButton aria-label="mark-read" size={size} onClick={onMarkRead}>
          <MarkEmailReadOutlinedIcon fontSize={size === 'small' ? 'small' : 'medium'} />
        </IconButton>
        <IconButton aria-label="archive" size={size} onClick={onArchive}>
          <ArchiveOutlinedIcon fontSize={size === 'small' ? 'small' : 'medium'} />
        </IconButton>
        <IconButton aria-label="more" size={size} onClick={onMore}>
          <MoreVertIcon fontSize={size === 'small' ? 'small' : 'medium'} />
        </IconButton>
      </Stack>
    </div>
  );
};

