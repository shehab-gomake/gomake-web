import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
      },
      titleStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(600, 20),
        color:primaryColor(500),
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
