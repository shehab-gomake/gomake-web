import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
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
        width: 180,
        height: 40,
      },
      addMachineBtn: {
        width: "fit-content",
        marginBottom: 15,
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
