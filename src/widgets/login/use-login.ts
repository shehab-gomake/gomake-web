import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import {
  updateTokenStorage,
  updateRefreshTokenStorage,
} from "@/services/storage-data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { companyProfileState } from "@/store/company-profile";
import { useTranslation } from "react-i18next";
import useTermsFlag from "@/hooks/use-terms"; // import the terms hook
import { tokenExpiredState } from "@/store/token-expired-modal";
import { autoSetThemeFromDomain } from "@/contexts/theme";

const useGomakeLogin = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const setUserProfile = useSetRecoilState(companyProfileState);
  const [state, setState] = useState<any>({ username: "", password: "" });
  const { isModalOpen, setIsModalOpen, setIsTermsAccepted } = useTermsFlag();
  const showLoginModal = useSetRecoilState(tokenExpiredState);

  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<{ [name: string]: boolean }>({
    username: false,
    password: false,
  });

  const changeState = useCallback(
    (key: string, value: any) => {
      setState({ ...state, [key]: value });
    },
    [state]
  );

  const onClickLogin = useCallback(async () => {
    if (state?.username?.length <= 0) {
      setErrors({ username: true, password: false });
      setErrorMsg(t("login.emailIsRequired"));
    } else if (state?.password?.length <= 0) {
      setErrors({ username: false, password: true });
      setErrorMsg(t("login.passwordIsRequired"));
    } else {
      const offsetMinutes = new Date().getTimezoneOffset() * -1;
      const offsetHours = offsetMinutes / 60;
      const result = await callApi("POST", "/v1/auth/login-customer", {
        userPrincipalName: state.username,
        password: state.password,
        timeZoneOffset: offsetHours,
      });
      if (result?.data?.data?.customer?.token) {
        showLoginModal(false);
        updateTokenStorage(result?.data?.data?.customer?.token);
        if (result?.data?.data?.customer?.refreshToken) {
          updateRefreshTokenStorage(result?.data?.data?.customer?.refreshToken);
        }

        // Auto-set theme based on domain after successful login
        autoSetThemeFromDomain();

        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get("redirect");
        const customer = result?.data?.data?.customer;

        if (customer?.isGoAiUser) {
          if (customer.isTermsAccepted) {
            // Check if billing is required (not paid)
            if (customer?.isGoAiBillingRequired) {
              navigate("/gomake-ai/billing");
            } else {
              navigate("/gomake-ai");
            }
          } else {
            setIsModalOpen(true);
          }
        } else if (customer.isTermsAccepted) {
          navigate(redirectPath || "/");
        } else {
          setIsModalOpen(true);
        }
      } else {
        setErrorMsg(t("login.invalidCredentialToken"));
      }
    }
  }, [state]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const passwordParam = params.get("password");
    if (emailParam || passwordParam) {
      setState((prev) => ({
        ...prev,
        username: emailParam || prev.username,
        password: passwordParam || prev.password,
      }));
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onClickLogin();
    }
  };

  const inputs = useMemo(() => {
    return [
      {
        name: "username",
        label: "login.username",
        type: "text",
        placeholder: "login.username",
        required: true,
        key: "username",
      },
      {
        name: "password",
        label: "login.password",
        type: "password",
        placeholder: "Password",
        required: true,
        key: "password",
      },
    ];
  }, []);

  const getUserProfile = async () => {
    const res = await callApi("GET", "/v1/get-print-house-profile");
    if (res.success) {
      setUserProfile(res?.data?.data);
    }
  };

  return {
    inputs,
    errors,
    errorMsg,
    changeState,
    onClickLogin,
    getUserProfile,
    handleKeyPress,
    t,
    isModalOpen,
    setIsModalOpen,
    setIsTermsAccepted,
    state,
  };
};

export { useGomakeLogin };
