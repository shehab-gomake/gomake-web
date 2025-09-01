import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { GoMakeAlertModal } from "@/components/modal/alert-modal";
import { useStyle } from "./style";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMobileHeight } from "@/hooks/use-responsive";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { forgetPasswordApi } from "@/services/api-service/users/users-auth";

interface ForgotPasswordLeftSideProps {
  isMobile?: boolean;
}

const ForgotPasswordLeftSide = ({ isMobile }: ForgotPasswordLeftSideProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);
  const { classes } = useStyle();
  const mobileHeight = useMobileHeight();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { alertFaultUpdate } = useSnackBar();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const onClickSendEmail = async () => {
    if (email?.length <= 0) {
      setErrorMsg(t("login.thisFieldRequired"));
      setError(true);
    } else {
      setErrorMsg("");
      setError(false);
      const callBack = (res) => {
        if (res?.success) {
          setOpenSuccessModal(true);
        } else {
          alertFaultUpdate();
        }
      };
      await forgetPasswordApi(callApi, callBack, { email });
    }
  };

  return (
    <div
      style={{
        ...classes.leftContainer,
        ...(isMobile
          ? {
            width: "100%",
            height: mobileHeight,
            minHeight: "unset",
          }
          : {}),
      }}
    >
      <Image
        alt="logo"
        // src={"https://i.ibb.co/wzpwSq6/Group-1239.png"}
        src={
          "https://gomake-printhouses-logos.s3.amazonaws.com/default_generalLogo.jpeg"
        }
        width={isMobile ? 100 : 180}
        height={isMobile ? 100 : 180}
        style={{
          borderRadius: "8px",
        }}
      />
      <div style={classes.loginContainer}>
        <div
          style={{
            ...classes.loginLbl,
            ...(isMobile ? { ...FONT_FAMILY.Outfit(600, 35) } : {}),
          }}
        >
          {t("login.forgotPassword")}
        </div>
        <div style={classes.inputContainer}>
          <div style={classes.inputLbl}>{t("login.email")}</div>
          <div style={classes.input}>
            <GomakeTextInput
              placeholder={t("login.enterYourEmail")}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
          </div>
        </div>
        <div style={classes.errorMsgStyle}>{errorMsg}</div>
        <div style={classes.btnContainer}>
          <GomakePrimaryButton onClick={onClickSendEmail}>
            {t("login.send")}
          </GomakePrimaryButton>
        </div>
        <GoMakeAlertModal
          openModal={openSuccessModal}
          onClose={() => setOpenSuccessModal(false)}
          title={t("login.forgotPassword")}
          subTitle={"login.forgotPasswordEmailSent"}
          yesBtn={"login.goToLogin"}
          withCancelBtn={false}
          onClickConfirm={() => {
            setOpenSuccessModal(false);
            navigate("/login");
          }}
        />
      </div>
    </div>
  );
};
export { ForgotPasswordLeftSide };
