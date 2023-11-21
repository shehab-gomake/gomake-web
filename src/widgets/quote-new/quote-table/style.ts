import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = ({ isAnderLine }) => {
  const { grayColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {};
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
