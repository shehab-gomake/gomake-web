import React, { useState } from 'react';
import { Badge, IconButton, Stack, Box, Typography } from '@mui/material';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { GoMakeMenu } from '@/components';
import { CustomTooltip } from '@/widgets/header';
import { PrimaryButton } from '@/components/button/primary-button';
import { FONT_FAMILY } from '@/utils/font-family';
import { NotificationTabs, TabPanel } from '@/widgets/frontdesk-notifications/components/notification-tabs';
import { MessageNotificationItem } from '@/widgets/frontdesk-notifications/components/message-notification-item';
import { TicketNotificationItem } from '@/widgets/frontdesk-notifications/components/ticket-notification-item';
import { useFrontdeskNotifications } from '@/widgets/frontdesk-notifications/hooks/use-frontdesk-notifications';

const FrontdeskNav = () => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const open = Boolean(anchorEl);

  const {
    messageNotifications,
    ticketNotifications,
    counts,
    handleNotificationClick,
    navigateToFrontdesk,
  } = useFrontdeskNotifications();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleNotificationItemClick = (notification: any) => {
    handleNotificationClick(notification);
    handleClose();
  };

  const handleOpenFrontdesk = () => {
    navigateToFrontdesk();
    handleClose();
  };

  const renderIconButton = () => (
    <CustomTooltip title="FrontDesk" arrow>
      <IconButton
        style={{ backgroundColor: '#f6f6f6', padding: '8px' }}
        onClick={handleClick}
      >
        <HeadsetMicOutlinedIcon style={{ color: '#2e3092', width: 22, height: 22 }} />
      </IconButton>
    </CustomTooltip>
  );

  const renderEmptyState = (type: 'messages' | 'tickets') => (
    <Box
      sx={{
        padding: '40px 20px',
        textAlign: 'center',
        color: neutralColor(400),
      }}
    >
      <Typography sx={{ ...FONT_FAMILY.Lexend(400, 14) }}>
        {type === 'messages'
          ? 'No new message notifications'
          : 'No new ticket notifications'}
      </Typography>
    </Box>
  );

  const renderMenu = () => (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      noListPadding
      sx={{
        '& .MuiPaper-root': {
          width: 420,
          maxHeight: 600,
        },
      }}
    >
      <Stack width="100%" height="100%">
        {/* Header */}
        <Box
          sx={{
            padding: '16px 20px',
            borderBottom: `1px solid ${neutralColor(200)}`,
          }}
        >
          <Typography
            sx={{
              ...FONT_FAMILY.Lexend(600, 16),
              color: primaryColor(900),
            }}
          >
            FrontDesk Notifications
          </Typography>
          <Typography
            sx={{
              ...FONT_FAMILY.Lexend(400, 12),
              color: neutralColor(600),
              marginTop: '4px',
            }}
          >
            {counts.total} unread notification{counts.total !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Tabs */}
        <NotificationTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          messageBadgeCount={counts.messages}
          ticketBadgeCount={counts.tickets}
        />

        {/* Tab Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: 400,
          }}
        >
          <TabPanel value={activeTab} index={0}>
            {messageNotifications.length > 0 ? (
              <Stack>
                {messageNotifications.map((notification) => (
                  <MessageNotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationItemClick}
                  />
                ))}
              </Stack>
            ) : (
              renderEmptyState('messages')
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {ticketNotifications.length > 0 ? (
              <Stack>
                {ticketNotifications.map((notification) => (
                  <TicketNotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationItemClick}
                  />
                ))}
              </Stack>
            ) : (
              renderEmptyState('tickets')
            )}
          </TabPanel>
        </Box>

        {/* Footer Button */}
        <Box
          sx={{
            padding: '12px 20px',
            borderTop: `1px solid ${neutralColor(200)}`,
          }}
        >
          <PrimaryButton
            onClick={handleOpenFrontdesk}
            style={{
              width: '100%',
              backgroundColor: primaryColor(500),
              color: '#ffffff',
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '6px',
            }}
          >
            Open FrontDesk
          </PrimaryButton>
        </Box>
      </Stack>
    </GoMakeMenu>
  );

  return counts.total > 0 ? (
    <Badge
      style={{ padding: '2px' }}
      badgeContent={counts.total}
      color="error"
      max={99}
      componentsProps={{
        badge: {
          style: {
            right: '-5px',
            transform: 'none',
          },
        },
      }}
    >
      {renderIconButton()}
      {renderMenu()}
    </Badge>
  ) : (
    <>
      {renderIconButton()}
      {renderMenu()}
    </>
  );
};

export { FrontdeskNav };
