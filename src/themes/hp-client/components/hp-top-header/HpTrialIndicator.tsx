import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { useGomakeRouter } from "@/hooks";

const HpTrialIndicator: React.FC = () => {
  const { t } = useTranslation();
  const printHouseProfileState = useRecoilValue(printHouseProfile);
  const { navigate } = useGomakeRouter();

  if (!printHouseProfileState?.isTrial) {
    return null;
  }

  const getTrialStatus = () => {
    if (printHouseProfileState?.trialFinished) {
      return {
        text: t("trial.trialFinished"),
        color: "#CC2C00", // HP Client red from Figma (notification badge color)
        backgroundColor: "rgba(204, 44, 0, 0.1)", // 10% opacity of #CC2C00
        borderColor: "rgba(204, 44, 0, 0.2)", // 20% opacity of #CC2C00
      };
    }

    const remainingDays = printHouseProfileState?.remainingTrialDays || 0;
    if (remainingDays <= 3) {
      return {
        text: t("trial.remainingDays", { days: remainingDays }),
        color: "#F59E0B", // Orange/Yellow warning color
        backgroundColor: "rgba(245, 158, 11, 0.1)", // 10% opacity of #F59E0B
        borderColor: "rgba(245, 158, 11, 0.2)", // 20% opacity of #F59E0B
      };
    }

    return {
      text: t("trial.remainingDays", { days: remainingDays }),
      color: "#00843D",
      backgroundColor: "rgba(0, 132, 61, 0.1)", // 10% opacity of #00843D
      borderColor: "rgba(0, 132, 61, 0.2)", // 20% opacity of #00843D
    };
  };

  const status = getTrialStatus();

  // Use status colors from getTrialStatus for dynamic styling
  const badgeStyle: React.CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "4px 8px",
    gap: "4px",
    height: "30px",
    background: status.backgroundColor,
    border: `1px solid ${status.borderColor}`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const textStyle: React.CSSProperties = {
    height: "24px",
    fontFamily: '"Forma DJR UI", sans-serif',
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    color: status.color,
    flex: "none",
    order: 0,
    flexGrow: 0,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <div
      onClick={() => navigate("/settings/subscriptions")}
      style={badgeStyle}
      onMouseEnter={(e) => {
        // Slightly darken background on hover
        e.currentTarget.style.opacity = "0.9";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      <div style={textStyle}>{status.text}</div>
    </div>
  );
};

export default HpTrialIndicator;
