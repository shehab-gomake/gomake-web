import { Editor } from 'primereact/editor';
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/button/primary-button";
import { useEmailSetting } from "./useEmailSetting";
import * as React from "react";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { toolBarInputs } from './inputs';

const EmailSettings = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { text, setText , state, setState , onChangeInputs} = useEmailSetting();


    const renderHeader = () => {
        return (
            <div style={{ width: "100%" }}>
                <span className="ql-formats" >
                <Stack direction={'row'}  >
                    <select className="ql-header" data-pc-section="header"></select>
                    <select className="ql-font" data-pc-section="font"></select>
                    <button className="ql-bold" aria-label="Bold"></button>
                    <button className="ql-italic" aria-label="Italic"></button>
                    <button className="ql-underline" aria-label="Underline"></button>
                    <select className="ql-color" data-pc-section="color"></select>
                    <select className="ql-background" data-pc-section="background"></select>
                    <button className="ql-list" value="ordered"  aria-label="Ordered List" data-pc-section="list"></button>
                    <select className="ql-align" data-pc-section="select"></select>
                    <button className="ql-image" aria-label="Insert Image" data-pc-section="image"></button>
                    <button className="ql-code-block ql-active" aria-label="Insert Code Block" data-pc-section="codeblock"></button>


                    </Stack>
                    <Stack direction={'row'}  gap={"10px"}>
                        {
                            toolBarInputs(state).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                        }
                    </Stack>
                </span>
            </div>
        );
    };

    return (
        <div className="card" style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }}  headerTemplate={renderHeader()} />
            <div style={{ display: "flex", alignSelf: "flex-end", gap: "10px" }}>
                <SecondaryButton onClick={() => alert("hey")} variant={"contained"}>{t("mailingSettings.save")}</SecondaryButton>
                <SecondaryButton onClick={() => {setText(""); setState(null);}} variant={"outlined"}>{t("mailingSettings.reset")}</SecondaryButton>
            </div>
        </div>
    );
};

export { EmailSettings };

