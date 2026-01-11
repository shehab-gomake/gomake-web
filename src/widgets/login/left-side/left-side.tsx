import { GomakePrimaryButton } from "@/components";
import Image from "next/image";
import { useGomakeLogin } from "../use-login";
import { InputContainer } from "./input";
import { IInput } from "./interfaces";
import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { companyProfileState } from "@/store/company-profile";
import { Link, useMediaQuery } from "@mui/material";
import { TermModal } from "../terms-modal/TermModal";
import { useTheme } from "@/contexts/theme";
import { HpLogoIcon } from "@/themes/hp-client/icons";

const LoginLeftSide = () => {
  const { classes } = useStyle();
  const userProfile = useRecoilValue(companyProfileState);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { currentTheme } = useTheme();
  const isHpClient = currentTheme === "hp-client";

  const {
    errors,
    inputs,
    errorMsg,
    changeState,
    onClickLogin,
    handleKeyPress,
    t,
    isModalOpen,
    setIsModalOpen,
    setIsTermsAccepted,
    state,
  } = useGomakeLogin();

  return (
    <div style={isMobile ? classes.MobileSubContainer : classes.leftContainer}>
      {userProfile?.loginLogo ? (
        <div style={classes.logoContainer}>
          <Image
            src={userProfile?.loginLogo}
            alt="logo"
            style={{
              objectFit: "contain",
              borderRadius: 8,
              ...(isMobile && { marginBottom: "20px" }),
            }}
            width={isMobile ? 70 : 150}
            height={isMobile ? 70 : 150}
          />
        </div>
      ) : isHpClient ? (
        <div style={classes.logoContainer}>
          <HpLogoIcon
            width={isMobile ? 70 : 150}
            height={isMobile ? 70 : 150}
          />
        </div>
      ) : null}

      <div
        style={{
          ...classes.loginContainer,
          ...(isMobile && { padding: "0px 20px" }),
        }}
      >
        <div style={classes.loginLbl}>{t("login.login")}</div>
        {inputs.map((input: IInput) => (
          <InputContainer
            key={input.key}
            input={input}
            changeState={changeState}
            error={errors[input.key]}
            placeholder={t(input.placeholder)}
            handleKeyPress={handleKeyPress}
            value={state[input.key]}
          />
        ))}
        <Link
          underline="none"
          style={classes.forgotStyle}
          href="/forgot-password"
        >
          {t("login.forgotPassword")}
        </Link>
        <div style={classes.errorMsgStyle}>{errorMsg}</div>
      </div>
      <div style={classes.btnContainer}>
        <GomakePrimaryButton onClick={onClickLogin}>
          {t("login.login")}
        </GomakePrimaryButton>
      </div>
      <TermModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setIsTermsAccepted={setIsTermsAccepted}
        setIsModalOpen={setIsModalOpen}
      />
      {/* <TermModal open={true} onClose={() => setIsModalOpen(false)} setIsTermsAccepted={setIsTermsAccepted} /> */}
    </div>
  );
};
export { LoginLeftSide };
