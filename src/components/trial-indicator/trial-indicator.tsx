import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { useStyle } from "./style";
import AccessAlarmsOutlinedIcon from "@mui/icons-material/AccessAlarmsOutlined";

const TrialIndicator: React.FC = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const printHouseProfileState = useRecoilValue(printHouseProfile);

  // Don't show if not a trial account
  if (!printHouseProfileState?.isTrial) {
    return null;
  }

  const getTrialStatus = () => {
    if (printHouseProfileState?.trialFinished) {
      return {
        text: t("trial.trialFinished"),
        color: "#DC2626",
        backgroundColor: "#FEF2F2",
        borderColor: "#FCA5A5",
        iconColor: "#DC2626",
      };
    }

    const remainingDays = printHouseProfileState?.remainingTrialDays || 0;
    const maxDays = printHouseProfileState?.maxTrialDays || 14;

    if (remainingDays <= 3) {
      return {
        text: t("trial.remainingDays", { days: remainingDays }),
        color: "#EA580C",
        backgroundColor: "#FFF7ED",
        borderColor: "#FDBA74",
        iconColor: "#EA580C",
      };
    }

    return {
      text: t("trial.remainingDays", { days: remainingDays }),
      color: "#059669",
      backgroundColor: "#ECFDF5",
      borderColor: "#6EE7B7",
      iconColor: "#059669",
    };
  };

  const status = getTrialStatus();

  return (
    <div style={classes.container}>
      <div
        style={{
          ...classes.indicator,
          color: status.color,
          backgroundColor: status.backgroundColor,
          borderColor: status.borderColor,
        }}
      >
        <AccessAlarmsOutlinedIcon
          style={{
            ...classes.icon,
            color: status.iconColor,
          }}
        />
        <div style={classes.text}>{status.text}</div>
      </div>
    </div>
  );
};

export { TrialIndicator };
