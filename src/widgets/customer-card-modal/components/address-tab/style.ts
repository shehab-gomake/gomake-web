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

      headerStyle: {
        color: "var(--primary-900, #090A1D)",
        fontFamily: "Lexend",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 520,
        lineHeight: "normal",
      },

      inputStyle: {
        width: "180px",
        height: "40px",
        flexShrink: 0,
        borderRadius: "4px",
        background: "#FFF",
        boxShadow: "0px 4px 60px 0px #00000014",
        border: "none",
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#8283BE",
      },


      autoButtonStyle: {
        width: convertWidthToVW(50),
        height: convertHeightToVH(30),
        marginRight: convertWidthToVW(1),
        marginTop: "23px",
        background: "#F135A3",
      },

      autoComplateStyle: {
        display: "flex",
        width: "180px",
        height: "40px",
        flexShrink: 0,
        borderRadius: "4px",
        background: "#FFF",
        boxShadow: "0px 4px 60px 0px #00000014",
        border: "none",
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#8283BE",
      },
      
      buttonsStyle: {
        color: "var(--error-500, #D92C2C)",
        ...FONT_FAMILY.Lexend(500, 14),
        fontStyle: 'normal',
        lineHeight: 'normal',
        border: "none",
        background: "#FFF",
        marginLeft: "7px",
      },

      switchHeaderStyle: {
        color: "var(--primary-900, #090A1D)",
        fontFamily: "Lexend",
        fontSize: "12px",
        fontStyle: "regular",
        fontWeight: 400,
        lineHeight: "normal",
      },


    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };

