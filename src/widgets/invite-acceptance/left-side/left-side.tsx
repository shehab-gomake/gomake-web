import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useGomakeAxios } from "@/hooks";
import { acceptInvitationApi } from "@/services/api-service/users/users-api";
import { useSnackBar } from "@/hooks";

const InviteAcceptanceLeftSide = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { token } = router.query;
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFault } = useSnackBar();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (!token) {
      setErrorMsg(t("invite.invalidToken"));
    }
  }, [token]);

  const onClickAcceptInvitation = async () => {
    if (!token) {
      setErrorMsg(t("invite.invalidToken"));
      return;
    }

    if (password?.length <= 0) {
      setErrorMsg(t("login.thisFieldRequired"));
      setError({ password: true, confirmPassword: false });
      return;
    } else if (confirmPassword?.length <= 0) {
      setErrorMsg(t("login.thisFieldRequired"));
      setError({ password: false, confirmPassword: true });
      return;
    } else if (password !== confirmPassword) {
      setErrorMsg(t("login.notMach"));
      setError({ password: true, confirmPassword: true });
      return;
    } else if (password.length < 8) {
      setErrorMsg(t("alerts.invalidPass"));
      setError({ password: true, confirmPassword: true });
      return;
    }

    setErrorMsg("");
    setError({ password: false, confirmPassword: false });
    setLoading(true);

    const callback = (data: any) => {
      setLoading(false);
      if (data.success) {
        alertSuccessUpdate();
        // Redirect to login page after successful invitation acceptance
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        if (data?.message) {
          setErrorMsg(data.message);
        } else {
          alertFault("invite.acceptanceFailed");
        }
      }
    };

    await acceptInvitationApi(callApi, callback, {
      token: token as string,
      password: password,
    });
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
        <div style={clasess.loginLbl}>{t("invite.acceptInvitation")}</div>
        <div style={clasess.descriptionLbl}>
          {t("invite.setPasswordDescription")}
        </div>
        <div style={clasess.inputContainer}>
          <div style={clasess.inputLbl}>{t("login.password")}</div>
          <div style={clasess.input}>
            <GomakeTextInput
              placeholder={t("login.password")}
              onChange={(e) => setPassword(e.target.value)}
              error={error["password"]}
              type="password"
              disabled={loading || !token}
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
              disabled={loading || !token}
            />
          </div>
        </div>
        <div style={clasess.errorMsgStyle}>{errorMsg}</div>
        <div style={clasess.btnContainer}>
          <GomakePrimaryButton
            onClick={onClickAcceptInvitation}
            disabled={loading || !token}
          >
            {loading ? t("invite.accepting") : t("invite.acceptInvitation")}
          </GomakePrimaryButton>
        </div>
      </div>
    </div>
  );
};
export { InviteAcceptanceLeftSide };
