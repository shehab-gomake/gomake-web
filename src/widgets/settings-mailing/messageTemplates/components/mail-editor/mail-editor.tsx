import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { PdfUploadComponent } from "../upload-file/upload-file";
import { EditorTYPE } from "../../enums/enum";
import {
  languageTemplateState,
  smsBodyState,
  smsSubjectState,
  smsTemplateState,
} from "@/widgets/settings-mailing/states/state";
import { ISMSTemplate } from "../../interfaces/interface";
import { mailInputs, mailInputs1, mailInputs2, mailInputs3 } from "./inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { QuillEditor } from "./quill-editor";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { languageOptionsState, languagesState } from "@/store/languages";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton } from "@/components";
import { useMessageTemplate } from "@/widgets/settings-mailing/useMessageTemplate";
import { FONT_FAMILY } from "@/utils/font-family";
import { AddNewButton } from "@/components/button/add-new-button";
import { BodyTypeEnum } from "@/enums/accounting-enums";

export interface IProps {
  onClickSave: (value: any) => void;
}
const EmailSettings = ({ onClickSave }: IProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { onOpenDeleteModal } = useMessageTemplate();
  const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
  const [subject, setSubject] = useRecoilState<string>(smsSubjectState);
  const [body, setBody] = useRecoilState<string>(smsBodyState);
  // const languages = useRecoilValue(languagesState);
  const languages = useRecoilValue(languageOptionsState);

  const setLanguageState = useSetRecoilState<string>(languageTemplateState);
  const handleUpdateClick = () => {
    const updatedTemplate = {
      ...state,
      title: subject,
      text: body,
    };
    onClickSave(updatedTemplate);
  };

  const handleResetClick = () => {
    setSubject(null);
    setBody(null);
  };

  const onChangeInputs = (key, value) => {
    setState({ ...state, [key]: value });
  };

  const onChangeLanguage = (e: any, value: { value: string; text: string }) => {
    onOpenDeleteModal();
    setLanguageState(value?.value);
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleBodyTypeToggle = (type: BodyTypeEnum) => {
    setState((prevState) => {
      const isTypePresent = prevState.smsTemplateBodies.some(body => body.type === type);
      const updatedBodies = isTypePresent
        ? prevState.smsTemplateBodies.filter(body => body.type !== type)
        : [...prevState.smsTemplateBodies, { type, body: "" }];

      return {
        ...prevState,
        smsTemplateBodies: updatedBodies,
      };
    });
  };

  const handleSaveBodyTypes = () => {
    setIsModalOpen(false);
  };

  // Function to update body content for a specific type
  const handleBodyContentChange = (type: BodyTypeEnum, content: string) => {
    setState((prevState: ISMSTemplate) => ({
      ...prevState,
      smsTemplateBodies: prevState.smsTemplateBodies.map((body) =>
        body.type === type ? { ...body, body: content } : body
      ),
    }));
  };




  const handleAddNewButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


  return (
    <div style={classes.containerStyle}>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>
          {t("mailingSettings.language")}
        </h3>
        <GoMakeAutoComplate
          options={languages.map(({ text, value }) => ({
            ...languages,
            label: text,
            value,
          }))}
          onChange={(e: any, value: any) => onChangeLanguage(e, value)}
          style={classes.dropDownListStyle}
          value={
            !!state.lang
              ? languages.find((lang) => lang.value === state?.lang)?.text
              : ""
          }
          disableClearable={true}
          placeholder={t("mailingSettings.selectLanguage")}
        />
      </div>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>{t("mailingSettings.subject")}</h3>
        <QuillEditor value={subject} setValue={setSubject} />
      </div>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>{t("mailingSettings.body")}</h3>
        <QuillEditor value={body} setValue={setBody} />
      </div>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>
          {t("mailingSettings.specialBody")}
        </h3>
        <AddNewButton
          label={t("mailingSettings.specialBody")}
          onClick={handleAddNewButtonClick}
        />
        <GoMakeModal
          insideStyle={{ height: "fit-content" }}
          openModal={isModalOpen}
          onClose={handleModalClose}
        >
          <div>
            <h3>Select Body Types</h3>
            {Object.keys(BodyTypeEnum)
              .filter((key) => isNaN(Number(key)))  // Filter out numeric keys
              .map((key) => {
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      checked={state?.smsTemplateBodies?.some(body => body.type === BodyTypeEnum[key as keyof typeof BodyTypeEnum])}
                      onChange={() => handleBodyTypeToggle(BodyTypeEnum[key as keyof typeof BodyTypeEnum])}
                    />
                    <label>{key}</label>
                  </div>
                )
              })}
            <button onClick={handleSaveBodyTypes}>Save</button>
          </div>
        </GoMakeModal>
        {state?.smsTemplateBodies && state?.smsTemplateBodies.length > 0 && state?.smsTemplateBodies.map((body) => {
          return (
            <div key={body.type} style={classes.subSection}>
              <h3 style={classes.subSectionHeader}>
                {t(`mailingSettings.${BodyTypeEnum[body.type]?.toLowerCase()}Body`)}
              </h3>
              <QuillEditor
                value={body.body || ""}
                setValue={(content) => handleBodyContentChange(body.type, content)}
              />
            </div>
          )
        })}
        {/* {selectedBodyTypes.map((type) => (
          <div key={type} style={classes.subSection}>
            <h3 style={classes.subSectionHeader}>
              {t(`mailingSettings.${BodyTypeEnum[type].toLowerCase()}Body`)}
            </h3>
            <QuillEditor
              value={bodyContents[type] || ""}
              setValue={(content) => handleBodyContentChange(type, content)}
            />
          </div>
        ))} */}
      </div>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>
          {t("mailingSettings.attachment")}
        </h3>
        <PdfUploadComponent
          onUpload={true}
          fileName={state?.attachment}
        ></PdfUploadComponent>
      </div>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>{t("mailingSettings.mails")}</h3>
        {state?.isMailToPrintHouse ? (
          <Stack direction={"column"} gap={"12px"} alignItems={"flex-start"}>
            {mailInputs(state).map((item) => (
              <FormInput
                input={item as IInput}
                changeState={onChangeInputs}
                error={false}
                readonly={false}
              />
            ))}
          </Stack>
        ) : (
          <Stack direction={"column"} gap={"18px"}>
            <Stack direction={"column"} gap={"5px"}>
              <Stack direction={"row"} width={"180px"} alignItems={"flex-start"}>
                {mailInputs1(state).map((item) => (
                  <FormInput
                    input={item as IInput}
                    changeState={onChangeInputs}
                    error={false}
                    readonly={false}
                  />

                ))}

              </Stack>
              <div
                style={{
                  marginTop: "10px",
                  padding: "0px 5px",
                  ...FONT_FAMILY.Inter(600, 13),
                  color: state.isSendGridVerificated
                    ? "green"
                    : "red",
                }}
              >
                {state.isSendGridVerificated
                  ? t("usersSettings.emailVerified")
                  : t("usersSettings.emailNotVerified")}
              </div>
            </Stack>
            <Stack direction={"row"} gap={"12px"} alignItems={"flex-start"}>
              {mailInputs2(state).map((item) => (
                <FormInput
                  input={item as IInput}
                  changeState={onChangeInputs}
                  error={false}
                  readonly={false}
                />
              ))}
            </Stack>
            <Stack
              direction={"column"}
              gap={"8px"}
              alignItems={"center"}
              width={"68%"}
            >
              {mailInputs3(state).map((item) => (
                <FormInput
                  input={item as IInput}
                  changeState={onChangeInputs}
                  error={false}
                  readonly={false}
                />
              ))}
            </Stack>
          </Stack>
        )}
      </div>
      <div style={classes.footerStyle}>
        <SecondaryButton
          style={{ width: "fit-content" }}
          onClick={handleResetClick}
          variant={"outlined"}
        >
          {t("mailingSettings.reset")}
        </SecondaryButton>
        <SecondaryButton
          style={{ width: "fit-content" }}
          onClick={handleUpdateClick}
          variant={"contained"}
        >
          {t("mailingSettings.save")}
        </SecondaryButton>
      </div>
    </div>
  );
};

export { EmailSettings };
