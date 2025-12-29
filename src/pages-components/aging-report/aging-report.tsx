import { Divider } from "@mui/joy";
import { AgingReportHeaderWidget } from "./widgets/header-widget";
import { AgingReportButtonWidget } from "./widgets/button-widget";
import { useAgingReport } from "./use-aging-report";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { HeaderTitle } from "@/widgets/header-title/header-title";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { SendEmailLedgerReportModal } from "../ledger-report/widgets/send-email-modal";
import { Stack } from "@mui/material";
import { WhatsAppWebModal } from "@/widgets/quote-new/modals-widgets/whats-app-web-modal";
import { GoMakeAlertModal } from "@/components/modal/alert-modal";
import { SendPaymentDebitsModal } from "./widgets/send-payment-debits-modal";

interface IProps {
  clientType: CLIENT_TYPE;
}

const AgingReportWidget = ({ clientType }: IProps) => {
  const {
    t,
    handleClickSelectDate,
    selectDate,
    setSelectDate,
    dateRef,
    agent,
    agentsCategories,
    handleAgentChange,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickBtn1,
    onClickBtn2,
    onClickBtn3,
    onClickBtn4,
    onClickBtn5,
    onClickBtn6,
    showTable,
    detailedReport,
    getTableDataRows,
    onChangeDetailedReport,
    onChangeByReferenceDate,
    transformedHeaders,
    handleDateChange,
    fromDate,
    toDate,
    showCustomerModal,
    setShowCustomerModal,
    customerForEdit,
    setCustomerForEdit,
    onClickOpenCustomerModal, // New handler
    isFetching,
    tableHeader,
    handleSortAgingReport,
    isDescOrder,
    isPurchaseReport,
    setFromDate,
    setToDate,
    agingReportByCreationDate,
    onChangeAgingReportByCreationDate,
    isSendPaymentModal,
    clientContactsValue,
    setClientContactsValue,
    selectedContactById,
    setSelectedContactById,
    onChangeUpdateClientContact,
    sendPaymenttoClient,
    isWhatsAppModal,
    whatsappMessage,
    isSendToAllClientsModal,
    sendPaymentToAllClients,
    isSendPaymentDebitsModal,
    availableDebits,
    onClickBtn7,
    sendSelectedDebitsPayment,
    isLoadingDebits,
  } = useAgingReport(clientType);

  const { classes } = useStyle();

  return (
    <div style={classes.mainContainer}>
      <HeaderTitle
        title={
          clientType === CLIENT_TYPE.SUPPLIER
            ? t("tabs.supplierAging")
            : t("tabs.agingReport")
        }
        marginTop={"0px"}
        marginBottom={"0px"}
      />
      <Stack
        direction={"row"}
        width={"100%"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        rowGap={"8px"}
      >
        <AgingReportHeaderWidget
          handleClickSelectDate={handleClickSelectDate}
          selectDate={selectDate}
          setSelectDate={setSelectDate}
          dateRef={dateRef}
          agent={agent}
          agentsCategories={agentsCategories}
          handleAgentChange={handleAgentChange}
          customer={customer}
          isFetchingCustomers={isFetching}
          renderOptions={renderOptions}
          checkWhatRenderArray={checkWhatRenderArray}
          handleCustomerChange={handleCustomerChange}
          detailedReport={detailedReport}
          onChangeDetailedReport={onChangeDetailedReport}
          agingReportByCreationDate={agingReportByCreationDate}
          onChangeAgingReportByCreationDate={onChangeAgingReportByCreationDate}
          onChangeByReferenceDate={onChangeByReferenceDate}
          handleDateChange={handleDateChange}
          fromDate={fromDate}
          toDate={toDate}
          isPurchaseReport={isPurchaseReport}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
        <AgingReportButtonWidget
          onClickBtn1={onClickBtn1}
          onClickBtn2={onClickBtn2}
          onClickBtn3={onClickBtn3}
          onClickBtn4={onClickBtn4}
          onClickBtn5={onClickBtn5}
          onClickBtn6={onClickBtn6}
          onClickBtn7={onClickBtn7}
        />
      </Stack>
      <Divider />
      {showTable && (
        <PrimaryTable
          rows={getTableDataRows(onClickOpenCustomerModal)} // Pass handler here
          headers={transformedHeaders}
          maxHeight={"100vh"}
          stickyHeader={true}
          variant={detailedReport ? "PrimaryTable " : "OddEvenTable"}
          isAgingeport={true}
          isAgingDetailedReport={detailedReport}
          handleSortAgingReport={handleSortAgingReport}
          isDescOrder={isDescOrder}
        />
      )}
      {/* Add CustomerCardWidget */}
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Edit}
        typeClient={
          isPurchaseReport ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER
        }
        codeFlag={true}
        isgetAllCustomers={false}
        openModal={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customer={customerForEdit}
        setCustomer={setCustomerForEdit}
      />

      <SendEmailLedgerReportModal
        openModal={isSendPaymentModal.isOpen}
        onCloseModal={() => isSendPaymentModal.close()}
        clientContactsValue={clientContactsValue}
        setSelectedContactById={setSelectedContactById}
        selectedContactById={selectedContactById}
        onChangeUpdateClientContact={onChangeUpdateClientContact}
        SendCustomerLedgerToMailApi={sendPaymenttoClient}
        isAgingReport={true}
      />
      <WhatsAppWebModal
        openModal={isWhatsAppModal.isOpen}
        onClose={() => isWhatsAppModal.close()}
        whatsappMassage={whatsappMessage}
        documentType={null}
        clientContacts={clientContactsValue}
      />
      <GoMakeAlertModal
        openModal={isSendToAllClientsModal.isOpen}
        onClose={() => isSendToAllClientsModal.close()}
        title={t("reports.sendDebitsToAllClients")}
        subTitle="reports.confirmSendDebitsToAllClients"
        onClickConfirm={sendPaymentToAllClients}
        yesBtn="sales.quote.Confirm"
      />
      <SendPaymentDebitsModal
        openModal={isSendPaymentDebitsModal.isOpen}
        onClose={() => isSendPaymentDebitsModal.close()}
        customerName={customer?.name || ""}
        debits={availableDebits}
        onSend={sendSelectedDebitsPayment}
        clientContacts={clientContactsValue}
        isLoading={isLoadingDebits}
      />
    </div>
  );
};

export { AgingReportWidget };
