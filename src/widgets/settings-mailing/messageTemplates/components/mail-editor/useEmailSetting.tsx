import { useState } from "react";
import { useRecoilState } from "recoil";
import { Stack } from "@mui/material";
import { smsTemplateState, subjectTextState } from "@/widgets/settings-mailing/states/state";
import { useMessageTemplate } from "@/widgets/settings-mailing/useMessageTemplate";
import { useStyle } from "./style";

const useEmailSetting = () => {
  const { classes } = useStyle();
  const { templateVariables } = useMessageTemplate();
  const [state, setState] = useRecoilState<any>(smsTemplateState);
  const [subjectText, setSubjectText] = useRecoilState<string>(subjectTextState);
  const [bodyText, setBodyText] = useState<string>(state?.text);
  const [value, setValue] = useState([]);

  const handleSubjectOptionClick = (option) => {
    const newText = subjectText?.endsWith('<p><br></p>') ? subjectText?.slice(0, -8) : subjectText?.slice(0, -4);
    option.value && setSubjectText(subjectText ? newText + " {{" + option.label + "}} </p>" : "<p>{{" + option.label + "}} </p>");
  };

  const handleBodyOptionClick = (option) => {
    const newText = bodyText?.endsWith('<p><br></p>') ? bodyText?.slice(0, -8) : bodyText?.slice(0, -4);
    option.value && setBodyText(bodyText ? newText + " {{" + option.label + "}} </p>" : "<p>{{" + option.label + "}} </p>");

  };

  const renderHeader = (flag) => {
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
          {/* {toolBarInputs(state).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)}
          <PdfUploadComponent onUpload={(value) => alert(value)} ></PdfUploadComponent> */}
        </Stack>
        <div className="options-container" >
          <Stack display={"flex"} direction={'row'} gap={'8px'} padding={'20px'} >
            {templateVariables?.map((option) => (
              <div style={classes.variableStyle}
                key={option.value}
                onClick={() => flag ? handleBodyOptionClick(option) : handleSubjectOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </Stack>
        </div>

      </span>
    );
  };

  return {
    subjectText,
    setSubjectText,
    bodyText,
    setBodyText,
    value,
    setValue,
    state,
    setState,
    renderHeader
  };
};

export { useEmailSetting };