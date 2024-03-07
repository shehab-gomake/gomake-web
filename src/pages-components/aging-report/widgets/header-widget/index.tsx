import { Checkbox } from "@mui/material";

import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components"
import { DateFormatter } from "@/utils/adapter";

import { AgingReportHeaderWidgetProps, useAgingReportHeader } from "./use-header-widget";

const AgingReportHeaderWidget = ({
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
  detailedReport,
  onChangeByReferenceDate,
  onChangeDetailedReport
}: AgingReportHeaderWidgetProps) => {

  const { clasess, t } = useAgingReportHeader()

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.date1FilterContainer}>
        <h3 style={clasess.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
        </div>
      </div>
      <div style={clasess.date2FilterContainer}>
        <h3 style={clasess.filterLabelStyle}>attribution date</h3>
        <div style={clasess.datePickerinvidualContainer} onClick={handleClickSelectDate}>
          <div
            style={clasess.dateStyle}

          >
            {selectDate ? DateFormatter(selectDate) : t("sales.quote.selectDate")}
            <div style={clasess.datePickerContainer}>
              <input
                type="date"
                onChange={(e) => {
                  setSelectDate(e.target.value);
                }}
                ref={dateRef}
              />
            </div>
          </div>
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
      <div style={clasess.date1FilterContainer}>
        <div style={clasess.checkboxStyle}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeDetailedReport}
            checked={detailedReport}
          />
          <div style={clasess.labelSwichStyle}>Detailed Report</div>
        </div>
        <div style={clasess.checkboxStyle}>
          <Checkbox
            onChange={onChangeByReferenceDate}
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />
            }
          />
          <div style={clasess.labelSwichStyle}>By Reference Date</div>
        </div>
      </div>
    </div>
  );
};
export { AgingReportHeaderWidget };
