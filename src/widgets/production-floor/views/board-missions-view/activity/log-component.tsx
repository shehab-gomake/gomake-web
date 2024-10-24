import { IBoardMissionsActivity } from "@/widgets/production-floor/interfaces/board-missions-activity";
import { Avatar, Stack } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { EActivityLogType } from "@/widgets/production-floor/enums/activity-type";
import { useTranslation } from "react-i18next";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";

const LogComponent = ({
  userName,
  userImages,
  logType,
  values,
  activityDate,
}: IBoardMissionsActivity) => {
  const { t } = useTranslation();
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
    <Stack direction={"row"} gap={"12px"} alignItems={"flex-start"}>
      <Avatar src={userImages} />
      <Stack style={{ width: "100%", ...FONT_FAMILY.Inter(400, 16) }}>
        <span>{userName}</span>
        <div
          style={{
            backgroundColor: "#F2F4F7",
            borderRadius: "0 8px 8px 8px",
            padding: "10px 14px 10px 14px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <span style={{ width: "75%" }}>{logText}</span>
        </div>
        <span
          style={{
            textAlign: "right",
            ...FONT_FAMILY.Inter(400, 14),
            marginTop: 5,
          }}
        >
          {DateFormatterDDMMYYYY(activityDate)}
        </span>
      </Stack>
    </Stack>
  );
};

export { LogComponent };
