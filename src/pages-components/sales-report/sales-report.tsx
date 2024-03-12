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
    detailedReport,
    getTableDataRows,
    onChangeDetailedReport,
    transformedHeaders
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
        detailedReport={detailedReport}
        onChangeDetailedReport={onChangeDetailedReport}

      />
      <Divider />
      <SalesReportButtonWidget
        onClickBtn1={onClickBtn1}
      />
      {
        showTable &&
        <PrimaryTable
          rows={getTableDataRows()}
          headers={transformedHeaders}
          maxHeight={650}
        />
      }

    </div>
  );
};


export { SalesReportWidget };
