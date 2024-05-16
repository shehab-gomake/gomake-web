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
  const { errors, inputs, errorMsg, changeState, onClickLogin, handleKeyPress, t } =
    useGomakeLogin();
  return (
    <div style={clasess.leftContainer}>
      {
        userProfile?.loginLogo && <div style={clasess.logoContainer}>
          <Image
            src={userProfile?.loginLogo}
            alt="logo"
            style={{ objectFit: 'contain' }}
            width={200}
            height={200}
          />
        </div>
      }

      <div style={clasess.loginContainer}>
        <div style={clasess.loginLbl}>{t("login.login")}</div>
        {inputs.map((input: IInput) => (
          <InputContainer
            key={input.key}
            input={input}
            changeState={changeState}
            error={errors[input.key]}
            placeholder={t(input.placeholder)}
            handleKeyPress={handleKeyPress}
          />
        ))}
        <Link
          underline="none"
          style={clasess.forgotStyle}
          href="/forgot-password"
        >
          {t("login.forgotPassword")}
        </Link>
        <div style={clasess.errorMsgStyle}>{errorMsg}</div>
      </div>
      <div style={clasess.btnContainer}>
        <GomakePrimaryButton onClick={onClickLogin} >
          {t("login.login")}
        </GomakePrimaryButton>
      </div>
    </div>
  );
};
export { LoginLeftSide };
