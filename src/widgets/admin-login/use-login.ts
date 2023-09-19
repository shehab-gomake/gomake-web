import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { useCustomer } from "@/hooks/use-customer";
import { updateTokenStorage } from "@/services/storage-data";
import { loadgingState } from "@/store/loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
// import { useTranslation } from "react-i18next";

const useGomakeAdminLogin = () => {
  // const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const setLoadingState = useSetRecoilState(loadgingState);
  const [state, setState] = useState<any>({});
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
    const result = await callApi("POST", "/v1/auth/login-customer", {
      userPrincipalName: state.email,
      password: state.password,
    });
    if (result?.data?.data?.token) {
      updateTokenStorage(result?.data?.data?.token);
      navigate("/admin");
    }
  }, [state]);
  const inputs = useMemo(() => {
    return [
      {
        name: "email",
        label: "login.email",
        type: "text",
        placeholder: "login.email",
        required: true,
        key: "email",
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

  return {
    inputs,
    errors,
    changeState,
    onClickLogin,
  };
};
export { useGomakeAdminLogin };
