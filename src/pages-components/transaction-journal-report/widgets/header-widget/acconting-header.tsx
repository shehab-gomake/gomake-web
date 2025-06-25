import {
  AccountingTransactionReportHeaderProps,
  useAgingReportHeader,
} from "./use-header-widget";
import { GoMakeAutoComplate } from "@/components";
import { formatDateToISOString } from "@/components/date-time/date-time-component";
import { DateField } from "@/components/date-picker/date-filed";
import { Box } from "@mui/material";

const AccountingTransactionReportHeader = ({
  filterState,
  setFilterState,
  handleClickClear,
  erpAccountsList,
}: AccountingTransactionReportHeaderProps) => {
  const { classes, t } = useAgingReportHeader();
  const dir: "rtl" | "ltr" = t("direction");

  const handleAccountChange = (e: any, value: any) => {
    setFilterState((prevState) => ({
      ...prevState,
      accountCode: value?.code ?? null,
    }));
  };

  const handleFromDateChange = (newDate) => {
    setFilterState((prevState) => ({
      ...prevState,
      startDate: newDate ? new Date(newDate) : null,
    }));
  };

  const handleToDateChange = (newDate) => {
    setFilterState((prevState) => ({
      ...prevState,
      endDate: newDate ? new Date(newDate) : null,
    }));
  };

  return (
    <div style={classes.mainContainer}>
      <div style={classes.date1FilterContainer}>
        <Box display="flex" gap={2} width="100%">
          <DateField
            label={t("general.startDate")}
            date={formatDateToISOString(filterState.startDate)}
            handleChange={handleFromDateChange}
            isEditable={true}
            withTime={false}
            inputWidth="100%"
            direction="column"
            compactMode={true}
          />
          <DateField
            label={t("general.endDate")}
            date={formatDateToISOString(filterState.endDate)}
            handleChange={handleToDateChange}
            isEditable={true}
            withTime={false}
            inputWidth="100%"
            direction="column"
            compactMode={true}
          />
        </Box>
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
