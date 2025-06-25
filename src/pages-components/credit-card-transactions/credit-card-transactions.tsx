import { useStyle } from "./style";
import { CreditCardTransactionsReportHeaderWidget } from "./widgets/header-widget";
import { useCreditCardTransactions } from "./use-credit-card-transactions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { GoMakeDeleteModal, GoMakeModal } from "@/components";
import { Stack } from "@mui/material";
import { TransferToClientModal } from "./widgets/modal/TransferToClientModal";
import { ModalType } from "@/enums";

const CreditCardTransactionsWidget = () => {
  const { classes } = useStyle();
  const {
    t,
    onSelectDeliveryTimeDates,
    onClickSearchFilter,
    onClickClearFilter,
    customer,
    renderOptions,
    checkWhatRenderArray,
    allCreditCardTransaction,
    handleCustomerChange,
    page,
    setPage,
    openModal,
    onClickClosModal,
    pagesCount,
    pageSize,
    handlePageSizeChange,
    tableHeaders,
    openRefundModal,
    onClickCloseRefundModal,
    onClickMakeRefund,
    onClickChangeTransactionClient,
    transactionAmount,
    receiptNumber,
    handleTransactionAmountChange,
    handleReceiptNumberChange,
    handleDateChange,
    fromDate,
    toDate,
    isFetching,
    initialPageSize,
    setToDate,
    setFromDate,
  } = useCreditCardTransactions();

  return (
    <>
      <Stack sx={classes.stackStyle}>
        <div style={classes.mainContainer}>
          <CreditCardTransactionsReportHeaderWidget
            transactionAmount={transactionAmount}
            receiptNumber={receiptNumber}
            handleTransactionAmountChange={handleTransactionAmountChange}
            handleReceiptNumberChange={handleReceiptNumberChange}
            onClickSearchFilter={onClickSearchFilter}
            onClickClearFilter={onClickClearFilter}
            customer={customer}
            renderOptions={renderOptions}
            checkWhatRenderArray={checkWhatRenderArray}
            handleCustomerChange={handleCustomerChange}
            handleDateChange={handleDateChange}
            fromDate={fromDate}
            toDate={toDate}
            isFetchingCustomers={isFetching}
            setToDate={setToDate}
            setFromDate={setFromDate}
          />
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={true}
            maxHeight={"100vh"}
            rows={allCreditCardTransaction}
            headers={tableHeaders}
            variant="OddEvenTable"
          />
        </div>
        <GoMakePagination
          onChangePageNumber={(event, value) => setPage(value)}
          onChangePageSize={handlePageSizeChange}
          page={page}
          setPage={setPage}
          pagesCount={pagesCount}
          pageSize={pageSize}
          initialPageSize={initialPageSize}
        />
      </Stack>
      <GoMakeModal
        insideStyle={classes.insideStyle}
        openModal={openModal}
        onClose={onClickClosModal}
        modalTitle={t("creditCardTransactions.TransferToAnotherCustomer")}
      >
        <TransferToClientModal
          onClickClosModal={onClickClosModal}
          onClickConfirm={onClickChangeTransactionClient}
        />
      </GoMakeModal>
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("creditCardTransactions.ProcessRefundModalTitle")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openRefundModal}
        onClose={onClickCloseRefundModal}
        onClickDelete={onClickMakeRefund}
      />
    </>
  );
};

export { CreditCardTransactionsWidget };
