import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { adaptRight } from "@/utils/adapter";
import { direction } from "html2canvas/dist/types/css/property-descriptors/direction";
import { useTranslation } from "react-i18next";

const useStyle = ({ headerHeight }) => {
  const { theme, grayColor, primarySecondaryBlend } = useGomakeTheme();
  const { t } = useTranslation();
  const direction = t("direction");
  const classes = useMemo(() => {
    return {
      tableRowStyle: {
        height: headerHeight,
        background: primarySecondaryBlend(300),
        color: "white",
      },
      tableHeaderStyle: {
        borderRight: `1px solid ${grayColor(200)}`,
        color: "#FFF",
        textAlign: "center" as "center",
        ...FONT_FAMILY.Inter(400, 12),
      },
      cellContainerStyle: {
        textAlign: "center" as "center",
        padding: "16px 24px",
      },
      tableFooterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        boxShadow: " 0px 1px 3px 0px #1018281A",
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        marginBottom: 45,
      },
      firstRowForFooterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
      },
      evenRowContainer: {
        display: "flex",
        textAlign: "center" as "center",
        padding: "12px 24px",
        color: "#FFFF",
        background: primarySecondaryBlend(300),
        ...FONT_FAMILY.Inter(500, 12),
        height: 44,
        borderBottom: `1px solid ${grayColor(200)}`,
      },
      oddRowContainer: {
        display: "flex",
        padding: "12px 24px",
        background: "#FFFFFFF",
        ...FONT_FAMILY.Inter(400, 14),
        height: 44,
        borderBottom: `1px solid ${grayColor(200)}`,
      },
      cellTextInputStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      subWorkFlowDividerVertical: {
        width: "2px",
        backgroundColor: "#99A9CA",
        margin: "-20px 40px",
        // top: 5,
        bottom: "39.5%",
        height: "20%",
        ...adaptRight(direction, 5),
      },
    };
  }, [theme]);

  return {
    classes,
  };
};

export { useStyle };
