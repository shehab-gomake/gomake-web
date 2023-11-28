import { HeaderTitle } from "@/widgets";
import { useStyle } from "./style";
import { useNewProfits } from "./use-profits";
import { useTranslation } from "react-i18next";
import { PricingList } from "./widgets/pricing-list/pricing-list";

const ProfitsNewPageWidget = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    allActionProfitRowsByActionId,
    actionProfitRowChartData,
    actionProfitByActionId,
    selectedTransition,
    selectedPricingBy,
    tableHeaders,
    Transition,
    PricingBy,
    router,
    updatePricingByForAction,
    setSelectedTransition,
    setSelectedPricingBy,
  } = useNewProfits();

  return (
    <div style={clasess.mainContainer}>
      <HeaderTitle
        title={`${router.query.actionName} pricing settings`}
        marginBottom={25}
        marginTop={1}
      />
      <div style={clasess.pricingAndExceptionsCointaner}>
        <div style={clasess.pricingCointaner}>
          <PricingList
            tableHeaders={tableHeaders}
            tableBodyList={allActionProfitRowsByActionId}
            Transition={Transition}
            PricingBy={PricingBy}
            actionProfitRowChartData={actionProfitRowChartData}
            setSelectedPricingBy={setSelectedPricingBy}
            setSelectedTransition={setSelectedTransition}
            selectedTransition={selectedTransition}
            selectedPricingBy={selectedPricingBy}
            updatePricingByForAction={updatePricingByForAction}
          />
        </div>
        <div style={clasess.exceptionsCointaner}>
          fff
          {/* <Exceptions
                  tableHeaders={tabelExceptionsHeaders}
                  tableRows={profitsStateValue?.actionExpectionRowsMapped}
                /> */}
        </div>
      </div>
    </div>
  );
};

export { ProfitsNewPageWidget };
