/**
 * Chatwoot Settings View
 *
 * Main settings page with subpage navigation.
 * Displays a sidebar with settings categories and renders the selected subpage.
 */

import React from "react";
import { Box, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";
import { ChatwootSettingsSubpage } from "@/widgets/frontdesk/routing/types";
import {
  Settings as SettingsIcon,
  People as AgentsIcon,
  Inbox as InboxesIcon,
  Groups as TeamsIcon,
  Label as LabelsIcon,
  Person as ProfileIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

// Import subpage components
import { GeneralSettingsSubpage } from "./settings/general-settings-subpage";
import { AgentsSubpage } from "./settings/agents-subpage";
import { InboxesSubpage } from "./settings/inboxes-subpage";
import { TeamsSubpage } from "./settings/teams-subpage";
import { LabelsSubpage } from "./settings/labels-subpage";
import { ProfileSettingsSubpage } from "./settings/profile-settings-subpage";

interface SettingsMenuItem {
  subpage: ChatwootSettingsSubpage;
  label: string;
  icon: React.ReactNode;
}

const SETTINGS_MENU_ITEMS: SettingsMenuItem[] = [
  {
    subpage: ChatwootSettingsSubpage.GENERAL,
    label: "General Settings (Account)",
    icon: <SettingsIcon />,
  },
  {
    subpage: ChatwootSettingsSubpage.AGENTS,
    label: "Agents",
    icon: <AgentsIcon />,
  },
  {
    subpage: ChatwootSettingsSubpage.INBOXES,
    label: "Inboxes",
    icon: <InboxesIcon />,
  },
  {
    subpage: ChatwootSettingsSubpage.TEAMS,
    label: "Teams",
    icon: <TeamsIcon />,
  },
  {
    subpage: ChatwootSettingsSubpage.LABELS,
    label: "Labels",
    icon: <LabelsIcon />,
  },
  {
    subpage: ChatwootSettingsSubpage.PROFILE,
    label: "Profile Settings",
    icon: <ProfileIcon />,
  },
];

export const SettingsView: React.FC = () => {
  const theme = useTheme();
  const { router: chatwootRouter } = useChatwootProvider();

  // Get current subpage or default to GENERAL
  const currentSubpage = chatwootRouter.currentSettingsSubpage || ChatwootSettingsSubpage.GENERAL;

  // Render the appropriate subpage component
  const renderSubpage = () => {
    switch (currentSubpage) {
      case ChatwootSettingsSubpage.GENERAL:
        return <GeneralSettingsSubpage />;
      case ChatwootSettingsSubpage.AGENTS:
        return <AgentsSubpage />;
      case ChatwootSettingsSubpage.INBOXES:
        return <InboxesSubpage />;
      case ChatwootSettingsSubpage.TEAMS:
        return <TeamsSubpage />;
      case ChatwootSettingsSubpage.LABELS:
        return <LabelsSubpage />;
      case ChatwootSettingsSubpage.PROFILE:
        return <ProfileSettingsSubpage />;
      default:
        return <GeneralSettingsSubpage />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Settings Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 280,
          minWidth: 280,
          borderRight: `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Back to Dashboard">
            <IconButton
              size="small"
              onClick={() => chatwootRouter.navigateToDashboard()}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" fontWeight={600}>
            Settings
          </Typography>
        </Box>
        <Divider />
        <List sx={{ flex: 1, py: 1 }}>
          {SETTINGS_MENU_ITEMS.map((item) => {
            const isSelected = currentSubpage === item.subpage;
            return (
              <ListItem key={item.subpage} disablePadding>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => chatwootRouter.navigateToSettings(item.subpage)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.action.selected,
                      borderRight: `3px solid ${theme.palette.primary.main}`,
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Settings Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {renderSubpage()}
      </Box>
    </Box>
  );
};

