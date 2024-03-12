import { Checkbox } from "@mui/material";

import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components"
import { SalesReportHeaderWidgetProps, useSalesReportHeader } from "./use-header-widget";


const SalesReportHeaderWidget = ({
  onSelectDeliveryTimeDates,
  resetDatePicker,
  agent,
  agentsCategories,
  handleAgentChange,
  customer,
  renderOptions,
  checkWhatRenderArray,
  handleCustomerChange,
  displayByGroups,
  onChangeDisplayByGroups,
  documentsTypeList,
  handleDocumentTypeChange,
  documentType
}: SalesReportHeaderWidgetProps) => {

  const { clasess, t } = useSalesReportHeader()

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.date1FilterContainer}>
        <h3 style={clasess.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
        </div>
      </div>
      <div style={clasess.date2FilterContainer}>
        <h3 style={clasess.filterLabelStyle}>{t("sales.quote.agent")}</h3>
        <GoMakeAutoComplate
          key={agent?.id}
          options={agentsCategories}
          style={clasess.textInputStyle}
          getOptionLabel={(option: any) => option.label}
          placeholder={t("sales.quote.ChooseAgent")}
          onChange={handleAgentChange}
          value={agent}
        />
      </div>
      <div style={clasess.date2FilterContainer}>
        <h3 style={clasess.filterLabelStyle}>{t("sales.quote.customer")}</h3>
        <GoMakeAutoComplate
          key={customer?.id}
          options={renderOptions()}
          onChangeTextField={checkWhatRenderArray}
          getOptionLabel={(option: any) => `${option.name}`}
          style={clasess.textInputStyle}
          placeholder={t("sales.quote.chooseCustomer")}
          onChange={handleCustomerChange}
          value={customer}
        />
      </div>
      <div style={clasess.date2FilterContainer}>
        <h3 style={clasess.filterLabelStyle}>{t("reports.documentsType")}</h3>
        <GoMakeAutoComplate
          options={documentsTypeList}
          style={clasess.textInputStyle}
          placeholder={t("reports.chooseDocumentType")}
          onChange={handleDocumentTypeChange}
          value={documentType}
        />
      </div>
      <div style={clasess.date1FilterContainer}>
        <div style={clasess.checkboxStyle}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeDisplayByGroups}
            checked={displayByGroups}
          />
          <div style={clasess.labelSwichStyle}>{t("reports.DisplayByGroups")}</div>
        </div>
      </div>

    </div>

  );
};
export { SalesReportHeaderWidget };
