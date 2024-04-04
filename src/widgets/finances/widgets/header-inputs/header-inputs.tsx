import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { useStyle } from "./style";
import { UpdateValueInput } from "@/components/text-input/update-value-input";

interface FinancesHeaderInputsWidgetProps {
  accountName: string;
  accountEmail: string;
  dayOfMonth: number;
  onChangeAccountName: (value) => void;
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
  const { classes } = useStyle();
  const { t } = useTranslation();
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={classes.mainContainer} >
      <div style={classes.inputContainer}>

      <UpdateValueInput
                clickedOut={() =>null}
                onInputChange={onChangeAccountName}
                onCancel={() =>null}
                onUpdate={() =>null}
                value={accountName}
              />
              
        <div style={classes.inputLabel}>{t("financesWidget.accountName")}</div>
        <GomakeTextInput
          style={classes.dropDownListStyle}
          onChange={onChangeAccountName}
          value={accountName}
          placeholder={t("financesWidget.enterAccountName")}
        />
      </div>
      <div style={classes.inputContainer}>
        <div style={classes.inputLabel}>{t("financesWidget.accountManagerEmail")}</div>
        <GomakeTextInput
          style={classes.dropDownListStyle}
          onChange={onChangeAccountEmail}
          value={accountEmail}
          placeholder={t("financesWidget.enterAccountEmail")}
        />
      </div>
      <div style={classes.inputContainer}>
        <div style={classes.inputLabel}>{t("financesWidget.dayOfMonth")}</div>
        <GoMakeAutoComplate
          options={daysInMonth}
          style={classes.dropDownListStyle}
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
