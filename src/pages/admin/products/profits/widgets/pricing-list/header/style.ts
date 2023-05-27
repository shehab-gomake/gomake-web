import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const useStyle = ({ width, header }: any) => {
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      headerItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color:
          header == "Exp.meter"
            ? primaryColor(500)
            : header == t("products.profits.pricingListWidget.totalPrice")
            ? primaryColor(500)
            : "#B5B7C0",
        width: `${width}`,
        maxWidth: `${width}`,
        textAlign: "center",
        textalign: "center",

        ...FONT_FAMILY.Lexend(
          header == "Exp.meter"
            ? 600
            : header == t("products.profits.pricingListWidget.totalPrice")
            ? 600
            : 500,
          14
        ),
        fontStyle: "normal",
        lineHeight: "18px",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
