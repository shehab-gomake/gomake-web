/**
 * Chatwoot Warnings Compact Component
 *
 * Compact view of system warnings for dashboard sidebar.
 * Shows a summary with count badge and click to expand.
 */

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { useChatwootWarnings, WarningSeverity, Warning } from '../../hooks/use-chatwoot-warnings';
import { useRouter } from 'next/router';

interface ChatwootWarningsCompactProps {
  /** Maximum number of warnings to display */
  maxItems?: number;
}

const getSeverityIcon = (severity: WarningSeverity) => {
  const iconProps = { fontSize: 18 as const };
  
  switch (severity) {
    case WarningSeverity.ERROR:
      return <ErrorIcon sx={{ ...iconProps, color: colorTokens.error[600] }} />;
    case WarningSeverity.WARNING:
      return <WarningIcon sx={{ ...iconProps, color: colorTokens.warning[600] }} />;
    case WarningSeverity.INFO:
      return <InfoIcon sx={{ ...iconProps, color: colorTokens.info[600] }} />;
    default:
      return <InfoIcon sx={{ ...iconProps, color: colorTokens.info[600] }} />;
  }
};

const getSeverityBgColor = (severity: WarningSeverity): string => {
  switch (severity) {
    case WarningSeverity.ERROR:
      return colorTokens.error[50];
    case WarningSeverity.WARNING:
      return colorTokens.warning[50];
    case WarningSeverity.INFO:
      return colorTokens.info[50];
    default:
      return colorTokens.neutral[50];
  }
};

export const ChatwootWarningsCompact: React.FC<ChatwootWarningsCompactProps> = ({
  maxItems = 3,
}) => {
  const warnings = useChatwootWarnings();
  const router = useRouter();

  // Don't render if no warnings
  if (warnings.length === 0) {
    return (
      <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[500],
            fontSize: '0.813rem',
          }}
        >
          No system warnings
        </Typography>
      </Box>
    );
  }

  const displayedWarnings = warnings.slice(0, maxItems);
  const remainingCount = warnings.length - displayedWarnings.length;

  const handleWarningClick = (warning: Warning) => {
    if (warning.actionRoute) {
      router.push(warning.actionRoute);
    }
  };

  return (
    <Box>
      <List sx={{ p: 0 }}>
        {displayedWarnings.map((warning, index) => (
          <ListItem
            key={warning.id}
            disablePadding
            sx={{
              borderBottom:
                index < displayedWarnings.length - 1
                  ? `1px solid ${colorTokens.neutral[100]}`
                  : 'none',
            }}
          >
            <ListItemButton
              onClick={() => handleWarningClick(warning)}
              disabled={!warning.actionRoute}
              sx={{
                px: 2,
                py: 1.5,
                cursor: warning.actionRoute ? 'pointer' : 'default',
                backgroundColor: getSeverityBgColor(warning.severity),
                '&:hover': warning.actionRoute
                  ? {
                      backgroundColor: colorTokens.neutral[100],
                    }
                  : {
                      backgroundColor: getSeverityBgColor(warning.severity),
                    },
                '&.Mui-disabled': {
                  opacity: 1,
                },
                transition: 'background-color 0.2s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getSeverityIcon(warning.severity)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.813rem',
                      color: colorTokens.neutral[900],
                      mb: 0.25,
                    }}
                  >
                    {warning.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      color: colorTokens.neutral[600],
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {warning.inboxName || warning.message}
                  </Typography>
                }
              />
              {warning.severity === WarningSeverity.ERROR && (
                <Badge
                  badgeContent="!"
                  color="error"
                  sx={{
                    ml: 1,
                    '& .MuiBadge-badge': {
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Show remaining count */}
      {remainingCount > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            textAlign: 'center',
            borderTop: `1px solid ${colorTokens.neutral[200]}`,
            backgroundColor: colorTokens.neutral[25],
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              color: colorTokens.neutral[600],
              fontWeight: 500,
            }}
          >
            +{remainingCount} more warning{remainingCount !== 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

