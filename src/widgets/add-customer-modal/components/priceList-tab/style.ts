import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";


const useStyle = () => {
  const clasess = useMemo(() => {
    return {

      headersStyle: {
        fontFamily: "Outfit",
        fontStyle: "normal",
        fontWeight: 300,
        fontSize: 14,
        color: "#1C1D58",
        ...FONT_FAMILY.Lexend(500, 14),
      },

      switchStyle: {
        alignSelf: "center",
      },

    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };


