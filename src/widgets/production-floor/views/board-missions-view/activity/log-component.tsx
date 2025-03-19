import { IBoardMissionsActivity } from "@/widgets/production-floor/interfaces/board-missions-activity";
import { Avatar, Stack } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { EActivityLogType } from "@/widgets/production-floor/enums/activity-type";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "@/hooks/use-date-format";
import { UserIcon } from "@/components/icons/user-icon";

const LogComponent = ({
  userName,
  userImages,
  logType,
  values,
  activityDate,
}: IBoardMissionsActivity) => {
  const { t } = useTranslation();
  const { formatISODateTime } = useDateFormat();

  const logTypeTextKey = {
    [EActivityLogType.UPDATE_STATUS]: "logs.updateStatus",
    [EActivityLogType.MOVE_TO_NEXT_STATION]: "logs.nextStation",
    [EActivityLogType.MOVE_TO_PREV_STATION]: "logs.prevStation",
    [EActivityLogType.ORDER_ITEM_UPDATED]: "logs.orderItemUpdated",
    [EActivityLogType.CUSTOMER_CHAT_STARTED]: "logs.customerChatStarted",
    [EActivityLogType.APPROVE_FILE_SENT]: "logs.approveFileSent",
    [EActivityLogType.FILE_APPROVED]: "logs.fileApproved",
    [EActivityLogType.FILE_REJECTED]: "logs.fileRejected",
  }[logType];

  let logFromToText = "";

  if (logType === EActivityLogType.UPDATE_STATUS) {
    logFromToText = `${t("logs.from")}: ${t(
      "productionStatuses." + values.source
    )}  ${t("logs.to")}: ${t("productionStatuses." + values.current)}`;
  } else if (
    logType === EActivityLogType.MOVE_TO_NEXT_STATION ||
    logType === EActivityLogType.MOVE_TO_PREV_STATION
  ) {
    logFromToText = `${t("logs.from")}: ${values.source} ${t("logs.to")}: ${
      values.current
    }`;
  } else {
    logFromToText = "";
  }

  const logText = logFromToText
    ? `${t(logTypeTextKey)} | ${logFromToText}`
    : t(logTypeTextKey);

  return (
    <Stack
      direction={"row"}
      gap={"12px"}
      alignItems={"flex-start"}
      marginBottom={"20px"}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: "var(--radius-full, 9999px)",
          border:
            "0.75px solid var(--Component-colors-Components-Avatars-avatar-contrast-border, rgba(0, 0, 0, 0.08))",
          backgroundColor: "#F2F4F7",
        }}
      >
        {userImages ? (
          <img
            src={userImages}
            alt="User"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <UserIcon />
        )}
      </Avatar>

      <Stack
        gap={"10px"}
        style={{ width: "100%", ...FONT_FAMILY.Inter(400, 16) }}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <span
            style={{
              color: "#344054",
              ...FONT_FAMILY.Inter(500, 16),
              textTransform: "capitalize",
            }}
          >
            {userName}
          </span>

          <span
            style={{
              ...FONT_FAMILY.Inter(400, 14),
              color: "#475467",
            }}
          >
            {formatISODateTime(activityDate)}
          </span>
        </Stack>
        <div
          style={{
            borderRadius: "0 8px 8px 8px",
            padding: "10px 14px 10px 14px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
            border: "1px solid #EAECF0",
            backgroundColor: "#F9FAFB",
          }}
        >
          <span
            style={{
              width: "100%",
              color: "#101828",
              ...FONT_FAMILY.Inter(500, 16),
            }}
          >
            {logText}
          </span>
        </div>
      </Stack>
    </Stack>
  );
};

export { LogComponent };
