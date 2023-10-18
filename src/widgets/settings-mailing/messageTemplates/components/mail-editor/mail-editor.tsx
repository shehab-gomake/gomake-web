import { Editor } from 'primereact/editor';
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import { useEmailSetting } from "./useEmailSetting";
import * as React from "react";
import { useState } from 'react';

export interface IProps {
    onClickSave: (value : any) => void;
}
const EmailSettings = ({onClickSave}: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { text , setText , state, renderHeader} = useEmailSetting();
    const [text1, setText1] = useState<string>(state?.body);

    const handleResetClick = () => {
        setText(null); 
        setText1(null); 
      };
      const testHeader = () => {
        return (
            <span className="ql-formats" style={{borderColor:"red"}} >
                <select className="ql-header" data-pc-section="header"></select>
                <select className="ql-font" data-pc-section="font"></select>
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <select className="ql-color" data-pc-section="color"></select>
                <select className="ql-background" data-pc-section="background"></select>
                <select className="ql-align" data-pc-section="select"></select>
                <button className="ql-image" aria-label="Insert Image" data-pc-section="image"></button>
                <button className="ql-code-block ql-active" aria-label="Insert Code Block" data-pc-section="codeblock"></button>
            </span>
        );
      };

      const header = testHeader();

    return (
        
        <div className="card" style={classes.containerStyle}>
            <div style={{ display: "flex" , flexDirection :"column", gap: "10px"}}>
            <h5 style={classes.headerStyle}>{t("mailingSettings.subject")}</h5>
            <div style={classes.editorToolbarStyle} >
            <Editor  value={text} onTextChange={(e) => setText(e.htmlValue)}  style={classes.editorStyle1}  headerTemplate={header} />
            </div>
            </div>
            <div style={{ display: "flex" , flexDirection :"column", gap: "10px"}}>
            <h5 style={classes.headerStyle}>{t("mailingSettings.body")}</h5>
            <div style={classes.editorToolbarStyle} >
            <Editor  value={text1} onTextChange={(e) => setText1(e.htmlValue)}  style={classes.editorStyle2}  headerTemplate={testHeader()} />
            </div>            </div>
            <div style={{ display: "flex", alignSelf: "flex-end", gap: "10px" }}>
                <SecondaryButton onClick={onClickSave} variant={"contained"}>{t("mailingSettings.save")}</SecondaryButton>
                <SecondaryButton onClick={handleResetClick} variant={"outlined"}>{t("mailingSettings.reset")}</SecondaryButton>
            </div>
        </div>
    );
};

export { EmailSettings };