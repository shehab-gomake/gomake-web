import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { errorColor, successColor, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        //  display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
       // width: "100%",
        height:"100%",
        backgroundColor: "#FFFFFF",
        margin: '0 4px',
        borderRadius: 8,
        boxShadow: "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
      },
      openBtnStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "98.47px",
        height: "26px",
        padding: "4px, 12px, 4px, 12px",
        borderRadius: "4px",
        gap: "10px",
        color: successColor(700),
        background: successColor(200),
        ...FONT_FAMILY.Lexend(500, 14),
      },
      closeBtnStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "98.47px",
        height: "26px",
        padding: "4px, 12px, 4px, 12px",
        borderRadius: "4px",
        gap: "10px",
        color: errorColor(600),
        background: errorColor(200),
        ...FONT_FAMILY.Lexend(500, 14),
      },
      buttonsContainerStyle: {
        display: "flex",
        width: "578px",
        height: "52px",
        gap: "24px",
      },
      buttonStyle: {
        width: "76px",
        height: "32px",
        padding: "6px 10px 6px  10px",
        borderRadius: "4px",
        gap: "10px",
      },
      buttonSecondStyle: {
        width: "76px",
        height: "32px",
        padding: "6px 10px 6px  10px",
        borderRadius: "4px",
        gap: "10px",
        color: primaryColor(700),
        background: primaryColor(100),
      },
      addNewStyle: {
        width: "133px",
        height: "40px",
        padding: "10px, 32px, 10px, 32px",
        borderRadius: "4px",
        gap: "10px",
        ...FONT_FAMILY.Lexend(500, 16),
        lineHeight: "20px",
      },
      dataRowStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        lineHeight: "17.5px",
        color:"#292D32",
        letterSpacing: '-1%',

      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
