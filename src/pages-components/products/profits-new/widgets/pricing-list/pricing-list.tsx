import { GoMakeAutoComplate } from "@/components";
import { useTranslation } from "react-i18next";
import { LineChart } from "@/pages-components/products/profits/widgets/line-chart";
import { PricingListTable } from "./pricing-list-table";
import { useStyle } from "./style";
import { PricingListProps } from "../../interface";

const PricingList = ({
  tableHeaders,
  tableBodyList,
  PricingBy,
  Transition,
  actionProfitRowChartData,
  setSelectedTransition,
  selectedTransition,
  selectedPricingBy,
  updatePricingByForAction,
  changeactionProfitRowsItems,
  onOpenAddStepModal,
}: PricingListProps) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <div style={clasess.pricListWidgetMainContainer}>
      <div style={clasess.headerMainCointaner}>
        <div style={clasess.listTitle}>
          {t("products.profits.pricingListWidget.pricingListTitle")}
        </div>
        <div style={clasess.filtersCointaner}>
          <div style={clasess.autoCompleteContainer}>
            <GoMakeAutoComplate
              options={PricingBy}
              style={clasess.autoCompleteStyleContainer}
              onChange={(e, value) => updatePricingByForAction(value)}
              value={selectedPricingBy}
            />
          </div>
          <div style={clasess.autoCompleteContainer}>
            <GoMakeAutoComplate
              options={Transition}
              style={clasess.autoCompleteStyleContainer}
              onChange={(e, value) => setSelectedTransition(value)}
              value={selectedTransition}
            />
          </div>
        </div>
      </div>
      <PricingListTable
        tableHeaders={tableHeaders}
        tableBodyList={tableBodyList}
        changeactionProfitRowsItems={changeactionProfitRowsItems}
        onOpenAddStepModal={onOpenAddStepModal}
      />
      <div style={clasess.chartContainer}>
        <LineChart actionProfitRowChartData={actionProfitRowChartData} />
      </div>
    </div>
  );
};
export { PricingList };
