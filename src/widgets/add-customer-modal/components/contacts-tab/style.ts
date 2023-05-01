import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";


const useStyle = () => {
  const clasess = useMemo(() => {
    return {

      inputStyle: {
        border: "none",
        borderBottom: "1px solid black",
        borderBottomColor: "#2E3092",
        padding: "0.5rem",
        display: "inline-block",
        boxShadow: "none",
        outline: '1px solid white',
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#8283BE",
      },

      headersStyle: {
        fontFamily: "Outfit",
        fontStyle: "normal",
        fontWeight: 300,
        fontSize: 14,
        color: "#1C1D58",
        ...FONT_FAMILY.Lexend(500, 14),
      },

      autoButtonStyle: {
        width: convertWidthToVW(50),
        height: convertHeightToVH(30),
        marginRight: convertWidthToVW(1),
        marginTop: "18px",
        background: "#F135A3",
      },

      autoComplateStyle: {
        width: convertWidthToVW(100),
        height: convertHeightToVH(30),

      },

    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
