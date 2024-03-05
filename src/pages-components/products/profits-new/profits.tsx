import { ProfitRightSideWidget } from "./widgets/profit-right-side/profit-right-side";
import { ProfitLeftSideWidget } from "./widgets/profit-left-side/profit-left-side";
import { ProfitHeaderWidget } from "./widgets/profit-header/profit-header";
import { useNewProfits } from "./use-profits";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";
import {StepType, useTour} from "@reactour/tour";
import {useEffect} from "react";

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
    dataForDefault,
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
    isLoading,
    ProfitCurrency,
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
    updateTransitionForAction,
    setSelectedTransition,
    changeactionProfitRowsItems,
    addNewStepForActionProfitRow,
    updateActionProfitRow,
    deleteActionProfitRow,
    deleteExceptionProfit,
    getProfitsPricingTables,
  } = useNewProfits();
  const {setIsOpen, setSteps, setCurrentStep} = useTour();
  const profitsSteps: StepType[] = [
    {
      selector: '[data-tour="profitStep1"]',
      content: 'This is the most important screen in the system.\n' +
          'Here, you can control pricing by\n' +
          'setting the profit you want for the cost\n' +
          'calculated from the machines and materials settings.',
      position: 'center',
    },
    {
      selector: '[data-tour="profitStep2"]',
      content: 'You can change the method and set a price by:\n' +
          'Units quantity\n' +
          'Materials quantity\n' +
          'Square Meters (M^٢)\n' +
          'Cubic Meters (M^٣)\n' +
          'And more',
      position: 'top',
    },
    {
      selector: '[data-tour="profitStep3"]',
      content: 'Here, we can add rules for 3\n' +
          'Setting different pricing tables for\n' +
          'specific clients\n' +
          'products\n' +
          'based on inputs\n' +
          'and more',
      position: 'bottom',
    },
    {
      selector: '[data-tour="profitStep4"]',
      content: 'Here, we can add rules for 4\n' +
          'Adding percentage to the basic price tables for\n' +
          'specific clients\n' +
          'products\n' +
          'based on inputs\n' +
          'and more',
      position: 'right',
    },
    {
      selector: '[data-tour="menu-settings"]',
      content: 'Set minimum price.',
      position: 'right',
      styles: {
        maskWrapper: props => ({...props, zIndex: 1000000})
      }
    },
  ]

  useEffect(() => {
    setSteps(profitsSteps);
    setIsOpen(true);
    setCurrentStep(0);
  }, []);
  return (
    <div data-tour={'profitStep1'} style={classes.mainGridContainer}>
      {router.query.draftId && (
        <header>
          {!isLoading ? (
            <ProfitHeaderWidget calculateCaseValue={calculateCaseValue} />
          ) : (
            <div style={classes.skeletonCpntainer}>
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={68}
                style={{ borderRadius: 17 }}
              />
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={68}
                style={{ borderRadius: 17 }}
              />
            </div>
          )}
        </header>
      )}
      <div style={classes.bodyGridContainer}>
        {!isLoading ? (
                <div data-tour={'profitStep2'}>
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
            updateTransitionForAction={updateTransitionForAction}
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
                </div>
        ) : (
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"100vh"}
            style={{ borderRadius: 17 }}
          />
        )}
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
          dataForDefault={dataForDefault}
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
          ProfitCurrency={ProfitCurrency}
        />
      </div>
    </div>
  );
};

export { ProfitsNewPageWidget };
