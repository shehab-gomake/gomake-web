import { Editor } from 'primereact/editor';
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import { useEmailSetting } from "./useEmailSetting";
import * as React from "react";
import { useState } from 'react';
import { PdfUploadComponent } from '../upload-file/upload-file';
import { Select, Stack } from '@mui/material';

export interface IProps {
    onClickSave: (value: any) => void;
}
const EmailSettings = ({ onClickSave }: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { text, setText,  text1, setText1 , state, renderHeader } = useEmailSetting();

    const handleResetClick = () => {
        setText(null);
        setText1(null);
    };



    

    return (

        <div className="card" style={classes.containerStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h5 style={classes.headerStyle}>{t("mailingSettings.subject")}</h5>
                <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={classes.editorStyle1} headerTemplate={renderHeader()} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h5 style={classes.headerStyle}>{t("mailingSettings.body")}</h5>
                <Editor value={text1} onTextChange={(e) => setText1(e.htmlValue)} style={classes.editorStyle2} headerTemplate={renderHeader()} />
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