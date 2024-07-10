import { CircularProgress, Stack } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { useCompanyForm } from "@/widgets/quick-setup-widgets/company/use-company-form";
import { useStyle } from "@/widgets/quick-setup-widgets/company/style";
import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { domainRegex, emailRegex } from "@/utils/regex";
import { NewLogo } from "@/icons";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { defaultCountries } from "react-international-phone";
import { useCallback, useState } from "react";
import { TermModal } from "@/widgets/login/terms-modal/TermModal";
import useTermsFlag from "@/hooks/use-terms";
const SignUpCompanyForm = ({ isMobile }: any) => {
  const { t } = useTranslation();
  const { state, onChange, onclickNext, loading, countryList, currencies, languages, checkPrintHouseDomain } = useCompanyForm();
  const { classes } = useStyle();
  const [lastCheckedDomain, setLastCheckedDomain] = useState("");
  const { isModalOpen, setIsModalOpen, setIsTermsAccepted, isTermsAccepted } = useTermsFlag();

  const handleDomainBlur = useCallback(
    (e) => {
      const newDomain = e.target.value;
      if (newDomain !== lastCheckedDomain) {
        checkPrintHouseDomain(newDomain);
        setLastCheckedDomain(newDomain);
      }
    },
    [lastCheckedDomain, checkPrintHouseDomain]
  );

  const renderPhone = useCallback(() => {
    const countryData = defaultCountries.find((item) => item[0] === state?.country?.name)?.[1];
    return (
      <PhoneInput
        country={countryData}
        enableAreaCodes={true}
        value={state.phone}
        onChange={(phone) => onChange("phone", phone)}
        inputStyle={{ width: "100%" }}
        containerStyle={{ width: "100%" }}
      />
    );
  }, [state.country, state.phone]);

  return (
    <Stack gap={"12px"} alignItems={"flex-start"} >
      <NewLogo />
      <div style={isMobile ? classes.signUpMobileStyle : classes.signUpStyle}>Sign up</div>
      <div style={isMobile ? classes.subTitleMobileStyle : classes.subTitleStyle}>
        Please enter the following details to create account.
      </div>
      <Stack gap={"24px"} width={"100%"}>
        <GoMakeAutoComplate
          options={countryList}
          getOptionLabel={(option: any) => `${option.name}`}
          onChange={(e, v) => onChange("country", v)}
          value={state.country}
          placeholder={t("signup.country")}
          style={classes.dropDownList}
        />
        <GomakeTextInput
          onChange={(e) => {
            onChange("name", e.target.value);
          }}
          onBlur={handleDomainBlur}
          style={classes.input}
          placeholder={t("signup.companyName")}
          value={state.name}
        />
        <Stack direction={"row"} alignItems={"center"} style={{ position: "relative" }}>
          <GomakeTextInput
            onChange={(e) => onChange("domain", e.target.value)}
            style={classes.input}
            placeholder={t("signup.companyDomain")}
            error={state.domain ? !domainRegex.test(state.domain) : false}
            value={state.domain}
          />
          <span style={{ position: "absolute", right: 8 }}>.gomake.net</span>
        </Stack>
        <GomakeTextInput
          onChange={(e) => onChange("fullName", e.target.value)}
          style={classes.input}
          placeholder={t("signup.fullName")}
          value={state.fullName}
        />
        <GomakeTextInput
          onChange={(e) => onChange("email", e.target.value)}
          style={classes.input}
          placeholder={t("signup.email")}
          error={state.email ? !emailRegex.test(state.email) : false}
          value={state.email}
        />
        {renderPhone()}
        <GoMakeAutoComplate
          options={languages}
          getOptionLabel={(option: any) => `${option.label}`}
          onChange={(e, v) => onChange("systemLanguage", v)}
          value={state.systemLanguage}
          placeholder={t("signup.defaultLanguage")}
          style={classes.dropDownList}
        />
        <GoMakeAutoComplate
          options={currencies}
          getOptionLabel={(option: any) => `${option.label}`}
          onChange={(e, v) => onChange("systemCurrency", v)}
          value={state.systemCurrency}
          placeholder={t("signup.defaultCurrency")}
          style={classes.dropDownList}
        />
        <p style={isMobile ? classes.privacyPolicyMobileStyle : classes.privacyPolicyStyle} >
          By clicking Create Account, you agree to our{' '}
          <a
            href="https://gomake-contents.s3.eu-west-3.amazonaws.com/Website+Privacy+Notice+-GoMake+(incl+GDPR).pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2e3092' }}
          >
            <u>Privacy Policy</u>
          </a>
          .
        </p>
      </Stack>
      <PrimaryButton
        endIcon={loading && <CircularProgress style={{ width: "20px", height: "20px" }} />}
        onClick={() => (isTermsAccepted ? onclickNext() : setIsModalOpen(true))}
        style={classes.nextButton}
        disabled={loading}
        variant={"contained"}
      >
        {loading ? `${t("signup.create")} ${state.domain}` : t("signup.create")}
      </PrimaryButton>
      <TermModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setIsTermsAccepted={setIsTermsAccepted}
        isQuickSetup={true}
        setIsModalOpen={setIsModalOpen}
      />
    </Stack>
  );
};

export { SignUpCompanyForm };
