import { useCallback, useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";

const useGomakeLogin = () => {
  // const { t } = useTranslation();
  const [state, setState] = useState({});
  const [errors, setErrors] = useState<{ [name: string]: boolean }>({
    username: false,
    password: true,
  });
  const changeState = useCallback(
    (key: string, value: any) => {
      setState({ ...state, [key]: value });
    },
    [state]
  );
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
  };
};
export { useGomakeLogin };
