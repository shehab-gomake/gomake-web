/**
 * Warnings Settings View
 *
 * Dedicated settings page for viewing and managing system warnings.
 * Follows the same design patterns as other settings subpages.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { BaseSettingsSubpage, SettingsSection } from '../../components/settings';
import { useChatwootWarnings, WarningSeverity, Warning } from '../../hooks/use-chatwoot-warnings';
import { useChatwootProvider } from '../../hooks/use-chatwoot-provider';
import { ChatwootSettingsSubpage } from '@/widgets/frontdesk/routing/types';

const getSeverityIcon = (severity: WarningSeverity, theme: any) => {
  const iconProps = { fontSize: 20 as const };
  
  switch (severity) {
    case WarningSeverity.ERROR:
      return <ErrorIcon sx={{ ...iconProps, color: theme.palette.error.main }} />;
    case WarningSeverity.WARNING:
      return <WarningIcon sx={{ ...iconProps, color: theme.palette.warning.main }} />;
    case WarningSeverity.INFO:
      return <InfoIcon sx={{ ...iconProps, color: theme.palette.info.main }} />;
    default:
      return <InfoIcon sx={{ ...iconProps, color: theme.palette.info.main }} />;
  }
};

const getSeverityChipColor = (severity: WarningSeverity): "error" | "warning" | "info" => {
  switch (severity) {
    case WarningSeverity.ERROR:
      return 'error';
    case WarningSeverity.WARNING:
      return 'warning';
    case WarningSeverity.INFO:
      return 'info';
    default:
      return 'info';
  }
};

const getSeverityLabel = (severity: WarningSeverity, t: (key: string) => string): string => {
  switch (severity) {
    case WarningSeverity.ERROR:
      return t("frontdesk.settings.warningsSeverityCritical");
    case WarningSeverity.WARNING:
      return t("frontdesk.settings.warningsSeverityWarning");
    case WarningSeverity.INFO:
      return t("frontdesk.settings.warningsSeverityInfo");
    default:
      return t("frontdesk.settings.warningsSeverityUnknown");
  }
};

export const WarningsSettingsView: React.FC = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const theme = useTheme();
  const warnings = useChatwootWarnings();
  const { router: chatwootRouter } = useChatwootProvider();

  const handleWarningAction = (warning: Warning) => {
    if (warning.inboxId) {
      // Store the inboxId to auto-select it when navigating to inboxes settings
      sessionStorage.setItem('chatwoot:selectInbox', warning.inboxId.toString());
      // Navigate to Settings > Inboxes subpage
      // The inboxes subpage will check sessionStorage and auto-select the inbox
      chatwootRouter.navigateToSettings(ChatwootSettingsSubpage.INBOXES);
    }
  };

  // Group warnings by severity
  const errorWarnings = warnings.filter(w => w.severity === WarningSeverity.ERROR);
  const warningWarnings = warnings.filter(w => w.severity === WarningSeverity.WARNING);
  const infoWarnings = warnings.filter(w => w.severity === WarningSeverity.INFO);

  return (
    <BaseSettingsSubpage
      title={t("frontdesk.settings.warningsTitle")}
      description={t("frontdesk.settings.warningsDescription")}
    >
      {warnings.length === 0 ? (
        // No warnings state
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            textAlign: 'center',
            gap: 2,
            direction: dir,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', opacity: 0.5 }} />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            {t("frontdesk.settings.warningsEmptyTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            {t("frontdesk.settings.warningsEmptyDescription")}
          </Typography>
        </Box>
      ) : (
        // Warnings list
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, direction: dir }}>
          {/* Critical Issues Section */}
          {errorWarnings.length > 0 && (
            <SettingsSection
              title={t("frontdesk.settings.warningsCriticalTitle", { count: errorWarnings.length })}
              description={t("frontdesk.settings.warningsCriticalDescription")}
            >
              <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0, direction: dir }}>
                {errorWarnings.map((warning, index) => (
                  <React.Fragment key={warning.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 0,
                        borderBottom: index < errorWarnings.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        display: 'flex',
                        alignItems: 'flex-start',
                        direction: dir,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                        {getSeverityIcon(warning.severity, theme)}
                      </ListItemIcon>
                      <Box sx={{ flex: 1, minWidth: 0, [dir === "rtl" ? "ml" : "mr"]: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, direction: dir }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {warning.title}
                          </Typography>
                          <Chip
                            label={getSeverityLabel(warning.severity, t)}
                            size="small"
                            color={getSeverityChipColor(warning.severity)}
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              height: 20,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {warning.message}
                        </Typography>
                        {warning.inboxName && (
                          <Typography variant="caption" color="text.secondary">
                            {t("frontdesk.settings.warningsAffectedInbox", { name: warning.inboxName })}
                          </Typography>
                        )}
                      </Box>
                      {warning.actionLabel && warning.inboxId && (
                        <IconButton
                          onClick={() => handleWarningAction(warning)}
                          size="small"
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'primary.main',
                            },
                            transform: dir === "rtl" ? "rotate(180deg)" : "none",
                          }}
                          aria-label={warning.actionLabel}
                        >
                          <ChevronRightIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </SettingsSection>
          )}

          {/* Warnings Section */}
          {warningWarnings.length > 0 && (
            <SettingsSection
              title={t("frontdesk.settings.warningsWarningTitle", { count: warningWarnings.length })}
              description={t("frontdesk.settings.warningsWarningDescription")}
            >
              <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0, direction: dir }}>
                {warningWarnings.map((warning, index) => (
                  <React.Fragment key={warning.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 0,
                        borderBottom: index < warningWarnings.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        display: 'flex',
                        alignItems: 'flex-start',
                        direction: dir,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                        {getSeverityIcon(warning.severity, theme)}
                      </ListItemIcon>
                      <Box sx={{ flex: 1, minWidth: 0, [dir === "rtl" ? "ml" : "mr"]: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, direction: dir }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {warning.title}
                          </Typography>
                          <Chip
                            label={getSeverityLabel(warning.severity, t)}
                            size="small"
                            color={getSeverityChipColor(warning.severity)}
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              height: 20,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {warning.message}
                        </Typography>
                        {warning.inboxName && (
                          <Typography variant="caption" color="text.secondary">
                            {t("frontdesk.settings.warningsAffectedInbox", { name: warning.inboxName })}
                          </Typography>
                        )}
                      </Box>
                      {warning.actionLabel && warning.inboxId && (
                        <IconButton
                          onClick={() => handleWarningAction(warning)}
                          size="small"
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'primary.main',
                            },
                            transform: dir === "rtl" ? "rotate(180deg)" : "none",
                          }}
                          aria-label={warning.actionLabel}
                        >
                          <ChevronRightIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </SettingsSection>
          )}

          {/* Info Section */}
          {infoWarnings.length > 0 && (
            <SettingsSection
              title={t("frontdesk.settings.warningsInfoTitle", { count: infoWarnings.length })}
              description={t("frontdesk.settings.warningsInfoDescription")}
            >
              <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0, direction: dir }}>
                {infoWarnings.map((warning, index) => (
                  <React.Fragment key={warning.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 0,
                        borderBottom: index < infoWarnings.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        display: 'flex',
                        alignItems: 'flex-start',
                        direction: dir,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                        {getSeverityIcon(warning.severity, theme)}
                      </ListItemIcon>
                      <Box sx={{ flex: 1, minWidth: 0, [dir === "rtl" ? "ml" : "mr"]: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, direction: dir }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {warning.title}
                          </Typography>
                          <Chip
                            label={getSeverityLabel(warning.severity, t)}
                            size="small"
                            color={getSeverityChipColor(warning.severity)}
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              height: 20,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {warning.message}
                        </Typography>
                        {warning.inboxName && (
                          <Typography variant="caption" color="text.secondary">
                            {t("frontdesk.settings.warningsAffectedInbox", { name: warning.inboxName })}
                          </Typography>
                        )}
                      </Box>
                      {warning.actionLabel && warning.inboxId && (
                        <IconButton
                          onClick={() => handleWarningAction(warning)}
                          size="small"
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'primary.main',
                            },
                            transform: dir === "rtl" ? "rotate(180deg)" : "none",
                          }}
                          aria-label={warning.actionLabel}
                        >
                          <ChevronRightIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </SettingsSection>
          )}
        </Box>
      )}
    </BaseSettingsSubpage>
  );
};

export default WarningsSettingsView;

