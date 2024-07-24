import { PricingList } from "../pricing-list/pricing-list";
import { useStyle } from "./style";
import { AddStepModal } from "../add-step-modal";
import { ProfitLeftSideProps } from "../../interface";

const ProfitLeftSideWidget = ({
  actionProfitRowChartData,
  actionProfitRowsList,
  selectedTransition,
  selectedPricingBy,
  tableHeaders,
  Transition,
  PricingBy,
  openAddStepModal,
  onCloseAddStepModal,
  onOpenAddStepModal,
  updatePricingByForAction,
  updateTransitionForAction,
  setSelectedTransition,
  changeactionProfitRowsItems,
  addNewStepForActionProfitRow,
  updateActionProfitRow,
  anchorElMorePriceTable,
  openMorePriceTable,
  handleClickMorePriceTable,
  handleCloseMorePriceTable,
  selectedActionProfitRow,
  setSelectedActionProfit,
  deleteActionProfitRow,
  selectedAdditionalProfitRow,
  selectedPricingTableItems
}: ProfitLeftSideProps) => {
  const { clasess } = useStyle();
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
        updateTransitionForAction={updateTransitionForAction}
        changeactionProfitRowsItems={changeactionProfitRowsItems}
        setSelectedTransition={setSelectedTransition}
        onOpenAddStepModal={onOpenAddStepModal}
        updateActionProfitRow={updateActionProfitRow}
        anchorElMorePriceTable={anchorElMorePriceTable}
        openMorePriceTable={openMorePriceTable}
        handleClickMorePriceTable={handleClickMorePriceTable}
        handleCloseMorePriceTable={handleCloseMorePriceTable}
        selectedActionProfitRow={selectedActionProfitRow}
        setSelectedActionProfit={setSelectedActionProfit}
        deleteActionProfitRow={deleteActionProfitRow}
        selectedAdditionalProfitRow={selectedAdditionalProfitRow}
        selectedPricingTableItems={selectedPricingTableItems}
      />
      <AddStepModal
        openModal={openAddStepModal}
        onCloseModal={onCloseAddStepModal}
        selectedPricingBy={selectedPricingBy}
        addNewStepForActionProfitRow={addNewStepForActionProfitRow}
      />
    </div>
  );
};
export { ProfitLeftSideWidget };
