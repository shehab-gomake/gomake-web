import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const LoginByCodeLeftSide = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);
  const onClickSendEmail = () => {
    if (code?.length <= 0) {
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
      <Image
        alt="logo"
        src={"https://i.ibb.co/wzpwSq6/Group-1239.png"}
        width={180}
        height={180}
      />
      <div style={clasess.loginContainer}>
        <div style={clasess.loginLbl}>{t("login.receiveCode")}</div>
        <div style={clasess.inputContainer}>
          <div style={clasess.inputLbl}>{t("login.code")}</div>
          <div style={clasess.input}>
            <GomakeTextInput
              placeholder={t("login.code")}
              onChange={(e) => setCode(e.target.value)}
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
export { LoginByCodeLeftSide };
