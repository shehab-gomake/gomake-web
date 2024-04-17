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
      detailValue: {
        ...FONT_FAMILY.Inter(500, 14),
        color: primaryColor(900),
      },
      sectionTitle: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(500, 14),
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
      toggleSubWorkFlowActionButton: {
        backgroundColor: primaryColor(600),
        borderRadius: 8,
        height: 40,
        width: 40,
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
        // width: "400px",
      },
      button: {
        width: "fit-content",
        borderRadius: 0,
        border: 0,
        "&:hover": {
          width: "fit-content",
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
    };
  }, [theme, direction]);
  return {
    classes,
  };
};
export { useStyle };
