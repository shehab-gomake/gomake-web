import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ForgotPasswordLeftSide = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);
  const onClickSendEmail = () => {
    if (email?.length <= 0) {
      setErrorMsg(t("login.thisFieldRequired"));
      setError(true);
    } else {
      setErrorMsg("");
      setError(false);
    }
  };
  const { clasess } = useStyle();
  return (
    <div style={clasess.leftContainer}>
      <div style={clasess.loginContainer}>
        <div style={clasess.loginLbl}>{t("login.forgotPassword")}</div>
        <div style={clasess.inputContainer}>
          <div style={clasess.inputLbl}>{t("login.email")}</div>
          <div style={clasess.input}>
            <GomakeTextInput
              placeholder={t("login.enterYourEmail")}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
          </div>
        </div>
        <div style={clasess.errorMsgStyle}>{errorMsg}</div>
        <div style={clasess.btnContainer}>
          <GomakePrimaryButton onClick={onClickSendEmail}>
            {t("login.send")}
          </GomakePrimaryButton>
        </div>
      </div>
    </div>
  );
};
export { ForgotPasswordLeftSide };
