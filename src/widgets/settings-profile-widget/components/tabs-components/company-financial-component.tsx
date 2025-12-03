import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useTranslation } from "react-i18next";
import {
  companyFinancialInputs,
  bankAccountsInputs,
} from "@/widgets/settings-profile-widget/components/profiles/inputs/company-financial-inputs";
import {
  companyCreditCardsInputs,
  pinPadsInputs,
} from "@/widgets/settings-profile-widget/components/profiles/inputs/company-credit-cards-inputs";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { FormInput } from "@/components/form-inputs/form-input";
import { FormArrayInput } from "@/components/form-inputs/form-array-input";
import { BankAccountsArrayInput } from "./bank-accounts-array-input";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { FONT_FAMILY } from "@/utils/font-family";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import { Stack } from "@mui/material";
import { useStyle } from "./style";
import { CreditClearanceCompanies } from "@/store/company-profile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface IProps {
  taxLoginInfo: {
    isLoggedIn: boolean;
    loginUrl: string;
    lastLoginDate: Date;
  };
  printHouseTaxLogout: () => void;
}

const CompanyFinancialComponent = ({
  taxLoginInfo,
  printHouseTaxLogout,
}: IProps) => {
  const { t } = useTranslation();
  const {
    profile,
    profileChange,
    updateProfileChanges,
    updatePinPadState,
    updateBankAccountsState,
    alertLogOutModal,
    connectToStripe,
  } = useCompanyProfile();

  const changeState = (key: string, value: any) => {
    profileChange({ ...profile, [key]: value });
  };

  const financialInputs = companyFinancialInputs(profile);
  const bankAccounts = bankAccountsInputs(profile);
  const creditCardInputs = companyCreditCardsInputs(profile, t);
  const pinPads = pinPadsInputs(profile);

  const { classes } = useStyle();
  return (
    <div style={classes.financialDiv} className="custom-scrollbar">
      {profile?.isShowFinance && (
        <>
          <FormInputsSectionComponent
            sectionTitle={t("profileSettings.financial")}
          >
            {bankAccounts.length > 0 && (
              <div style={{ width: "100%", marginBottom: "16px" }}>
                {bankAccounts.map((bankAccount) => (
                  <BankAccountsArrayInput
                    key={bankAccount.parameterKey}
                    name={bankAccount.name}
                    parameterKey={bankAccount.parameterKey}
                    value={bankAccount.value}
                    inputs={bankAccount.inputs ?? []}
                    updateState={updateBankAccountsState}
                    isValid={true}
                    containerStyle={{ padding: "0px" }}
                  />
                ))}
              </div>
            )}
            {[...financialInputs].map((input: any) => (
              <FormInput
                key={input.parameterKey}
                input={input}
                changeState={changeState}
                error={(input.required && !input.value) || !input.isValid}
              />
            ))}
          </FormInputsSectionComponent>
        </>
      )}

      <FormInputsSectionComponent
        sectionTitle={t("profileSettings.creditCards")}
      >
        {[...creditCardInputs].map((input: any) => (
          <FormInput
            key={input.parameterKey}
            input={input}
            changeState={changeState}
            error={(input.required && !input.value) || !input.isValid}
          />
        ))}

        {profile?.creditClearanceCompany === CreditClearanceCompanies.Stripe &&
          (profile?.isConnectedToStripe ? (
            <div style={classes.connectedBtn}>
              <CheckCircleIcon fontSize="small" />
              {t("profileSettings.isConnect")}
            </div>
          ) : (
            <SecondaryButton
              variant="contained"
              sx={{
                width: "fit-content",
                alignSelf: "end",
              }}
              onClick={connectToStripe}
            >
              {t("profileSettings.connectToStripe")}
            </SecondaryButton>
          ))}
      </FormInputsSectionComponent>

      {profile.creditClearanceCompany !== CreditClearanceCompanies.Stripe &&
        pinPads.length > 0 && (
          <FormInputsSectionComponent>
            {pinPads.map((pinPad) => (
              <FormArrayInput
                key={pinPad.parameterKey}
                name={pinPad.name}
                parameterKey={pinPad.parameterKey}
                value={pinPad.value}
                inputs={pinPad.inputs ?? []}
                updateState={updatePinPadState}
                isValid={true}
                containerStyle={{ padding: "0px" }}
              />
            ))}
          </FormInputsSectionComponent>
        )}
      {/* Tax Authority Section */}
      {profile?.isShowFinance && (
        <FormInputsSectionComponent
          sectionTitle={t("profileSettings.taxAuthority")}
        >
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
                {new Date(taxLoginInfo.lastLoginDate).toLocaleDateString()}
              </div>
            )}
          </Stack>
        </FormInputsSectionComponent>
      )}

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

      {/* Logout Modal */}
      {profile?.isShowFinance && (
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
      )}
    </div>
  );
};

export { CompanyFinancialComponent };
