import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "16px",
        minHeight: "85vh",
      },
      subContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        padding: "16px 21px 24px 32px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(238, 238, 238, 0.501967)",
        border: "1px solid #F8F9FA",
      },
      datesContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap" as "wrap",
        gap: 16,
        padding: "24px 21px 24px 32px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(238, 238, 238, 0.501967)",
        border: "1px solid #F8F9FA",
      },
      collapsibleTable: {
        "& .MuiTableRow-root": {
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        },
        "& .MuiTableCell-root": {
          borderBottom: "1px solid #e0e0e0",
        },
      },
      departmentRow: {
        backgroundColor: "#f8f9fa",
        "&:hover": {
          backgroundColor: "#e9ecef",
        },
      },
      searchBtnStyle: {
        display: "flex",
        height: 40,
        width: "fit-content",
        alignSelf: "flex-end",
      },
      stationRow: {
        "&:hover": {
          backgroundColor: "#f0f8ff",
        },
      },
      dateButton: {
        width: "fit-content",
        height: "40px",
        borderRadius: "8px",
        border: "1px solid rgba(208, 213, 221, 1)",
        backgroundColor: "#FFF",
        ...FONT_FAMILY.Lexend(500, 16),
        cursor: "pointer",
        color: "rgba(52, 64, 84, 1)",
        display: "flex",
        alignItems: "center" as "center",
        justifyContent: "center" as "center",
        gap: "8px",
        textTransform: "none" as "none",
      },
      buttonText: {
        lineHeight: "20px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...FONT_FAMILY.Lexend(500, 14),
        color: "rgba(52, 64, 84, 1)",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
