import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { Stack } from "@mui/material";
import { toolBarInputs } from "./inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { documentState, textState } from "@/widgets/settings-mailing/states/state";

const useEmailSetting = () => {
  const { t } = useTranslation();

  const variables = [
    { label: t("mailingSettings.clientName"), id: " {{customerName}}" },
    { label: t("mailingSettings.phoneNumber"), id: "{{phone}}" },
    { label: t("mailingSettings.email"), id: "{{mail}}" },
    { label: t("mailingSettings.orderNumber"), id: "{{orderNum}}" },
    { label: t("mailingSettings.orderNote"), id: "{{orderNotes}}" },
    { label: t("mailingSettings.approveLink"), id: "{{approveLink}}" },
    { label: t("mailingSettings.missionTitle"), id: "{{missionTitle}}" },
    { label: t("mailingSettings.missionStatus"), id: "{{missionStatus}}" },
    { label: t("mailingSettings.quoteNumber"), id: "{{quoteNum}}" },
    { label: t("mailingSettings.quoteLink"), id: "{{quoteLink}}" },
    { label: t("mailingSettings.firstWorkName"), id: "{{firstWorkName}}" },
    { label: t("mailingSettings.workName"), id: "{{workNames}}" },
  ];

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

  //const [text, setText] = useState("<p><b>GoMake</b> template</p>");
  //const [state, setState] = useState([]);
  // const handleInsertVariable = (e: any, value: any) => {
  //     const newText = text?.endsWith('<p><br></p>') ? text?.slice(0, -8) : text?.slice(0, -4);
  //     value &&  setText(text? newText + " " +value?.id + " </p>" : "<p>" + value?.id + " </p>");
  //     setValue(value?.label);
  // };

  const [text, setText]= useRecoilState<string>(textState);
  const [value, setValue] = useState([]);
  const [state, setState]= useRecoilState<any>(documentState);

    const onChangeInputs = (key, value) => {
        if (key == "variable") {
            const newText = text?.endsWith('<p><br></p>') ? text?.slice(0, -8) : text?.slice(0, -4);
            value && setText(text ? newText + " " + value + " </p>" : "<p>" + value + " </p>");
        }
        setState({ ...state, [key]: value })
    }
  
  return {
    variables,
    text,
    setText,
    value,
    setValue,
    state, setState, onChangeInputs , renderHeader
  };
};

export { useEmailSetting };