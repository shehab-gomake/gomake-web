import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

import { GoMakeAutoComplate } from "@/components";

import { usePricingListWidget } from "./use-pricing-list-widget";
import { PricingList } from "./pricing-list/pricing-list";

const PriceListWidget = () => {
  const { tabelHeaders, tabelRows } = usePricingListWidget();
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <div style={clasess.headerMainCointaner}>
        <div style={clasess.listTitle}>
          {t("products.profits.pricingListWidget.pricingListTitle")}
        </div>
        <div style={clasess.filtersCointaner}>
          <div style={clasess.filterContainer}>
            <GoMakeAutoComplate
              options={["prices1", "prices2", "prices3"]}
              style={clasess.autoComplateStyle}
              placeholder={t(
                "products.profits.pricingListWidget.meterPerPrice"
              )}
              onChange={""}
            />
          </div>
          <div style={clasess.filterContainer}>
            <GoMakeAutoComplate
              options={["prices1", "prices2", "prices3"]}
              style={clasess.autoComplateStyle}
              placeholder={t("products.profits.pricingListWidget.transition")}
              onChange={""}
            />
          </div>
        </div>
      </div>

      <PricingList tableHeaders={tabelHeaders} tableRows={tabelRows} />
    </>
  );
};
export default PriceListWidget;
