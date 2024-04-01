import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { useStyle } from "./style";

interface FinancesHeaderInputsWidgetProps {
  accountName: string;
  accountEmail: string;
  dayOfMonth: number;
  onChangeAccountName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeAccountEmail: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSelectDayOfMonth: (event: React.ChangeEvent<HTMLInputElement>, value: any) => void;
}


const FinancesHeaderInputsWidget: React.FC<FinancesHeaderInputsWidgetProps> = ({
  accountName,
  accountEmail,
  dayOfMonth,
  onChangeAccountName,
  onChangeAccountEmail,
  onChangeSelectDayOfMonth
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={clasess.mainContainer} >
      <div style={clasess.inputContainer}>
        <div style={clasess.inputLabel}>{t("financesWidget.accountName")}</div>
        <GomakeTextInput
          style={clasess.dropDownListStyle}
          onChange={onChangeAccountName}
          value={accountName}
          placeholder={t("financesWidget.enterAccountName")}
        />
      </div>
      <div style={clasess.inputContainer}>
        <div style={clasess.inputLabel}>{t("financesWidget.accountManagerEmail")}</div>
        <GomakeTextInput
          style={clasess.dropDownListStyle}
          onChange={onChangeAccountEmail}
          value={accountEmail}
          placeholder={t("financesWidget.enterAccountEmail")}
        />
      </div>
      <div style={clasess.inputContainer}>
        <div style={clasess.inputLabel}>{t("financesWidget.dayOfMonth")}</div>
        <GoMakeAutoComplate
          options={daysInMonth}
          style={clasess.dropDownListStyle}
          placeholder={t("financesWidget.selectDayOfMonth")}
          onChange={onChangeSelectDayOfMonth}
          value={dayOfMonth}
          disableClearable={true}
        />
      </div>
    </div>
  );
};
export { FinancesHeaderInputsWidget };
