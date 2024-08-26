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

  const { classes, t } = useSalesReportHeader()

  return (
    <div style={classes.mainContainer}>
      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
        </div>
      </div>
      <div style={classes.date2FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("sales.quote.agent")}</h3>
        <GoMakeAutoComplate
          key={agent?.id}
          options={agentsCategories}
          style={classes.textInputStyle}
          getOptionLabel={(option: any) => option.label}
          placeholder={t("sales.quote.ChooseAgent")}
          onChange={handleAgentChange}
          value={agent}
        />
      </div>
      <div style={classes.date2FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
        <GoMakeAutoComplate
          key={customer?.id}
          options={renderOptions()}
          onChangeTextField={checkWhatRenderArray}
          getOptionLabel={(option: any) => `${option.name}`}
          style={classes.textInputStyle}
          placeholder={t("sales.quote.chooseCustomer")}
          onChange={handleCustomerChange}
          value={customer}
        />
      </div>
      <div style={classes.date2FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("reports.documentsType")}</h3>
        <GoMakeAutoComplate
          options={documentsTypeList}
          style={classes.textInputStyle}
          placeholder={t("reports.chooseDocumentType")}
          onChange={handleDocumentTypeChange}
          value={documentType}
        />
      </div>
      <div style={classes.date1FilterContainer}>
        <div style={classes.checkboxStyle}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeDisplayByGroups}
            checked={displayByGroups}
          />
          <div style={classes.labelSwichStyle}>{t("reports.DisplayByGroups")}</div>
        </div>
      </div>

    </div>

  );
};
export { SalesReportHeaderWidget };
