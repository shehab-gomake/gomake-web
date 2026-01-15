import { IUserProfile } from "@/store/user-profile";
import { useRecoilValue } from "recoil";
import { languageOptionsState } from "@/store/languages";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";

const personalInputs = (state: IUserProfile) => {
  const languages = useRecoilValue(languageOptionsState);
  const profileData = useRecoilValue<ICompanyProfile>(companyProfileState);
  const defaultLanguageOptions = profileData?.languages?.length > 0
    ? languages.filter((lang) => profileData?.languages?.includes(lang.value))
    : [];
  return [
    {
      name: "firstName",
      label: "profileSettings.firstName",
      type: "text",
      placeholder: "profileSettings.firstName",
      required: true,
      parameterKey: "firstName",
      options: [],
      value: state.firstName,
      machineInputType: "input",
      isValid: !!state.firstName,
      readonly: false,
    },
    {
      name: "lastName",
      label: "profileSettings.lastName",
      type: "text",
      placeholder: "profileSettings.lastName",
      required: true,
      parameterKey: "lastName",
      options: [],
      value: state.lastName,
      machineInputType: "input",
      isValid: !!state.lastName,
      readonly: false,
    },
    // {
    //     name: "position",
    //     label: "profileSettings.position",
    //     type: "text",
    //     placeholder: "profileSettings.position",
    //     required: false,
    //     parameterKey: "role",
    //     options: [],
    //     value: state.role,
    //     machineInputType: 'input',
    //     isValid: !!state.role,
    //     readonly: false
    // },
    {
      name: "systemLang",
      label: "profileSettings.systemLanguage",
      type: "select",
      placeholder: "profileSettings.systemLanguage",
      required: true,
      parameterKey: "systemLang",
      options: defaultLanguageOptions,
      value: state.systemLang,
      isValid: !!state.systemLang,
      readonly: false,
    },
  ];
};

export { personalInputs };
