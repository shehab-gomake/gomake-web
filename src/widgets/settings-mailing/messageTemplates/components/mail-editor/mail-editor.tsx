import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { PdfUploadComponent } from '../upload-file/upload-file';
import { EditorTYPE } from '../../enums/enum';
import { smsBodyState, smsSubjectState, smsTemplateState } from '@/widgets/settings-mailing/states/state';
import { ISMSTemplate } from '../../interfaces/interface';
import { mailInputs1, mailInputs2, mailInputs3 } from './inputs';
import { FormInput } from '@/components/form-inputs/form-input';
import { IInput } from '@/components/form-inputs/interfaces';
import { Stack } from '@mui/material';
import { MyEditor } from './myEditor';
import { useRecoilState } from "recoil";

export interface IProps {
    onClickSave: (value: any) => void;
}
const EmailSettings = ({ onClickSave }: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
    const [subject, setSubject] = useRecoilState<string>(smsSubjectState);
    const [body, setBody] = useRecoilState<string>(smsBodyState);


    const handleUpdateClick = () => {
        const updatedTemplate = {
            ...state,
            title: subject,
            text: body,
        };
        onClickSave(updatedTemplate);
    };

    const handleResetClick = () => {
        setSubject("<p>hello</p");
        setBody("<p>bye</p");
    };

    const onChangeInputs = (key, value) => {
        setState({ ...state, [key]: value })
    }

    return (
        <div style={classes.containerStyle}>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t("mailingSettings.subject")}</h3>
                <MyEditor headerEditor={EditorTYPE.SUBJECT} ></MyEditor>
            </div>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader} >{t("mailingSettings.body")}</h3>
                <MyEditor headerEditor={EditorTYPE.BODY} ></MyEditor>
            </div>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t("mailingSettings.attachment")}</h3>
                <PdfUploadComponent onUpload={true} ></PdfUploadComponent>
            </div>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t("mailingSettings.mails")}</h3>
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
                </Stack>
            </div>
            <div style={classes.footerStyle} >
                <SecondaryButton onClick={handleResetClick} variant={"outlined"}>{t("mailingSettings.reset")}</SecondaryButton>
                <SecondaryButton onClick={handleUpdateClick} variant={"contained"}>{t("mailingSettings.save")}</SecondaryButton>
            </div>
        </div>
    );
};

export { EmailSettings };