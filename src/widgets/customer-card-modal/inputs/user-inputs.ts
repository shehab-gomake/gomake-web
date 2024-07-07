import { languagesState } from "@/store/languages";
import {emailRegex} from "@/utils/regex";
import { useRecoilValue } from "recoil";

const userInputs = (state, showPass) => {
  const languages = useRecoilValue(languagesState);

  return [
    {
      name: "email",
      label: "customers.modal.email",
      type: "text",
      placeholder: "customers.modal.email",
      required: true,
      parameterKey: "email",
      options: [],
      value: state?.email,
      isValid: !!state?.email, 
      regex: emailRegex,
      readonly: false,
    },
    {
      name: "userName",
      label: "customers.modal.userName",
      type: "text",
      placeholder: "customers.modal.userName",
      required: false,
      parameterKey: "username",
      options: [],
      value: state?.username,
      isValid: !!state.username,
      readonly: false,
      disabled: true,
    },
    {
      name: "password",
      label: "customers.modal.password",
      type: "password",
      placeholder: "customers.modal.password",
      required: true,
      parameterKey: "password",
      options: [],
      value: state?.password,
      isValid: true,
      disabled: showPass,
    },
    {
      name: "IPaddress",
      label: "customers.modal.IPaddress",
      type: "text",
      placeholder: "customers.modal.IPaddress",
      required: false,
      parameterKey: "userIPAddress",
      options: [],
      value: state?.userIPAddress,
      isValid: true,
      readonly: false,
    },
    {
      name: "language",
      label: "customers.modal.language",
      type: "select",
      placeholder: "customers.modal.language",
      required: false,
      parameterKey: "systemLanguage",
      options: languages,
      value: state?.systemLanguage, 
      isValid: true,
    },
    {
      name: "loginUsingEmailCode",
      label: "customers.modal.loginUsingEmailCode",
      type: "switch",
      placeholder: "customers.modal.loginUsingEmailCode",
      required: false,
      parameterKey: "isCanLoginWithCode",
      options: [],
      value: state?.isCanLoginWithCode,
      isValid: true,
    },
  ];
};

export { userInputs };
