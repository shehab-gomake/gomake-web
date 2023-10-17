import { Editor } from 'primereact/editor';
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import { useEmailSetting } from "./useEmailSetting";
import * as React from "react";

export interface IProps {
    onClickSave: (value : any) => void;
}
const EmailSettings = ({onClickSave}: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { text , setText , setState , renderHeader} = useEmailSetting();

    const handleResetClick = () => {
        setText(null); 
        setState(null);
      };

    return (
        <div className="card" style={classes.containerStyle}>
            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '500px' }}  headerTemplate={renderHeader()} />
            <div style={{ display: "flex", alignSelf: "flex-end", gap: "10px" }}>
                <SecondaryButton onClick={onClickSave} variant={"contained"}>{t("mailingSettings.save")}</SecondaryButton>
                <SecondaryButton onClick={handleResetClick} variant={"outlined"}>{t("mailingSettings.reset")}</SecondaryButton>
            </div>
        </div>
    );
};

export { EmailSettings };