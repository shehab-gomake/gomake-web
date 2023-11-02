import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { IconButton, Stack } from "@mui/material";
import { smsBodyState, smsSubjectState, smsTemplateState } from "@/widgets/settings-mailing/states/state";
import { useMessageTemplate } from "@/widgets/settings-mailing/useMessageTemplate";
import { useStyle } from "./style";
import { ISMSTemplate } from "../../interfaces/interface";
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { LeftArrowIcon } from "@/components/icons/left-arrow-icon";
import { RightArrowIcon } from "@/components/icons/right-arrow-icon";
import { useTranslation } from "react-i18next";


const useEmailSetting = () => {
  const { classes } = useStyle();
  const { templateVariables } = useMessageTemplate();
  const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
  const [value, setValue] = useState([]);
  const [subject, setSubject] = useRecoilState<string>(smsSubjectState);
  const [body, setBody] = useRecoilState<string>(smsBodyState);
  const { t } = useTranslation();
  type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

  const dir: 'rtl' | 'ltr' = t('direction');
  const RTL = dir == 'rtl';



  const apiRef: { current: scrollVisibilityApiType } = useRef(null);
  useEffect(() => {
    if (RTL && apiRef.current?.scrollContainer.current)
      apiRef.current.scrollContainer.current.scrollLeft = 99999;
  }, [apiRef, RTL]);

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
        // newTitle += ` {{${option?.value}}}</p>`;
        newTitle += ` <span contenteditable="false" style="background-color: rgb(235, 236, 255);">${option.label}</span><span contenteditable="false" style="background-color: #FFFFFF;"> </span></p>`;
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
        newText += ` <span style="background-color: rgb(235, 236, 255);" contenteditable=false >${option.label}</span><span style="background-color: #FFFFFF;"> </span></p>`;
      }
      setBody(newText);
      setState({ ...state, text: newText });
    }
  };

  const renderHeader = (flag) => {
    return (
      <span className="ql-formats">
        <Stack direction={'row'} gap={"2px"} className="container">
          <select className={`ql-header ${dir == 'rtl' && 'ql-header-rtl'}`} data-pc-section="header" ></select>
          <select className={`ql-font ${dir == 'rtl' && 'ql-font-rtl'}`} data-pc-section="font" ></select>
          <button className="ql-bold" aria-label="Bold"></button>
          <button className="ql-italic" aria-label="Italic"></button>
          <button className="ql-underline" aria-label="Underline"></button>
          <select className="ql-color" data-pc-section="color"></select>
          <select className="ql-background" data-pc-section="background"></select>
          <select className="ql-align" data-pc-section="select"></select>
          <button className="ql-image" aria-label="Insert Image" data-pc-section="image"></button>
          <button className="ql-code-block ql-active" aria-label="Insert Code Block" data-pc-section="codeblock"></button>
        </Stack>
        <Stack direction={'column'} gap={"2px"} style={classes.variablesContainer}   >
          <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} apiRef={apiRef}
            RTL={RTL}>
            {templateVariables?.map((option) => (
              <button style={classes.variableStyle}
                onClick={() => (flag ? handleBodyOptionClick(option) : handleSubjectOptionClick(option))}
              >
                {option?.label}
              </button>
            ))}
          </ScrollMenu>
        </Stack>
      </span>
    );
  };

  function LeftArrow() {
    const { scrollPrev } = useContext(VisibilityContext);
    return (
      <IconButton onClick={() => (scrollPrev())} style={{ display: "flex" }} >
        {RTL ? <RightArrowIcon /> : <LeftArrowIcon />}
      </IconButton>
    );
  }



  function RightArrow() {
    const { scrollNext } = useContext(VisibilityContext);
    return (
      <IconButton onClick={() => (scrollNext())} style={{ display: "flex" }}>
        {RTL ? <LeftArrowIcon /> : <RightArrowIcon />}
      </IconButton>
    );
  }



  return {
    value,
    setValue,
    state,
    setState,
    renderHeader
  };
};

export { useEmailSetting };