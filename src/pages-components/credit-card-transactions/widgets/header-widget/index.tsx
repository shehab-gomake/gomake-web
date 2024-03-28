
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components"
import {
    useCreditCardTransactionsReportHeader , CreditCardTransactionsReportHeaderWidgetProps
} from "@/pages-components/credit-card-transactions/widgets/header-widget/use-header-credit-card-widget";
import { HeaderTitle } from "@/widgets";



const CreditCardTransactionsReportHeaderWidget = ({
  onSelectDeliveryTimeDates,
  resetDatePicker,
  customer,
  customerId,
  renderOptions,
  onClickSearchFilter,
  onClickClearFilter,
  checkWhatRenderArray,
  handleCustomerChange,
}: CreditCardTransactionsReportHeaderWidgetProps) => {

  const {   t ,classes} = useCreditCardTransactionsReportHeader();

  return (
    <>
          <div style={classes.mainContainer}>
          <div style={classes.headerStyle}>
          <HeaderTitle
              marginTop={1}
              marginBottom={1}
              title={t("creditcardTransactions.creditcardTransactions")}
            />
            </div>
          <div style={classes.filtersContainer}>
          <div style={classes.date1FilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
                <div style={{ width: "100%" }}>
                  <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
                </div>
              </div>
              <div style={classes.date2FilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
                <GoMakeAutoComplate
                  key={customerId}
                  options={renderOptions()}
                  onChangeTextField={checkWhatRenderArray}
                  getOptionLabel={(option: any) => `${option.name}`}
                  style={classes.textInputStyle}
                  placeholder={t("sales.quote.chooseCustomer")}
                  onChange={handleCustomerChange}
                  value={customer}
                />
              </div>
              <div style={classes.date3FilterContainer}>
                          <div style={classes.filterLabelStyle} />
                          <GomakePrimaryButton
                            style={classes.searchBtnStyle}
                            onClick={onClickSearchFilter}
                          >
                            {t("sales.quote.search")}
                          </GomakePrimaryButton>
              </div>
              <div style={classes.date3FilterContainer}>
                          <div style={classes.filterLabelStyle} />
                          <GomakePrimaryButton
                            style={classes.clearBtnStyle}
                            onClick={onClickClearFilter}
                          >
                            {t("sales.quote.clear")}
                          </GomakePrimaryButton>
              </div>    
          </div>
      
        </div>
    
  </>

  );
};
export { CreditCardTransactionsReportHeaderWidget };
