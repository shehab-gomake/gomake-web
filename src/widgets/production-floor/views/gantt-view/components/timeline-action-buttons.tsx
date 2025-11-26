import { Button, Stack } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import RestoreIcon from "@mui/icons-material/Restore";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { restoreOldBoardApi } from "@/services/api-service/jobs-time-line/jobs-time-line-endpoints";
import moment from "moment";

interface TimelineActionButtonsProps {
  hasLocalChanges: () => boolean;
  isSubmitting: boolean;
  isRecovering: boolean;
  isTimeLineLocked: boolean;
  rescheduleSuccess: boolean;
  isRTL: boolean;
  onRescheduleClick: () => void;
  onRecoverClick: () => void;
  clearAllLocalChanges: () => void;
  setRescheduleSuccess: (value: boolean) => void;
  getData: (month: number) => void;
  currentMonth: moment.Moment;
  callApi: any;
  alertSuccessUpdate: () => void;
  alertFaultUpdate: () => void;
}

export const TimelineActionButtons = ({
  hasLocalChanges,
  isSubmitting,
  isRecovering,
  isTimeLineLocked,
  rescheduleSuccess,
  isRTL,
  onRescheduleClick,
  onRecoverClick,
  clearAllLocalChanges,
  setRescheduleSuccess,
  getData,
  currentMonth,
  callApi,
  alertSuccessUpdate,
  alertFaultUpdate,
}: TimelineActionButtonsProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  const handleResetClick = async () => {
    if (hasLocalChanges()) {
      // Case 1: Reset local changes (current behavior)
      clearAllLocalChanges();
      setRescheduleSuccess(false); // Reset success state when clearing local changes
      getData(currentMonth.clone().month());
    } else if (rescheduleSuccess) {
      // Case 2: Restore old board after successful reschedule
      await restoreOldBoardApi(callApi, (res) => {
        if (res.success) {
          alertSuccessUpdate();
          setRescheduleSuccess(false);
          getData(currentMonth.clone().month());
        } else {
          alertFaultUpdate();
        }
      });
    }
  };

  return (
    <Stack direction="row" gap={1}>
      <Button
        variant="contained"
        startIcon={<BoltIcon />}
        disabled={!hasLocalChanges() || isSubmitting || isTimeLineLocked}
        onClick={onRescheduleClick}
        sx={classes.rescheduleButton(isRTL)}
      >
        {isSubmitting ? "Submitting..." : t("productionFloor.reSchedule")}
      </Button>

      <Button
        variant="contained"
        startIcon={<RestoreIcon />}
        disabled={isRecovering || isTimeLineLocked}
        onClick={onRecoverClick}
        sx={classes.recoverButton(isRTL)}
      >
        {isRecovering ? "Recovering..." : t("productionFloor.recoverOverdue")}
      </Button>

      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        disabled={
          (!hasLocalChanges() && !rescheduleSuccess) || isTimeLineLocked
        }
        onClick={handleResetClick}
        sx={classes.resetChangesButton(isRTL)}
      >
        {t("productionFloor.resetChanges")}
      </Button>
    </Stack>
  );
};
