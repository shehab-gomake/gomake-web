import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { useStyle } from "./style";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { UpdatedTextInput } from "@/components/text-input/updated-text-input";

interface FinancesHeaderInputsWidgetProps {
  accountName: string;
  accountEmail: string;
  dayOfMonth: number;
  onChangeAccountName: (value) => void;
  onResetAccountName: () => void;
  onClickUpdateCpaMangerName: () => void;
  onChangeAccountEmail: (value) => void;
  onResetAccountMail: () => void;
  onClickUpdateCpaMangerMail: () => void;
  onChangeSelectDayOfMonth: (event: React.ChangeEvent<HTMLInputElement>, value: any) => void;
}


const FinancesHeaderInputsWidget: React.FC<FinancesHeaderInputsWidgetProps> = ({
  accountName,
  accountEmail,
  dayOfMonth,
  onChangeAccountName,
  onResetAccountName,
  onClickUpdateCpaMangerName,
  onChangeAccountEmail,
  onResetAccountMail,
  onClickUpdateCpaMangerMail,
  onChangeSelectDayOfMonth
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={classes.mainContainer} >
      <div style={classes.inputContainer}>
        <div style={classes.inputLabel}>{t("financesWidget.accountName")}</div>
        <UpdatedTextInput
          onInputChange={onChangeAccountName}
          onCancel={onResetAccountName}
          onUpdate={onClickUpdateCpaMangerName}
          value={accountName}
          height="40px"
          width="180px"
        />
      </div>
      <div style={classes.inputContainer}>
        <div style={classes.inputLabel}>{t("financesWidget.accountManagerEmail")}</div>
        <UpdatedTextInput
          onInputChange={onChangeAccountEmail}
          onCancel={onResetAccountMail}
          onUpdate={onClickUpdateCpaMangerMail}
          value={accountEmail}
          height="40px"
          width="180px"
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
