
import { Divider } from "@mui/joy";
import { PrimaryTable } from "@/components/tables/primary-table";
import { AdjustmentsLedgerReportModal } from "./widgets/adjustments-modal";
import { SendEmailLedgerReportModal } from "./widgets/send-email-modal";
import { LedgerReportHeaderWidget } from "./widgets/header-widget";
import { LedgerReportButtonWidget } from "./widgets/button-widget";
import { useLedgerReport } from "./use-ledger-report";
import { useStyle } from "./style";
import { CreateNewTransactionModal } from "./widgets/create-transaction-modal";
import { HeaderTitle } from "@/widgets/header-title";

const LedgerReportWidget = ({ customerId }: any) => {
  const { classes } = useStyle();
  const {
    t,
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
    onClickCloseCreateTransactionModal,
    isopenCreateTransactionModal,
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
    setClientPaymentsList,
    handleDateChange,
    fromDate,
    toDate,
  } = useLedgerReport({ customerId });

  return (
    <div style={classes.mainContainer}>
      <HeaderTitle title={t("tabs.ledgerReport")} marginTop={"0px"} marginBottom={"0px"} />
      <LedgerReportHeaderWidget
        customer={customer}
        renderOptions={renderOptions}
        checkWhatRenderArray={checkWhatRenderArray}
        handleCustomerChange={handleCustomerChange}
        isExtended={isExtended}
        onChangeIsExtended={onChangeIsExtended}
        handleDateChange={handleDateChange}
        fromDate={fromDate}
        toDate={toDate}
        customerId={customerId}
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
          stickyHeader={true}
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
        customerId={customerId || customer?.id}
        onCloseModal={onClickCloseAdjustmentsModal}
        openModal={isopenAdjustmentsModal}
        clientPaymentsList={clientPaymentsList}
        getClientPaymentItems={getClientPaymentItems}
        setClientPaymentsList={setClientPaymentsList}
      />
      <CreateNewTransactionModal onCloseModal={onClickCloseCreateTransactionModal} openModal={isopenCreateTransactionModal} customerId={customerId} />
    </div>
  );
};

export { LedgerReportWidget };