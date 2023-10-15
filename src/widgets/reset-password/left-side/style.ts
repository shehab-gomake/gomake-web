import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptLeft, adaptPaddingLeft, adaptPaddingRight, adaptRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor,errorColor } = useGomakeTheme();
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      leftContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center" as "center",
        alignItems: "center",
        height: "100%",
        minHeight: "100vh",
        width: "50%"
      },
      logoContainer: {
        display: "flex",
      },
      loginContainer: {
        alignItems: "flex-start",
        width: "100%",
        ...adaptPaddingRight(t("direction"), 48),
        marginTop:40
        // paddingLeft: 48,
      },
      loginLbl: {
        color: primaryColor(600),
        ...FONT_FAMILY.Outfit(600, 48),
        marginBottom: 40,
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 20),
      },
      input: {
        width: "85%",
        marginBottom: 15
      },
      btnContainer: {
        width: "50%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        alignSelf: "flex-end",
        marginTop: 30,
      },
      forgotStyle:{
        display: "flex",
       marginTop:10,
       cursor:"pointer",
      },
      errorMsgStyle:{
        ...FONT_FAMILY.Lexend(500,12),
        color:errorColor(500),
        marginTop:10,
      }
    };
  }, [theme,t ]);
  return {
    clasess,
  };
};
export { useStyle };
