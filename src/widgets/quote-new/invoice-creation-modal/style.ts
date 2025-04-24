import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "544px",
        minWidth: "400px",
        borderRadius: "8px",
        height: "auto",
        maxHeight: 600,
        zIndex: 999999,
        padding: "20px",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "20px",
      },
      sectionTitle: {
        ...FONT_FAMILY.Inter(500, 16),
        color: "#344054",
        width: "100%",
      },
      optionsButtons: {
        "& .MuiButton-startIcon": {
          margin: "0 5px",
        },
        ...FONT_FAMILY.Inter(600, 16),
        width: "100%",
        borderRadius: "8px",
        height: "40px",
        backgroundColor: "#FFFFFF",
        color: "#344054",
        border: "1px solid #D0D5DD",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "capitalize" as "capitalize",
      },
      delBtn: {
        textTransform: "capitalize" as "capitalize",
        ...FONT_FAMILY.Inter(600, 16),
        boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
        width: "100%",
        height: "40px",
        border: "1px solid #10B981",
        backgroundColor: "#FFFFFF",
        color: "#10B981",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "#ECFDF3",
        },
        "& .MuiButton-startIcon": {
          margin: "0 5px",
        },
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
