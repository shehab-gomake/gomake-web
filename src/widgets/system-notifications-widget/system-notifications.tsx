import {
  Badge,
  IconButton,
  Stack,
  Popover,
  Typography,
  Box,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { GoMakeMenu } from "@/components";
import { useRecoilState } from "recoil";
import {
  ENotificationType,
  systemNotificationsState,
} from "@/store/system-notifications";
import Divider from "@mui/material/Divider";
import { PrimaryButton } from "@/components/button/primary-button";
import { useRouter } from "next/router";
import {
  getUnreadNotificationsApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadByIdApi,
} from "@/services/api-service/system-notifications/system-notifications-endpoints";
import { NotificationMessageComponent } from "@/widgets/system-notifications-widget/component/notification-message-component";
import { useTranslation } from "react-i18next";
import { MessageDateTimeComponent } from "@/widgets/messenger/components/message-date-time-component";
import { CustomTooltip } from "../header";
import { useTheme } from "@/contexts/theme";

const SystemNotifications = () => {
  const { getIconOverride, currentTheme } = useTheme();
  const [notifications, setNotifications] = useRecoilState(
    systemNotificationsState
  );
  const { callApi } = useGomakeAxios();
  const { pathname } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [noNotificationsAnchorEl, setNoNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const noNotificationsOpen = Boolean(noNotificationsAnchorEl);
  const { successColor, errorColor, primaryColor } = useGomakeTheme();
  const { t } = useTranslation();

  const isHpClient = currentTheme === "hp-client";
  const NotificationsIcon = getIconOverride("NotificationsIcon");
  const iconButtonBackground = isHpClient ? "transparent" : "#f6f6f6";
  const showIconBadge = isHpClient && notifications.length > 0;

  const handelClick = async (event) => {
    if (notifications.length > 0) {
      setAnchorEl(event.currentTarget);
    } else {
      setNoNotificationsAnchorEl(event.currentTarget);
      // Auto close after 3 seconds
      setTimeout(() => {
        setNoNotificationsAnchorEl(null);
      }, 2000);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNoNotificationsClose = () => {
    setNoNotificationsAnchorEl(null);
  };

  const getNotifications = async () => {
    const callBack = (res) => {
      if (res.success) {
        setNotifications(res?.data);
      }
    };
    await getUnreadNotificationsApi(callApi, callBack);
  };

  const markNotificationsASRead = async () => {
    const callBack = (res) => {
      if (res.success) {
        setNotifications([]);
        handleClose();
      }
    };
    await markAllNotificationsAsReadApi(callApi, callBack);
  };

  const markNotificationAsRead = async (id: string) => {
    const callBack = (res) => {
      if (res.success) {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id != id)
        );
      }
    };
    await markNotificationAsReadByIdApi(callApi, callBack, id);
  };

  useEffect(() => {
    getNotifications().then();
  }, [pathname]);

  const getNotificationStatusColor = (
    notificationType: ENotificationType
  ): string => {
    switch (notificationType) {
      case ENotificationType.QUOTE_APPROVED_STATUS:
        return successColor(500);
      case ENotificationType.BOARD_MISSIONS_APPROVED_STATUS:
        return successColor(500);
      case ENotificationType.BOARD_MISSIONS_REJECTED_STATUS:
        return errorColor(500);
      case ENotificationType.QUOTE_REJECTED_STATUS:
        return errorColor(500);
      default:
        return primaryColor(500);
    }
  };

  const renderIconButton = () => (
    <CustomTooltip title={t("header.notifications")} arrow>
      <IconButton
        style={{ backgroundColor: iconButtonBackground, padding: "8px" }}
        onClick={handelClick}
      >
        {NotificationsIcon ? (
          <NotificationsIcon width={22} height={22} showBadge={showIconBadge} />
        ) : (
          <NotificationsNoneOutlinedIcon style={{ color: "#2e3092" }} />
        )}
      </IconButton>
    </CustomTooltip>
  );

  const renderMenu = () => (
    <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
      <Stack width="auto" padding="10px 20px 0 20px" height="fit-content">
        <Stack gap="10px">
          {notifications?.map((notification) => (
            <Stack gap="10px" key={notification.id}>
              <Stack
                style={{ cursor: "pointer" }}
                onClick={() => markNotificationAsRead(notification.id)}
                direction="row"
                alignItems="center"
                gap="10px"
              >
                <div
                  style={{
                    borderRadius: "50%",
                    backgroundColor: getNotificationStatusColor(
                      notification.type
                    ),
                    height: "15px",
                    width: "15px",
                  }}
                />
                <Stack gap="5px">
                  <NotificationMessageComponent {...notification} />
                  <MessageDateTimeComponent
                    date={new Date(notification.createdDate)}
                  />
                </Stack>
              </Stack>
              <Divider flexItem orientation="horizontal" />
            </Stack>
          ))}
        </Stack>
        <PrimaryButton
          onClick={markNotificationsASRead}
          style={{
            color: primaryColor(200),
            padding: 0,
            fontSize: 12,
          }}
        >
          {t("notifications.markAsRead")}
        </PrimaryButton>
      </Stack>
    </GoMakeMenu>
  );

  const renderNoNotificationsPopover = () => (
    <Popover
      open={noNotificationsOpen}
      anchorEl={noNotificationsAnchorEl}
      onClose={handleNoNotificationsClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      PaperProps={{
        style: {
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: "20px",
          minWidth: 240,
          textAlign: "center",
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#e8f5e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 24,
                color: "#4caf50",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: primaryColor(500),
              fontWeight: 600,
              fontSize: "16px",
              mb: 0.5,
            }}
          >
            {t("notifications.allCaughtUp") || "All caught up!"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontWeight: 400,
              fontSize: "13px",
              lineHeight: 1.4,
            }}
          >
            {t("notifications.noNewNotifications") ||
              "No new notifications at the moment"}
          </Typography>
        </Stack>
      </Box>
    </Popover>
  );

  const showBadge = currentTheme !== "hp-client" && notifications.length > 0;

  return notifications.length > 0 ? (
    showBadge ? (
      <Badge
        style={{ padding: "2px" }}
        badgeContent={notifications.length}
        color="warning"
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
    )
  ) : (
    <>
      {renderIconButton()}
      {renderNoNotificationsPopover()}
    </>
  );
};
export { SystemNotifications };
