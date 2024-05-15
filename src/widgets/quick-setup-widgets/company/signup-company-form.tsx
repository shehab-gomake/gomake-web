import { CircularProgress, Stack } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { useCompanyForm } from "@/widgets/quick-setup-widgets/company/use-company-form";
import { useStyle } from "@/widgets/quick-setup-widgets/company/style";
import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { domainRegex, emailRegex } from "@/utils/regex";
import { PhoneInputComponent } from "@/components/form-inputs/phone-input";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const SignupCompanyForm = () => {
    const { state, onChange, onclickNext, loading, countryList } = useCompanyForm();
    const { classes } = useStyle();
    const { t } = useTranslation();
    const [isAvailable, setIsAvailable] = useState(false)
    const domainList = [
        "Account  1",
        "Account  2",
        "Account  3",
    ]

    console.log("state", state)

    return (
        <Stack gap={'30px'} alignItems={'center'}>
            <h2 style={classes.header}>{t('signup.companyHeader')}</h2>
            <Stack gap={'24px'}>
                <GomakeTextInput
                    onChange={(e) => {
                        onChange('name', e.target.value)
                        onChange('domain', e.target.value)
                    }}
                    onBlur={() => { setIsAvailable(true) }}
                    style={classes.input}
                    placeholder={t('signup.companyName')}
                    value={state.name} />
                <Stack direction={'row'} alignItems={'center'} width={400}>
                    <GomakeTextInput onChange={(e) => onChange('domain', e.target.value)}
                        style={classes.input}
                        placeholder={t('signup.companyDomain')}
                        error={state.domain ? !domainRegex.test(state.domain) : false}
                        value={state.domain} />
                    <span style={{ marginLeft: 5 }}>.gomake.net</span>
                </Stack>
                {
                    isAvailable &&
                    <Stack direction={'column'} alignItems={'center'} gap={"8px"} width={420}>
                        <span style={classes.msgTestStyle}>
                            <CloseIcon style={{ color: "red", width: 18, height: 18 }} /> {t('signup.errorDomain')}
                        </span>
                        {domainList.map((domain) => {
                            return (
                                <Stack direction={'row'} alignItems={'center'} gap={"5px"} style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        onChange('domain', domain)
                                        setIsAvailable(false)
                                    }} >
                                    <CheckIcon style={{ color: "green" }} />
                                    {domain}
                                </Stack>
                                // <div >{domain}</div>
                            )
                        })}
                    </Stack>
                }
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
                />
                <GoMakeAutoComplate
                    options={countryList}
                    getOptionLabel={(option: any) => `${option.name}`}
                    onChange={(e, v) => onChange('country', v)}
                    value={state.country}
                    placeholder={t('signup.country')} />
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