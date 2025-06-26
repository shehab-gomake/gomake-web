import { ProfileAvatar } from "@/widgets/settings-profile-widget/components/avatar/profile-avatar";
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
import { companyCommunicationInputs } from "./inputs/company-communication-inputs";
import { companyPrintNodeInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/company-print-node-inputs";
import { printHouseUsePrintNode } from "@/store/print-house-profile";
import { useRecoilValue } from "recoil";
import { FONT_FAMILY } from "@/utils/font-family";
import React, { useCallback } from "react";
import { WorkingDaysComponent } from "@/widgets/settings-profile-widget/components/profiles/working-days/working-days-component";
import { OutlookEmailLoginComponent } from "@/widgets/settings-profile-widget/components/profiles/sender-email-auth/outlook-email-login";
import GoogleAuth from "@/widgets/settings-profile-widget/components/profiles/sender-email-auth/google-email-login";
import {
  companyCreditCardsInputs,
  pinPadsInputs,
} from "./inputs/company-credit-cards-inputs";
import { FormArrayInput } from "@/components/form-inputs/form-array-input";
import { GoMakeAlertModal, GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";

interface ICompanyProfileComponentProps {
  taxLoginInfo: {
    isLoggedIn: boolean;
    loginUrl: string;
    lastLoginDate: Date;
  };
  printHouseTaxLogout?: () => void;
}

const CompanyProfileComponent = ({
  taxLoginInfo,
  printHouseTaxLogout,
}: ICompanyProfileComponentProps) => {
  const { t } = useTranslation();
  const {
    profileChange,
    profile,
    updateProfileChanges,
    changeCompanyProfileImage,
    changeCompanyLoginImage,
    currencies,
    countriesWithCodes,
    onToggleWorkingDays,
    onWorkingTimeChange,
    updatePinPadState,
    alertLogOutModal,
  } = useCompanyProfile();

  const isPrintHouseUsePrintNode = useRecoilValue(printHouseUsePrintNode);

  const changeState = (key, value) => {
    profileChange({
      ...profile,
      [key]: value,
    });
  };

  const formSections: {
    inputs: any[];
    title?: string;
    component?: JSX.Element;
  }[] = [
    {
      inputs: companyProfileInputs(profile, currencies),
      title: "profileSettings.company",
    },
    {
      inputs: [],
      title: "profileSettings.dayOfWork",
      component: (
        <WorkingDaysComponent
          days={profile?.businessDays?.days}
          startTime={profile?.businessDays?.startTime}
          endTime={profile?.businessDays?.endTime}
          onTimeChange={onWorkingTimeChange}
          onToggleDay={onToggleWorkingDays}
        />
      ),
    },
    {
      inputs: companyContactsInputs(profile),
      title: "profileSettings.contacts",
    },
    {
      inputs: companyLocationInputs(profile, countriesWithCodes),
      title: "profileSettings.location",
    },
    {
      inputs: companyFinancialInputs(profile),
      title: "profileSettings.financial",
    },

    {
      inputs: companyCreditCardsInputs(profile, t),
      title: "profileSettings.creditCards",
    },
    {
      inputs: [],
      component: (
        <>
          {pinPadsInputs(profile).map((pinPad) => (
            <FormArrayInput
              name={pinPad.name}
              key={pinPad.parameterKey}
              parameterKey={pinPad.parameterKey}
              value={pinPad.value}
              inputs={pinPad.inputs ? pinPad.inputs : []}
              updateState={updatePinPadState}
              isValid={true}
              containerStyle={{ padding: "0px" }}
            />
          ))}
        </>
      ),
    },
    {
      inputs: companyCommunicationInputs(profile),
      title: "profileSettings.smsAndEmails",
    },
    isPrintHouseUsePrintNode
      ? {
          inputs: companyPrintNodeInputs(profile),
          title: "profileSettings.printNode",
        }
      : null,
    {
      inputs: [],
      title: "profileSettings.taxAuthority",
    },
  ].filter(Boolean);

  return (
    <div
      style={{
        paddingBottom: 2,
        paddingTop: "40px",
        position: "relative",
        height: "78vh",
        overflow: "auto",
      }}
      className="custom-scrollbar"
    >
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
            <FormInputsSectionComponent
              sectionTitle={section.title ?? null}
              key={section.title}
            >
              {section.component && section.component}
              {section.title === "profileSettings.taxAuthority" ? (
                <Stack direction={"column"}>
                  <SecondaryButton
                    variant="outlined"
                    onClick={() => {
                      if (taxLoginInfo?.isLoggedIn) {
                        alertLogOutModal.open();
                      } else {
                        window.open(taxLoginInfo.loginUrl, "_blank");
                      }
                    }}
                    sx={{
                      color: !taxLoginInfo?.isLoggedIn ? "green" : "red",
                      borderColor: !taxLoginInfo?.isLoggedIn ? "green" : "red",
                      "&:hover": {
                        backgroundColor: !taxLoginInfo?.isLoggedIn
                          ? "#e6ffe6"
                          : "#ffe6e6",
                        borderColor: !taxLoginInfo?.isLoggedIn
                          ? "darkgreen"
                          : "darkred",
                      },
                    }}
                  >
                    {taxLoginInfo?.isLoggedIn
                      ? t("dashboard-widget.logout")
                      : t("login.login")}
                  </SecondaryButton>
                  {taxLoginInfo?.isLoggedIn && taxLoginInfo.lastLoginDate && (
                    <div
                      style={{
                        marginTop: "8px",
                        ...FONT_FAMILY.Inter(600, 13),
                        color: "#666",
                      }}
                    >
                      {t("profileSettings.lastLoginDate")}:{" "}
                      {new Date(
                        taxLoginInfo.lastLoginDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </Stack>
              ) : (
                section.inputs.map((companyInput) => (
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
                    {companyInput.parameterKey === "mailServiceEmail" && (
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "0px 5px",
                          ...FONT_FAMILY.Inter(600, 13),
                          color: profile.isSendGridVerificated
                            ? "green"
                            : "red",
                        }}
                      >
                        {profile.isSendGridVerificated
                          ? t("usersSettings.emailVerified")
                          : t("usersSettings.emailNotVerified")}
                      </div>
                    )}
                  </div>
                ))
              )}
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
          <SecondaryButton onClick={updateProfileChanges} variant={"contained"}>
            {t("profileSettings.update")}
          </SecondaryButton>
        </PermissionCheck>
      </div>

      <GoMakeDeleteModal
        openModal={alertLogOutModal.isOpen}
        modalType={ModalType.WARNING}
        title={t("dashboard-widget.logout")}
        subTitle={t("modal.confirmLogout")}
        yesBtn={t("dashboard-widget.logout")}
        cancelBtn={t("modal.cancel")}
        onClose={alertLogOutModal.close}
        onClickDelete={() => {
          printHouseTaxLogout();
          alertLogOutModal.close();
        }}
      />
    </div>
  );
};
export { CompanyProfileComponent };
