import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { PdfUploadComponent } from '../upload-file/upload-file';
import { EditorTYPE } from '../../enums/enum';
import { languageTemplateState, smsBodyState, smsSubjectState, smsTemplateState } from '@/widgets/settings-mailing/states/state';
import { ISMSTemplate } from '../../interfaces/interface';
import { mailInputs, mailInputs1, mailInputs2, mailInputs3 } from './inputs';
import { FormInput } from '@/components/form-inputs/form-input';
import { IInput } from '@/components/form-inputs/interfaces';
import { Stack } from '@mui/material';
import { QuillEditor } from './quill-editor';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { languagesState } from "@/store/languages";
import { GoMakeAutoComplate } from "@/components";
import { useMessageTemplate } from "@/widgets/settings-mailing/useMessageTemplate";
import { userProfileState } from "@/store/user-profile";
import { useEffect } from "react";
import { getSMSTemplateApi } from "@/services/api-service/mailing/mailing-api";
import { useGomakeAxios } from "@/hooks";

export interface IProps {
    onClickSave: (value: any) => void;
}
const EmailSettings = ({ onClickSave }: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { onOpenDeleteModal } = useMessageTemplate();
    const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
    const [subject, setSubject] = useRecoilState<string>(smsSubjectState);
    const [body, setBody] = useRecoilState<string>(smsBodyState);
    const languages = useRecoilValue(languagesState);
    const setLanguageState = useSetRecoilState<string>(languageTemplateState);
    const stateLang = useRecoilValue(userProfileState);
    const { callApi } = useGomakeAxios();
    useEffect(() => {
        let systemLang = stateLang?.systemLang
        if (systemLang) {
            setState({ ...state, lang: systemLang })
            onClickYes(systemLang)
        }

    }, [stateLang,])

    const onClickYes = async (languageState) => {
        await getSmsTemplateById(state?.id, languageState);
    };
    const getSmsTemplateById = async (id, language = null) => {
        const callBack = (res) => {
            if (res.success) {
                setState(res.data);
                setBody(res.data?.text);
                setSubject(res.data?.title);
            }
        }
        await getSMSTemplateApi(callApi, callBack, { templateId: id, lang: language })
    }


    const handleUpdateClick = () => {
        const updatedTemplate = {
            ...state,
            title: subject,
            text: body,
        };
        onClickSave(updatedTemplate);
    };

    const handleResetClick = () => {
        setSubject(null);
        setBody(null);
    };

    const onChangeInputs = (key, value) => {
        setState({ ...state, [key]: value })
    }

    const onChangeLanguage = (e: any, value: { value: string; text: string; }) => {
        onOpenDeleteModal();
        setLanguageState(value?.value);
    };

    return (
        <div style={classes.containerStyle}>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t("mailingSettings.language")}</h3>
                <GoMakeAutoComplate
                    options={languages.map(({ text, value }) => ({ ...languages, label: text, value }))}
                    onChange={(e: any, value: any) => onChangeLanguage(e, value)}
                    style={classes.dropDownListStyle}
                    value={!!state.lang ? languages.find((lang) => lang.value === state?.lang)?.text : ''}
                    disableClearable={true}
                    placeholder={t("mailingSettings.selectLanguage")} />
            </div>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t("mailingSettings.subject")}</h3>
                <QuillEditor headerEditor={EditorTYPE.SUBJECT} ></QuillEditor>
            </div>
            <div style={classes.subSection} key={body}>
                <h3 style={classes.subSectionHeader} >{t("mailingSettings.body")}</h3>
                <QuillEditor headerEditor={EditorTYPE.BODY} ></QuillEditor>
            </div>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t("mailingSettings.attachment")}</h3>
                <PdfUploadComponent onUpload={true} fileName={state?.attachment}></PdfUploadComponent>
            </div>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t("mailingSettings.mails")}</h3>
                {state?.isMailToPrintHouse ?
                    <Stack direction={'column'} gap={"12px"} alignItems={"flex-start"}>
                        {
                            mailInputs(state).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                        }
                    </Stack>
                    :
                    <Stack direction={'column'} gap={"18px"}>
                        <Stack direction={'row'} width={"180px"} alignItems={"flex-start"} >
                            {
                                mailInputs1(state).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                            }
                        </Stack>
                        <Stack direction={'row'} gap={"12px"} alignItems={"flex-start"} >
                            {
                                mailInputs2(state).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                            }
                        </Stack>
                        <Stack direction={'column'} gap={"8px"} alignItems={"center"} width={"68%"}>
                            {
                                mailInputs3(state).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                            }
                        </Stack>
                    </Stack>}
            </div>
            <div style={classes.footerStyle} >
                <SecondaryButton onClick={handleResetClick} variant={"outlined"}>{t("mailingSettings.reset")}</SecondaryButton>
                <SecondaryButton onClick={handleUpdateClick} variant={"contained"}>{t("mailingSettings.save")}</SecondaryButton>
            </div>
        </div>
    );
};

export { EmailSettings };