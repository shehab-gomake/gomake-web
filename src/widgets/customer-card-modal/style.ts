import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { colors } from "@mui/material";
import { useMemo } from "react";
import { Placeholder } from "react-bootstrap";


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

      insideStyle: { width: "64%", height: "93%", maxWidth: "1240px", paddingLeft: "32px", paddingRight: "48px", paddingTop: "27px", paddingBottom: "27px", background: "#FDFDFD" },

      subTitleStyle: {
        width: "113px",
        height: "20px",
        fontFamily: "Lexend",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "normal",
        color: "#ED028C",
      },

      colStyle: {
        display: "flex",
        width: "180px",
        height: "68px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
      },

      inputStyle1: {
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

      headerStyle: {
        color: "var(--primary-900, #090A1D)",
        fontFamily: "Lexend",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 520,
        lineHeight: "normal",
        
      },

      headersStyle: {
        width: "220px",
        height: "30px",
        fontFamily: "Lexend",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "24px",
        color: "#2E3092",
        lineheight: "normal",
        ...FONT_FAMILY.Lexend(500, 14),
      },

      tabStyle: {
        width: "62px",
        height: "20px",
        color: "#FFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: '27px',
        fontFamily: "Lexend",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: "normal",
        borderRadius: "4px",
        background: "#ED028C"
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

      switchHeaderStyle: {
        color: "var(--primary-900, #090A1D)",
        fontFamily: "Lexend",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
      },

      autoButtonStyle: {
        width: convertWidthToVW(75),
        height: convertHeightToVH(30),
        marginRight: convertWidthToVW(1),
      },

      updateButtonStyle: {
        width: "193px",
        height: "40px",
        display: "flex",
        padding: "10px 32px",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        gap: "10px",
        borderRadius: "4px",
        background: "var(--second-500, #ED028C)",
        color: "var(--puree, #FFF)",
        textAlign: "center",
        fontFamily: "Lexend",
        fontSize: "15px",
        fontStyle: "normal",
        fontWeight: 500,
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

      selectStyle: {
        width: convertWidthToVW(150),
        height: convertHeightToVH(30),
      },

      textAreaStyle: {
        display: "flex",
        width: "308px",
        height: "80px",
        padding: "5px 7px",
        alignItems: "flex-start",
        gap: "16px",
        borderRadius: "4px",
        border: "1px solid var(--primary-500, #2E3092)",
        color: "var(--medium-300, #9695C7)",
        fontFamily: "Lexend",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "normal",
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

