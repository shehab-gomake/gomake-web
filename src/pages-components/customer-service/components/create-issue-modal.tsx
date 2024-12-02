import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "../style";
import { CreateIssueModalProps } from "../interface";
import { useTranslation } from "react-i18next";
import { JiraImageUpload } from "./jira-Image-Upload";
import { SectionsList } from "./sections-list";
import { Checkbox, Stack } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { useRef } from "react";

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  openModal,
  ticketTypeList,
  onClickClosModal,
  createIssue,
  setTicketState,
  ticketState,
  setFileBase64,
  handleSectionChange,
  createAnother,
  handleCheckboxChange,

  selectedSubSection,
  setSelectedSubSection,
  selectedSection,
  setSelectedSection,
  jiraImageUploadRef,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <GoMakeModal
      insideStyle={classes.insideStyle}
      openModal={openModal}
      onClose={onClickClosModal}
      modalTitle={t("customerService.addNewTicket")}
      withRoundedCloseIcon={false}
    >
      <div style={classes.mainModalContainer}>
        <GoMakeAutoComplate
          key={
            ticketState?.ticketType ? ticketState?.ticketType?.value : "reset"
          }
          options={ticketTypeList}
          style={{ height: "40px", width: "100%", border: "none" }}
          placeholder={t("customerService.chooseTheTicketType")}
          onChange={(e, val) =>
            setTicketState({ ...ticketState, ticketType: val })
          }
          value={ticketState?.ticketType || null}
          withArrow
        />
        <SectionsList
          selectedSubSection={selectedSubSection}
          setSelectedSubSection={setSelectedSubSection}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          onChange={(val1, val2) => handleSectionChange(val1, val2)}
        />
        <JiraImageUpload
          onUpload={true}
          onFileSelect={setFileBase64}
          ref={jiraImageUploadRef}
        />
        <GomakeTextInput
          onChange={(e) =>
            setTicketState({ ...ticketState, title: e.target.value })
          }
          style={{ height: "40px", width: "100%", border: "none" }}
          placeholder={t("customerService.typeTheTicketTitle")}
          value={ticketState?.title}
        />
        <GomakeTextInput
          onChange={(e) =>
            setTicketState({ ...ticketState, description: e.target.value })
          }
          style={classes.multiTextInput}
          placeholder={t("customerService.typeTheTicketDescription")}
          value={ticketState?.description}
          multiline
        />

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <div style={classes.inputLbl}>
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              checked={createAnother}
              onChange={handleCheckboxChange}
            />
            {t("customerService.createAnother")}
          </div>
          <GomakePrimaryButton
            style={classes.btnContainer}
            onClick={createIssue}
          >
            {t("customerService.addTicket")}
          </GomakePrimaryButton>
        </Stack>
      </div>
    </GoMakeModal>
  );
};

export { CreateIssueModal };
