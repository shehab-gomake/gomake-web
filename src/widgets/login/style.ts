import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between" as "space-between",
        minHeight: "100vh",
        // ...FONT_FAMILY.Lexend(600),
      },
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
