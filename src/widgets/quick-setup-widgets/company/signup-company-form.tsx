import {CircularProgress, Stack} from "@mui/material";
import {PrimaryButton} from "@/components/button/primary-button";
import {useCompanyForm} from "@/widgets/quick-setup-widgets/company/use-company-form";
import {useStyle} from "@/widgets/quick-setup-widgets/company/style";
import {useTranslation} from "react-i18next";
import {GoMakeAutoComplate, GomakeTextInput} from "@/components";
import {domainRegex} from "@/utils/regex";

const SignupCompanyForm = () => {
    const {state, onChange, currencies, languages, onclickNext, loading} = useCompanyForm();
    const {classes} = useStyle();
    const {t} = useTranslation();
    
    return (
        <Stack gap={'30px'} alignItems={'center'}>
            <h2 style={classes.header}>{t('signup.companyHeader')}</h2>
            <Stack gap={'24px'}>
                <GomakeTextInput onChange={(e) => onChange('name', e.target.value)}
                                 style={classes.input}
                                 placeholder={t('signup.companyName')}
                                 value={state.name}/>
                <Stack direction={'row'} alignItems={'flex-end'} width={400}>
                    <GomakeTextInput onChange={(e) => onChange('domain', e.target.value)}
                                     style={classes.input}
                                     placeholder={t('signup.companyDomain')}
                                     error={state.domain ? !domainRegex.test(state.domain) : false}
                                     value={state.domain}/>
                    <span>.gomake.net</span>
                </Stack>
                <GoMakeAutoComplate options={currencies}
                                    onChange={(e, v) => onChange('systemCurrency', v?.value)}
                                    value={state.systemCurrency}
                                    placeholder={t('signup.defaultCurrency')}/>
                <GoMakeAutoComplate options={languages}
                                    onChange={(e, v) => onChange('systemLanguage', v?.value)}
                                    value={state.systemLanguage}
                                    placeholder={t('signup.defaultLanguage')}/>
            </Stack>
            <PrimaryButton endIcon={loading && <CircularProgress style={{width: '20px', height: '20px'}}/>}
                           onClick={onclickNext}
                           style={classes.nextButton}
                           disabled={loading}
                           variant={'contained'}>
                {loading ? `${t('signup.creating')} ${state.domain}` : t('signup.next')}
            </PrimaryButton>
        </Stack>
    )
}

export {SignupCompanyForm}