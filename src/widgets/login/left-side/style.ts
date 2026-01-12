import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptPaddingRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { getTitleTypography } from "@/utils/typography-utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor, errorColor } = useGomakeTheme();
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      leftContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center" as "center",
        alignItems: "center",
        height: "100%",
        minHeight: "100vh",
        width: "50%",
      },
      MobileSubContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center" as "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      },
      logoContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
      },
      loginContainer: {
        alignItems: "flex-start",
        width: "100%",
        ...adaptPaddingRight(t("direction"), 48),
      },
      loginLbl: {
        color: `var(--theme-typography-heading-color,${primaryColor(500)})`,
        ...FONT_FAMILY.Outfit(600, 48),
        marginBottom: 40,
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
        marginTop: 25,
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 20),
      },
      input: {
        width: "87%",
      },
      btnContainer: {
        width: "53%",
        marginTop: 62,
      },
      forgotStyle: {
        display: "flex",
        marginTop: 10,
        marginBottom: 10,
        cursor: "pointer",
        width: "87%",
      },
      errorMsgStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: errorColor(500),
      },
    };
  }, [theme, t]);
  return {
    classes,
  };
};
export { useStyle };
