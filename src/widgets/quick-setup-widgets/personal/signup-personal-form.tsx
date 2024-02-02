import {CircularProgress, Stack} from "@mui/material";
import {GomakeTextInput} from "@/components";
import {usePersonalForm} from "@/widgets/quick-setup-widgets/personal/use-personal-form";
import {useStyle} from "@/widgets/quick-setup-widgets/personal/style";
import {useTranslation} from "react-i18next";
import {PrimaryButton} from "@/components/button/primary-button";
import {PhoneInputComponent} from "@/components/form-inputs/phone-input";
import React from "react";

const SignupPersonalForm = () => {
    const {state, onChange, loading, onclickNext} = usePersonalForm();
    const {classes} = useStyle();
    const {t} = useTranslation();
    return (
        <Stack gap={'30px'} alignItems={'center'}>
            <h2 style={classes.header}>{t('signup.personalHeader')}</h2>
            <Stack gap={'24px'}>
                <Stack gap={'40px'} direction={'row'}>
                    <GomakeTextInput onChange={(e) => onChange('firstName', e.target.value)}
                                     style={classes.nameInput}
                                     placeholder={t('signup.firstName')}
                                     value={state.firstName}/>
                    <GomakeTextInput onChange={(e) => onChange('lastName', e.target.value)}
                                     style={classes.nameInput}
                                     placeholder={t('signup.lastName')}
                                     value={state.lastName}/>
                </Stack>
                <GomakeTextInput onChange={(e) => onChange('email', e.target.value)}
                                 style={classes.input}
                                 placeholder={t('signup.email')}
                                 value={state.email}/>
                <PhoneInputComponent
                    onChange={(e) => onChange('phone', e)}
                    value={state.phone}
                />
                <GomakeTextInput onChange={(e) => onChange('password', e.target.value)}
                                 style={classes.input}
                                 placeholder={t('signup.password')}
                                 type={'password'}
                                 value={state.password}/>
                <GomakeTextInput onChange={(e) => onChange('rePassword', e.target.value)}
                                 style={classes.input}
                                 placeholder={t('signup.rePassword')}
                                 type={'password'}
                                 value={state.rePassword}/>
            </Stack>
            <PrimaryButton endIcon={loading && <CircularProgress style={{width: '20px', height: '20px'}}/>}
                           style={classes.nextButton}
                           onClick={onclickNext}
                           disabled={loading}
                           variant={'contained'}>
                {t('signup.next')}
            </PrimaryButton>
        </Stack>
    )
}

export {SignupPersonalForm}