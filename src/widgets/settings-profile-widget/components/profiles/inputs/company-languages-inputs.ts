import { ICompanyProfile } from "@/store/company-profile";

const companyLanguagesInputs = (
  state: ICompanyProfile,
  languages: { value: string; text: string; label?: string }[]
) => {
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
  ];
};

export { companyLanguagesInputs };

