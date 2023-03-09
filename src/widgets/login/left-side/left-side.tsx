import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import Image from "next/image";
import { useGomakeLogin } from "../use-login";
import { InputContainer } from "./input";
import { IInput } from "./interfaces";
import { useStyle } from "./style";

const LoginLeftSide = () => {
  const { clasess } = useStyle();
  const { errors, inputs, changeState, onClickLogin } = useGomakeLogin();
  return (
    <div style={clasess.leftContainer}>
      <div style={clasess.logoContainer}>
        <Image
          src={"https://i.ibb.co/wzpwSq6/Group-1239.png"}
          alt="logo"
          width={100}
          height={100}
        />
      </div>
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
