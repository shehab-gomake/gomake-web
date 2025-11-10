import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useTranslation } from "react-i18next";
import { companyPrintNodeInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-print-node-inputs";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { FormInput } from "@/components/form-inputs/form-input";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";

const CompanyPrintNodeComponent = () => {
  const { t } = useTranslation();
  const { profile, profileChange, updateProfileChanges } = useCompanyProfile();
  const inputs = companyPrintNodeInputs(profile);

  const changeState = (key: string, value: any) => {
    profileChange({ ...profile, [key]: value });
  };

  return (
    <div className="custom-scrollbar" style={{ paddingTop: "30px" }}>
      <FormInputsSectionComponent
        sectionTitle={t("profileSettings.printNode")}
      >
        {inputs.map((input) => (
          <div key={input.parameterKey}>
            <FormInput
              input={input}
              changeState={changeState}
              error={
                (input.required && !input.value) || !input.isValid
              }
            />
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

export { CompanyPrintNodeComponent };

