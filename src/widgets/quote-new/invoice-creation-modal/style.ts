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
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
