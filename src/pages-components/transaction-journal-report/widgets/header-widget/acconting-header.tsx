import {
  AccountingTransactionReportHeaderProps,
  useAgingReportHeader,
} from "./use-header-widget";
import { formatDateToISOString } from "@/components/date-time/date-time-component";
import { DateField } from "@/components/date-picker/date-filed";
import { Box } from "@mui/material";
import { NestedCheckbox } from "@/components/nested-checkbox";
import { transformAccountsToNestedGroups } from "@/components/nested-checkbox/transform-accounts";
import { useMemo } from "react";

const AccountingTransactionReportHeader = ({
  filterState,
  setFilterState,
  handleClickClear,
  erpAccountsList,
}: AccountingTransactionReportHeaderProps) => {
  const { classes, t } = useAgingReportHeader();
  const dir: "rtl" | "ltr" = t("direction");

  // Transform flat account list to nested groups
  const nestedGroups = useMemo(() => {
    if (!erpAccountsList || erpAccountsList.length === 0) {
      return [];
    }
    return transformAccountsToNestedGroups(erpAccountsList);
  }, [erpAccountsList]);

  // Get selected codes as array (handle both string and array formats)
  const selectedCodes = useMemo(() => {
    if (!filterState?.accountCode) {
      return [];
    }
    if (Array.isArray(filterState.accountCode)) {
      return filterState.accountCode;
    }
    return [filterState.accountCode];
  }, [filterState?.accountCode]);

  const handleAccountCodesChange = (selectedCodes: string[]) => {
    setFilterState((prevState) => ({
      ...prevState,
      accountCode: selectedCodes.length > 0 ? selectedCodes : null,
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

      <div
        style={{
          ...classes.date1FilterContainer,
          minWidth: "200px",
          maxWidth: "300px",
          flex: "0 0 auto",
        }}
      >
        <h3 style={classes.filterLabelStyle}>{t("reports.accountCode")}</h3>
        <NestedCheckbox
          groups={nestedGroups}
          selectedCodes={selectedCodes}
          onChange={handleAccountCodesChange}
          placeholder={t("reports.selectAccountCode")}
          style={classes.textInputStyle}
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
