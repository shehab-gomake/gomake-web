import React from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useTranslation } from "react-i18next";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { WorkingDaysComponent } from "@/widgets/settings-profile-widget/components/profiles/working-days/working-days-component";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission";

const CompanyWorkingDaysComponent = () => {
  const { t } = useTranslation();
  const {
    profile,
    onWorkingTimeChange,
    onToggleWorkingDays,
    updateProfileChanges,
  } = useCompanyProfile();

  return (
    <div className="custom-scrollbar" style={{ paddingTop: "30px" }}>
      <FormInputsSectionComponent sectionTitle={t("profileSettings.dayOfWork")}>
        <WorkingDaysComponent
          days={profile?.businessDays?.days}
          startTime={profile?.businessDays?.startTime}
          endTime={profile?.businessDays?.endTime}
          onTimeChange={onWorkingTimeChange}
          onToggleDay={onToggleWorkingDays}
        />
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

export { CompanyWorkingDaysComponent };
