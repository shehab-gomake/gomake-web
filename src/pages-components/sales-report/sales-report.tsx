import { Divider } from "@mui/joy";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { SalesReportHeaderWidget } from "./widgets/header-widget";
import { SalesReportButtonWidget } from "./widgets/button-widget";
import { useSalesReport } from "./use-sales-report";
import { HeaderTitle } from "@/widgets/header-title/header-title";

const SalesReportWidget = () => {
  const { classes } = useStyle();
  const {
    t,
    agent,
    agentsCategories,
    handleAgentChange,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickBtn1,
    showTable,
    getTableDataRows,
    onChangeDisplayByGroups,
    handleDocumentTypeChange,
    documentType,
    reportsTypeList,
    displayByGroups,
    tableHeaders,
    getTotalTableDataRows,
    handleDateChange,
    fromDate,
    toDate,
    isFetching,
    getNewTableDataRows,
    tableData,
    handleExportRows,
    onClickExportExcelReport,
  } = useSalesReport();

  return (
    <div style={classes.mainContainer}>
      <HeaderTitle
        title={t("tabs.salesReport")}
        marginTop={"0px"}
        marginBottom={"0px"}
      />
      <SalesReportHeaderWidget
        agent={agent}
        agentsCategories={agentsCategories}
        handleAgentChange={handleAgentChange}
        customer={customer}
        renderOptions={renderOptions}
        checkWhatRenderArray={checkWhatRenderArray}
        handleCustomerChange={handleCustomerChange}
        displayByGroups={displayByGroups}
        onChangeDisplayByGroups={onChangeDisplayByGroups}
        reportsTypeList={reportsTypeList}
        handleDocumentTypeChange={handleDocumentTypeChange}
        documentType={documentType}
        handleDateChange={handleDateChange}
        fromDate={fromDate}
        toDate={toDate}
        isFetchingCustomers={isFetching}
      />
      <Divider />
      <SalesReportButtonWidget
        onClickBtn1={onClickBtn1}
        onPrintClick={handleExportRows}
        onClickExportExcelReport={onClickExportExcelReport}
      />
      {showTable &&
        (Array.isArray(tableData) ? tableData : []).map((item) => {
          return (
            <div style={classes.tableTitleContainer}>
              <div style={classes.titleStyle}>
                {item.accountName}-{item.accountCode}
              </div>
              <PrimaryTable
                rows={getNewTableDataRows(item?.data)}
                headers={tableHeaders}
                maxHeight={"calc(100vh - 450px)"}
                stickyHeader={true}
                variant="OddEvenTable"
              />
              <div style={classes.totalStyle}>
                {t("deposits.total")} : {item.total.toFixed(2)}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export { SalesReportWidget };
