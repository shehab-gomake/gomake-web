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
import { useEffect } from "react";

interface LedgerReportWidgetProps {
  customerId?: string;
  isFromCustomerCard?: boolean;
  autoShowCard?: boolean;
}
const LedgerReportWidget = ({
  customerId,
  isFromCustomerCard = false,
                              autoShowCard = false,

}: LedgerReportWidgetProps) => {
  const { classes } = useStyle();
  const {
    t,
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
    isFetching,
    erpAccountsList,
    getErpAccountsList,
  } = useLedgerReport({ customerId });

  useEffect(() => {
    getErpAccountsList();
  }, []);

  useEffect(() => {
    if (autoShowCard && customerId) {
      onClickShowCard()
    }
  }, [autoShowCard, customerId]);
  return (
    <div style={classes.mainContainer}>
      {!isFromCustomerCard && (
        <HeaderTitle
          title={t("tabs.ledgerReport")}
          marginTop={"0px"}
          marginBottom={"0px"}
        />
      )}
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
        isFetchingCustomers={isFetching}
      />
      <Divider />
      <LedgerReportButtonWidget
        onClickCreateNewTransaction={onClickCreateNewTransaction}
        onClickSendingTicketByEmail={onClickSendingTicketByEmail}
        onClickPrintCard={onClickPrintCard}
        onClickShowCard={onClickShowCard}
        onClickAdjustments={onClickAdjustments}
      />
      {showTable && (
        <PrimaryTable
          rows={getTableDataRows()}
          headers={tableHeaders}
          maxHeight={"100vh"}
          stickyFirstCol={false}
          stickyHeader={true}
          variant="OddEvenTable"
        />
      )}
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
      <CreateNewTransactionModal
        onCloseModal={onClickCloseCreateTransactionModal}
        openModal={isopenCreateTransactionModal}
        erpAccountsList={erpAccountsList}
      />
    </div>
  );
};

export { LedgerReportWidget };
