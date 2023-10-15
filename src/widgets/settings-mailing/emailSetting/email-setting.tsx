import { useState } from "react";
import { Editor } from 'primereact/editor';
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/button/primary-button";


const EmailSettings = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [text, setText] = useState('<div>Hello World!</div><div><b>GoMake</b> template</div><div><br></div>');
   

    const renderHeader = () => {
        return (
            <div>
                <span className="ql-formats">
                    <select className="ql-header" data-pc-section="header"></select>
                    <select className="ql-font" data-pc-section="font"></select>
                    <button className="ql-bold" aria-label="Bold"></button>
                    <button className="ql-italic" aria-label="Italic"></button>
                    <button className="ql-underline" aria-label="Underline"></button>
                    <button onClick={customButtonHandler}>variable</button>

                </span>
            </div>
        );
    };
    const customButtonHandler = (e) => {
        setText(text ? text + "<span>{{Phone}}</span>" : "<div>{{Phone}}</div>");
    };

    const header = renderHeader();

    return (
        <div className="card" style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} headerTemplate={header}/>
            <div style={{ display: "flex", alignSelf: "flex-end", gap: "10px" }}>
                <SecondaryButton onClick={() => alert("hey")} variant={"contained"}>{t("mailingSettings.save")}</SecondaryButton>
                <PrimaryButton onClick={() => setText("")} variant={"contained"}>{t("mailingSettings.reset")}</PrimaryButton>
            </div>
        </div>
    );
};

export { EmailSettings };

