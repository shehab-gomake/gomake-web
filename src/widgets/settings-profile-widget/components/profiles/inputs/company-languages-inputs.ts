import { useDefaultLanguageOptions } from "@/hooks/use-default-language-options";
import { ICompanyProfile } from "@/store/company-profile";

const companyLanguagesInputs = (
  state: ICompanyProfile,
  languages: { value: string; text: string; label?: string }[]
) => {
  const { defaultLanguageOptions } = useDefaultLanguageOptions();
  return [
    {
      name: "languages",
      label: "profileSettings.languages",
      type: "select",
      placeholder: "profileSettings.languages",
      required: false,
      parameterKey: "languages",
      options: languages.map((lang) => ({
        value: lang.value,
        text: lang.text,
      })),
      value: state.languages || [],
      multiple: true,
      isValid: true,
    },
    {
      name: "defaultLanguage",
      label: "signup.defaultLanguage",
      type: "select",
      placeholder: "signup.defaultLanguage",
      required: false,
      parameterKey: "systemLanguage",
      options: defaultLanguageOptions.map((lang) => ({
        value: lang.value,
        text: lang.text,
      })),
      value: state.systemLanguage || "",
      isValid: true,
    },
  ];
};

export { companyLanguagesInputs };

