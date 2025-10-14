import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor, neutralColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      header: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: "#000",
        width: "fit-content",
      },
      headerStyle:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingRight: 10,
        paddingLeft: 10,
      },
      backButtonStyle:{
        height: 30,
        background: "#CBCBE5",
        width: 90,
        borderRadius: 8,
      },
      subHeader: {
        ...FONT_FAMILY.Lexend(600, 20),
        color: "#5759A8",
        cursor: "pointer",
        width: "fit-content",
      },
      noData: {
        width: "100%",
        alignItems: "flex-end",
        backgroundColor: primaryColor(10),
        textAlign: "center" as "center",
        marginTop: 20,
        height: 100,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 16),
        alignContent: "flex-end",
        color: secondColor(500),
      },
      noDataSpan: {
        width: "100%",
        alignItems: "center",
        backgroundColor: primaryColor(10),
        textAlign: "center" as "center",
        marginTop: 20,
        height: 42,
        color: secondColor(500),
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
        cursor: "pointer",
      },
      noDataButton: {
        width: "fit-content",
        height: 34,
      },
      clickableData: {
        padding: "0 10px",
        height: "26px",
        borderRadius: "4",
        width: "fit-content",
        ...FONT_FAMILY.Lexend(400, 14),
        "&:hover": {
          backgroundColor: neutralColor(200),
        },
      },
      buttonsContainerStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "10px",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
