import { useStyle } from "./style";
import { FinancesHeaderWidget } from "./widgets/header/finances";
import { FinancesHeaderInputsWidget } from "./widgets/header-inputs/header-inputs";
import { useFinances } from "./use-finances";
import { FinancesTableWidget } from "./widgets/finances-table/finances";

const FinancesWidget = () => {
  const { classes } = useStyle();
  const {
    accountName,
    accountEmail,
    dayOfMonth,
    onChangeAccountName,
    onResetAccountName,
    onClickUpdateCpaMangerName,
    onChangeAccountEmail,
    onResetAccountMail,
    onClickUpdateCpaMangerMail,
    onChangeSelectDayOfMonth,
    getAccountRows,
    onResetDayOfMonth,
    onClickUpdateDayInMonth
  } = useFinances()

  return (
    <div style={classes.mainContainer}>
      <FinancesHeaderWidget />
      <FinancesHeaderInputsWidget
        accountName={accountName}
        accountEmail={accountEmail}
        dayOfMonth={dayOfMonth}
        onChangeAccountName={onChangeAccountName}
        onResetAccountName={onResetAccountName}
        onClickUpdateCpaMangerName={onClickUpdateCpaMangerName}
        onChangeAccountEmail={onChangeAccountEmail}
        onResetAccountMail={onResetAccountMail}
        onClickUpdateCpaMangerMail={onClickUpdateCpaMangerMail}
        onChangeSelectDayOfMonth={onChangeSelectDayOfMonth}
        onResetDayOfMonth={onResetDayOfMonth}
        onClickUpdateDayInMonth={onClickUpdateDayInMonth}
      />
      <FinancesTableWidget getAccountRows={getAccountRows} />
    </div>
  );
};
export { FinancesWidget };
