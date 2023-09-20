import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";


const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      buttonStyle: {
        width: convertWidthToVW(100),
        height: convertHeightToVH(50),
        marginRight: convertWidthToVW(10),
        backgroundColor: "#F135A3",
      },
      insideStyle: { width: "64%", height: "93%", maxWidth: "1240px", maxHeight: "1007px", paddingLeft: "32px", paddingRight: "48px", paddingTop: "27px", paddingBottom: "27px", background: "#FDFDFD" },
      subTitleStyle: {
        fontStyle: "normal",
        lineHeight: "normal",
        color: "#ED028C",
        ...FONT_FAMILY.Lexend(600, 16),
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
        fontStyle: "normal",
        lineHeight: "normal",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      buttonsStyle: {
        color: "var(--primary-500, #2E3092)",
        fontStyle: "normal",
        lineHeight: "normal",
        letterSpacing: "-0.14px",
        border: "none",
        background: "#FFF",
        marginLeft: "7px",
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
        fontStyle: "normal",
        lineHeight: "normal",
        borderRadius: "4px",
        background: "#ED028C",
        ...FONT_FAMILY.Lexend(500, 16),
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
        fontStyle: "normal",
        lineHeight: "normal",
        ...FONT_FAMILY.Lexend(400, 12),
      },
      autoButtonStyle: {
        height: "40px",
        padding: "10px 32px",
        borderRadius: "4px",
        background: "var(--second-500, #ED028C)",
        color: "var(--puree, #FFF)",
        TextAlign: "center",
        fontStyle: "normal",
        lineHeight: "normal",
        border: "none",
        ...FONT_FAMILY.Lexend(500, 16),
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
        fontStyle: "normal",
        lineHeight: "normal",
        ...FONT_FAMILY.Lexend(500, 12)
      },
      footerStyle: {
        display: "flex",
        justifyContent: "flex-end",
        position: "fixed" as "fixed",
        bottom: "10px",
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
