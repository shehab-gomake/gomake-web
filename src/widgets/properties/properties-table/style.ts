import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        paddingLeft: 20,
        paddingRight: 20,
      },
      headerContainer: {
        display: "flex",
        justifyContent: "space-between" as "space-between",
        alignItems: "center" as "center",
        margin: "30px 0 25px 0",
      },
      header: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: primaryColor(500),
      },
      searchInput: {
        width: 300,
        height: 40,
      },
      shadowBorder: {
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
      rowItem: {
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column" as "column",
        alignItems: "center",
        textAlign: "flex-start",
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(900),
        maxHeight: 45,
        overflowX: "hidden" as "hidden",
        overflowY: "scroll" as "scroll",
      },
      item: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(900),
        maxHeight: 45,
        textAlign: "start" as "start",
      },
      defaultUnitStyle: {
        ...FONT_FAMILY.Lexend(700, 10),
        color: "#000000",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
