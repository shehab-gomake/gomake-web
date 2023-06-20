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
        justifyContent: "center" as "center",
        alignItems: "center" as "center",
        color:
          header == "Exp.meter"
            ? primaryColor(500)
            : header == t("products.profits.pricingListWidget.totalPrice") ||
              header == t("products.profits.pricingListWidget.Expprofit")
            ? primaryColor(500)
            : "#B5B7C0",
        width: `${width}`,
        maxWidth: `${width}`,
        textAlign: "center" as "center",
        ...FONT_FAMILY.Lexend(
          header == "Exp.meter"
            ? 600
            : header == t("products.profits.pricingListWidget.totalPrice") ||
              header == t("products.profits.pricingListWidget.Expprofit")
            ? 600
            : 500,
          14
        ),
        fontStyle: "normal",
        lineHeight: "18px",

        // ...(header == t("products.profits.pricingListWidget.Expprofit") && {
        //   border: " 1px solid #F135A3",
        //   borderTopLeftRadius: "4px",
        //   borderTopRightRadius: "4px",
        //   borderBottom: "0px",
        // }),
        // padding:
        //   header == t("products.profits.pricingListWidget.Expprofit") ? 20 : "",
        // // borderBottom: 0,
        // // paddingBottom: 0,
      },
    };
  }, [t, header]);
  return {
    clasess,
  };
};
export { useStyle };
