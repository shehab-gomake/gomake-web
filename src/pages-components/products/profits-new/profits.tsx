import { ProfitRightSideWidget } from "./widgets/profit-right-side/profit-right-side";
import { ProfitLeftSideWidget } from "./widgets/profit-left-side/profit-left-side";
import { ProfitHeaderWidget } from "./widgets/profit-header/profit-header";
import { useNewProfits } from "./use-profits";
import { useStyle } from "./style";

const ProfitsNewPageWidget = () => {
  const { clasess } = useStyle();
  const {
    actionProfitRowChartData,
    actionProfitRowsList,
    selectedTransition,
    selectedPricingBy,
    tableHeaders,
    Transition,
    PricingBy,
    router,
    openAddStepModal,
    minimumValue,
    isUpdateMinimumValue,
    onBlurMinimumValue,
    setIsUpdateMinimumValue,
    onInputChangeMinimumValue,
    onCloseAddStepModal,
    onOpenAddStepModal,
    updatePricingByForAction,
    setSelectedTransition,
    changeactionProfitRowsItems,
    addNewStepForActionProfitRow,
    updateActionProfitRow,
  } = useNewProfits();
  return (
    <div style={clasess.mainGridContainer}>
      {router.query.quoteId && (
        <header>
          <ProfitHeaderWidget />
        </header>
      )}
      <div style={clasess.bodyGridContainer}>
        <ProfitLeftSideWidget
          actionProfitRowChartData={actionProfitRowChartData}
          actionProfitRowsList={actionProfitRowsList}
          selectedTransition={selectedTransition}
          selectedPricingBy={selectedPricingBy}
          tableHeaders={tableHeaders}
          Transition={Transition}
          PricingBy={PricingBy}
          openAddStepModal={openAddStepModal}
          onCloseAddStepModal={onCloseAddStepModal}
          onOpenAddStepModal={onOpenAddStepModal}
          updatePricingByForAction={updatePricingByForAction}
          setSelectedTransition={setSelectedTransition}
          changeactionProfitRowsItems={changeactionProfitRowsItems}
          addNewStepForActionProfitRow={addNewStepForActionProfitRow}
          updateActionProfitRow={updateActionProfitRow}
        />
        <ProfitRightSideWidget
          minimumValue={minimumValue}
          isUpdateMinimumValue={isUpdateMinimumValue}
          onBlurMinimumValue={onBlurMinimumValue}
          setIsUpdateMinimumValue={setIsUpdateMinimumValue}
          onInputChangeMinimumValue={onInputChangeMinimumValue}
        />
      </div>
    </div>
  );
};

export { ProfitsNewPageWidget };
