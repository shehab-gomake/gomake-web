import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH } from "@/utils/adapter";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
        tabStyle: {
            background: "#FFFFFF",
            ...FONT_FAMILY.Lexend(500,14)
          },
          container: {
            marginTop: convertHeightToVH(30),
            //marginBottom:  convertHeightToVH(50),
          },
          headerStyle: {
            ...FONT_FAMILY.Lexend(700,20),
            lineHeight: "21px",
            color: primaryColor(500)
          },
        
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
