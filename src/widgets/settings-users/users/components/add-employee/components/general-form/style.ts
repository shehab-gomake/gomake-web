import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      subSectionHeader: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),
        margin: "24 0 18 0",
      },
      subSectionActionHeader: {
        ...FONT_FAMILY.Lexend(600, 14),
        color: "#040404",
        margin: "24 0 18 0",
      },
      inputsContainer: {
        display: "flex",
        gap: 30,
        flexWrap: "wrap" as "wrap",
      },
      container: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 24,
        paddingTop: 20,
        overflowY: "auto" as "auto",
        maxHeight: "calc(84vh - 120px)",
      },
      subSection: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 18,
      },
      stationsButton: {
        "& .MuiButton-startIcon": {
          margin: "0 5px",
        },
        ...FONT_FAMILY.Inter(600, 16),
        width: "fit-content",
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
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
