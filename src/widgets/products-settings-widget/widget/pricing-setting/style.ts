import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {};
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
