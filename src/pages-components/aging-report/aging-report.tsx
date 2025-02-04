import { Divider } from "@mui/joy";
import { AgingReportHeaderWidget } from "./widgets/header-widget";
import { AgingReportButtonWidget } from "./widgets/button-widget";
import { useAgingReport } from "./use-aging-report";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { HeaderTitle } from "@/widgets/header-title/header-title";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { isValidCustomer } from "@/utils/helpers";

const AgingReportWidget = () => {
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
  } = useAgingReport();
  const { classes } = useStyle();

  return (
    <div style={classes.mainContainer}>
      <HeaderTitle
        title={t("tabs.agingReport")}
        marginTop={"0px"}
        marginBottom={"0px"}
      />

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
        onChangeByReferenceDate={onChangeByReferenceDate}
        handleDateChange={handleDateChange}
        fromDate={fromDate}
        toDate={toDate}
      />

      <Divider />

      <AgingReportButtonWidget
        onClickBtn1={onClickBtn1}
        onClickBtn2={onClickBtn2}
        onClickBtn3={onClickBtn3}
      />

      {showTable && (
        <PrimaryTable
          rows={getTableDataRows(onClickOpenCustomerModal)} // Pass handler here
          headers={transformedHeaders}
          maxHeight={"100vh"}
          stickyHeader={true}
          variant="OddEvenTable"
        />
      )}

      {/* Add CustomerCardWidget */}
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

export { AgingReportWidget };
