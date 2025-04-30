import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = (isRtl: boolean) => {
  const { primaryColor, theme } = useGomakeTheme();
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
      linearProgress: {
        height: 6,
        borderRadius: 3,
        "& .MuiLinearProgress-bar": {
          backgroundColor: primaryColor(500),
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
