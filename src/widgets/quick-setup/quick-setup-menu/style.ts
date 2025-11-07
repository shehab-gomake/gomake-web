import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { QuoteIfExistState } from "@/pages-components/quote-new/store/quote";
import { useMemo } from "react";
import { useRecoilState } from "recoil";

const useStyle = (isRtl: boolean, hasFrontDeskPermission: boolean = false, isChatbotOpen: boolean = false) => {
  const { primaryColor, theme, grayColor } = useGomakeTheme();
  const [QuoteIfExist] = useRecoilState<any>(QuoteIfExistState);

  const classes = useMemo(() => {
    return {
      mainContainer: {
        position: "fixed",
        top: 60,
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
        [isRtl ? "marginLeft" : "marginRight"]: (() => {
          let margin = 205; // Base margin for default header icons

          // Add cart icon width if showing quote cart
          if (QuoteIfExist && window.location.pathname !== "/quote") {
            margin += 45;
          }

          // Add frontDesk icon width if user has permission
          if (hasFrontDeskPermission) {
            margin += 45;
          }

          // Add chatbot sidebar width (default 500px) if chatbot is open
          if (isChatbotOpen) {
            margin += 500;
          }

          return `${margin}px`;
        })(),
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
  }, [theme, isRtl, QuoteIfExist, hasFrontDeskPermission, isChatbotOpen]);

  return {
    classes,
  };
};
export { useStyle };
