import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const ResetPasswordLeftSide = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState({
    password: false,
    confirmPassword: false,
  });
  const onClickResetPassword = () => {
    if (password?.length <= 0) {
      setErrorMsg(t("login.thisFieldRequired"));
      setError({ password: true, confirmPassword: false });
    } else if (confirmPassword?.length <= 0) {
      setErrorMsg(t("login.thisFieldRequired"));
      setError({ password: false, confirmPassword: true });
    } else if (password !== confirmPassword) {
      setErrorMsg(t("login.notMach"));
      setError({ password: true, confirmPassword: true });
    } else {
      setErrorMsg("");
      setError({ password: false, confirmPassword: false });
    }
  };
  const { clasess } = useStyle();
  return (
    <div style={clasess.leftContainer}>
      <Image
        alt="logo"
        src={"https://i.ibb.co/wzpwSq6/Group-1239.png"}
        width={180}
        height={180}
      />
      <div style={clasess.loginContainer}>
        <div style={clasess.loginLbl}>{t("login.resetPassword")}</div>
        <div style={clasess.inputContainer}>
          <div style={clasess.inputLbl}>{t("login.password")}</div>
          <div style={clasess.input}>
            <GomakeTextInput
              placeholder={t("login.password")}
              onChange={(e) => setPassword(e.target.value)}
              error={error["password"]}
              type="password"
            />
          </div>
        </div>
        <div style={clasess.inputContainer}>
          <div style={clasess.inputLbl}>{t("login.confirmPassword")}</div>
          <div style={clasess.input}>
            <GomakeTextInput
              placeholder={t("login.password")}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error["confirmPassword"]}
              type="password"
            />
          </div>
        </div>
        <div style={clasess.errorMsgStyle}>{errorMsg}</div>
        <div style={clasess.btnContainer}>
          <GomakePrimaryButton onClick={onClickResetPassword}>
            {t("login.resetPassword")}
          </GomakePrimaryButton>
        </div>
      </div>
    </div>
  );
};
export { ResetPasswordLeftSide };
