import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Collapse,
} from "@mui/material";
import {
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Label as LabelIcon,
  Schedule as ScheduleIcon,
  AttachFile as AttachIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Block as BlockIcon,
  Report as ReportIcon,
} from "@mui/icons-material";
import { EmailMessage, EmailThread } from "../types/email.types";
import { format, formatDistanceToNow } from "date-fns";

interface EmailInfoPanelProps {
  email?: EmailMessage | EmailThread;
  onClose?: () => void;
  onStar?: (starred: boolean) => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onMarkSpam?: () => void;
  onAddLabel?: (label: string) => void;
}

export const EmailInfoPanel: React.FC<EmailInfoPanelProps> = ({
  email,
  onClose,
  onStar,
  onArchive,
  onDelete,
  onMarkSpam,
  onAddLabel,
}) => {
  const [detailsExpanded, setDetailsExpanded] = React.useState(true);
  const [attachmentsExpanded, setAttachmentsExpanded] = React.useState(true);
  const [actionsExpanded, setActionsExpanded] = React.useState(false);

  if (!email) {
    return (
      <Paper
        elevation={0}
        sx={{
          width: 240,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Select an email to view details
        </Typography>
      </Paper>
    );
  }

  const isThread = "messages" in email;
  const message = isThread ? email.messages[email.messages.length - 1] : email as EmailMessage;

  return (
    <Paper
      elevation={0}
      sx={{
        width: 240,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight="bold">
            Details
          </Typography>
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {/* Quick Actions */}
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <IconButton
              size="small"
              onClick={() => onStar?.(!message.isStarred)}
              sx={{
                backgroundColor: "action.hover",
                "&:hover": { backgroundColor: "action.selected" },
              }}
            >
              {message.isStarred ? (
                <StarIcon sx={{ fontSize: 18, color: "warning.main" }} />
              ) : (
                <StarBorderIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
            <IconButton
              size="small"
              onClick={onArchive}
              sx={{
                backgroundColor: "action.hover",
                "&:hover": { backgroundColor: "action.selected" },
              }}
            >
              <ArchiveIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                backgroundColor: "action.hover",
                "&:hover": { backgroundColor: "action.selected" },
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={onMarkSpam}
              sx={{
                backgroundColor: "action.hover",
                "&:hover": { backgroundColor: "action.selected" },
              }}
            >
              <ReportIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        {/* Email Details */}
        <Box>
          <ListItemButton
            onClick={() => setDetailsExpanded(!detailsExpanded)}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemText
              primary={
                <Typography variant="subtitle2" fontWeight="medium">
                  Details
                </Typography>
              }
            />
            {detailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>

          <Collapse in={detailsExpanded}>
            <Box sx={{ px: 2, pb: 2 }}>
              {/* From */}
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    From
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                      {message.from.name?.[0] || message.from.email[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {message.from.name || message.from.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {message.from.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* To */}
                {message.to.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      To
                    </Typography>
                    <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                      {message.to.slice(0, 3).map((recipient, index) => (
                        <Typography key={index} variant="body2" noWrap>
                          {recipient.name || recipient.email}
                        </Typography>
                      ))}
                      {message.to.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{message.to.length - 3} more
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}

                {/* Date */}
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(message.createdAt), "MMM d, yyyy h:mm a")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </Typography>
                </Box>

                {/* Labels */}
                {message.labels && message.labels.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Labels
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                      {message.labels.map((label) => (
                        <Chip
                          key={label}
                          label={label}
                          size="small"
                          icon={<LabelIcon />}
                          sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Thread Info */}
                {isThread && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Thread
                    </Typography>
                    <Typography variant="body2">
                      {email.messages.length} messages
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Collapse>
        </Box>

        <Divider />

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <>
            <Box>
              <ListItemButton
                onClick={() => setAttachmentsExpanded(!attachmentsExpanded)}
                sx={{ py: 1, px: 2 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="medium">
                      Attachments ({message.attachments.length})
                    </Typography>
                  }
                />
                {attachmentsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>

              <Collapse in={attachmentsExpanded}>
                <List dense sx={{ px: 2, pb: 2 }}>
                  {message.attachments.map((attachment) => (
                    <ListItem
                      key={attachment.id}
                      disablePadding
                      sx={{
                        py: 0.5,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "action.hover" },
                        borderRadius: 1,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <AttachIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" noWrap>
                              {attachment.filename}
                            </Typography>
                          </Stack>
                        }
                        secondary={`${(attachment.size / 1024).toFixed(1)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
            <Divider />
          </>
        )}

        {/* Advanced Actions */}
        <Box>
          <ListItemButton
            onClick={() => setActionsExpanded(!actionsExpanded)}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemText
              primary={
                <Typography variant="subtitle2" fontWeight="medium">
                  Actions
                </Typography>
              }
            />
            {actionsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>

          <Collapse in={actionsExpanded}>
            <Stack sx={{ p: 2, pt: 0 }} spacing={1}>
              <Button
                size="small"
                fullWidth
                variant="outlined"
                startIcon={<ScheduleIcon />}
                sx={{ justifyContent: "flex-start" }}
              >
                Snooze
              </Button>
              <Button
                size="small"
                fullWidth
                variant="outlined"
                startIcon={<LabelIcon />}
                sx={{ justifyContent: "flex-start" }}
                onClick={() => onAddLabel?.("Important")}
              >
                Add Label
              </Button>
              <Button
                size="small"
                fullWidth
                variant="outlined"
                startIcon={<PersonIcon />}
                sx={{ justifyContent: "flex-start" }}
              >
                Create Contact
              </Button>
              <Button
                size="small"
                fullWidth
                variant="outlined"
                startIcon={<BlockIcon />}
                sx={{ justifyContent: "flex-start" }}
              >
                Block Sender
              </Button>
            </Stack>
          </Collapse>
        </Box>
      </Box>
    </Paper>
  );
};