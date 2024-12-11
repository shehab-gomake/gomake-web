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

        //?new
        overflowY: "auto" as "auto",
        maxHeight: "calc(84vh - 120px)",
      },
      subSection: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 18,
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
