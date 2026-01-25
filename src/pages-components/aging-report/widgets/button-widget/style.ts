import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 15,
      },
      btnContainer: {
        width: "fit-content",
        height: 40,
      },
      optionsButtons: {
        "& .MuiButton-startIcon": {
          margin: "0 5px",
        },
        ...FONT_FAMILY.Inter(600, 16),
        width: "max-content",
        borderRadius: "8px",
        height: "40px",
        backgroundColor: "#FFFFFF",
        color: "#344054",
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
        ...FONT_FAMILY.Inter(500, 16),
        borderRadius: "8px",
        height: "40px",
        backgroundColor: primaryColor(500),
        color: "#FFF",
        textTransform: "capitalize",
        "&:hover": {
          backgroundColor:primaryColor(600),
        },
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
