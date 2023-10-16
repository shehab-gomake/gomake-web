import { useState } from "react";
import { useTranslation } from "react-i18next";

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

  const [text, setText] = useState("<p><b>GoMake</b> template</p>");
  const [value, setValue] = useState([]);
  const handleInsertVariable = (e: any, value: any) => {
      const newText = text?.endsWith('<p><br></p>') ? text?.slice(0, -8) : text?.slice(0, -4);
      value &&  setText(text? newText + " " +value?.id + " </p>" : "<p>" + value?.id + " </p>");
      setValue(value?.label);
  };


  const [state, setState] = useState([]);
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
    handleInsertVariable,
    state, setState, onChangeInputs
  };
};

export { useEmailSetting };