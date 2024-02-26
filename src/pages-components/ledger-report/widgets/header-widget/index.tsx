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

  const { clasess, t } = useAgingReportHeader()

  return (
    <div style={clasess.mainContainer}>
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
      <div style={clasess.date1FilterContainer}>
        <h3 style={clasess.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
        </div>
      </div>

      <div style={clasess.date1FilterContainer}>
        <h3 style={clasess.filterLabelStyle}>{t("reports.extendedCard")}</h3>
        <div style={clasess.checkboxStyle}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeIsExtended}
            checked={isExtended}
          />
        </div>

      </div>
    </div>
  );
};
export { LedgerReportHeaderWidget };
