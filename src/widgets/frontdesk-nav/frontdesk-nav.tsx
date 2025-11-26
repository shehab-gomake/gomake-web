import React, { useState } from "react";
import { Badge, IconButton, Stack, Box, Typography, CircularProgress, Button } from "@mui/material";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { GoMakeMenu } from "@/components";
import { CustomTooltip } from "@/widgets/header";
import { PrimaryButton } from "@/components/button/primary-button";
import { FONT_FAMILY } from "@/utils/font-family";
import { NotificationTabs, TabPanel } from "@/widgets/frontdesk-notifications/components/notification-tabs";
import { MessageNotificationItem } from "@/widgets/frontdesk-notifications/components/message-notification-item";
import { TicketNotificationItem } from "@/widgets/frontdesk-notifications/components/ticket-notification-item";
import { InfiniteScrollObserver } from "@/widgets/frontdesk-notifications/components/infinite-scroll-observer";
import { useFrontdeskNotifications } from "@/widgets/frontdesk-notifications/hooks/use-frontdesk-notifications";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useTheme } from "@/contexts/theme/useTheme";

const FrontDeskNav = () => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const open = Boolean(anchorEl);
  const { CheckPermission } = useUserPermission();
  const {
    messageNotifications,
    ticketNotifications,
    counts,
    loading,
    error,
    hasMore,
    isLoadingMore,
    handleNotificationClick,
    navigateToFrontdesk,
    retryFetch,
    loadMore,
  } = useFrontdeskNotifications();

  const { getIconOverride, currentTheme } = useTheme();

  // Get theme-aware Help icon (HP Client icon when theme is active)
  const FrontDeskIcon = getIconOverride("FrontDeskIcon");

  // Make background color theme-aware: transparent for HP theme, default gray for others
  const iconButtonBackground = currentTheme === "hp-client" ? "transparent" : "#f6f6f6";

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

  const handleRetry = () => {
    retryFetch();
  };

  const renderIconButton = () => (
    <CustomTooltip title="FrontDesk" arrow>
      <IconButton style={{ backgroundColor: iconButtonBackground, padding: "8px" }} onClick={handleClick}>
        {FrontDeskIcon ? (
          <FrontDeskIcon width={20} height={20} />
        ) : (
          <EmailOutlinedIcon style={{ color: "#2e3092", width: 22, height: 22 }} />
        )}
      </IconButton>
    </CustomTooltip>
  );

  const renderLoadingState = () => (
    <Box
      sx={{
        padding: "60px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={40} sx={{ color: primaryColor(500) }} />
      <Typography sx={{ ...FONT_FAMILY.Lexend(400, 14), color: neutralColor(600) }}>Loading notifications...</Typography>
    </Box>
  );

  const renderErrorState = () => (
    <Box
      sx={{
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 48, color: "#EF4444" }} />
      <Typography sx={{ ...FONT_FAMILY.Lexend(600, 16), color: neutralColor(900) }}>Failed to load notifications</Typography>
      <Typography sx={{ ...FONT_FAMILY.Lexend(400, 13), color: neutralColor(600) }}>
        {error || "An error occurred while fetching notifications"}
      </Typography>
      <Button
        onClick={handleRetry}
        startIcon={<RefreshIcon />}
        sx={{
          ...FONT_FAMILY.Lexend(600, 14),
          color: primaryColor(500),
          textTransform: "none",
          padding: "8px 16px",
          "&:hover": {
            backgroundColor: `${primaryColor(500)}10`,
          },
        }}
      >
        Retry
      </Button>
    </Box>
  );

  const renderEmptyState = (type: "messages" | "tickets") => (
    <Box
      sx={{
        padding: "40px 20px",
        textAlign: "center",
        color: neutralColor(400),
      }}
    >
      <Typography sx={{ ...FONT_FAMILY.Lexend(400, 14) }}>
        {type === "messages" ? "No new message notifications" : "No new ticket notifications"}
      </Typography>
    </Box>
  );

  const renderTabContent = () => {
    // Show loading state on first load
    if (loading && messageNotifications.length === 0 && ticketNotifications.length === 0) {
      return renderLoadingState();
    }

    // Show error state if error exists and no notifications loaded
    if (error && messageNotifications.length === 0 && ticketNotifications.length === 0) {
      return renderErrorState();
    }

    // Show tab content
    return (
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
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
              {/* Infinite scroll loader */}
              <InfiniteScrollObserver onLoadMore={loadMore} hasMore={hasMore} isLoading={isLoadingMore} />
            </Stack>
          ) : (
            renderEmptyState("messages")
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {ticketNotifications.length > 0 ? (
            <Stack>
              {ticketNotifications.map((notification) => (
                <TicketNotificationItem key={notification.id} notification={notification} onClick={handleNotificationItemClick} />
              ))}
              {/* Infinite scroll loader */}
              <InfiniteScrollObserver onLoadMore={loadMore} hasMore={hasMore} isLoading={isLoadingMore} />
            </Stack>
          ) : (
            renderEmptyState("tickets")
          )}
        </TabPanel>
      </Box>
    );
  };

  const renderMenu = () => (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      noListPadding
      sx={{
        "& .MuiPaper-root": {
          width: 420,
          maxHeight: 600,
        },
      }}
    >
      <Stack width="100%" height="100%">
        {/* Header */}
        <Box
          sx={{
            padding: "16px 20px",
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
              marginTop: "4px",
            }}
          >
            {counts.total} unread notification{counts.total !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* Tabs - hide during loading or error on initial load */}
        {!(loading && messageNotifications.length === 0 && ticketNotifications.length === 0) &&
          !(error && messageNotifications.length === 0 && ticketNotifications.length === 0) && (
            <NotificationTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              messageBadgeCount={counts.messages}
              ticketBadgeCount={counts.tickets}
            />
          )}

        {/* Tab Content / Loading / Error */}
        {renderTabContent()}

        {/* Footer Button */}
        <Box
          sx={{
            padding: "12px 20px",
            borderTop: `1px solid ${neutralColor(200)}`,
          }}
        >
          <PrimaryButton
            onClick={handleOpenFrontdesk}
            style={{
              width: "100%",
              backgroundColor: primaryColor(500),
              color: "#ffffff",
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "6px",
            }}
          >
            Open FrontDesk
          </PrimaryButton>
        </Box>
      </Stack>
    </GoMakeMenu>
  );

  return !CheckPermission(Permissions.SHOW_FRONT_DESK) ? (
    <div></div>
  ) : counts.total > 0 ? (
    <Badge
      style={{ padding: "2px" }}
      badgeContent={counts.total}
      color="error"
      max={99}
      componentsProps={{
        badge: {
          style: {
            right: "-5px",
            transform: "none",
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

export { FrontDeskNav };
