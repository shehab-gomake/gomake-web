import React from "react";
import { Stack } from "@mui/material";
import { ProfileAvatar } from "@/widgets/settings-profile-widget/components/avatar/profile-avatar";
import { companyContactsInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-contacts-inputs";
import { companyProfileInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-profile-inputs";
import { companyLanguagesInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-languages-inputs";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { SecondaryButton } from "@/components/button/secondary-button";
import { IInput } from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission";
import { useRecoilValue } from "recoil";
import { languageOptionsState } from "@/store/languages";

const CompanyBasicInfoComponent = () => {
  const { t } = useTranslation();
  const { profile, profileChange, updateProfileChanges, currencies, changeCompanyLoginImage, changeCompanyProfileImage } =
    useCompanyProfile();
  const languages = useRecoilValue(languageOptionsState);

  console.log("languages", { languages, profile });

  const changeState = (key: string, value: any) => {
    profileChange({ ...profile, [key]: value });
  };

  const formSections = [
    {
      inputs: companyProfileInputs(profile, currencies),
      title: "profileSettings.company",
    },
    {
      inputs: companyContactsInputs(profile),
      title: "profileSettings.contacts",
    },
    {
      inputs: companyLanguagesInputs(profile, languages),
      title: "profileSettings.languages",
    },
  ];

  return (
    <div className="custom-scrollbar" style={{ paddingTop: "30px" }}>
      <Stack direction="row" gap="57px">
        <ProfileAvatar
          onUploadImage={(img) => changeCompanyLoginImage(img)}
          src={profile.loginLogo}
          title={t("profileSettings.loginLogo")}
        />
        <ProfileAvatar
          onUploadImage={(img) => changeCompanyProfileImage(img)}
          src={profile.logo}
          title={t("profileSettings.companyLogo")}
        />
      </Stack>
      <Stack direction={"column"} gap={"32px"} paddingTop={"44px"}>
        {formSections.map((section) => {
          return (
            <FormInputsSectionComponent
              sectionTitle={section.title}
              key={section.title}
            >
              {section.inputs.map((companyInput) => (
                <div key={companyInput.parameterKey}>
                  {
                    <FormInput
                      input={companyInput as IInput}
                      changeState={changeState}
                      error={
                        (companyInput.required && !companyInput.value) ||
                        !companyInput.isValid
                      }
                    />
                  }
                </div>
              ))}
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
        <PermissionCheck userPermission={Permissions.EDIT_COMPANY_PROFILE}>
          <SecondaryButton onClick={updateProfileChanges} variant="contained">
            {t("profileSettings.update")}
          </SecondaryButton>
        </PermissionCheck>
      </div>
    </div>
  );
};

export { CompanyBasicInfoComponent };
