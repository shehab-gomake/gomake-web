import { Divider } from "@mui/joy";

import { useLedgerReport } from "./use-ledger-report";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { LedgerReportHeaderWidget } from "./widgets/header-widget";
import { LedgerReportButtonWidget } from "./widgets/button-widget";
import { SendEmailLedgerReportModal } from "./widgets/send-email-modal";
import { useEffect } from "react";

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
    tableHeaders,
    isopenEmailModal,
    onClickCloseEmailModal,
    getAllClientContacts,
    clientContactsValue,
    setSelectedContactById,
    selectedContactById,
    onChangeUpdateClientContact
  } = useLedgerReport()
  useEffect(() => {
    if (customer?.id) {
      getAllClientContacts();
    }
  }, [customer]);
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
      <SendEmailLedgerReportModal
        openModal={isopenEmailModal}
        onCloseModal={onClickCloseEmailModal}
        clientContactsValue={clientContactsValue}
        setSelectedContactById={setSelectedContactById}
        selectedContactById={selectedContactById}
        onChangeUpdateClientContact={onChangeUpdateClientContact}
      />
    </div>

  );
};


export { LedgerReportWidget };
