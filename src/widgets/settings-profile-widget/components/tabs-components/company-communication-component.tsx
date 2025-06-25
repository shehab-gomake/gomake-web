import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useTranslation } from "react-i18next";
import { companyCommunicationInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-communication-inputs";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { FormInput } from "@/components/form-inputs/form-input";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { FONT_FAMILY } from "@/utils/font-family";
import { useEffect } from "react";
import { IMailProviders } from "@/store/company-profile";

const CompanyCommunicationComponent = () => {
  const { t } = useTranslation();
  const { profile, profileChange, updateProfileChanges } = useCompanyProfile();
  const inputs = companyCommunicationInputs(profile);

  const changeState = (key: string, value: any) => {
    profileChange({ ...profile, [key]: value });
  };

  useEffect(() => {
    if (!profile?.mailProvider) {
      changeState("mailProvider", IMailProviders.GMAIL);
    }
  }, [profile?.mailProvider]);

  return (
    <div className="custom-scrollbar" style={{ paddingTop: "30px" }}>
      <FormInputsSectionComponent
        sectionTitle={t("profileSettings.smsAndEmails")}
      >
        {inputs.map((input) => (
          <div key={input.parameterKey}>
            <FormInput
              input={input}
              changeState={changeState}
              error={(input.required && !input.value) || !input.isValid}
            />
            {input.parameterKey === "mailServiceEmail" && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "0px 5px",
                  ...FONT_FAMILY.Inter(600, 13),
                  color: profile.isSendGridVerificated ? "green" : "red",
                }}
              >
                {profile.isSendGridVerificated
                  ? t("usersSettings.emailVerified")
                  : t("usersSettings.emailNotVerified")}
              </div>
            )}
          </div>
        ))}
      </FormInputsSectionComponent>

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

export { CompanyCommunicationComponent };
