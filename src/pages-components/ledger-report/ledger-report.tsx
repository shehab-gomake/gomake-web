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
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { Stack } from "@mui/material";

interface LedgerReportWidgetProps {
  clientType: CLIENT_TYPE;
  customerId?: string;
  isFromCustomerCard?: boolean;
  autoShowCard?: boolean;
}
const LedgerReportWidget = ({
  customerId,
  isFromCustomerCard = false,
  autoShowCard = false,
  clientType,
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
    isPurchaseReport,
    hasFetchedPaymentsOnce,
    isLoadingPayments,
    setToDate,
    setFromDate,
  } = useLedgerReport({ customerId, clientType });

  useEffect(() => {
    getErpAccountsList();
  }, []);

  useEffect(() => {
    if (autoShowCard && customerId) {
      onClickShowCard();
    }
  }, [autoShowCard, customerId]);
  return (
    <div style={classes.mainContainer}>
      {!isFromCustomerCard && (
        <HeaderTitle
          title={
            isPurchaseReport
              ? t("tabs.supplierLedger")
              : t("tabs.customerLedger")
          }
          marginTop={"0px"}
          marginBottom={"0px"}
        />
      )}
      <Stack
        direction={"row"}
        width={"100%"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        rowGap={"8px"}
      >
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
          isPurchaseReport={isPurchaseReport}
          setToDate={setToDate}
          setFromDate={setFromDate}
        />

        <LedgerReportButtonWidget
          onClickCreateNewTransaction={onClickCreateNewTransaction}
          onClickSendingTicketByEmail={onClickSendingTicketByEmail}
          onClickPrintCard={onClickPrintCard}
          onClickShowCard={onClickShowCard}
          onClickAdjustments={onClickAdjustments}
        />
      </Stack>
      <Divider />

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
        isAgingReport={false}
      />
      <AdjustmentsLedgerReportModal
        customerId={customerId || customer?.id}
        onCloseModal={onClickCloseAdjustmentsModal}
        openModal={isopenAdjustmentsModal}
        clientPaymentsList={clientPaymentsList}
        getClientPaymentItems={getClientPaymentItems}
        setClientPaymentsList={setClientPaymentsList}
        isLoading={isLoadingPayments}
        hasFetchedOnce={hasFetchedPaymentsOnce}
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
