
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { GoMakeAutoComplate, GomakePrimaryButton, GomakeTextInput } from "@/components"
import {
  CreditCardTransactionsReportHeaderWidgetProps
} from "@/pages-components/credit-card-transactions/widgets/header-widget/use-header-credit-card-widget";
import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

const CreditCardTransactionsReportHeaderWidget = ({
  onSelectDeliveryTimeDates,
  resetDatePicker,
  customer,
  transactionAmount,
  receiptNumber,
  handleTransactionAmountChange,
  handleReceiptNumberChange,
  renderOptions,
  onClickSearchFilter,
  onClickClearFilter,
  checkWhatRenderArray,
  handleCustomerChange,
}: CreditCardTransactionsReportHeaderWidgetProps) => {

  const { t } = useTranslation();
  const { classes } = useStyle();

  return (
    <>
      <div style={classes.headerStyle}>
        <HeaderTitle
          marginTop={1}
          marginBottom={1}
          title={t("creditCardTransactions.creditCardTransactions")}
        />
      </div>

      <div style={classes.filtersContainer}>
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
          <h3 style={classes.filterLabelStyle}>{t("creditCardTransactions.transactionAmount")}</h3>
          <GomakeTextInput
            style={classes.textInputStyle}
            value={transactionAmount}
            placeholder={t("creditCardTransactions.transactionAmount")}
            onChange={handleTransactionAmountChange}
            type={"number"}
          />
        </div>
        <div style={classes.date2FilterContainer}>
          <h3 style={classes.filterLabelStyle}>{t("sales.quote.receiptNumber")}</h3>
          <GomakeTextInput
            style={classes.textInputStyle}
            value={receiptNumber}
            placeholder={t("sales.quote.receiptNumber")}
            onChange={handleReceiptNumberChange}
          />
        </div>
        <div style={classes.date1FilterContainer}>
          <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
          <div style={{ width: "100%" }}>
            <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
          </div>
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
    </>
  );
};

export { CreditCardTransactionsReportHeaderWidget };