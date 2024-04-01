import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { FinancesHeaderWidget } from "./widgets/header/finances";
import { FinancesHeaderInputsWidget } from "./widgets/header-inputs/header-inputs";
import { useFinances } from "./use-finances";
import { FinancesTableWidget } from "./widgets/finances-table/finances";

const FinancesWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    accountName,
    accountEmail,
    dayOfMonth,
    onChangeAccountName,
    onChangeAccountEmail,
    onChangeSelectDayOfMonth,
    getAccountRows
  } = useFinances()

  return (
    <div style={clasess.mainContainer}>
      <FinancesHeaderWidget />
      <FinancesHeaderInputsWidget
        accountName={accountName}
        accountEmail={accountEmail}
        dayOfMonth={dayOfMonth}
        onChangeAccountName={onChangeAccountName}
        onChangeAccountEmail={onChangeAccountEmail}
        onChangeSelectDayOfMonth={onChangeSelectDayOfMonth}
      />
      <FinancesTableWidget getAccountRows={getAccountRows} />
    </div>
  );
};
export { FinancesWidget };
