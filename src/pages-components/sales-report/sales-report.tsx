import { Divider } from "@mui/joy";

import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { SalesReportHeaderWidget } from "./widgets/header-widget";
import { SalesReportButtonWidget } from "./widgets/button-widget";
import { useSalesReport } from "./use-sales-report";

const SalesReportWidget = () => {
  const { clasess } = useStyle();
  const {
    onSelectDeliveryTimeDates,
    resetDatePicker,
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
    documentsTypeList,
    displayByGroups,
    tableHeaders
  } = useSalesReport()
  return (
    <div style={clasess.mainContainer}>
      <SalesReportHeaderWidget
        onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
        resetDatePicker={resetDatePicker}
        agent={agent}
        agentsCategories={agentsCategories}
        handleAgentChange={handleAgentChange}
        customer={customer}
        renderOptions={renderOptions}
        checkWhatRenderArray={checkWhatRenderArray}
        handleCustomerChange={handleCustomerChange}
        displayByGroups={displayByGroups}
        onChangeDisplayByGroups={onChangeDisplayByGroups}
        documentsTypeList={documentsTypeList}
        handleDocumentTypeChange={handleDocumentTypeChange}
        documentType={documentType}

      />
      <Divider />
      <SalesReportButtonWidget
        onClickBtn1={onClickBtn1}
      />
      {
        showTable &&
        <PrimaryTable
          rows={getTableDataRows()}
          headers={tableHeaders}
          maxHeight={650}
        />
      }

    </div>
  );
};


export { SalesReportWidget };
