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
        <div style={clasess.inputLabel}>Account Name</div>
        <GomakeTextInput
          style={{ height: "40px", minWidth: 180 }}
          onChange={onChangeAccountName}
          value={accountName}
          placeholder="Enter your account name"
        />
      </div>
      <div style={clasess.inputContainer}>
        <div style={clasess.inputLabel}>Account Manager Email</div>
        <GomakeTextInput
          style={{ height: "40px", minWidth: 180 }}
          onChange={onChangeAccountEmail}
          value={accountEmail}
          placeholder="Enter your account email"
        />
      </div>
      <div style={clasess.inputContainer}>
        <div style={clasess.inputLabel}>Day Of Month For Sending An Account Statement</div>
        <GoMakeAutoComplate
          options={daysInMonth}
          style={clasess.dropDownListStyle}
          placeholder="Select Day Of Month"
          onChange={onChangeSelectDayOfMonth}
          value={dayOfMonth}
          disableClearable={true}
        />
      </div>
    </div>
  );
};
export { FinancesHeaderInputsWidget };
