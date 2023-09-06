import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {

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

      headerStyle: {
        color: "var(--primary-900, #090A1D)",
        TextAlign: "center",
        fontStyle: "normal",
        lineHeight: "normal",
        ...FONT_FAMILY.Lexend(500, 14),
      },

      buttonsStyle: {
        color: "var(--error-500, #D92C2C)",
        fontStyle: 'normal',
        lineHeight: 'normal',
        border: "none",
        background: "#FFF",
        marginLeft: "7px",
        ...FONT_FAMILY.Lexend(500, 14),
      },

    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
