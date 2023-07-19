import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";


const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      headerStyle: {
        width: "438px",
        height: "18px",
        color: "var(--second-500, #ED028C)",
        TextAlign: "center",
        fontFamily: "Lexend",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: "normal",
      },

      headerStyle1: {
        color: "var(--primary-900, #090A1D)",
        TextAlign: "center",
        fontFamily: "Lexend",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "normal",
      },


      switchHeaderStyle: {
        color: "var(--primary-900, #090A1D)",
        fontFamily: "Lexend",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
      },

      autoComplateStyle: {
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



    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };


