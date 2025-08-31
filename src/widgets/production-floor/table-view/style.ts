import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = ({ textColor }) => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      categoryLabel: {
        ...FONT_FAMILY.Lexend(600, 12),
        color: primaryColor(500),
        padding: "2px 12px",
        backgroundColor: primaryColor(50),
        borderRadius: 17,
      },
      statusLabel: {
        color: "#FFF",
        ...FONT_FAMILY.Lexend(500, 13),
        width: "100%",
        textTransform: "capitalize",
        justifyContent: "center",
        boxSizing: "border-box",
        display: "flex",
      },
      borderRadius: {
        borderRadius: "4px",
      },
      // currentStationBtn: {
      //     borderRadius: 0,
      //     border: 0,
      //     backgroundColor: primaryColor(500),
      //     '&:hover': {
      //         backgroundColor: primaryColor(500),
      //         opacity: 0.8
      //     },
      //     '&.Mui-disabled': {
      //         backgroundColor: primaryColor(500),
      //         color: "#FFF"
      //     }
      // },
      currentStationBtn: {
        boxShadow: "none",
        backgroundColor: "transparent",
        // ...FONT_FAMILY.Inter(600, 12),
        ...FONT_FAMILY.Inter(500, 14),
        // color: textColor || primaryColor(600),
        color: "#475467",
        fontStyle: "normal",
        textTransform: "capitalize" as "capitalize",
        gap: "2px",
        "&:hover": {
          backgroundColor: "transparent",
          color: textColor || primaryColor(600),
          boxShadow: "none",

          //  opacity: 0.8
        },
      },
      moveToBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "4px",
        background: "rgba(46, 48, 146, 0.10)",
        color: "#2E3092",
        gap: "5px",
        flexShrink: 0,
        height: 36,
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      moveToText: {
        ...FONT_FAMILY.Inter(500, 10),
        color: primaryColor(600),
        textAlign: "center" as "center",
        fontStyle: "italic",
        lineHeight: "20px",
        textTransform: "initial" as "initial",
      },
      actionText: {
        color: primaryColor(600),
        // ...FONT_FAMILY.Inter(500, 12),
        ...FONT_FAMILY.Inter(500, 14),
        fontStyle: "normal",
        lineHeight: "20px",
        textTransform: "capitalize" as "capitalize",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "calc(100% - 20px)", // Leave space for arrow icon
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
