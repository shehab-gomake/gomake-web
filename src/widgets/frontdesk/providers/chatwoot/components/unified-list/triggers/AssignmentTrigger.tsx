/**
 * AssignmentTrigger Component
 *
 * Unified inline trigger for assignment dropdowns (Agent/Team).
 * Used in conversation detail panel.
 *
 * @module unified-list/triggers/AssignmentTrigger
 */

import React from 'react';
import { Box, Typography, Avatar, Button, CircularProgress } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import { assignmentStyles, getAssignmentValueBoxSx } from '../styles';
import { colorTokens } from '@/widgets/frontdesk/design-system';

export interface AssignmentTriggerProps {
  /** Type of assignment */
  type: 'agent' | 'team';
  /** Section label */
  label: string;
  /** Current value display name */
  valueName?: string;
  /** Current value description */
  valueDescription?: string;
  /** Avatar URL (for agents) */
  avatarUrl?: string;
  /** Avatar initials fallback */
  avatarInitials?: string;
  /** Avatar background color */
  avatarColor?: string;
  /** Whether something is selected */
  hasValue: boolean;
  /** Placeholder when nothing selected */
  placeholder: string;
  /** Click handler */
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

export const AssignmentTrigger: React.FC<AssignmentTriggerProps> = ({
  type,
  label,
  valueName,
  valueDescription,
  avatarUrl,
  avatarInitials = '??',
  avatarColor = colorTokens.neutral[400],
  hasValue,
  placeholder,
  onClick,
  loading = false,
  disabled = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <Box sx={assignmentStyles.container}>
      <Typography variant="caption" sx={assignmentStyles.label}>
        {label}
      </Typography>

      {hasValue ? (
        <Box onClick={onClick} sx={getAssignmentValueBoxSx(isDisabled)}>
          {loading ? (
            <CircularProgress size={32} />
          ) : (
            <>
              {type === 'agent' ? (
                <Avatar
                  src={avatarUrl}
                  sx={{
                    ...assignmentStyles.avatar,
                    bgcolor: avatarColor,
                  }}
                >
                  {avatarInitials}
                </Avatar>
              ) : (
                <Box
                  sx={{
                    ...assignmentStyles.iconContainer,
                    bgcolor: colorTokens.neutral[100],
                  }}
                >
                  <GroupsIcon sx={{ fontSize: 18, color: colorTokens.neutral[500] }} />
                </Box>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={assignmentStyles.name}>
                  {valueName}
                </Typography>
                {valueDescription && (
                  <Typography variant="caption" sx={assignmentStyles.description}>
                    {valueDescription}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      ) : (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={
            loading ? (
              <CircularProgress size={16} />
            ) : type === 'agent' ? (
              <PersonIcon />
            ) : (
              <GroupsIcon />
            )
          }
          onClick={onClick}
          disabled={isDisabled}
          sx={assignmentStyles.emptyButton}
        >
          {placeholder}
        </Button>
      )}
    </Box>
  );
};

export default AssignmentTrigger;

