import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "30px",
        minHeight: "85vh",
      },
      subContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
        padding: "24px 21px 24px 32px",
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
      stationRow: {
        "&:hover": {
          backgroundColor: "#f0f8ff",
        },
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
