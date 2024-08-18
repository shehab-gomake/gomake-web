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

  const { classes, t } = useAgingReportHeader()

  return (
    <div style={classes.mainContainer}>
      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
        </div>
      </div>
      <div style={classes.date2FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("customers.modal.referenceDate")}</h3>
        <div style={classes.datePickerinvidualContainer} onClick={handleClickSelectDate}>
          <div
            style={classes.dateStyle}

          >
            {selectDate ? DateFormatter(selectDate) : t("sales.quote.selectDate")}
            <div style={classes.datePickerContainer}>
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
      <div style={classes.date1FilterContainer}>
        <div style={classes.checkboxStyle}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeDetailedReport}
            checked={detailedReport}
          />
          <div style={classes.labelSwichStyle}>{t("reports.detailedReport")}</div>
        </div>
        <div style={classes.checkboxStyle}>
          <Checkbox
            onChange={onChangeByReferenceDate}
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />
            }
          />
          <div style={classes.labelSwichStyle}>{t("reports.byReferenceDate")}</div>
        </div>
      </div>
    </div>
  );
};
export { AgingReportHeaderWidget };
