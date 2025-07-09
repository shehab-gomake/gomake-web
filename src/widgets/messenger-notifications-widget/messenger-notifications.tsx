import { Badge, IconButton } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getUserUnreadMessagesCountApi } from "@/services/api-service/chat/quick-blox-chat-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState } from "recoil";
import { unreadMessagesCountState } from "@/store/unread-messages-count";
import { CustomTooltip } from "../header";
import { useTranslation } from "react-i18next";

const MessengerNotifications = () => {
  const { pathname, push } = useRouter();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [unreadMessagesCount, setUnreadMessagesCount] = useRecoilState(
    unreadMessagesCountState
  );
  const handelClick = async () => {
    await push("/messenger");
  };
  const getUnreadMessagesCount = async () => {
    const callBack = (res) => {
      if (res.success) {
        setUnreadMessagesCount(res?.data?.total);
      } else {
      }
    };
    await getUserUnreadMessagesCountApi(callApi, callBack);
  };
  useEffect(() => {
    getUnreadMessagesCount().then();
  }, [pathname]);

  return (
    <Badge
      style={{ padding: "2px" }}
      badgeContent={unreadMessagesCount}
      color={"warning"}
      invisible={unreadMessagesCount === 0}
    >
      <CustomTooltip title={t("header.messenger")} arrow>
        <IconButton
          style={{ backgroundColor: "#f6f6f6", padding: "8px" }}
          onClick={handelClick}
        >
          <EmailOutlinedIcon
            style={{ color: "#2e3092", width: 22, height: 22 }}
          />
        </IconButton>
      </CustomTooltip>
    </Badge>
  );
};
export { MessengerNotifications };
