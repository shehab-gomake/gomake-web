import { loadgingState } from "@/store/loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
// import { useTranslation } from "react-i18next";

const useGomakeLogin = () => {
  // const { t } = useTranslation();
  const setLoadingState = useSetRecoilState(loadgingState);
  const [state, setState] = useState({});
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
  const onClickLogin = useCallback(() => {
    setLoadingState(true);
    setTimeout(() => {
      setLoadingState(false);
    }, 3000);
  }, [state]);
  useEffect(() => {
    console.log(state);
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

  return {
    inputs,
    errors,
    changeState,
    onClickLogin,
  };
};
export { useGomakeLogin };
