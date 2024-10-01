import { adaptRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Source } from "./use-actions-list";

const useStyle = ({ source }: any) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const oppositeDir = dir === "rtl" ? "ltr" : "rtl";
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
        ...adaptRight(oppositeDir, 0),
        top: source === Source.USERS ? "-610px" : "110%",
        maxWidth: "500px",
        width: "fit-content",
        height: "fit-content",
        maxHeight: "600px",
        overflowY: "hidden",
        overflowX: "hidden",
        zIndex: 99999999999999,
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
        padding: "5px",
        maxHeight: "300px",
        overflowY: "scroll" as "scroll",
      },
      applyBtnContainer: {
        position: "sticky" as "sticky",
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "#FFF",
        zIndex: 1,
      },
      applyBtnStyle: {
        width: "100%",
        borderRadius: "0px 0px 8px 8px",
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
        width: "150px",
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
        color: "#98A2B3",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
