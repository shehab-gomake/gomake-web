import { useGomakeTheme } from "@/hooks/use-gomake-thmem";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      leftContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 0.5,
        height: "100vh",
      },
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
