import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import Image from "next/image";
import { useGomakeAdminLogin } from "../use-login";
import { InputContainer } from "./input";
import { IInput } from "./interfaces";
import { useStyle } from "./style";

const LoginLeftSide = () => {
  const { classes } = useStyle();
  const { errors, inputs, changeState, onClickLogin } = useGomakeAdminLogin();
  return (
    <div style={classes.leftContainer}>
      <div style={classes.loginContainer}>
        <div style={classes.loginLbl}>Login</div>
        {inputs.map((input: IInput) => (
          <InputContainer
            key={input.key}
            input={input}
            changeState={changeState}
            error={errors[input.key]}
          />
        ))}
      </div>
      <div style={classes.btnContainer}>
        <GomakePrimaryButton onClick={onClickLogin}>Login</GomakePrimaryButton>
      </div>
    </div>
  );
};
export { LoginLeftSide };
