import { useEffect, useState } from "react";
import { Editor } from 'primereact/editor';
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeAutoComplate } from "@/components";
import { useEmailSetting } from "./useEmailSetting";


const EmailSettings = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const {variables , handleInsertVariable , value  , setValue , text , setText} = useEmailSetting();

    const renderHeader = () => {
        return (
            <div style={{width: "100%"}}>
                <span className="ql-formats" >
                    <select className="ql-header" data-pc-section="header"></select>
                    <select className="ql-font" data-pc-section="font"></select>
                    <button className="ql-bold" aria-label="Bold"></button>
                    <button className="ql-italic" aria-label="Italic"></button>
                    <button className="ql-underline" aria-label="Underline"></button>
                    <GoMakeAutoComplate
                                options={variables}
                                style={classes.dropDownListStyle}
                                placeholder={t("mailingSettings.variable")}
                                onChange={handleInsertVariable}
                                value={value}
                            />        
                </span>
            </div>
        );
    };
   

    const header = renderHeader();

    return (
        <div className="card" style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} headerTemplate={header} />
            <div style={{ display: "flex", alignSelf: "flex-end", gap: "10px" }}>
                <SecondaryButton onClick={() => alert("hey")} variant={"contained"}>{t("mailingSettings.save")}</SecondaryButton>
                <PrimaryButton onClick={() => {setText(""); setValue(null);} } variant={"contained"}>{t("mailingSettings.reset")}</PrimaryButton>
            </div>
        </div>
    );
};

export { EmailSettings };

