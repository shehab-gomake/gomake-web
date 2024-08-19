import { Divider } from "@mui/joy";
import { PrimaryTable } from "@/components/tables/primary-table";
import { LedgerReportButtonWidget } from "./widgets/button-widget";
import { useTransactionJournalReport } from "./use-transaction-journal-report";
import { useStyle } from "./style";
import { TransactionJournalReportHeaderWidget } from "./widgets/header-widget";
import { DocumentsTypeReportList } from "@/enums";
import { HeaderTitle } from "@/widgets/header-title/header-title";
interface TransactionJournalReportWidgetProps {
  isPayment: boolean;
}

const TransactionJournalReportWidget = ({ isPayment }: TransactionJournalReportWidgetProps) => {
  const { classes } = useStyle();
  const {
    t,
    onSelectDeliveryTimeDates,
    handleDocumentTypeChange,
    onClickPrintCard,
    onClickShowCard,
    getTableDataRows,
    documentType,
    resetDatePicker,
    documentsTypeList,
    showTable,
    tableHeaders,
    dataTable
  } = useTransactionJournalReport({ isPayment })

  return (
    <div style={classes.mainContainer}>
      <HeaderTitle title={isPayment?  t("tabs.dailyPaymentsReport") : t("tabs.transactionJournalReport")} marginTop={"0px"} marginBottom={"0px"} />
      <TransactionJournalReportHeaderWidget
        onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
        resetDatePicker={resetDatePicker}
        handleDocumentTypeChange={handleDocumentTypeChange}
        documentType={documentType}
        documentsTypeList={documentsTypeList}
        isPayment={isPayment}
      />
      <Divider />
      <LedgerReportButtonWidget
        onClickPrintCard={onClickPrintCard}
        onClickShowCard={onClickShowCard}
      />
      <div style={{ width: "100%", height: "100%" }}>
        {documentType?.id !== DocumentsTypeReportList.Payments && !isPayment ?
          <div>
            {
              showTable &&
              dataTable?.map((item) => {
                return <PrimaryTable
                  rows={getTableDataRows(item?.data)}
                  headers={tableHeaders}
                  maxHeight={650}
                />
              })

            }</div> :
          <div>
            {
              showTable &&
              dataTable?.map((item) => {
                return (
                  <div style={classes.tableTitleContainer}>
                    <div style={classes.titleStyle}>{item.accountName}-{item.accountCode}</div>
                    <PrimaryTable
                      rows={getTableDataRows(item?.data)}
                      headers={tableHeaders}
                      maxHeight={400}
                    />
                  </div>
                )
              })
            }
          </div>
        }
      </div>
    </div>

  );
};


export { TransactionJournalReportWidget };