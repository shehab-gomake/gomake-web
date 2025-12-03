/**
 * Chatwoot Settings View
 *
 * Main settings page with subpage navigation.
 * Displays a sidebar with settings categories and renders the selected subpage.
 */

import React, { useEffect } from "react";
import { Box, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton, Tooltip, Badge } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";
import { useChatwootPermissions } from "../hooks/use-chatwoot-permissions";
import { useChatwootWarnings } from "../hooks/use-chatwoot-warnings";
import { VIEW_PERMISSIONS, SETTINGS_PERMISSIONS } from "../constants/permissions.constants";
import { ChatwootSettingsSubpage } from "@/widgets/frontdesk/routing/types";
import type { PermissionConfig } from "../constants/permissions.constants";
import {
  ArrowLeftIcon,
  UserGroupIcon,
  InboxIcon,
  UserIcon,
  TagIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Import subpage components
import { AgentsSubpage } from "./settings/agents-subpage";
import { InboxesSubpage } from "./settings/inboxes-subpage";
import { TeamsSubpage } from "./settings/teams-subpage";
import { LabelsSubpage } from "./settings/labels-subpage";
import { WarningsSettingsView } from "./settings/warnings-settings-view";
import { ProfileSettingsSubpage } from "./settings/profile-settings-subpage";
import { WebhookTestView } from "./webhook-test-view";
import { OldFrontDeskSubpage } from "./settings/old-frontdesk-subpage";

interface SettingsMenuItem {
  subpage: ChatwootSettingsSubpage;
  label: string;
  icon: React.ReactNode;
  permissionConfig?: PermissionConfig; // Optional permission check - if undefined, accessible to all
}

const SETTINGS_MENU_ITEMS: SettingsMenuItem[] = [
  {
    subpage: ChatwootSettingsSubpage.AGENTS,
    label: "Agents",
    icon: <UserGroupIcon />,
    permissionConfig: SETTINGS_PERMISSIONS.agents, // Administrator only
  },
  {
    subpage: ChatwootSettingsSubpage.INBOXES,
    label: "Inboxes",
    icon: <InboxIcon />,
    permissionConfig: SETTINGS_PERMISSIONS.inboxes, // Administrator only
  },
  {
    subpage: ChatwootSettingsSubpage.TEAMS,
    label: "Teams",
    icon: <UserGroupIcon />,
    permissionConfig: SETTINGS_PERMISSIONS.teams, // Administrator only
  },
  {
    subpage: ChatwootSettingsSubpage.LABELS,
    label: "Labels",
    icon: <TagIcon />,
    permissionConfig: SETTINGS_PERMISSIONS.labels, // Administrator only
  },
  {
    subpage: ChatwootSettingsSubpage.WARNINGS,
    label: "Warnings",
    icon: <ExclamationTriangleIcon />,
    // No permission config - accessible to all
  },
  {
    subpage: ChatwootSettingsSubpage.PROFILE,
    label: "Profile Settings",
    icon: <UserIcon />,
    // No permission config - accessible to all (uses VIEW_PERMISSIONS.settings which includes agents)
  },
  {
    subpage: ChatwootSettingsSubpage.WEBHOOK_TEST,
    label: "Webhook Test",
    icon: <LinkIcon />,
    // No permission config - accessible to all
  },
  {
    subpage: ChatwootSettingsSubpage.OLD_FRONTDESK,
    label: "Old FrontDesk",
    icon: <ClockIcon />,
    // No permission config - accessible to all
  },
];

export const SettingsView: React.FC = () => {
  const theme = useTheme();
  const { router: chatwootRouter } = useChatwootProvider();
  const warnings = useChatwootWarnings();
  const warningCount = warnings.length;

  // Defense-in-depth: Check if user has permission to access Settings
  const { canAccess } = useChatwootPermissions();
  const canAccessSettings = canAccess(VIEW_PERMISSIONS.settings);

  // Redirect unauthorized users to My Inbox
  useEffect(() => {
    if (!canAccessSettings) {
      console.warn("[SettingsView] Unauthorized access attempt - redirecting to My Inbox");
      chatwootRouter.navigateToMyInbox();
    }
  }, [canAccessSettings, chatwootRouter]);

  // Filter menu items based on permissions
  const visibleMenuItems = React.useMemo(() => {
    return SETTINGS_MENU_ITEMS.filter((item) => {
      // If no permission config, item is accessible to all
      if (!item.permissionConfig) {
        return true;
      }
      // Check if user has permission to access this item
      return canAccess(item.permissionConfig);
    });
  }, [canAccess]);

  // Get the first accessible subpage (prefer WARNINGS, then PROFILE, then first item)
  const getFirstAccessibleSubpage = React.useCallback((): ChatwootSettingsSubpage => {
    const warningsItem = visibleMenuItems.find(
      (item) => item.subpage === ChatwootSettingsSubpage.WARNINGS
    );
    if (warningsItem) return ChatwootSettingsSubpage.WARNINGS;

    const profileItem = visibleMenuItems.find(
      (item) => item.subpage === ChatwootSettingsSubpage.PROFILE
    );
    if (profileItem) return ChatwootSettingsSubpage.PROFILE;

    return visibleMenuItems[0]?.subpage || ChatwootSettingsSubpage.WARNINGS;
  }, [visibleMenuItems]);

  // Determine current subpage: use router value if accessible, otherwise use first accessible
  const currentSubpage = React.useMemo(() => {
    const routerSubpage = chatwootRouter.currentSettingsSubpage;
    if (routerSubpage) {
      // Check if router subpage is accessible
      const isAccessible = visibleMenuItems.some((item) => item.subpage === routerSubpage);
      if (isAccessible) {
        return routerSubpage;
      }
    }
    // Router subpage not accessible or not set - use first accessible
    return getFirstAccessibleSubpage();
  }, [chatwootRouter.currentSettingsSubpage, visibleMenuItems, getFirstAccessibleSubpage]);

  // Redirect if current router subpage is not accessible
  useEffect(() => {
    if (!canAccessSettings) return; // Already handled above

    const routerSubpage = chatwootRouter.currentSettingsSubpage;
    if (routerSubpage && currentSubpage !== routerSubpage) {
      // Router subpage is not accessible - redirect to accessible one
      console.warn(
        `[SettingsView] User cannot access ${routerSubpage} - redirecting to ${currentSubpage}`
      );
      chatwootRouter.navigateToSettings(currentSubpage);
    }
  }, [canAccessSettings, chatwootRouter, currentSubpage]);

  // Render the appropriate subpage component
  const renderSubpage = () => {
    // Safety check: ensure currentSubpage is accessible (should always be true due to redirect logic)
    const subpageToRender = visibleMenuItems.some(
      (item) => item.subpage === currentSubpage
    )
      ? currentSubpage
      : getFirstAccessibleSubpage();

    switch (subpageToRender) {
      case ChatwootSettingsSubpage.AGENTS:
        return <AgentsSubpage />;
      case ChatwootSettingsSubpage.INBOXES:
        return <InboxesSubpage />;
      case ChatwootSettingsSubpage.TEAMS:
        return <TeamsSubpage />;
      case ChatwootSettingsSubpage.LABELS:
        return <LabelsSubpage />;
      case ChatwootSettingsSubpage.WARNINGS:
        return <WarningsSettingsView />;
      case ChatwootSettingsSubpage.PROFILE:
        return <ProfileSettingsSubpage />;
      case ChatwootSettingsSubpage.WEBHOOK_TEST:
        return <WebhookTestView />;
      case ChatwootSettingsSubpage.OLD_FRONTDESK:
        return <OldFrontDeskSubpage />;
      case ChatwootSettingsSubpage.GENERAL:
        // General Settings removed - fallback to Warnings
        return <WarningsSettingsView />;
      default:
        // Unknown subpage - fallback to Warnings
        return <WarningsSettingsView />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        backgroundColor: "#f8f9fa", // Muted background
      }}
    >
      {/* Settings Sidebar - Minimalist Clean */}
      <Box
        sx={{
          width: 200,
          minWidth: 200,
          borderRight: `1px solid rgba(0,0,0,0.08)`,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fafbfc",
        }}
      >
        {/* Compact Header */}
        <Box sx={{ px: 2, py: 1.75, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => chatwootRouter.navigateToDashboard()}
              sx={{
                color: "#9ca3af",
                p: 0.375,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  color: "#6366f1",
                  backgroundColor: "rgba(99, 102, 241, 0.08)",
                  transform: "translateX(-2px)",
                },
              }}
            >
              <ArrowLeftIcon style={{ width: 16, height: 16 }} />
            </IconButton>
            <Typography 
              variant="overline" 
              sx={{ 
                fontWeight: 700, 
                fontSize: "0.688rem",
                color: "#9ca3af",
                letterSpacing: "0.1em",
              }}
            >
              SETTINGS
            </Typography>
          </Box>
        </Box>

        {/* Menu Items */}
        <List sx={{ flex: 1, py: 1.5, px: 1.25 }}>
          {visibleMenuItems.map((item) => {
            const isSelected = currentSubpage === item.subpage;
            const showBadge = item.subpage === ChatwootSettingsSubpage.WARNINGS && warningCount > 0;
            return (
              <ListItem key={item.subpage} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => chatwootRouter.navigateToSettings(item.subpage)}
                  sx={{
                    py: 1.125,
                    px: 1.25,
                    borderRadius: "6px",
                    minHeight: "40px",
                    position: "relative",
                    transition: "all 0.2s ease-in-out",
                    "&::before": isSelected ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: "60%",
                      backgroundColor: "#6366f1",
                      borderRadius: "0 2px 2px 0",
                    } : {},
                    "&.Mui-selected": {
                      backgroundColor: "rgba(99, 102, 241, 0.08)",
                    },
                    "&:hover": {
                      backgroundColor: isSelected 
                        ? "rgba(99, 102, 241, 0.12)" 
                        : "rgba(0, 0, 0, 0.06)",
                      transform: "translateX(2px)",
                      "& .MuiListItemIcon-root": {
                        color: isSelected ? "#6366f1" : "#6366f1",
                      },
                      "& .MuiListItemText-primary": {
                        color: isSelected ? "#1f2937" : "#374151",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: isSelected ? "#6366f1" : "#9ca3af",
                      transition: "color 0.2s ease-in-out",
                    }}
                  >
                    {showBadge ? (
                      <Badge 
                        badgeContent={warningCount} 
                        color="error"
                        max={99}
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.625rem',
                            height: 14,
                            minWidth: 14,
                            padding: '0 3px',
                            fontWeight: 600,
                          },
                        }}
                      >
                        {React.cloneElement(item.icon as React.ReactElement, { 
                          style: { width: 16, height: 16 } 
                        })}
                      </Badge>
                    ) : (
                      React.cloneElement(item.icon as React.ReactElement, { 
                        style: { width: 16, height: 16 } 
                      })
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.813rem",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "#1f2937" : "#6b7280",
                      lineHeight: 1.5,
                    }}
                    sx={{
                      "& .MuiListItemText-primary": {
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Settings Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          backgroundColor: "#f8f9fa", // Muted background
        }}
      >
        {renderSubpage()}
      </Box>
    </Box>
  );
};

