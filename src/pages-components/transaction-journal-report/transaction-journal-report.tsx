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
import { isValidCustomer } from "@/utils/helpers";
import { AccountingTransactionReportHeader } from "./widgets/header-widget/acconting-header";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { useEffect } from "react";

import CollapsibleTable from "./widgets/collapse-table";

interface TransactionJournalReportWidgetProps {
  reportType: EReportType;
}

const TransactionJournalReportWidget = ({
  reportType,
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
  } = useTransactionJournalReport({ reportType });
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

  return (
    <div
      style={
        isAccountingTransaction
          ? classes.mainContainer
          : { ...classes.mainContainer, marginBottom: 20 }
      }
    >
      <HeaderTitle title={label} marginTop={"0px"} marginBottom={"0px"} />
      {isAccountingTransaction && (
        <AccountingTransactionReportHeader
          handleDateChange={handleDatesChange}
          filterState={filterState}
          setFilterState={setFilterState}
          handleClickClear={handleClearFilters}
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
        reportType={reportType}
      />
      {reportType === EReportType.AdjustmentsReport && (
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
        isValidCustomer={isValidCustomer}
        customerAction={CUSTOMER_ACTIONS.Edit}
        codeFlag={true}
        typeClient={CLIENT_TYPE.CUSTOMER}
        isgetAllCustomers={false}
        openModal={showCustomerModal}
        modalTitle={t("customers.modal.editTitle")}
        onClose={() => setShowCustomerModal(false)}
        customer={customerForEdit}
        setCustomer={setCustomerForEdit}
        showUpdateButton={true}
      />
      {(isAccountingTransaction || isAdjustmentsReport) && (
        <GoMakePagination
          onChangePageNumber={(event, value) => setPageNumber(value)}
          onChangePageSize={handlePageSizeChange}
          page={pageNumber}
          setPage={setPageNumber}
          pagesCount={pagesCount}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export { TransactionJournalReportWidget };
