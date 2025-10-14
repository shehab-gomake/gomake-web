import React from 'react';
import { styled, Tabs, Tab, TabsProps, TabProps, Badge, Box } from '@mui/material';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { FONT_FAMILY } from '@/utils/font-family';

/**
 * Styled Tabs component following gomake patterns
 */
const StyledTabs = styled(Tabs)<TabsProps>(() => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  return {
    minHeight: '48px',
    borderBottom: `1px solid ${neutralColor(200)}`,

    '& .MuiTabs-indicator': {
      backgroundColor: primaryColor(500),
      height: '2px',
    },

    '& .MuiButtonBase-root': {
      textTransform: 'initial',
    },
  };
});

/**
 * Styled Tab component
 */
const StyledTab = styled(Tab)<TabProps>(() => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  return {
    minWidth: 'auto',
    minHeight: '48px',
    padding: '12px 20px',
    color: neutralColor(600),
    ...FONT_FAMILY.Lexend(500, 14),

    '&:hover': {
      color: primaryColor(500),
      backgroundColor: `${primaryColor(500)}05`,
    },

    '&.Mui-selected': {
      color: primaryColor(500),
      ...FONT_FAMILY.Lexend(600, 14),
    },
  };
});

interface NotificationTabsProps {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  messageBadgeCount?: number;
  ticketBadgeCount?: number;
}

const NotificationTabs: React.FC<NotificationTabsProps> = ({
  activeTab,
  onTabChange,
  messageBadgeCount = 0,
  ticketBadgeCount = 0,
}) => {
  const { primaryColor } = useGomakeTheme();

  return (
    <StyledTabs value={activeTab} onChange={onTabChange}>
      <StyledTab
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Messages
            {messageBadgeCount > 0 && (
              <Badge
                badgeContent={messageBadgeCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    position: 'relative',
                    transform: 'none',
                    fontSize: '0.688rem',
                    height: 18,
                    minWidth: 18,
                    padding: '0 4px',
                  },
                }}
              />
            )}
          </Box>
        }
      />
      <StyledTab
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Tickets
            {ticketBadgeCount > 0 && (
              <Badge
                badgeContent={ticketBadgeCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    position: 'relative',
                    transform: 'none',
                    fontSize: '0.688rem',
                    height: 18,
                    minWidth: 18,
                    padding: '0 4px',
                  },
                }}
              />
            )}
          </Box>
        }
      />
    </StyledTabs>
  );
};

/**
 * Tab Panel component for content switching
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
    >
      {value === index && children}
    </Box>
  );
};

export { NotificationTabs, TabPanel };
