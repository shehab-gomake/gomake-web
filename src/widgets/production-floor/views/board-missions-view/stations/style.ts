import { useMemo } from "react";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { adaptRight } from "@/utils/adapter";
import { useIsMobile } from "@/hooks/use-responsive";
const useStyle = () => {
  const { theme, neutralColor, primaryColor, secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const direction = t("direction");
  const isMobile = useIsMobile();

  const classes = useMemo(() => {
    return {
      detailTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(500),
        width: "max-content",
      },
      detailValue: {
        ...FONT_FAMILY.Inter(500, 14),
        color: primaryColor(900),
      },

      realTimeValue: {
        ...FONT_FAMILY.Inter(600, 14),
        color: primaryColor(900),
      },
      sectionTitle: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(500, 14),
      },
      machineTitle: {
        color: secondColor(500),
        ...FONT_FAMILY.Lexend(500, isMobile ? 12 : 14),
        textTransform: "capitalize" as "capitalize",
        "& .MuiButton-endIcon": {
          ...(direction === "rtl" && {
            marginRight: "0px",
            marginLeft: "0px",
          }),
        },
      },
      supplierTitle: {
        color: secondColor(500),
        ...FONT_FAMILY.Lexend(500, isMobile ? 12 : 14),
        textTransform: "capitalize" as "capitalize",
        padding: "7px 5px",
      },
      actionContainer: {
        padding: "5px 16px",
        borderRadius: "8px",
        width: "100%",
        backgroundColor: "#FFF",
        color: "#000",
      },
      addNoteBtn: {
        color: "#344054",
        borderColor: "#D0D5DD",
        borderRadius: "8px",
        height: "33px",
        lineHeight: "15px",
        "& .MuiButton-startIcon": {
          ...(direction === "rtl" && { margin: "8px 0" }),
        },
        "&:hover": {
          backgroundColor: "transparent",
          borderColor: "#D0D5DD",
        },
        "&:focus": {
          outline: "none",
          borderColor: "#D0D5DD",
        },
        "&:active": {
          outline: "none",
          borderColor: "#D0D5DD",
        },
      },
      actionContainerBorder: "2px solid " + primaryColor(500),
      toggleActionButton: {
        backgroundColor: primaryColor(50),
        borderRadius: 8,
        height: 40,
        width: 40,
      },
      toggleSubWorkFlowActionButton: {
        backgroundColor: primaryColor(600),
        borderRadius: 8,
        height: 30,
        width: 30,
        color: "white",
      },
      workFlowContainer: {
        padding: "10px 16px",
        borderRadius: 16,
        backgroundColor: "#F9FAFB",
      },
      subWorkFlowContainer: {
        padding: "10px 16px",
        borderRadius: 16,
        backgroundColor: primaryColor(300),
        color: "white",
      },
      buttonGroup: {
        borderRadius: "5px",
        border: "1px solid" + primaryColor(500),
        overflow: "hidden",
        width: "400px",
      },
      button: {
        width: "200px",
        borderRadius: 0,
        border: 0,
        "&:hover": {
          width: "200px",
          borderRadius: 0,
          border: 0,
        },
      },
      sourceLabel: {
        padding: "3px 10px",
        backgroundColor: "#F4F3FF",
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#5925DC",
        borderRadius: "16px",
        textAlign: "center" as "center",
      },
      outSourceLabel: {
        borderRadius: "8px",
        border: "1px solid #B9E6FE",
        background: "#F0F9FF",
        display: "inline-flex",
        padding: "var(--spacing-xs, 4px) 10px",
        alignItems: "center",
        //Text style
        color: "#026AA2",
        textAlign: "center" as "center",
        lineHeight: "20px",
        ...FONT_FAMILY.Inter(500, 14),
      },
      subWorkFlowDividerVertical: {
        width: "2px",
        backgroundColor: "#667085",
        margin: "",
        top: 0,
        bottom: "50%",
        height: "50%",
        ...adaptRight(direction, 5),
      },
      dividerStyle: {
        height: "60%",
        alignSelf: "center",
        color: "#D6D6D6",
      },
      paperStyle: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        maxHeight: "200px",
        overflowY: "auto",
        zIndex: 9999999999999999999,
      },
    };
  }, [theme, direction, isMobile]);
  return {
    classes,
  };
};
export { useStyle };
