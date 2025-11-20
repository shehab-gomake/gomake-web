import { adaptLeft, adaptRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Source } from "./use-actions-list";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMediaQuery } from "@mui/material";

const useStyle = ({ source }: any) => {
  const { t } = useTranslation();
  const { secondColor, theme, primaryColor } = useGomakeTheme();
  const dir: "rtl" | "ltr" = t("direction");
  const oppositeDir = dir === "rtl" ? "ltr" : "rtl";
  const finalDir = source === Source.PRODUCTION_FLOOR ? oppositeDir : dir;
  const isMobile = useMediaQuery("(max-width:768px)");

  const classes = useMemo(() => {
    return {
      buttonStyle: {
        width: "163px",
        height: "36px",
        borderRadius: "8px",
        border: "1px solid rgba(208, 213, 221, 1)",
        backgroundColor: "#FFF",
        ...FONT_FAMILY.Lexend(500, 16),
        cursor: "pointer",
        color: "rgba(52, 64, 84, 1)",
        display: "flex",
        alignItems: "center" as "center",
        justifyContent: "center" as "center",
        gap: "4px",
        textTransform: "none" as "none",
        boxShadow: "none",
      },
      paperStyle: {
        position: "absolute",
        ...(isMobile ? adaptLeft(finalDir, 0) : adaptRight(finalDir, 0)),
        top: source === Source.USERS ? "-420px" : "110%",
        maxWidth: "500px",
        width: "fit-content",
        height: "fit-content",
        maxHeight: "600px",
        overflowY: "hidden",
        overflowX: "hidden",
        zIndex: 9999999999999,
        display: "flex",
        padding: "10px",
        gap: "10px",
      },
      searchFiledStyle: {
        borderRadius: "6px",
        background: "#FFF",
        display: "flex",
        border: "1px solid #D0D5DD",
        "& .MuiOutlinedInput-root": {
          "& input": {
            height: "40px",
            width: "100%",
          },
        },
      },
      listContainer: {
        position: "sticky" as "sticky",
        top: 0,
        backgroundColor: "#FFF",
        zIndex: 1,
      },
      optionsDiv: {
        padding: "5px 0px",
        maxHeight: "300px",
        overflowY: "auto" as "auto",
        scrollbarColor: "#CCCDCF #f1f1f1",
        scrollbarWidth: "thin" as "thin",
      },
      applyBtnContainer: {
        display: "flex",
        position: "sticky" as "sticky",
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "#FFF",
        zIndex: 1,
        gap: 8,
        padding: "5px 0px 0px 0px",
      },
      applyBtnStyle: {
        width: "100%",
        borderRadius: "8px",
      },
      departmentsContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        gap: "5px",
        maxHeight: "400px",
      },
      departmentsLabel: {
        display: "flex",
        ...FONT_FAMILY.Inter(500, 14),
        color: "#344054",
        height: "40px",
        alignItems: "center",
      },
      departmentTicket: {
        borderRadius: "6px",
        border: "1px solid #D0D5DD",
        background: "#FFF",
        display: "flex",
        //width: "150px",
        maxWidth: "180px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        minHeight: "37px",
        alignItems: "center",
        padding: "4px 4px 4px 10px",
        justifyContent: "space-between",
        cursor: "pointer",
      },
      departmentText: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
      clearIconStyle: {
        cursor: "pointer",
        fontSize: "14px",
      },
      iconContainer: {
        cursor: "pointer",
        backgroundColor: "#FFF",
        border: `2px solid ${secondColor(500)}`,
        width: 40,
        minWidth: 40,
        minHeight: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
      },
      actionButtonStyle: {
        width: "fit-content",
        padding: 1,
        gap: "5px",
        alignItems: "center",
        display: "flex",
        height: "32px",
      },
      jobTimeAlertsButtonStyle: {
        width: "fit-content",
        padding: 1,
        gap: "5px",
        alignItems: "center",
        display: "flex",
        height: "32px",
        marginBottom: "8px",
      },
      actionIconStyle: {
        height: "14px",
        width: "14px",
        padding: 0,
      },
      actionButtonTextStyle: {
        paddingTop: "2px",
        color: primaryColor(700) ?? "#344054",
        fontSize: 12,
      },
    };
  }, [theme, isMobile]);
  return {
    classes,
  };
};
export { useStyle };
