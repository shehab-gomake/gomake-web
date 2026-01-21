import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();
  const direction: "rtl" | "ltr" = t("direction");
  const isRTL = direction === "rtl";

  const classes = useMemo(() => {
    return {
      container: {
        padding: "16px 0",
        width: "100%",
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "8px",
        width: "100%",
      },
      label: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
      },
      textInput: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
      },
      emptyState: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: secondColor(500),
        textAlign: "center" as "center",
        padding: "20px",
      },
    };
  }, [isRTL, primaryColor, secondColor, t]);

  return { classes };
};

export { useStyle };

