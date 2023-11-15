import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme} = useGomakeTheme();
  const classes = useMemo(() => {
    return {};
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };