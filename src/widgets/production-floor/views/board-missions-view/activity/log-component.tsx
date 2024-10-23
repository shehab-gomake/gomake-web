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
  activityDate
}: IBoardMissionsActivity) => {
  const { t } = useTranslation();
  const logTypeTextKey =
    logType === EActivityLogType.UPDATE_STATUS
      ? "logs.updateStatus"
      : logType === EActivityLogType.MOVE_TO_NEXT_STATION
        ? "logs.nextStation"
        : logType === EActivityLogType.MOVE_TO_PREV_STATION
          ? "logs.prevStation"
          : "";
  const logFromToText =
    logType === EActivityLogType.UPDATE_STATUS
      ? `${t("logs.from")}: ${t("productionStatuses." + values.source)}  ${t(
        "logs.to"
      )}: ${t("productionStatuses." + values.current)}`
      : `${t("logs.from")}: ${values.source} ${t("logs.to")}: ${values.current
      }`;
  const logText = `${t(logTypeTextKey)} | ${logFromToText}`;
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
        <span style={{ textAlign: "right", ...FONT_FAMILY.Inter(400, 14), marginTop: 5 }}>{DateFormatterDDMMYYYY(activityDate)}</span>
      </Stack>
    </Stack>
  );
};

export { LogComponent };
