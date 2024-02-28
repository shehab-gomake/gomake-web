
import { Divider } from "@mui/joy";

import { PrimaryTable } from "@/components/tables/primary-table";

import { AdjustmentsLedgerReportModal } from "./widgets/adjustments-modal";
import { SendEmailLedgerReportModal } from "./widgets/send-email-modal";
import { LedgerReportHeaderWidget } from "./widgets/header-widget";
import { LedgerReportButtonWidget } from "./widgets/button-widget";
import { useLedgerReport } from "./use-ledger-report";
import { useStyle } from "./style";

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
    onClickAdjustments,
    onChangeIsExtended,
    getTableDataRows,
    onClickCloseEmailModal,
    setSelectedContactById,
    onChangeUpdateClientContact,
    onClickCloseAdjustmentsModal,
    getClientPaymentItems,
    SendCustomerLedgerToMailApi,
    isExtended,
    showTable,
    resetDatePicker,
    customer,
    tableHeaders,
    isopenEmailModal,
    clientContactsValue,
    selectedContactById,
    isopenAdjustmentsModal,
    clientPaymentsList,
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
        onClickAdjustments={onClickAdjustments}

      />
      {
        showTable &&
        <PrimaryTable
          rows={getTableDataRows()}
          headers={tableHeaders}
          maxHeight={650}
        />
      }
      <SendEmailLedgerReportModal
        openModal={isopenEmailModal}
        onCloseModal={onClickCloseEmailModal}
        clientContactsValue={clientContactsValue}
        setSelectedContactById={setSelectedContactById}
        selectedContactById={selectedContactById}
        onChangeUpdateClientContact={onChangeUpdateClientContact}
        SendCustomerLedgerToMailApi={SendCustomerLedgerToMailApi}
      />
      <AdjustmentsLedgerReportModal
        onCloseModal={onClickCloseAdjustmentsModal}
        openModal={isopenAdjustmentsModal}
        clientPaymentsList={clientPaymentsList}
        getClientPaymentItems={getClientPaymentItems}
      />
    </div>

  );
};


export { LedgerReportWidget };
