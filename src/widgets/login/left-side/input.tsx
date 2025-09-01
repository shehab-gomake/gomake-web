import { GomakeTextInput } from "@/components";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { IInputContainer } from "./interfaces";
import { useStyle } from "./style";
import { useMediaQuery } from "@mui/material";

const InputContainer = ({
  input,
  error,
  changeState,
  placeholder,
  handleKeyPress,
  value,
}: IInputContainer) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
    changeState(input.key, e.target.value);
  };
  return (
    <div style={classes.inputContainer} key={input.key}>
      <div style={classes.inputLbl}>{t(input.label)}</div>
      <div style={isMobile ? {} : classes.input}>
        <GomakeTextInput
          onChange={onChangeState}
          type={input.type}
          error={error}
          value={value}
          placeholder={placeholder}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};
export { InputContainer };
