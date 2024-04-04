import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = ({ marginTop, marginBottom, color }) => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        marginTop: marginTop ? marginTop : convertHeightToVH(40),
        marginBottom: marginBottom ? marginBottom : convertHeightToVH(50),
      },
      titleStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(500, 24),
        color: color ? color : primaryColor(500),
        lineHeight: "30px",
      },
    };
  }, [marginTop, marginBottom]);
  return {
    classes,
  };
};
export { useStyle };
