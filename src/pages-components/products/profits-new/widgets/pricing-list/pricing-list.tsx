import { GoMakeAutoComplate } from "@/components";
import { useTranslation } from "react-i18next";
import { LineChart } from "@/pages-components/products/profits/widgets/line-chart";
import { PricingListTable } from "./pricing-list-table";
import { useStyle } from "./style";
import { PricingListProps } from "../../interface";
import { MoreMenuWidget } from "./more-menu";

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
  updateActionProfitRow,
  anchorElMorePriceTable,
  openMorePriceTable,
  handleClickMorePriceTable,
  handleCloseMorePriceTable,
  selectedActionProfitRow,
  setSelectedActionProfit,
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
        updateActionProfitRow={updateActionProfitRow}
        selectedPricingBy={selectedPricingBy}
        handleClickMorePriceTable={handleClickMorePriceTable}
        handleCloseMorePriceTable={handleCloseMorePriceTable}
        anchorElMorePriceTable={anchorElMorePriceTable}
        openMorePriceTable={openMorePriceTable}
        selectedActionProfitRow={selectedActionProfitRow}
        setSelectedActionProfit={setSelectedActionProfit}
      />
      <div style={clasess.chartContainer}>
        <LineChart actionProfitRowChartData={actionProfitRowChartData} />
      </div>
    </div>
  );
};
export { PricingList };
