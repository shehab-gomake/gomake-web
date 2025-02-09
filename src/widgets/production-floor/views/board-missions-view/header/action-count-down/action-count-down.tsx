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

interface IProps extends IBoardMissionsStationTimer {
  onToggle?: (seconds: number) => void;
  loading?: boolean;
}

//!here new
const ActionCountDown = ({
  isTimerRunning,
  totalRunningTime, // totalRunningTime is now expected as a number (seconds)
  onToggle,
  loading = false,
}: IProps) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [boardMissionsDetails] = useRecoilState(boardMissionsDetailsState);

  // Initialize state with totalRunningTime (which is in seconds)
  useEffect(() => {
    setSeconds(totalRunningTime || 0);
    setIsActive(isTimerRunning);
  }, [isTimerRunning, totalRunningTime]);

  // Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);
    }

    if (seconds === 0 && isActive) {
      setIsActive(false); // Stop when it reaches 00:00
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  // Format seconds into MM:SS
  const formatTime = useCallback(() => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, [seconds]);

  return (
    <Stack direction={"row"} alignItems={"center"}>
      <PermissionCheck
        userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}
      >
        {boardMissionsDetails?.currentBoardMissionActionId && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onToggle(seconds);
            }}
          >
            {loading ? (
              <CircularProgress size={32} />
            ) : isActive ? (
              <PauseCircleIcon style={{ color: "#43459D", fontSize: "32px" }} />
            ) : (
              <PlayCircleIcon style={{ color: "#43459D", fontSize: "32px" }} />
            )}
          </IconButton>
        )}
      </PermissionCheck>
      <Stack direction="row" alignItems="baseline">
        <span
          style={{
            ...FONT_FAMILY.Inter(600, 32),
            color: "#101828",
          }}
        >
          {formatTime()}
        </span>
        <span
          style={{
            ...FONT_FAMILY.Inter(400, 16),
            color: "#101828",
            marginLeft: 4,
          }}
        >
          Min
        </span>
      </Stack>
    </Stack>
  );
};

export { ActionCountDown };
