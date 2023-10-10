import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useState, useTransition } from "react";
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
        <div style={clasess.loginLbl}>Forgot password</div>
        <div style={clasess.inputContainer}>
          <div style={clasess.inputLbl}>Email</div>
          <div style={clasess.input}>
            <GomakeTextInput
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
          </div>
        </div>
        <div style={clasess.errorMsgStyle}>{errorMsg}</div>
        <div style={clasess.btnContainer}>
          <GomakePrimaryButton onClick={onClickSendEmail}>
            Send
          </GomakePrimaryButton>
        </div>
      </div>
    </div>
  );
};
export { ForgotPasswordLeftSide };
