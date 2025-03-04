import { GomakeTextInput } from "@/components";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { IInputContainer } from "./interfaces";
import { useStyle } from "./style";

const InputContainer = ({ input, error, changeState }: IInputContainer) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
    changeState(input.key, e.target.value);
  };
  return (
    <div style={classes.inputContainer} key={input.key}>
      <div style={classes.inputLbl}>{t(input.label)}</div>
      <div style={classes.input}>
        <GomakeTextInput
          onChange={onChangeState}
          type={input.type}
          error={error}
        />
      </div>
    </div>
  );
};
export { InputContainer };
