import { Divider } from "@mui/joy";

import { AgingReportHeaderWidget } from "./widgets/header-widget";
import { AgingReportButtonWidget } from "./widgets/button-widget";
import { useAgingReport } from "./use-aging-report";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";

const AgingReportWidget = () => {
  const { clasess } = useStyle();
  const {
    onSelectDeliveryTimeDates,
    resetDatePicker,
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
    transformedHeaders
  } = useAgingReport()
  return (
    <div style={clasess.mainContainer}>
      <AgingReportHeaderWidget
        onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
        resetDatePicker={resetDatePicker}
        handleClickSelectDate={handleClickSelectDate}
        selectDate={selectDate}
        setSelectDate={setSelectDate}
        dateRef={dateRef}
        agent={agent}
        agentsCategories={agentsCategories}
        handleAgentChange={handleAgentChange}
        customer={customer}
        renderOptions={renderOptions}
        checkWhatRenderArray={checkWhatRenderArray}
        handleCustomerChange={handleCustomerChange}
        detailedReport={detailedReport}
        onChangeDetailedReport={onChangeDetailedReport}
        onChangeByReferenceDate={onChangeByReferenceDate}

      />
      <Divider />
      <AgingReportButtonWidget
        onClickBtn1={onClickBtn1}
        onClickBtn2={onClickBtn2}
        onClickBtn3={onClickBtn3}
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


export { AgingReportWidget };
