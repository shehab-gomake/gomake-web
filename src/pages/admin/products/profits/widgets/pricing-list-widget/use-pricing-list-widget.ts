import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const usePricingListWidget = () => {
  const { t } = useTranslation();

  const tabelHeaders = useMemo(
    () => [
      t("products.profits.pricingListWidget.quantity"),
      t("products.profits.pricingListWidget.cost"),
      t("products.profits.pricingListWidget.profit"),
      t("products.profits.pricingListWidget.meterPrice"),
      t("products.profits.pricingListWidget.expMeter"),
      t("products.profits.pricingListWidget.price"),
      t("products.profits.pricingListWidget.totalPrice"),
      t("products.profits.pricingListWidget.more"),
    ],
    []
  );
  const tabelRows = useMemo(
    () => [
      {
        Quantity: 134,
        Cost: 443,
        Profit: 21,
        MeterPrice: 468,
        Exp: 55,
        total: 445,
        price: 52,
        more: "Edit",
      },
      {
        Quantity: 134,
        Cost: 443,
        Profit: 21,
        MeterPrice: 468,
        Exp: 55,
        total: 445,
        price: 52,
        more: "Edit",
      },
    ],
    []
  );
  return { tabelHeaders, tabelRows };
};

export { usePricingListWidget };
