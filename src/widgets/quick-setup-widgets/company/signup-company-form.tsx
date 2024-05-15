import { CircularProgress, Stack } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { useCompanyForm } from "@/widgets/quick-setup-widgets/company/use-company-form";
import { useStyle } from "@/widgets/quick-setup-widgets/company/style";
import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { domainRegex, emailRegex } from "@/utils/regex";
import { PhoneInputComponent } from "@/components/form-inputs/phone-input";
import { NewLogo } from "@/icons";

const SignupCompanyForm = ({ isMobile }: any) => {
    const {
        state,
        onChange,
        onclickNext,
        loading,
        countryList,
        currencies,
        languages,
        setIsAvailable,
    } = useCompanyForm();
    const { classes } = useStyle();
    const { t } = useTranslation();


    return (
        <Stack gap={'12px'} alignItems={'flex-start'}>
            <NewLogo />
            <div style={isMobile ? classes.signUpMobileStyle : classes.signUpStyle}>Sign up</div>
            <div style={isMobile ? classes.subTitleMobileStyle : classes.subTitleStyle}>Please enter the following details to create account.</div>
            <Stack gap={'24px'} width={"100%"}>
                <GomakeTextInput
                    onChange={(e) => {
                        onChange('name', e.target.value)
                        onChange('domain', e.target.value)
                    }}
                    onBlur={() => { setIsAvailable(true) }}
                    style={classes.input}
                    placeholder={t('signup.companyName')}
                    value={state.name}
                />
                <Stack direction={'row'} alignItems={'center'} style={{ position: "relative" }}>
                    <GomakeTextInput onChange={(e) => onChange('domain', e.target.value)}
                        style={classes.input}
                        placeholder={t('signup.companyDomain')}
                        error={state.domain ? !domainRegex.test(state.domain) : false}
                        value={state.domain} />
                    <span style={{ position: "absolute", right: 8 }}>.gomake.net</span>
                </Stack>
                <div style={classes.noteStyle}>You can use letters, numbers & periods</div>
                {/* {
                    isAvailable &&
                    <Stack direction={'column'} alignItems={'flex-start'} gap={"8px"} style={classes.suggestionStyle}>
                        <span style={classes.msgTestStyle}>
                            <CloseIcon style={{ color: "red", width: 18, height: 18 }} /> {t('signup.errorDomain')}
                        </span>
                        {domainList.map((domain) => {
                            return (
                                <>
                                    <Stack style={classes.suggestionItemStyle}
                                        onClick={() => {
                                            onChange('domain', domain)
                                            setIsAvailable(false)
                                        }} >
                                        {domain}
                                        <div style={classes.selectSuggestionStyle}>select Suggestion</div>
                                    </Stack>
                                    <div style={classes.lineStyle} />
                                </>

                            )
                        })}
                    </Stack>
                } */}
                <GomakeTextInput onChange={(e) => onChange('fullName', e.target.value)}
                    style={classes.input}
                    placeholder={t('signup.fullName')}
                    value={state.fullName} />
                <GomakeTextInput onChange={(e) => onChange('email', e.target.value)}
                    style={classes.input}
                    placeholder={t('signup.email')}
                    error={state.email ? !emailRegex.test(state.email) : false}
                    value={state.email} />
                <PhoneInputComponent
                    onChange={(e) => onChange('phone', e)}
                    value={state.phone}
                    customStyle={classes.inputPhone}
                />
                <GoMakeAutoComplate
                    options={countryList}
                    getOptionLabel={(option: any) => `${option.name}`}
                    onChange={(e, v) => onChange('country', v)}
                    value={state.country}
                    placeholder={t('signup.country')}
                    style={classes.dropDownList}
                />

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
                {loading ? `${t('signup.creating')} ${state.domain}` : t('signup.create')}
            </PrimaryButton>
        </Stack>
    )
}

export { SignupCompanyForm }