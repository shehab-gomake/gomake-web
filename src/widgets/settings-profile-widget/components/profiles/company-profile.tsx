import { ProfileAvatar } from "@/widgets/settings-profile-widget/components/avatar/profile-avatar";
import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { IInput } from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import { SecondaryButton } from "@/components/button/secondary-button";
import { companyContactsInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-contacts-inputs";
import { companyProfileInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-profile-inputs";
import { companyLocationInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-location-inputs";
import { companyFinancialInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-financial-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useTranslation } from "react-i18next";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import DaysOfWork from "./working-days/working-days";

const CompanyProfileComponent = () => {
  const { t } = useTranslation();
  const {
    getProfile,
    profileChange,
    profile,
    updateProfileChanges,
    changeCompanyProfileImage,
    changeCompanyLoginImage,
    daysOfWork,
    getCurrenciesApi,
    currencies,
    countriesWithCodes
  } = useCompanyProfile();

  useEffect(() => {
    getCurrenciesApi().then(() => {
      getProfile();
    });
  }, []);

  const changeState = (key, value) => {
    profileChange({
      ...profile,
      [key]: value,
    });
  };

  const formSections: { inputs: any[]; title: string }[] = [
    {
      inputs: companyProfileInputs(profile, currencies),
      title: "profileSettings.company"
    },
    {
      inputs: companyContactsInputs(profile),
      title: "profileSettings.contacts",
    },
    {
      inputs: companyLocationInputs(profile , countriesWithCodes),
      title: "profileSettings.location",
    },
    {
      inputs: companyFinancialInputs(profile),
      title: "profileSettings.financial",
    },
  ];


  return (
    <div style={{ paddingBottom: 2, paddingTop: "40px", position: "relative" }}>
      <Stack direction={"row"} gap={"57px"}>
        <div>
          <ProfileAvatar
            onUploadImage={changeCompanyLoginImage}
            src={profile.loginLogo}
            title={t("profileSettings.loginLogo")}
          />
        </div>
        <div>
          <ProfileAvatar
            onUploadImage={changeCompanyProfileImage}
            src={profile.logo}
            title={t("profileSettings.companyLogo")}
          />
        </div>
      </Stack>
      <Stack direction={"column"} gap={"32px"} paddingTop={"44px"}>
        {formSections.map((section) => {
          return (
            <FormInputsSectionComponent sectionTitle={section.title}>
              {section.inputs.map((companyInput) => (
                <FormInput
                  key={companyInput.parameterKey}
                  input={companyInput as IInput}
                  changeState={changeState}
                  error={false}
                />
              ))}
              {section.title === 'profileSettings.company' && <DaysOfWork options={daysOfWork} label={t("profileSettings.dayOfWork")} setState={profileChange} state={profile} />}
            </FormInputsSectionComponent>
          );
        })}
      </Stack>
      <div
        style={{
          position: "sticky",
          bottom: 10,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <PermissionCheck userPermission={Permissions.EDIT_COMPANY_PROFILE} >
          <SecondaryButton onClick={updateProfileChanges} variant={"contained"}>
            {t("profileSettings.update")}
          </SecondaryButton>
        </PermissionCheck>

      </div>
    </div>
  );
};
export { CompanyProfileComponent };
