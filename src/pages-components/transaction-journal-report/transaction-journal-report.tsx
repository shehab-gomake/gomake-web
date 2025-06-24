import { Divider } from "@mui/joy";
import { PrimaryTable } from "@/components/tables/primary-table";
import { LedgerReportButtonWidget } from "./widgets/button-widget";
import { useTransactionJournalReport } from "./use-transaction-journal-report";
import { useStyle } from "./style";
import { TransactionJournalReportHeaderWidget } from "./widgets/header-widget";
import { DocumentsTypeReportList, EReportType } from "@/enums";
import { HeaderTitle } from "@/widgets/header-title/header-title";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { AccountingTransactionReportHeader } from "./widgets/header-widget/acconting-header";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { useEffect } from "react";
import CollapsibleTable from "./widgets/collapse-table";
import { CreateNewTransactionModal } from "../ledger-report/widgets/create-transaction-modal";
import { AdjustmentsLedgerReportModal } from "../ledger-report/widgets/adjustments-modal";
import { GoMakeAutoComplate } from "@/components";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";

interface TransactionJournalReportWidgetProps {
  reportType: EReportType;
  clientType?: CLIENT_TYPE;
}

const TransactionJournalReportWidget = ({
  reportType,
  clientType = CLIENT_TYPE.CUSTOMER,
}: TransactionJournalReportWidgetProps) => {
  const { classes } = useStyle();
  const {
    t,
    handleDocumentTypeChange,
    onClickPrintCard,
    onClickShowCard,
    getTableDataRows,
    documentType,
    documentsTypeList,
    showTable,
    tableHeaders,
    dataTable,
    handleDateChange,
    fromDate,
    toDate,
    showCustomerModal,
    setShowCustomerModal,
    customerForEdit,
    setCustomerForEdit,
    onClickOpenCustomerModal,
    label,
    filterState,
    setFilterState,
    handleDatesChange,
    handlePageSizeChange,
    pageSize,
    pagesCount,
    pageNumber,
    setPageNumber,
    getAccountingTransactionReportFilter,
    handleClearFilters,
    getAccountingTableRows,
    rows,
    headers,
    getAdjustmentsReports,
    onClickOpenCreateTransactionModal,
    onClickCloseCreateTransactionModal,
    isOpenCreateTransactionModal,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
    isOpenAdjustmentsModal,
    onClickCloseAdjustmentsModal,
    onClickOpenAdjustmentsModal,
    getClientPaymentItems,
    clientPaymentsList,
    setClientPaymentsList,
    onClickExportAccountingReportExcel,
    onClickExportJournalExcelReport,
    erpAccountsList,
    getErpAccountsList,
    onClickDownloadMovingFiles,
    onClickExportJournalPDFReport,
    isLoadingPayments,
    hasFetchedOnce,
    initialPageSize,
  } = useTransactionJournalReport({ reportType, clientType });

  const isAccountingTransaction =
    reportType === EReportType.AccountingTransaction;
  const isAdjustmentsReport = reportType === EReportType.AdjustmentsReport;

  useEffect(() => {
    if (isAccountingTransaction) {
      getAccountingTransactionReportFilter();
    } else if (isAdjustmentsReport) {
      getAdjustmentsReports();
    }
  }, [pageNumber, pageSize]);

  useEffect(() => {
    if (customer?.id && isOpenAdjustmentsModal) {
      getClientPaymentItems();
    }
  }, [customer, isOpenAdjustmentsModal]);

  useEffect(() => {
    getErpAccountsList();
  }, []);

  return (
    <div
      style={
        isAccountingTransaction
          ? classes.mainContainer
          : { ...classes.mainContainer, marginBottom: 20 }
      }
    >
      <HeaderTitle title={label} marginTop={"0px"} marginBottom={"0px"} />
      {isAdjustmentsReport && (
        <div
          style={{
            ...classes.date1FilterContainer,
            width: "18%",
            maxWidth: "200px",
          }}
        >
          <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
          <ClientAutocomplete
            key={customer?.id}
            options={renderOptions()}
            onChangeTextField={checkWhatRenderArray}
            getOptionLabel={(option: any) => `${option.name}`}
            style={classes.textInputStyle}
            onChange={handleCustomerChange}
            value={customer}
            loading={isFetching}
          />
        </div>
      )}
      {isAccountingTransaction && (
        <AccountingTransactionReportHeader
          handleDateChange={handleDatesChange}
          filterState={filterState}
          setFilterState={setFilterState}
          handleClickClear={handleClearFilters}
          erpAccountsList={erpAccountsList}
        />
      )}
      {!isAdjustmentsReport && !isAccountingTransaction && (
        <TransactionJournalReportHeaderWidget
          handleDocumentTypeChange={handleDocumentTypeChange}
          documentType={documentType}
          documentsTypeList={documentsTypeList}
          reportType={reportType}
          handleDateChange={handleDateChange}
          fromDate={fromDate}
          toDate={toDate}
        />
      )}
      <Divider />
      <LedgerReportButtonWidget
        onClickPrintCard={onClickPrintCard}
        onClickShowCard={onClickShowCard}
        onClickCreateNewTransaction={onClickOpenCreateTransactionModal}
        onClickOpenAdjustmentsModal={onClickOpenAdjustmentsModal}
        onClickExportAccountingReportExcel={onClickExportAccountingReportExcel}
        onClickExportJournalExcelReport={onClickExportJournalExcelReport}
        onClickDownloadMovingFiles={onClickDownloadMovingFiles}
        onClickExportJournalPDFReport={onClickExportJournalPDFReport}
        reportType={reportType}
      />
      {isAdjustmentsReport && (
        <CollapsibleTable
          rows={rows}
          headers={headers}
          style={{ height: "100%", maxHeight: "calc(100vh - 300px)" }}
        />
      )}
      {isAccountingTransaction && (
        <PrimaryTable
          rows={getAccountingTableRows()}
          headers={tableHeaders}
          maxHeight={"calc(100vh - 300px)"}
          stickyHeader={true}
          variant="OddEvenTable"
        />
      )}
      {!isAccountingTransaction && !isAdjustmentsReport && (
        <div style={{ width: "100%", height: "100%" }}>
          {documentType?.id !== DocumentsTypeReportList.Payments &&
          reportType !== EReportType.DailyPayments ? (
            <div>
              {showTable &&
                dataTable?.map((item) => {
                  return (
                    <PrimaryTable
                      rows={getTableDataRows(
                        item?.data,
                        onClickOpenCustomerModal
                      )}
                      headers={tableHeaders}
                      maxHeight={"calc(100vh - 300px)"}
                      stickyHeader={true}
                      variant="OddEvenTable"
                    />
                  );
                })}
            </div>
          ) : (
            <div>
              {showTable &&
                dataTable?.map((item) => {
                  return (
                    <div style={classes.tableTitleContainer}>
                      <div style={classes.titleStyle}>
                        {item.accountName}-{item.accountCode}
                      </div>
                      <PrimaryTable
                        rows={getTableDataRows(
                          item?.data,
                          onClickOpenCustomerModal
                        )}
                        headers={tableHeaders}
                        maxHeight={400}
                        variant="OddEvenTable"
                      />
                      <div style={classes.totalStyle}>
                        {t("deposits.total")} : {item.total.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Edit}
        codeFlag={true}
        typeClient={CLIENT_TYPE.CUSTOMER}
        isgetAllCustomers={false}
        openModal={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customer={customerForEdit}
        setCustomer={setCustomerForEdit}
      />
      <CreateNewTransactionModal
        onCloseModal={onClickCloseCreateTransactionModal}
        openModal={isOpenCreateTransactionModal}
        erpAccountsList={erpAccountsList}
      />
      <AdjustmentsLedgerReportModal
        customerId={customer?.id}
        onCloseModal={onClickCloseAdjustmentsModal}
        openModal={isOpenAdjustmentsModal}
        clientPaymentsList={clientPaymentsList}
        getClientPaymentItems={getClientPaymentItems}
        setClientPaymentsList={setClientPaymentsList}
        isLoading={isLoadingPayments}
        hasFetchedOnce={hasFetchedOnce}
      />
      {(isAccountingTransaction || isAdjustmentsReport) && (
        <GoMakePagination
          onChangePageNumber={(event, value) => setPageNumber(value)}
          onChangePageSize={handlePageSizeChange}
          page={pageNumber}
          setPage={setPageNumber}
          pagesCount={pagesCount}
          pageSize={pageSize}
          initialPageSize={initialPageSize}
        />
      )}
    </div>
  );
};

export { TransactionJournalReportWidget };
