import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useTranslation } from "react-i18next";
import { companyLocationInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-location-inputs";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { FormInput } from "@/components/form-inputs/form-input";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { Stack } from "@mui/material";

const CompanyAddressComponent = () => {
  const { t } = useTranslation();
  const { profile, profileChange, countriesWithCodes, updateProfileChanges } =
    useCompanyProfile();

  const changeState = (key: string, value: any) => {
    profileChange({ ...profile, [key]: value });
  };

  const inputs = companyLocationInputs(profile, countriesWithCodes);

  return (
    <div className="custom-scrollbar" style={{ paddingTop: "30px" }}>
      <Stack paddingBottom={"44px"}>
        <FormInputsSectionComponent
          sectionTitle={t("profileSettings.location")}
        >
          {inputs.map((input) => (
            <FormInput
              key={input.parameterKey}
              input={input}
              changeState={changeState}
              error={(input.required && !input.value) || !input.isValid}
            />
          ))}
        </FormInputsSectionComponent>
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

export { CompanyAddressComponent };
