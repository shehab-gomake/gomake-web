import { useState } from "react";
import { useRecoilState } from "recoil";
import { Stack } from "@mui/material";
import { smsBodyState, smsSubjectState, smsTemplateState } from "@/widgets/settings-mailing/states/state";
import { useMessageTemplate } from "@/widgets/settings-mailing/useMessageTemplate";
import { useStyle } from "./style";
import { ISMSTemplate } from "../../interfaces/interface";

const useEmailSetting = () => {
  const { classes } = useStyle();
  const { templateVariables } = useMessageTemplate();
  const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
  const [value, setValue] = useState([]);
  const [subject, setSubject] = useRecoilState<string>(smsSubjectState);
  const [body, setBody] = useRecoilState<string>(smsBodyState);

  // title or subject
  const handleSubjectOptionClick = (option) => {
    if (state && state.title) {
    //  let newTitle = state.title;
      let newTitle = subject;

      if (newTitle.endsWith('<p><br></p>')) {
        newTitle = newTitle.slice(0, -12); // Remove the entire string
        newTitle += '<br><p>';
      } else if (newTitle.endsWith('<p></p>')) {
        newTitle = newTitle.slice(0, -8); // Remove the last "<p></p>"
      } else {
        newTitle = newTitle.slice(0, -4);
      }
      if (option.value) {
        newTitle += ` {{${option.label}}}</p>`;
      }

      setSubject (newTitle);
      setState({ ...state, title: newTitle });
    }
  };

  // text or body
  const handleBodyOptionClick = (option) => {
    if (state && state.text) {
      //let newText = state.text;
      let newText = body;

      if (newText.endsWith('<p><br></p>')) {
        newText = newText.slice(0, -12); // Remove the entire string
        newText += '<br><p>';
      } else if (newText.endsWith('<p></p>')) {
        newText = newText.slice(0, -8); // Remove the last "<p></p>"
      } else {
        newText = newText.slice(0, -4);
      }
      if (option.value) {
        newText += ` {{${option.label}}}</p>`;
      }

      setBody(newText)
      setState({ ...state, text: newText });
    }
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
        <Stack display={"flex"} direction={'row'} gap={'8px'} className="scroll-container" >
          {templateVariables?.map((option) => (
            < button style={classes.variableStyle}
              key={option.value}
              onClick={() => flag ? handleBodyOptionClick(option) : handleSubjectOptionClick(option)}
            >
            {option.label}
            </button>
          ))}
        </Stack>
      </span>
    );
  };

  return {
    value,
    setValue,
    state,
    setState,
    renderHeader
  };
};

export { useEmailSetting };