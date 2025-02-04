import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { adaptPaddingLeft, adaptPaddingRight } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor, secondColor, neutralColor } = useGomakeTheme();
  const {t} = useTranslation()
  const direction = t('direction');
  const classes = useMemo(() => {
    return {
      header: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: "#000",
      },
      headerStyle:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingRight: 12,
        ...adaptPaddingRight(direction, 20),
      },
      backButtonStyle:{
        height: 30,
        marginRight: 5,
        background: "#CBCBE5",
        width: 90,
        borderRadius: 8,
      },
      subHeader: {
        ...FONT_FAMILY.Lexend(600, 20),
        color: "#5759A8",
      },
      noData: {
        width: "100%",
        alignItems: "center",
        backgroundColor: primaryColor(10),
        textAlign: "center" as "center",
        marginTop: 20,
        height: 42,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
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
      clickableData: {
        padding: "0 10px",
        height: "26px",
        borderRadius: "4",
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
