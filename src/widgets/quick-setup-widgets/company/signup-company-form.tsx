import { CircularProgress, Stack } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { useCompanyForm } from "@/widgets/quick-setup-widgets/company/use-company-form";
import { useStyle } from "@/widgets/quick-setup-widgets/company/style";
import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { domainRegex, emailRegex } from "@/utils/regex";
import { PhoneInputComponent } from "@/components/form-inputs/phone-input";
import { NewLogo } from "@/icons";
import {
    defaultCountries,
} from "react-international-phone";
import { useCallback, useEffect, useState } from "react";
const SignupCompanyForm = ({ isMobile }: any) => {
    const {
        state,
        onChange,
        onclickNext,
        loading,
        countryList,
        currencies,
        languages,
        checkPrintHouseDomain
    } = useCompanyForm();
    const { classes } = useStyle();
    const { t } = useTranslation();

    const validateField = (field, value) => {
        if (!value) {
            return t('signup.requiredField');
        }
        if (field === 'domain' && !domainRegex.test(value)) {
            return t('signup.errorDomain');
        }
        if (field === 'email' && !emailRegex.test(value)) {
            return t('signup.errorEmail');
        }
        if (field === 'phone' && !value.match(/^\+[1-9]\d{1,14}$/)) { // Assuming E.164 format
            return t('signup.errorPhone');
        }
        return '';
    };
    const renderPhone = useCallback(() => {
        const countryData = defaultCountries.find((item) => item[0] === state?.country?.name)?.[1];
        return (
            <PhoneInputComponent
                key={countryData}
                onChange={(e) => onChange('phone', e)}
                value={state.phone}
                customStyle={classes.inputPhone}
                defaultCountry={countryData}
            />
        );
    }, [state.country, state.phone, classes.inputPhone]);
    return (
        <Stack gap={'12px'} alignItems={'flex-start'}>
            <NewLogo />
            <div style={isMobile ? classes.signUpMobileStyle : classes.signUpStyle}>Sign up</div>
            <div style={isMobile ? classes.subTitleMobileStyle : classes.subTitleStyle}>Please enter the following details to create account.</div>
            <Stack gap={'24px'} width={"100%"}>
                <GoMakeAutoComplate
                    options={countryList}
                    getOptionLabel={(option: any) => `${option.name}`}
                    onChange={(e, v) => onChange('country', v)}
                    value={state.country}
                    placeholder={t('signup.country')}
                    style={classes.dropDownList}
                />

                <GomakeTextInput
                    onChange={(e) => {
                        onChange('name', e.target.value)
                    }}
                    onBlur={(e) => { checkPrintHouseDomain(e.target.value) }}
                    style={classes.input}
                    placeholder={t('signup.companyName')}
                    value={state.name}
                    error={validateField('name', state.name)}
                />
                <Stack direction={'row'} alignItems={'center'} style={{ position: "relative" }}>
                    <GomakeTextInput onChange={(e) => onChange('domain', e.target.value)}
                        style={classes.input}
                        placeholder={t('signup.companyDomain')}
                        error={state.domain ? !domainRegex.test(state.domain) : false}
                        value={state.domain} />
                    <span style={{ position: "absolute", right: 8 }}>.gomake.net</span>
                </Stack>
                <GomakeTextInput onChange={(e) => onChange('fullName', e.target.value)}
                    style={classes.input}
                    placeholder={t('signup.fullName')}
                    value={state.fullName} />
                <GomakeTextInput onChange={(e) => onChange('email', e.target.value)}
                    style={classes.input}
                    placeholder={t('signup.email')}
                    error={state.email ? !emailRegex.test(state.email) : false}
                    value={state.email} />
                {renderPhone()}
                <GoMakeAutoComplate
                    options={languages}
                    getOptionLabel={(option: any) => `${option.label}`}
                    onChange={(e, v) => onChange('systemLanguage', v)}
                    value={state.systemLanguage}
                    placeholder={t('signup.defaultLanguage')}
                    style={classes.dropDownList}
                />
                <GoMakeAutoComplate
                    options={currencies}
                    getOptionLabel={(option: any) => `${option.label}`}
                    onChange={(e, v) => onChange('systemCurrency', v)}
                    value={state.systemCurrency}
                    placeholder={t('signup.defaultCurrency')}
                    style={classes.dropDownList}
                />
            </Stack>
            <PrimaryButton endIcon={loading && <CircularProgress style={{ width: '20px', height: '20px' }} />}
                onClick={onclickNext}
                style={classes.nextButton}
                disabled={loading}
                variant={'contained'}>
                {loading ? `${t('signup.create')} ${state.domain}` : t('signup.create')}
            </PrimaryButton>
        </Stack>
    )
}

export { SignupCompanyForm }