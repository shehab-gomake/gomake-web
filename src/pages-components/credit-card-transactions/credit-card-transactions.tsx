import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { CreditCardTransactionsReportHeaderWidget } from "./widgets/header-widget";
import { useCreditCardTransactions } from "./use-credit-card-transactions";


const CreditCardTransactionsWidget = () => {
  const {
    onSelectDeliveryTimeDates,
    resetDatePicker,
    onClickSearchFilter,
    onClickClearFilter,
    agent,
    agentsCategories,
    handleAgentChange,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
  } = useCreditCardTransactions();
  const { clasess } = useStyle();
  return (
    <div style={clasess.mainContainer}>
    <CreditCardTransactionsReportHeaderWidget
        agent={agent}
        onClickSearchFilter={onClickSearchFilter}
        onClickClearFilter={onClickClearFilter}
        onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
        resetDatePicker={resetDatePicker}
        agentsCategories={agentsCategories}
        handleAgentChange={handleAgentChange}
        customer={customer}
        renderOptions={renderOptions}
        checkWhatRenderArray={checkWhatRenderArray}
        handleCustomerChange={handleCustomerChange} 
    />
    <Divider />
    </div>
  );
};


export { CreditCardTransactionsWidget };
