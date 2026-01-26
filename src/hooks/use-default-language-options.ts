import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { languageOptionsState } from "@/store/languages";
import { useRecoilValue } from "recoil";

export const useDefaultLanguageOptions = () => {
  const languages = useRecoilValue(languageOptionsState);
  const profileData = useRecoilValue<ICompanyProfile>(companyProfileState);
  const profileLanguageOptions =
    profileData?.languages?.length > 0
      ? languages.filter((lang) => profileData?.languages?.includes(lang.value))
      : [];
  const englishOption = languages.find(
    (lang) =>
      lang.value === "en" ||
      (lang.text && lang.text.toLowerCase() === "english")
  );
  const baseLanguageOptions = englishOption
    ? profileLanguageOptions.some((lang) => lang.value === englishOption.value)
      ? profileLanguageOptions
      : [englishOption, ...profileLanguageOptions]
    : profileLanguageOptions;
  const addLanguageOption = {
    value: "add_language_action",
    text: "add language",
    label: "add language",
  };
  const defaultLanguageOptions = baseLanguageOptions.some(
    (lang) => lang.value === addLanguageOption.value
  )
    ? baseLanguageOptions
    : [addLanguageOption,...baseLanguageOptions];
  return {
    defaultLanguageOptions,
  };
};
