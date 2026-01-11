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
import { Box, Skeleton } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { TotalCardComponent } from "@/pages-components/quotes/widgets/statistics-section/total-card";
import {
  ItemsCountIcon,
  WalletIcon,
} from "@/pages-components/quotes/widgets/icons/header-section-icons";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";

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
  totalTransactionsCount,
  getValueByKey,
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* <PermissionCheck
            userPermission={Permissions.SHOW_ERP_DOCUMENTS_TABLE_SUMMERY}
          > */}
          {totalTransactionsCount !== undefined ? (
            <>
              <TotalCardComponent
                text={t("creditCardTransactions.transactionsCount")}
                number={totalTransactionsCount}
                icon={<ItemsCountIcon />}
              />
              <TotalCardComponent
                text={t("sales.quote.totalPrice")}
                number={getValueByKey?.("totalPrice") || "0"}
                icon={<WalletIcon />}
                withCurrency={true}
              />
            </>
          ) : (
            <>
              <Skeleton
                variant="rectangular"
                sx={{ width: 180, height: 40, borderRadius: 2 }}
              />
              <Skeleton
                variant="rectangular"
                sx={{ width: 180, height: 40, borderRadius: 2 }}
              />
            </>
          )}
          {/* </PermissionCheck> */}
        </div>
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
          <PrimaryButton
            variant="contained"
            style={classes.searchBtnStyle}
            onClick={onClickSearchFilter}
          >
            {t("sales.quote.search")}
          </PrimaryButton>
          <PrimaryButton
            variant="outlined"
            style={classes.clearBtnStyle}
            onClick={onClickClearFilter}
          >
            {t("sales.quote.clear")}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
};

export { CreditCardTransactionsReportHeaderWidget };
