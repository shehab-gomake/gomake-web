import { useStyle } from "./style";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { accountingInputs } from "../../inputs/accounting-inputs";
import { useTranslation } from "react-i18next";
import { CLIENT_TYPE } from "@/pages/customers/enums";


interface IProps {
  clientType: string;
  onChangeInputs:(key: any, value: any) => void;
  state:any;
}

const AccountingTab = ({ clientType ,onChangeInputs ,state}: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation()
  const isSupplier = clientType === CLIENT_TYPE.SUPPLIER;

  return (
    <div style={classes.customerInfoStyle}>
      <div style={classes.testSTYLE}>
        {accountingInputs(state, isSupplier, t).slice(0, 4).map((item) => (
          <FormInput
            input={item as IInput}
            changeState={onChangeInputs}
            error={item.required && !item.value}
            readonly={false}
          />
        ))}
      </div>
      <div style={classes.testSTYLE}>
        {accountingInputs(state, isSupplier, t).slice(4, 8).map((item) => (
          <FormInput
            input={item as IInput}
            changeState={onChangeInputs}
            error={item.required && !item.value}
            readonly={false}
          />
        ))}
      </div>
    </div>
  );
};

export { AccountingTab };
