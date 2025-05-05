import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      button: {
        width: "fit-content",
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
      },
      datepickerContainer: {
        direction: "ltr" as "ltr",
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "5px",
        borderRadius: "16px",
      },
      buttonText: {
        lineHeight: "20px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        // maxWidth: "120px", // Adjust as needed
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
