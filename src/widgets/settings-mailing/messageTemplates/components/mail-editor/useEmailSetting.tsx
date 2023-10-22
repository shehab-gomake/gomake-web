import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { Stack } from "@mui/material";
import { smsTemplateState, textState } from "@/widgets/settings-mailing/states/state";
import { useStyle } from "./style";
import { toolBarInputs } from "./inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { PdfUploadComponent } from "../upload-file/upload-file";

const useEmailSetting = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();

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

  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { label: t("mailingSettings.clientName"), value: " {{customerName}}" },
    { label: t("mailingSettings.phoneNumber"), value: "{{phone}}" },
    { label: t("mailingSettings.email"), value: "{{mail}}" },
    { label: t("mailingSettings.orderNumber"), value: "{{orderNum}}" },
    { label: t("mailingSettings.orderNote"), value: "{{orderNotes}}" },
    { label: t("mailingSettings.approveLink"), value: "{{approveLink}}" },



  ];

  const handleOptionClick = (option) => {
    const newText = text1?.endsWith('<p><br></p>') ? text?.slice(0, -8) : text?.slice(0, -4);
    option.value && setText1(text1 ? newText + " " + option.value + " </p>" : "<p>" + option.value + " </p>");
  };

  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollLeft -= 50; // Adjust the scroll distance as needed
  };

  const scrollRight = () => {
    containerRef.current.scrollLeft += 50; // Adjust the scroll distance as needed
  };



  const [state, setState] = useRecoilState<any>(smsTemplateState);
  const renderHeader = () => {
    return (

      <span className="ql-formats"  >
        <Stack direction={'row'} gap={"2px"} >
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
          {toolBarInputs(state).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)}
          <PdfUploadComponent onUpload={(value) => alert(value)} ></PdfUploadComponent>
        </Stack>

        <div className="options-container" ref={containerRef}>
            <Stack className="options" direction={'row'} gap={'20px'} padding={'20px'} >
              <button onClick={scrollLeft}>&#9664;</button>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`option ${selectedOption === option ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
              <button onClick={scrollRight}>&#9654;</button>
            </Stack>
          </div>
        

      </span>
    );
  };

  const [text, setText] = useRecoilState<string>(textState);
  const [text1, setText1] = useState<string>(state?.body);


  const [value, setValue] = useState([]);
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
    text1, setText1, 
    value,
    setValue,
    state, setState, onChangeInputs, renderHeader
  };
};

export { useEmailSetting };