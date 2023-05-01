import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";


const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {

      buttonStyle: {
        width: convertWidthToVW(100),
        height: convertHeightToVH(50),
        marginRight: convertWidthToVW(10),
        backgroundColor: "#F135A3",
      },

      insideStyle: { width: "85%" , },

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

      filterStyle: {
        display: "flex",
        width: "50%",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: '7px',
      },

      headers3Style: {
        color: "#F135A3",
        ...FONT_FAMILY.Lexend(500, 18),
      },

      tableContainer: {
        width: "100%",
      },

      switchStyle: {
        alignSelf: "center",
      },

      autoButtonStyle: {
        width: convertWidthToVW(75),
        height: convertHeightToVH(30),
        marginRight: convertWidthToVW(1),
      },

      autoComplateStyle: {
        width: convertWidthToVW(200),
      },

      selectStyle: {
        width: convertWidthToVW(150),
        height: convertHeightToVH(30),
      },

      textAreaStyle:{
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#8283BE",
      }

    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
function primaryColor(arg0: number): any {
  throw new Error("Function not implemented.");
}

