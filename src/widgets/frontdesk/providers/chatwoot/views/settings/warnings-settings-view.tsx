/**
 * Warnings Settings View
 *
 * Dedicated settings page for viewing and managing system warnings.
 * Similar structure to inbox settings pages.
 */

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { useChatwootWarnings, WarningSeverity, Warning } from '../../hooks/use-chatwoot-warnings';
import { useRouter } from 'next/router';

const getSeverityIcon = (severity: WarningSeverity) => {
  const iconProps = { fontSize: 32 as const };
  
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

const getSeverityBorderColor = (severity: WarningSeverity): string => {
  switch (severity) {
    case WarningSeverity.ERROR:
      return colorTokens.error[500];
    case WarningSeverity.WARNING:
      return colorTokens.warning[500];
    case WarningSeverity.INFO:
      return colorTokens.info[500];
    default:
      return colorTokens.neutral[300];
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

const getSeverityLabel = (severity: WarningSeverity): string => {
  switch (severity) {
    case WarningSeverity.ERROR:
      return 'Critical';
    case WarningSeverity.WARNING:
      return 'Warning';
    case WarningSeverity.INFO:
      return 'Info';
    default:
      return 'Unknown';
  }
};

export const WarningsSettingsView: React.FC = () => {
  const warnings = useChatwootWarnings();
  const router = useRouter();

  const handleWarningAction = (warning: Warning) => {
    if (warning.actionRoute) {
      router.push(warning.actionRoute);
    }
  };

  // Group warnings by severity
  const errorWarnings = warnings.filter(w => w.severity === WarningSeverity.ERROR);
  const warningWarnings = warnings.filter(w => w.severity === WarningSeverity.WARNING);
  const infoWarnings = warnings.filter(w => w.severity === WarningSeverity.INFO);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colorTokens.neutral[50],
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: '#fff',
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            color: colorTokens.neutral[900],
          }}
        >
          System Warnings
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[600],
            mt: 0.5,
            fontSize: '0.875rem',
          }}
        >
          Configuration issues and alerts that need your attention
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {warnings.length === 0 ? (
          // No warnings state
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: '#fff',
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color: colorTokens.success[500],
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: colorTokens.neutral[900],
                mb: 1,
              }}
            >
              All Systems Operational
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colorTokens.neutral[600],
              }}
            >
              No configuration issues or warnings detected
            </Typography>
          </Paper>
        ) : (
          // Warnings list
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Summary Cards */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {errorWarnings.length > 0 && (
                <Paper sx={{ flex: 1, p: 2, borderLeft: `4px solid ${colorTokens.error[500]}` }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: colorTokens.error[600] }}>
                    {errorWarnings.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colorTokens.neutral[600] }}>
                    Critical Issues
                  </Typography>
                </Paper>
              )}
              {warningWarnings.length > 0 && (
                <Paper sx={{ flex: 1, p: 2, borderLeft: `4px solid ${colorTokens.warning[500]}` }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: colorTokens.warning[600] }}>
                    {warningWarnings.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colorTokens.neutral[600] }}>
                    Warnings
                  </Typography>
                </Paper>
              )}
              {infoWarnings.length > 0 && (
                <Paper sx={{ flex: 1, p: 2, borderLeft: `4px solid ${colorTokens.info[500]}` }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: colorTokens.info[600] }}>
                    {infoWarnings.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colorTokens.neutral[600] }}>
                    Informational
                  </Typography>
                </Paper>
              )}
            </Box>

            {/* Critical Issues Section */}
            {errorWarnings.length > 0 && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colorTokens.error[700],
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ErrorIcon /> Critical Issues
                </Typography>
                <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {errorWarnings.map((warning) => (
                    <Paper
                      key={warning.id}
                      sx={{
                        border: `1px solid ${getSeverityBorderColor(warning.severity)}`,
                        backgroundColor: getSeverityBgColor(warning.severity),
                      }}
                    >
                      <ListItem
                        sx={{
                          px: 3,
                          py: 2,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 48, mt: 0.5 }}>
                          {getSeverityIcon(warning.severity)}
                        </ListItemIcon>
                        <ListItemText
                          sx={{ flex: 1 }}
                          primary={
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {warning.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  backgroundColor: getSeverityBorderColor(warning.severity),
                                  color: '#fff',
                                  borderRadius: 1,
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  fontSize: '0.65rem',
                                }}
                              >
                                {getSeverityLabel(warning.severity)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" sx={{ color: colorTokens.neutral[700], mb: 1 }}>
                                {warning.message}
                              </Typography>
                              {warning.inboxName && (
                                <Typography variant="caption" sx={{ color: colorTokens.neutral[600] }}>
                                  Affected Inbox: <strong>{warning.inboxName}</strong>
                                </Typography>
                              )}
                            </>
                          }
                        />
                        {warning.actionLabel && (
                          <Button
                            variant="contained"
                            size="medium"
                            endIcon={<ChevronRightIcon />}
                            onClick={() => handleWarningAction(warning)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            {warning.actionLabel}
                          </Button>
                        )}
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              </Box>
            )}

            {/* Warnings Section */}
            {warningWarnings.length > 0 && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colorTokens.warning[700],
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <WarningIcon /> Configuration Warnings
                </Typography>
                <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {warningWarnings.map((warning) => (
                    <Paper
                      key={warning.id}
                      sx={{
                        border: `1px solid ${getSeverityBorderColor(warning.severity)}`,
                        backgroundColor: getSeverityBgColor(warning.severity),
                      }}
                    >
                      <ListItem
                        sx={{
                          px: 3,
                          py: 2,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 48, mt: 0.5 }}>
                          {getSeverityIcon(warning.severity)}
                        </ListItemIcon>
                        <ListItemText
                          sx={{ flex: 1 }}
                          primary={
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {warning.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  backgroundColor: getSeverityBorderColor(warning.severity),
                                  color: '#fff',
                                  borderRadius: 1,
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  fontSize: '0.65rem',
                                }}
                              >
                                {getSeverityLabel(warning.severity)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" sx={{ color: colorTokens.neutral[700], mb: 1 }}>
                                {warning.message}
                              </Typography>
                              {warning.inboxName && (
                                <Typography variant="caption" sx={{ color: colorTokens.neutral[600] }}>
                                  Affected Inbox: <strong>{warning.inboxName}</strong>
                                </Typography>
                              )}
                            </>
                          }
                        />
                        {warning.actionLabel && (
                          <Button
                            variant="contained"
                            size="medium"
                            endIcon={<ChevronRightIcon />}
                            onClick={() => handleWarningAction(warning)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            {warning.actionLabel}
                          </Button>
                        )}
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              </Box>
            )}

            {/* Info Section */}
            {infoWarnings.length > 0 && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colorTokens.info[700],
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <InfoIcon /> Information
                </Typography>
                <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {infoWarnings.map((warning) => (
                    <Paper
                      key={warning.id}
                      sx={{
                        border: `1px solid ${getSeverityBorderColor(warning.severity)}`,
                        backgroundColor: getSeverityBgColor(warning.severity),
                      }}
                    >
                      <ListItem
                        sx={{
                          px: 3,
                          py: 2,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 48, mt: 0.5 }}>
                          {getSeverityIcon(warning.severity)}
                        </ListItemIcon>
                        <ListItemText
                          sx={{ flex: 1 }}
                          primary={
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {warning.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  backgroundColor: getSeverityBorderColor(warning.severity),
                                  color: '#fff',
                                  borderRadius: 1,
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  fontSize: '0.65rem',
                                }}
                              >
                                {getSeverityLabel(warning.severity)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" sx={{ color: colorTokens.neutral[700], mb: 1 }}>
                                {warning.message}
                              </Typography>
                              {warning.inboxName && (
                                <Typography variant="caption" sx={{ color: colorTokens.neutral[600] }}>
                                  Affected Inbox: <strong>{warning.inboxName}</strong>
                                </Typography>
                              )}
                            </>
                          }
                        />
                        {warning.actionLabel && (
                          <Button
                            variant="contained"
                            size="medium"
                            endIcon={<ChevronRightIcon />}
                            onClick={() => handleWarningAction(warning)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            {warning.actionLabel}
                          </Button>
                        )}
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WarningsSettingsView;

