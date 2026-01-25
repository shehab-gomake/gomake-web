import { allSMSTemplatesListState } from "@/store";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { languageOptionsState } from "@/store/languages";
import { EmployeeQuoteLimitationType } from "@/widgets/settings-users/users/enums/employee-actions";
import {
  Employee,
  IUserData,
} from "@/widgets/settings-users/users/interface/employee";
import { useRecoilValue } from "recoil";
import { useDefaultLanguageOptions } from "@/hooks/use-default-language-options";

const employeeInfoInputs = (
  state: Employee,
  userState: IUserData,
  quoteLimitationOptions: any
) => {
  const { defaultLanguageOptions } = useDefaultLanguageOptions();
  const allSMSTemplatesList = useRecoilValue(allSMSTemplatesListState);
  return [
    {
      name: "firstName",
      label: "usersSettings.firstName",
      type: "text",
      placeholder: "usersSettings.firstName",
      required: true,
      parameterKey: "firstname",
      options: [],
      value: state.firstname,
      machineInputType: "input",
      isValid: !!state.firstname,
    },
    {
      name: "lastName",
      label: "usersSettings.lastName",
      type: "text",
      placeholder: "usersSettings.lastName",
      required: true,
      parameterKey: "lastname",
      options: [],
      value: state.lastname,
      machineInputType: "input",
      isValid: !!state.lastname,
    },
    {
      name: "phone",
      label: "usersSettings.phone",
      type: "phone",
      placeholder: "usersSettings.phone",
      required: false,
      parameterKey: "phone",
      options: [],
      value: state.phone,
      machineInputType: "input",
      isValid: !!state.phone,
    },
    // {
    //     name: "PinCodeForLoginWithApplication",
    //     label: "usersSettings.PinCodeForLoginWithApplication",
    //     type: "text",
    //     placeholder: "usersSettings.PinCodeForLoginWithApplication",
    //     required: false,
    //     parameterKey: "pinCodeForLoginWithApplication",
    //     options: [],
    //     value: state.pinCodeForLoginWithApplication,
    //     machineInputType: 'input',
    //     isValid: !!state.pinCodeForLoginWithApplication,
    // },
    {
      name: "systemLanguage",
      label: "customers.modal.language",
      type: "select",
      placeholder: "customers.modal.language",
      required: false,
      parameterKey: "systemLanguage",
      options: defaultLanguageOptions,
      value: userState?.systemLanguage,
      isValid: !!userState?.systemLanguage,
      readonly: false,
    },
    {
      name: "smsTemplatesGroupId",
      label: "usersSettings.smsTemplatesGroupId",
      type: "select",
      placeholder: "usersSettings.smsTemplatesGroupId",
      required: false,
      parameterKey: "smsTemplatesGroupId",
      value: state.smsTemplatesGroupId,
      options: allSMSTemplatesList,
      isValid: true,
      // optionsUrl: "/v1/crm-service/roles/get-all-sms-templates",
    },
    // {
    //     name: "isGraphicArtist",
    //     label: "usersSettings.isGraphicArtist",
    //     type: "switch",
    //     placeholder: "usersSettings.isGraphicArtist",
    //     required: false,
    //     parameterKey: "isGraphicArtist",
    //     value: state.isGraphicArtist,
    //     options: [],
    //     machineInputType: 'input',
    //     isValid: true,
    // },
    {
      name: "QuoteLimitationType",
      label: "usersSettings.QuoteLimitationType",
      type: "select",
      placeholder: "usersSettings.QuoteLimitationType",
      required: false,
      parameterKey: "quoteLimitationType",
      value: state?.quoteLimitationType,
      options: quoteLimitationOptions,
      isValid: true,
    },
    state?.quoteLimitationType ===
      EmployeeQuoteLimitationType.LimitedTotalPrice && {
      name: "QuotePriceLimit",
      label: "usersSettings.QuotePriceLimit",
      type: "number",
      placeholder: "usersSettings.QuotePriceLimit",
      required: false,
      parameterKey: "quotePriceLimit",
      options: [],
      value: state.quotePriceLimit,
      isValid: true,
    },
  ].filter(Boolean);
};

export { employeeInfoInputs };
