import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useState } from "react";
import { IBoardMissionsStationTimer } from "@/widgets/production-floor/views/board-missions-view/stations/interface";
import { CircularProgress, IconButton } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { FONT_FAMILY } from "@/utils/font-family";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { useRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";

interface IProps extends IBoardMissionsStationTimer {
  onToggle?: (seconds: number) => void;
  loading?: boolean;
}

const ActionCountDown = ({
  isTimerRunning,
  totalRunningTime,
  onToggle,
  loading = false,
}: IProps) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [boardMissionsDetails] = useRecoilState(boardMissionsDetailsState);
  const { errorColor } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  useEffect(() => {
    setSeconds(totalRunningTime || 0);
    setIsActive(isTimerRunning);
  }, [isTimerRunning, totalRunningTime]);

  // Countdown logic (allows negative values)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // const formatTime = useCallback(() => {
  //   const absSeconds = Math.abs(seconds);
  //   const hours = Math.floor(absSeconds / 3600);
  //   const minutes = Math.floor((absSeconds % 3600) / 60);
  //   const remainingSeconds = absSeconds % 60;

  //   return `${hours.toString().padStart(2, "0")}:${minutes
  //     .toString()
  //     .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  // }, [seconds]);

  const formatTime = useCallback(() => {
    const absSeconds = Math.abs(seconds);
    const hours = Math.floor(absSeconds / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const remainingSeconds = absSeconds % 60;

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

    return seconds < 0 ? `-${formattedTime}` : formattedTime;
  }, [seconds]);

  return (
    <Stack direction={"row"} alignItems={"flex-end"}>
      <PermissionCheck
        userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}
      >
        {boardMissionsDetails?.currentBoardMissionActionId && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsActive((prev) => !prev); // Toggle timer state
              if (onToggle) {
                onToggle(seconds);
              }
            }}
          >
            {loading ? (
              <CircularProgress size={32} />
            ) : isActive ? (
              <PauseCircleIcon style={{ color: "#43459D", fontSize: "32px" }} />
            ) : (
              <PlayCircleIcon
                style={{
                  color: "#43459D",
                  fontSize: "32px",
                  transform: isRTL ? "scaleX(-1)" : "none",
                }}
              />
            )}
          </IconButton>
        )}
      </PermissionCheck>
      <span
        style={{
          ...FONT_FAMILY.Inter(600, 30),
          color: seconds < 0 ? errorColor(500) : "#101828",
          alignItems: "center",
        }}
      >
        {formatTime()}
      </span>
    </Stack>
  );
};

export { ActionCountDown };
