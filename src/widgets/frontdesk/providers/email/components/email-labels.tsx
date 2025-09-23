import React from "react";
import { Box, Stack, Typography, List, CircularProgress, Divider, Collapse, IconButton } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailLabel } from "../types/email.types";
import { getLabelIcon } from "../utils/icon-utils";
import { EmailListItem } from "./ui/email-list-item";

interface EmailLabelsProps {
  accountId?: string;
  labels: EmailLabel[];
  systemLabels: EmailLabel[];
  userLabels: EmailLabel[];
  selectedLabelId?: string | null;
  loading?: boolean;
  error?: string;
  onLabelSelect: (labelId: string | null) => void;
}

export const EmailLabels: React.FC<EmailLabelsProps> = ({
  accountId,
  labels,
  systemLabels,
  userLabels,
  selectedLabelId,
  loading = false,
  error,
  onLabelSelect,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [showUserLabels, setShowUserLabels] = React.useState(true);

  const LabelListItem: React.FC<{ label: EmailLabel; isSystem?: boolean }> = ({ label, isSystem = false }) => {
    const isSelected = label.id === selectedLabelId;
    const IconComponent = getLabelIcon(label.id, label.name, isSystem);

    return (
      <EmailListItem
        icon={<IconComponent sx={{ fontSize: 16, color: isSelected ? primaryColor(600) : neutralColor(500) }} />}
        primary={label.name}
        badgeCount={label.unreadCount}
        isSelected={isSelected}
        onClick={() => onLabelSelect(isSelected ? null : label.id)}
      />
    );
  };

  if (!accountId) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: neutralColor(500) }}>
          Select an account to view labels
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress size={20} />
        <Typography variant="body2" sx={{ color: neutralColor(600), mt: 1 }}>
          Loading labels...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "error.main" }}>
          Failed to load labels
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 1 }}>
      {systemLabels.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: neutralColor(600),
              fontWeight: 600,
              fontSize: "0.75rem",
              px: 1,
              py: 0.5,
              display: "block",
            }}
          >
            FOLDERS
          </Typography>
          <List dense sx={{ py: 0 }}>
            {systemLabels.map((label) => (
              <LabelListItem key={label.id} label={label} isSystem />
            ))}
          </List>
        </Box>
      )}

      {/* User Labels */}
      {userLabels.length > 0 && (
        <Box>
          {systemLabels.length > 0 && <Divider sx={{ my: 1 }} />}

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: neutralColor(600),
                fontWeight: 600,
                fontSize: "0.75rem",
                py: 0.5,
              }}
            >
              LABELS
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowUserLabels(!showUserLabels)}
              sx={{
                color: neutralColor(500),
                "&:hover": { color: neutralColor(700) },
              }}
            >
              {showUserLabels ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Stack>

          <Collapse in={showUserLabels}>
            <List dense sx={{ py: 0 }}>
              {userLabels.map((label) => (
                <LabelListItem key={label.id} label={label} />
              ))}
            </List>
          </Collapse>
        </Box>
      )}

      {labels.length === 0 && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: neutralColor(500) }}>
            No labels found
          </Typography>
        </Box>
      )}
    </Box>
  );
};
