import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = (isRtl: boolean) => {
  const { primaryColor, theme, grayColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        position: "fixed",
        bottom: 24,
        [isRtl ? "left" : "right"]: 24,
        width: 280,
        borderRadius: "16px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        p: 2,
        backgroundColor: "#ffffff",
        zIndex: 1300,
      },
      secondGuide: {
        color: grayColor(500),
        position: "fixed",
        top: 9,
        [isRtl ? "left" : "right"]: 1,
        [isRtl ? "marginLeft" : "marginRight"]: "265px",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        background: "#F6F6F6",
        borderRadius: "999px",
        px: 2,
        py: 1,
        cursor: "pointer",
        zIndex: 1300,
      },
      listItemText: {
        color: "#333333",
        fontSize: "14px",
        textAlign: isRtl ? ("right" as "right") : ("left" as "left"),
      },
      listSubItemText: {
        color: "#333333",
        fontSize: "13px",
        textAlign: isRtl ? ("right" as "right") : ("left" as "left"),
      },
      linearProgress: {
        height: 6,
        borderRadius: 3,
        "& .MuiLinearProgress-bar": {
          backgroundColor: primaryColor(500),
        },
      },
      circularProgress: {
        color: primaryColor(500), // Active progress color
        backgroundColor: "transparent",
        "& .MuiCircularProgress-circle": {
          strokeLinecap: "round",
        },
        "&.MuiCircularProgress-root": {
          position: "relative",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          boxSizing: "border-box",
          border: "3px solid #E0E0E0", // background ring
          zIndex: -1,
        },
      },
      checkBox: {
        color: primaryColor(500),
        "&.Mui-checked": {
          color: primaryColor(400),
        },
      },
      btnStyle: {
        backgroundColor: primaryColor(500),
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: primaryColor(200),
        },
      },
    };
  }, [theme, isRtl]);

  return {
    classes,
  };
};
export { useStyle };
