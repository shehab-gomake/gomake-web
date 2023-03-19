import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import Image from "next/image";
import { useGomakeAdminLogin } from "../use-login";
import { InputContainer } from "./input";
import { IInput } from "./interfaces";
import { useStyle } from "./style";

const LoginLeftSide = () => {
  const { clasess } = useStyle();
  const { errors, inputs, changeState, onClickLogin } = useGomakeAdminLogin();
  return (
    <div style={clasess.leftContainer}>
      <div style={clasess.loginContainer}>
        <div style={clasess.loginLbl}>Login</div>
        {inputs.map((input: IInput) => (
          <InputContainer
            key={input.key}
            input={input}
            changeState={changeState}
            error={errors[input.key]}
          />
        ))}
      </div>
      <div style={clasess.btnContainer}>
        <GomakePrimaryButton onClick={onClickLogin}>Login</GomakePrimaryButton>
      </div>
    </div>
  );
};
export { LoginLeftSide };
