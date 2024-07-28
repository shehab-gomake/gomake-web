import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { updateTokenStorage } from "@/services/storage-data";
import { useCallback, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { companyProfileState } from "@/store/company-profile";
import { useTranslation } from "react-i18next";
import useTermsFlag from "@/hooks/use-terms"; // import the terms hook

const useGomakeLogin = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const setUserProfile = useSetRecoilState(companyProfileState);
  const [state, setState] = useState<any>({});
  const { isModalOpen, setIsModalOpen, setIsTermsAccepted } = useTermsFlag();

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
      const result = await callApi("POST", "/v1/auth/login-customer", {
        userPrincipalName: state.username,
        password: state.password,
      });
      if (result?.data?.data?.customer?.token) {
        updateTokenStorage(result?.data?.data?.customer?.token);
        result?.data?.data?.customer.isTermsAccepted ? navigate("/") : setIsModalOpen(true);
      } else {
        setErrorMsg(t("login.invalidCredentialToken"));
      }
    }
  }, [state]);

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
  };
};

export { useGomakeLogin };
