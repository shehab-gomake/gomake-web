import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, theme  ,grayColor} = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 15,
        width: "100%",
      },
      btnContainer: {
        width: "fit-content",
        lineHeight: "18px",
        textTransform: "inherit" as "inherit",
      },

      optionsButtons: {
        "& .MuiButton-startIcon": {
          margin: "0 5px",
        },
        ...FONT_FAMILY.Inter(600, 16),
        // width: "100%",
        borderRadius: "8px",
        height: "40px",
        backgroundColor: "#FFFFFF",
        color: grayColor(700),
        border: "1px solid #D0D5DD",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "capitalize" as "capitalize",
        "&:hover": {
          backgroundColor: "#F0F4FF",
          border: "1px solid #D0D5DD",
        },
      },
      primaryButton: {
        ...FONT_FAMILY.Inter(600, 16),
        borderRadius: "8px",
        height: "40px",
        backgroundColor: primaryColor(500),
        color: "#FFF",
        textTransform: "capitalize",
        "&:hover": {
          backgroundColor: primaryColor(600),
        },
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
