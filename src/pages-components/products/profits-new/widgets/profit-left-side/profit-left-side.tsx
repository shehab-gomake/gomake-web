import { PricingList } from "../pricing-list/pricing-list";
import { useNewProfits } from "../../use-profits";
import { useStyle } from "./style";

const ProfitLeftSideWidget = () => {
  const { clasess } = useStyle();
  const {
    actionProfitRowChartData,
    actionProfitRowsList,
    selectedTransition,
    selectedPricingBy,
    tableHeaders,
    Transition,
    PricingBy,
    updatePricingByForAction,
    setSelectedTransition,
    changeactionProfitRowsItems,
  } = useNewProfits();
  return (
    <div style={clasess.mainHeaderContainer}>
      <PricingList
        tableHeaders={tableHeaders}
        tableBodyList={actionProfitRowsList}
        Transition={Transition}
        PricingBy={PricingBy}
        actionProfitRowChartData={actionProfitRowChartData}
        selectedTransition={selectedTransition}
        selectedPricingBy={selectedPricingBy}
        updatePricingByForAction={updatePricingByForAction}
        changeactionProfitRowsItems={changeactionProfitRowsItems}
        setSelectedTransition={setSelectedTransition}
      />
    </div>
  );
};
export { ProfitLeftSideWidget };
