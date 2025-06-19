import { useMemo } from "react";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { adaptRight } from "@/utils/adapter";
const useStyle = () => {
  const { theme, neutralColor, primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const direction = t("direction");
  const classes = useMemo(() => {
    return {
      detailTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(500),
      },
      insideStyle: {
        // width: "600px",
        height: "300px",
      },
      detailValue: {
        ...FONT_FAMILY.Inter(500, 14),
        color: primaryColor(900),
      },
      textAreaDetailValue: {
        ...FONT_FAMILY.Inter(900, 16),
        color: primaryColor(900),
      },
      sectionTitle: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(500, 14),
      },
      mobileSectionTitle: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(500, 13),
      },
      actionContainer: {
        backgroundColor: "#FFF",
        padding: "0 16px",
        borderRadius: 16,
        width: "100%",
      },
      actionContainerBorder: "2px solid " + primaryColor(500),
      toggleActionButton: {
        backgroundColor: primaryColor(50),
        borderRadius: 8,
        height: 40,
        width: 40,
      },
      toggleActionButtonMobile: {
        backgroundColor: primaryColor(50),
        borderRadius: 8,
        height: 30,
        width: 30,
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
        borderRadius: "8px",
        backgroundColor: primaryColor(300),
        color: "white",
      },
      buttonGroup: {
        borderRadius: "0px",
        // border: "1px solid" + primaryColor(500),
        overflow: "hidden",
        display: "flex",
        flexWrap: "nowrap",
        width: "max-content",
      },
      tabsContainer: {
        maxWidth: "800px",
        overflowX: "auto" as const,
        overflowY: "hidden" as const,
      },
      fixedOutSourceButton: {
        width: "fit-content",
        border: "none",
        borderRadius: 0,

      },
      button: {
        minWidth: "fit-content",
        borderRadius: 0,
        border: 0,
        whiteSpace: "nowrap",
        
        "&:hover": {
          minWidth: "fit-content",
          flex: "1 1 auto",
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
      subWorkFlowDividerVertical: {
        width: "2px",
        backgroundColor: "#667085",
        margin: "",
        top: 0,
        bottom: "50%",
        height: "50%",
        ...adaptRight(direction, 5),
      },
      nameStyle: {
        // marginRight: 12,
        ...FONT_FAMILY.Inter(400, 12),
        color: "#FFF",
      },
      secondPartStyle: {
        ...FONT_FAMILY.Inter(700, 14),
        color: "#FFF",
      },
      totalRealProductionTimeStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: "10px",
      },
      lineStyle: {
        ...FONT_FAMILY.Inter(500, 14),
        color: "#FFF",
        height: 20,
        width: 1,
        backgroundColor: "#FFF",
      },
      modalStyle: {
        width: "45%",
        minWidth: "350px",
        borderRadius: "8px",
        height: "auto",
        gap: "10px",
        zIndex: 5,
      },
      autoCompleteSelectedAction: {
        width: 200,
        height: 36,
        border: "1px solid #D0D5DD",
        borderRadius: 8,
        boxShadow: "none",
        backgroundColor: "#FFF",
      },
      autoCompleteSelectedSectionName: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        width: 140,
        height: 36,
        border: "1px solid #D0D5DD",
        borderRadius: 8,
        boxShadow: "none",
        backgroundColor: "#FFF",
        color: "#344054",
        ...FONT_FAMILY.Inter(500, 14),
      },
    };
  }, [theme, direction]);
  return {
    classes,
  };
};
export { useStyle };
