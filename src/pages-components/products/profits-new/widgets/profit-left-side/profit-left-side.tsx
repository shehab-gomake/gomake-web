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
  setSelectedTransition,
  changeactionProfitRowsItems,
  addNewStepForActionProfitRow,
  updateActionProfitRow,
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
        changeactionProfitRowsItems={changeactionProfitRowsItems}
        setSelectedTransition={setSelectedTransition}
        onOpenAddStepModal={onOpenAddStepModal}
        updateActionProfitRow={updateActionProfitRow}
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
