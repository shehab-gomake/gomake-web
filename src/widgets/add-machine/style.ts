import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
