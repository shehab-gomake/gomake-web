import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";


const useStyle = () => {
  const clasess = useMemo(() => {
    return {

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

      switchHeaderStyle: {
        color: "var(--primary-900, #090A1D)",
        fontFamily: "Lexend",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
      },


      buttonsStyle: {
        color: "var(--error-500, #D92C2C)",
        fontFamily: 'Lexend',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: 'normal',
        border: "none",
        background: "#FFF",
        marginLeft: "7px",
      },

      headerStyle: {
        color: "var(--primary-900, #090A1D)",
        TextAlign: "center",
        fontFamily: "Lexend",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "normal",
      },

      autoButtonStyle: {
      },

    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
