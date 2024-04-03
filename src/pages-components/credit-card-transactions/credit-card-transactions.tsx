import { useStyle } from "./style";
import { CreditCardTransactionsReportHeaderWidget } from "./widgets/header-widget";
import { useCreditCardTransactions } from "./use-credit-card-transactions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { GoMakeDeleteModal, GoMakeModal } from "@/components";
import { Stack } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { ShowCreditCardTransactions } from "./widgets/modal/ShowCreditCardTransactions";


const CreditCardTransactionsWidget = () => {
  const { t,
    onSelectDeliveryTimeDates,
    resetDatePicker,
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
    ModalTitle,
    customerId,
    pagesCount,
    pageSize,
    handlePageSizeChange,
    tableHeaders,
    openRefundModal,
    onClickCloseRefundModal
  } = useCreditCardTransactions();

  const { classes } = useStyle();

  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        display="flex"
        spacing={2}
        height="100%"
      >
        <div style={classes.mainContainer}>

          <CreditCardTransactionsReportHeaderWidget
            onClickSearchFilter={onClickSearchFilter}
            onClickClearFilter={onClickClearFilter}
            onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
            resetDatePicker={resetDatePicker}
            customer={customer}
            customerId={customerId}
            renderOptions={renderOptions}
            checkWhatRenderArray={checkWhatRenderArray}
            handleCustomerChange={handleCustomerChange}
          />

          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={true}
            maxHeight={650}
            rows={allCreditCardTransaction}
            headers={tableHeaders}
          />
        </div>

        <GoMakePagination
          onChangePageNumber={(event, value) => setPage(value)}
          onChangePageSize={handlePageSizeChange}
          page={page}
          setPage={setPage}
          pagesCount={pagesCount}
          pageSize={pageSize}
        />
      </Stack>

      <GoMakeModal
        insideStyle={classes.insideStyle}
        openModal={openModal}
        onClose={onClickClosModal}
        modalTitle={t("creditCardTransactions.TransferToAnotherCustomer")}
      >
        <ShowCreditCardTransactions />
      </GoMakeModal>
      <GoMakeDeleteModal
        icon={<WarningAmberIcon style={classes.iconStyle} />}
        title={t("creditCardTransactions.ProcessRefundModalTitle")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openRefundModal}
        onClose={onClickCloseRefundModal}
        onClickDelete={() => null}
      />

    </>
  );
};


export { CreditCardTransactionsWidget };
