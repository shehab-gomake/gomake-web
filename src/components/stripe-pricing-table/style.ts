import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
