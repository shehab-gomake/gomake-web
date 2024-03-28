import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { CreditCardTransactionsReportHeaderWidget } from "./widgets/header-widget";
import { useCreditCardTransactions } from "./use-credit-card-transactions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { GoMakeModal } from "@/components";
import { ShowCreditCardTransactions } from "./modal/ShowCreditCardTransactions";


const CreditCardTransactionsWidget = () => {
  const {
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
  } = useCreditCardTransactions();
  const { clasess } = useStyle();
  return (
    <div style={clasess.mainContainer}>
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
    <Divider />
    <PrimaryTable
              stickyFirstCol={false}
              stickyHeader={true}
              maxHeight={650}
              rows={allCreditCardTransaction}
              headers={tableHeaders}
            />
     <GoMakePagination
            onChangePageNumber={(event, value) => setPage(value)}
            onChangePageSize={handlePageSizeChange}
            page={page}
            setPage={setPage}
            pagesCount={pagesCount}
            pageSize={pageSize}
          />
      <GoMakeModal
        insideStyle={clasess.insideStyle}
        openModal={openModal}
        onClose={onClickClosModal}
        modalTitle={ModalTitle}
      >
        <ShowCreditCardTransactions customerId={customerId} renderOptions={undefined} checkWhatRenderArray={undefined} handleCustomerChange={undefined} customer={undefined} />
      </GoMakeModal>
    </div>
  );
};


export { CreditCardTransactionsWidget };
