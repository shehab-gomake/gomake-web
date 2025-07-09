import { Badge, IconButton, Stack } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
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

const SystemNotifications = () => {
  const [notifications, setNotifications] = useRecoilState(
    systemNotificationsState
  );
  const { callApi } = useGomakeAxios();
  const { pathname } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { successColor, errorColor, primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const handelClick = async (event) => {
    if (notifications.length > 0) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
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

  return (
    <Badge
      style={{ padding: "2px" }}
      badgeContent={notifications.length}
      color={"warning"}
      invisible={notifications.length === 0}
    >
      <CustomTooltip title={t("header.notifications")} arrow>
        <IconButton
          style={{ backgroundColor: "#f6f6f6", padding: "8px" }}
          onClick={handelClick}
        >
          <NotificationsNoneOutlinedIcon style={{ color: "#2e3092" }} />
        </IconButton>
      </CustomTooltip>

      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <Stack
          width={"auto"}
          padding={"10px 20px 0 20px"}
          height={"fit-content"}
        >
          <Stack gap={"10px"}>
            {notifications?.map((notification) => (
              <Stack gap={"10px"}>
                <Stack
                  style={{ cursor: "pointer" }}
                  onClick={() => markNotificationAsRead(notification.id)}
                  direction={"row"}
                  alignItems={"center"}
                  gap={"10px"}
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
                  <Stack gap={"5px"}>
                    <NotificationMessageComponent {...notification} />
                    <MessageDateTimeComponent
                      date={new Date(notification.createdDate)}
                    />
                  </Stack>
                </Stack>
                <Divider flexItem orientation={"horizontal"} />
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
    </Badge>
  );
};
export { SystemNotifications };
