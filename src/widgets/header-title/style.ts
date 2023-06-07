import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = ({ marginTop, marginBottom }) => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        marginTop: marginTop ? marginTop : convertHeightToVH(40),
        marginBottom: marginBottom ? marginBottom : convertHeightToVH(50),
      },
      titleStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(600, 20),
        color: primaryColor(500),
      },
    };
  }, [marginTop, marginBottom]);
  return {
    clasess,
  };
};
export { useStyle };
