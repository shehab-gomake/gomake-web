import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import {adaptPaddingRight} from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme , errorColor , primaryColor } = useGomakeTheme();
  const {t} = useTranslation();
  const direction = t('direction');
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#FFFFFF",
        margin: "0 4px",
        borderRadius: 8,
        // boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.08)",
        boxShadow:
          "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
        gap: 30,
      },
      customerSectionStyle:{
        width: "100%",
        gap: "10px",
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
      },
      autoComplateRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 30,
      },
      selectCustomerContainer: {
        width: "100%",
        // border: `1px solid ${secondColor(300)}`,
        borderRadius: "4px",
        height: 40,
        display: "flex",
        alignItems: "center" as "center",
      },
      selectTypeContainer: {
        width: "100%",
        // border: `1px solid ${secondColor(300)}`,
      },
      btnContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "50%",
      },
      btnStyle: {
        height: 40,
      },
      errorMsgStyle: {
        padding: 10,
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
      },
      autoButtonStyle: {
        ...adaptPaddingRight(direction, 10),
        background: "none",
        color: primaryColor(500),
        TextAlign: "center",
        fontStyle: "normal",
        lineHeight: "normal",
        border: "none",
        cursor: "pointer",
        ...FONT_FAMILY.Lexend(500, 14),
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
