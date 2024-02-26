import { Divider } from "@mui/joy";

import { useLedgerReport } from "./use-ledger-report";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { LedgerReportHeaderWidget } from "./widgets/header-widget";
import { LedgerReportButtonWidget } from "./widgets/button-widget";

const LedgerReportWidget = () => {
  const { clasess } = useStyle();
  const {
    onSelectDeliveryTimeDates,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickCreateNewTransaction,
    onClickSendingTicketByEmail,
    onClickPrintCard,
    onClickShowCard,
    onChangeIsExtended,
    getTableDataRows,
    isExtended,
    showTable,
    resetDatePicker,
    customer,
    tableHeaders
  } = useLedgerReport()
  return (
    <div style={clasess.mainContainer}>
      <LedgerReportHeaderWidget
        onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
        resetDatePicker={resetDatePicker}
        customer={customer}
        renderOptions={renderOptions}
        checkWhatRenderArray={checkWhatRenderArray}
        handleCustomerChange={handleCustomerChange}
        isExtended={isExtended}
        onChangeIsExtended={onChangeIsExtended}
      />
      <Divider />
      <LedgerReportButtonWidget
        onClickCreateNewTransaction={onClickCreateNewTransaction}
        onClickSendingTicketByEmail={onClickSendingTicketByEmail}
        onClickPrintCard={onClickPrintCard}
        onClickShowCard={onClickShowCard}
      />
      {
        showTable &&
        <PrimaryTable
          rows={getTableDataRows()}
          headers={tableHeaders}
          maxHeight={650}
        />
      }

    </div>
  );
};


export { LedgerReportWidget };
