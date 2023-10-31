import { useContext, useState } from "react";
import { useRecoilState } from "recoil";
import { IconButton, Stack } from "@mui/material";
import { smsBodyState, smsSubjectState, smsTemplateState } from "@/widgets/settings-mailing/states/state";
import { useMessageTemplate } from "@/widgets/settings-mailing/useMessageTemplate";
import { useStyle } from "./style";
import { ISMSTemplate } from "../../interfaces/interface";
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

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
      let newTitle = subject;
      if (newTitle.endsWith('<p><br></p>')) {
        newTitle = newTitle.slice(0, -12);
        newTitle += '<br><p>';
      } else if (newTitle.endsWith('<p></p>')) {
        newTitle = newTitle.slice(0, -8);
      } else {
        newTitle = newTitle.slice(0, -4);
      }
      if (option.value) {
        newTitle += ` {{${option.label}}}</p>`;
      }

      setSubject(newTitle);
      setState({ ...state, title: newTitle });
    }
  };

  // text or body
  const handleBodyOptionClick = (option) => {
    if (state && state.text) {
      let newText = body;
      if (newText.endsWith('<p><br></p>')) {
        newText = newText.slice(0, -12);
        newText += '<br><p>';
      } else if (newText.endsWith('<p></p>')) {
        newText = newText.slice(0, -8);
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
      <span className="ql-formats">
        <Stack direction={'row'} gap={"2px"}  >
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
        <div style={classes.variablesContainer}>
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} >
          {templateVariables?.map((option) => (
            <button style={classes.variableStyle}
              onClick={() => (flag ? handleBodyOptionClick(option) : handleSubjectOptionClick(option))}
            >
              {option?.label}
            </button>
          ))}
        </ScrollMenu>
        </div>
      </span>

    );
  };


  function LeftArrow() {
    const { scrollPrev } = useContext(VisibilityContext);
    return (
      <IconButton >
        <ArrowCircleLeftOutlinedIcon onClick={() => scrollPrev()} />
      </IconButton>

    );
  }

  function RightArrow() {
    const { scrollNext } = useContext(VisibilityContext);
    return (
      <IconButton >
        <ArrowCircleRightOutlinedIcon onClick={() => scrollNext()} />
      </IconButton>

    );
  }


  const renderHeaderr = (flag) => {
    return (
      <span className="ql-formats" style={{ width: "900px" }}>
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} >
          {templateVariables?.map((option) => (
            <button style={classes.variableStyle}
              onClick={() => (flag ? handleBodyOptionClick(option) : handleSubjectOptionClick(option))}
            >
              {option?.label}
            </button>
          ))}
        </ScrollMenu>

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