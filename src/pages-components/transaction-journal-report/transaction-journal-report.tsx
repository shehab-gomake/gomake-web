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
    //?new
    label,
    filterState,
    setFilterState,
    handleDatesChange,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    customer,
    handleCustomerChange,
  } = useTransactionJournalReport({ reportType });

  return (
    <div style={classes.mainContainer}>
      <HeaderTitle title={label} marginTop={"0px"} marginBottom={"0px"} />
      {reportType === EReportType.AccountingTransaction ? (
        <AccountingTransactionReportHeader
          handleDateChange={handleDatesChange}
          filterState={filterState}
          setFilterState={setFilterState}
          renderOptions={renderOptions}
          checkWhatRenderArray={checkWhatRenderArray}
          isFetching={isFetching}
          customer={customer}
          handleCustomerChange={handleCustomerChange}
        />
      ) : (
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
      />
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
    </div>
  );
};

export { TransactionJournalReportWidget };
