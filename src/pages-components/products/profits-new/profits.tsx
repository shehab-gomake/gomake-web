import { ProfitRightSideWidget } from "./widgets/profit-right-side/profit-right-side";
import { ProfitLeftSideWidget } from "./widgets/profit-left-side/profit-left-side";
import { ProfitHeaderWidget } from "./widgets/profit-header/profit-header";
import { useNewProfits } from "./use-profits";
import { useStyle } from "./style";

const ProfitsNewPageWidget = () => {
  const { classes } = useStyle();
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
    profitsPricingTables,
    anchorElPricingTables,
    openPricingTables,
    anchorElPricingTablesMapping,
    openPricingTablesMapping,
    selectedPricingTableItems,
    dataForExceptions,
    dataForPricing,
    anchorElMorePriceTable,
    openMorePriceTable,
    selectedActionProfitRow,
    actionProfitByActionId,
    typeExceptionSelected,
    selectedAdditionalProfitRow,
    anchorElAdditionalProfitMenu,
    openAdditionalProfitMenu,
    calculateCaseValue,
    handleCloseAdditionalProfitMenu,
    handleClickAdditionalProfitMenu,
    setSelectedActionProfitRow,
    setTypeExceptionSelected,
    setSelectedActionProfit,
    handleClickMorePriceTable,
    handleCloseMorePriceTable,
    onDragEnd,
    setSelectedPricingTableItems,
    handleClickPricingTablesMapping,
    handleClosePricingTablesMapping,
    handleClickPricingTables,
    handleClosePricingTables,
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
    deleteActionProfitRow,
    deleteExceptionProfit,
    getProfitsPricingTables,
  } = useNewProfits();
  return (
    <div style={classes.mainGridContainer}>
      {router.query.draftId && (
        <header>
          <ProfitHeaderWidget calculateCaseValue={calculateCaseValue} />
        </header>
      )}
      <div style={classes.bodyGridContainer}>
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
          anchorElMorePriceTable={anchorElMorePriceTable}
          openMorePriceTable={openMorePriceTable}
          handleClickMorePriceTable={handleClickMorePriceTable}
          handleCloseMorePriceTable={handleCloseMorePriceTable}
          selectedActionProfitRow={selectedActionProfitRow}
          setSelectedActionProfit={setSelectedActionProfit}
          deleteActionProfitRow={deleteActionProfitRow}
          selectedAdditionalProfitRow={selectedAdditionalProfitRow}
        />
        <ProfitRightSideWidget
          minimumValue={minimumValue}
          isUpdateMinimumValue={isUpdateMinimumValue}
          onBlurMinimumValue={onBlurMinimumValue}
          setIsUpdateMinimumValue={setIsUpdateMinimumValue}
          onInputChangeMinimumValue={onInputChangeMinimumValue}
          profitsPricingTables={profitsPricingTables}
          anchorElPricingTables={anchorElPricingTables}
          openPricingTables={openPricingTables}
          handleClickPricingTables={handleClickPricingTables}
          handleClosePricingTables={handleClosePricingTables}
          anchorElPricingTablesMapping={anchorElPricingTablesMapping}
          openPricingTablesMapping={openPricingTablesMapping}
          handleClickPricingTablesMapping={handleClickPricingTablesMapping}
          handleClosePricingTablesMapping={handleClosePricingTablesMapping}
          selectedPricingTableItems={selectedPricingTableItems}
          setSelectedPricingTableItems={setSelectedPricingTableItems}
          dataForExceptions={dataForExceptions}
          dataForPricing={dataForPricing}
          onDragEnd={onDragEnd}
          deleteExceptionProfit={deleteExceptionProfit}
          selectedPricingBy={selectedPricingBy}
          actionProfitByActionId={actionProfitByActionId}
          getProfitsPricingTables={getProfitsPricingTables}
          typeExceptionSelected={typeExceptionSelected}
          setTypeExceptionSelected={setTypeExceptionSelected}
          selectedAdditionalProfitRow={selectedAdditionalProfitRow}
          setSelectedActionProfitRow={setSelectedActionProfitRow}
          anchorElAdditionalProfitMenu={anchorElAdditionalProfitMenu}
          openAdditionalProfitMenu={openAdditionalProfitMenu}
          handleCloseAdditionalProfitMenu={handleCloseAdditionalProfitMenu}
          handleClickAdditionalProfitMenu={handleClickAdditionalProfitMenu}
        />
      </div>
    </div>
  );
};

export { ProfitsNewPageWidget };
