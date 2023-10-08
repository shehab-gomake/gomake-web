import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptLeft, adaptPaddingLeft, adaptPaddingRight, adaptRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
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
        marginTop: 40,
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
    };
  }, [theme,t ]);
  return {
    clasess,
  };
};
export { useStyle };
