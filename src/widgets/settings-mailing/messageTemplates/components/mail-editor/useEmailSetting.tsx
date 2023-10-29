import { useState } from "react";
import { useRecoilState } from "recoil";
import { Stack } from "@mui/material";
import { smsTemplateState } from "@/widgets/settings-mailing/states/state";
import { useMessageTemplate } from "@/widgets/settings-mailing/useMessageTemplate";
import { useStyle } from "./style";
import { ISMSTemplate } from "../../interfaces/interface";

const useEmailSetting = () => {
  const { classes } = useStyle();
  const { templateVariables } = useMessageTemplate();
  const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
  const [value, setValue] = useState([]);


  // title or subject
  // const handleSubjectOptionClick = (option) => {
  //   const newText = state?.title?.endsWith('<p><br></p>') ? state?.title?.slice(0, -8) : state?.title?.slice(0, -4);
  //   option.value && setState({ ...state, title :  (state?.title ? newText + " {{" + option.label + "}} </p>" : "<p>{{" + option.label + "}} </p>")});
  // };

  const handleSubjectOptionClick = (option) => {
   // const newText = state?.title?.endsWith('<p><br></p>') ? state?.title?.slice(0, -8) : state?.title?.slice(0, -4);
    option.value && setState({ ...state, title :  (state?.title + " {{" + option.label + "}}" ) });
  };

  // text or body
  const handleBodyOptionClick = (option) => {
    const newText = state?.text?.endsWith('<p><br></p>') ? state?.text?.slice(0, -8) : state?.text?.slice(0, -4);
    option.value && setState({ ...state, text :  (state?.text ? newText + " {{" + option.label + "}} </p>" : "<p>{{" + option.label + "}} </p>")});
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