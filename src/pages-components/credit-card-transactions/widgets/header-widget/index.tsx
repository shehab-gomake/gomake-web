import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { CreditCardTransactionsReportHeaderWidgetProps } from "@/pages-components/credit-card-transactions/widgets/header-widget/use-header-credit-card-widget";
import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { DateRangePicker } from "rsuite";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { predefinedRanges } from "@/utils/dateRanges";
import { DateField } from "@/components/date-picker/date-filed";
import { formatDateToISOString } from "@/components/date-time/date-time-component";
import { Box } from "@mui/material";

const CreditCardTransactionsReportHeaderWidget = ({
  customer,
  transactionAmount,
  receiptNumber,
  cardNumber,
  handleTransactionAmountChange,
  handleReceiptNumberChange,
  handleCardNumberChange,
  renderOptions,
  onClickSearchFilter,
  onClickClearFilter,
  checkWhatRenderArray,
  handleCustomerChange,
  fromDate,
  toDate,
  isFetchingCustomers,
  setToDate,
  setFromDate,
}: CreditCardTransactionsReportHeaderWidgetProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  const handleFromDateChange = (newDate) => {
    setFromDate(newDate ? new Date(newDate) : null);
  };

  const handleToDateChange = (newDate) => {
    setToDate(newDate ? new Date(newDate) : null);
  };

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
          <ClientAutocomplete
            key={customer?.id}
            options={renderOptions()}
            onChangeTextField={checkWhatRenderArray}
            getOptionLabel={(option: any) => `${option.name}`}
            style={classes.textInputStyle}
            onChange={handleCustomerChange}
            value={customer}
            loading={isFetchingCustomers}
          />
        </div>
        <div style={classes.date2FilterContainer}>
          <h3 style={classes.filterLabelStyle}>
            {t("creditCardTransactions.transactionAmount")}
          </h3>
          <GomakeTextInput
            style={classes.textInputStyle}
            value={transactionAmount}
            placeholder={t("creditCardTransactions.transactionAmount")}
            onChange={handleTransactionAmountChange}
            type={"number"}
          />
        </div>
        <div style={classes.date2FilterContainer}>
          <h3 style={classes.filterLabelStyle}>
            {t("sales.quote.receiptNumber")}
          </h3>
          <GomakeTextInput
            style={classes.textInputStyle}
            value={receiptNumber}
            placeholder={t("sales.quote.receiptNumber")}
            onChange={handleReceiptNumberChange}
          />
        </div>

        <div style={classes.date2FilterContainer}>
          <h3 style={classes.filterLabelStyle}>
            {t("creditCardTransactions.CardNumber")}
          </h3>
          <GomakeTextInput
            style={classes.textInputStyle}
            value={cardNumber}
            placeholder={t("creditCardTransactions.CardNumber")}
            onChange={handleCardNumberChange}
          />
        </div>

        <div style={classes.date1FilterContainer}>
          <Box display="flex" gap={2} width="100%">
            <DateField
              label={t("general.startDate")}
              date={formatDateToISOString(fromDate)}
              handleChange={handleFromDateChange}
              isEditable={true}
              withTime={false}
              inputWidth="100%"
              direction="column"
              compactMode={true}
            />
            <DateField
              label={t("general.endDate")}
              date={formatDateToISOString(toDate)}
              handleChange={handleToDateChange}
              isEditable={true}
              withTime={false}
              inputWidth="100%"
              direction="column"
              compactMode={true}
            />
          </Box>
        </div>
        <div style={classes.date3FilterContainer}>
          <SecondaryButton
            variant="contained"
            style={classes.searchBtnStyle}
            onClick={onClickSearchFilter}
          >
            {t("sales.quote.search")}
          </SecondaryButton>
          <SecondaryButton
            variant="outlined"
            style={classes.clearBtnStyle}
            onClick={onClickClearFilter}
          >
            {t("sales.quote.clear")}
          </SecondaryButton>
        </div>
      </div>
    </>
  );
};

export { CreditCardTransactionsReportHeaderWidget };
