import { GomakePrimaryButton } from "@/components";
import Image from "next/image";
import { useGomakeLogin } from "../use-login";
import { InputContainer } from "./input";
import { IInput } from "./interfaces";
import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { companyProfileState } from "@/store/company-profile";
import { Link } from "@mui/material";

const LoginLeftSide = () => {
  const { clasess } = useStyle();
  const userProfile = useRecoilValue(companyProfileState);
  const { errors, inputs, errorMsg, changeState, onClickLogin } =
    useGomakeLogin();
  return (
    <div style={clasess.leftContainer}>
      <div style={clasess.logoContainer}>
        <Image
          src={userProfile?.loginLogo}
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
        <Link
          underline="none"
          style={clasess.forgotStyle}
          href="/forgot-password"
        >
          Forgot password?
        </Link>
        <div style={clasess.errorMsgStyle}>{errorMsg}</div>
      </div>
      <div style={clasess.btnContainer}>
        <GomakePrimaryButton onClick={onClickLogin}>Login</GomakePrimaryButton>
      </div>
    </div>
  );
};
export { LoginLeftSide };
