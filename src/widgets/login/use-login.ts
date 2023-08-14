import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { updateTokenStorage } from "@/services/storage-data";
import { useCallback, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import {userProfileState} from "@/store/user-profile";

const useGomakeLogin = () => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const setUserProfile = useSetRecoilState(userProfileState);
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
      userPrincipalName: state.username,
      password: state.password,
    });
    if (result?.data?.data?.customer?.token) {
      updateTokenStorage(result?.data?.data?.customer?.token);
      navigate("/");
    }
  }, [state]);
  const inputs = useMemo(() => {
    return [
      {
        name: "username",
        label: "login.username",
        type: "text",
        placeholder: "Username",
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
    const res = await callApi("GET", '/v1/get-print-house-profile');
    if (res.success) {
      setUserProfile(res?.data?.data);
    }
  }
  return {
    inputs,
    errors,
    changeState,
    onClickLogin,
    getUserProfile
  };
};
export { useGomakeLogin };
