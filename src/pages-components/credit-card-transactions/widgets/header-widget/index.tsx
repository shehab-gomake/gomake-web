

import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components"
import { CreditCardTransactionsReportHeaderWidgetProps, useCreditCardTransactionsReportHeader } from "./use-header-credit-card-widget";
import { useTranslation } from "react-i18next";



const CreditCardTransactionsReportHeaderWidget = ({
 
  agent,
  onSelectDeliveryTimeDates,
  resetDatePicker,
  agentsCategories,
  handleAgentChange,
  customer,
  renderOptions,
  onClickSearchFilter,
  onClickClearFilter,
  checkWhatRenderArray,
  handleCustomerChange,
}: CreditCardTransactionsReportHeaderWidgetProps) => {

  const { classes } = useCreditCardTransactionsReportHeader();
  const { t }= useTranslation();

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
                  <div style={classes.filterLabelStyle} />
                  <GomakePrimaryButton
                    style={classes.searchBtnStyle}
                    onClick={onClickSearchFilter}
                  >
                    {t("sales.quote.search")}
                  </GomakePrimaryButton>
                </div>
                <div style={classes.statusFilterContainer}>
                  <div style={classes.filterLabelStyle} />
                  <GomakePrimaryButton
                    style={classes.clearBtnStyle}
                    onClick={onClickClearFilter}
                  >
                    {t("sales.quote.clear")}
                  </GomakePrimaryButton>
                </div>
   

    </div>

  );
};
export { CreditCardTransactionsReportHeaderWidget };
