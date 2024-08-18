import { Checkbox } from "@mui/material";

import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components"

import { AgingReportHeaderWidgetProps, useAgingReportHeader } from "./use-header-widget";

const LedgerReportHeaderWidget = ({
  onSelectDeliveryTimeDates,
  resetDatePicker,
  customer,
  renderOptions,
  checkWhatRenderArray,
  handleCustomerChange,
  isExtended,
  onChangeIsExtended
}: AgingReportHeaderWidgetProps) => {

  const { classes, t } = useAgingReportHeader()

  return (
    <div style={classes.mainContainer}>
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
      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
        </div>
      </div>

      <div style={classes.checkBoxContainer}>
        <div style={classes.checkboxStyle}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeIsExtended}
            checked={isExtended}
          />
        </div>
        <h3 style={classes.filterLabelStyle}>{t("reports.extendedCard")}</h3>
      </div>
    </div>
  );
};
export { LedgerReportHeaderWidget };
