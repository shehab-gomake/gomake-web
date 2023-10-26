import { Editor } from 'primereact/editor';
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import { useEmailSetting } from "./useEmailSetting";
import * as React from "react";
import { PdfUploadComponent } from '../upload-file/upload-file';
import { EditorTYPE } from '../../enums/enum';

export interface IProps {
    onClickSave: (value: any) => void;
}
const EmailSettings = ({ onClickSave }: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { subjectText, setSubjectText, bodyText, setBodyText , renderHeader  } = useEmailSetting();

    const handleResetClick = () => {
        setSubjectText(null);
        setBodyText(null);
    };

    return (
        <div className="card" style={classes.containerStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h5 style={classes.headerStyle}>{t("mailingSettings.subject")}</h5>
                <Editor value={subjectText} onChange={(e)=>setSubjectText(e.target.nodeValue)}  style={classes.editorStyle1} headerTemplate={renderHeader(EditorTYPE.SUBJECT)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h5 style={classes.headerStyle}>{t("mailingSettings.body")}</h5>
                <Editor value={bodyText} onChange={(e) => setBodyText(e.target.nodeValue)} style={classes.editorStyle2} headerTemplate={renderHeader(EditorTYPE.BODY)} /> 
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
                <h5 style={classes.headerStyle}>{t("mailingSettings.attachment")}</h5>
                <PdfUploadComponent onUpload={(value) => alert(value)} ></PdfUploadComponent>
            </div>
            <div style={{ display: "flex", alignSelf: "flex-end", gap: "10px" }}>
                <SecondaryButton onClick={onClickSave} variant={"contained"}>{t("mailingSettings.save")}</SecondaryButton>
                <SecondaryButton onClick={handleResetClick} variant={"outlined"}>{t("mailingSettings.reset")}</SecondaryButton>
            </div>
        </div>
    );
};

export { EmailSettings };