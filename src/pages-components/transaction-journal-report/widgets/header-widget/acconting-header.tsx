import {
  AccountingTransactionReportHeaderProps,
  useAgingReportHeader,
} from "./use-header-widget";
import { DateRangePicker } from "rsuite";
import { createGlobalStyle } from "styled-components";
import { GoMakeAutoComplate } from "@/components";
import { predefinedRanges } from "@/utils/dateRanges";

const AccountingTransactionReportHeader = ({
  handleDateChange,
  filterState,
  setFilterState,
  handleClickClear,
  erpAccountsList,
}: AccountingTransactionReportHeaderProps) => {
  const { classes, t } = useAgingReportHeader();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";

  const GlobalStyle = createGlobalStyle`
  .rs-picker-popup-daterange {
    left: ${({ RTL }: any) => (RTL ? "auto" : "150px")} !important;
    right: ${({ RTL }: any) => (RTL ? "150px" : "auto")} !important;
  }
`;

  const handleAccountChange = (e: any, value: any) => {
    setFilterState((prevState) => ({
      ...prevState,
      accountCode: value?.code ?? null,
    }));
  };

  return (
    <div style={classes.mainContainer}>
      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GlobalStyle RTL={RTL} />
          <DateRangePicker
            onChange={handleDateChange}
            value={
              filterState.startDate && filterState.endDate
                ? [filterState.startDate, filterState.endDate]
                : null
            }
            ranges={predefinedRanges}
          />
        </div>
      </div>

      <div style={{ ...classes.date1FilterContainer, width: "18%" }}>
        <h3 style={classes.filterLabelStyle}>{t("reports.accountCode")}</h3>
        <GoMakeAutoComplate
          options={erpAccountsList}
          getOptionLabel={(option: any) => option.name}
          style={classes.textInputStyle}
          placeholder={t("reports.selectAccountCode")}
          value={erpAccountsList?.find(
            (option) => option.code === filterState?.accountCode
          )}
          onChange={handleAccountChange}
        />
      </div>

      {/* 
      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>
          {t("accounting.fromAccountCode")}
        </h3>
        <GomakeTextInput
          onChange={(e) =>
            setFilterState((prevState) => ({
              ...prevState,
              fromAccount: e.target.value,
            }))
          }
          value={filterState.fromAccount}
          placeholder={t("accounting.fromAccountCode")}
          style={{ height: 40 }}
        />
      </div>
      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>
          {t("accounting.toAccountCode")}
        </h3>
        <GomakeTextInput
          onChange={(e) =>
            setFilterState((prevState) => ({
              ...prevState,
              toAccount: e.target.value,
            }))
          }
          value={filterState.toAccount}
          placeholder={t("accounting.toAccountCode")}
          style={{ height: 40 }}
        />
      </div> */}
    </div>
  );
};
export { AccountingTransactionReportHeader };
