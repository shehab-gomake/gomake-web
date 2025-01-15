import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { useStyle } from "../style";
import { CreateIssueModalProps } from "../interface";
import { useTranslation } from "react-i18next";
import { JiraImageUpload } from "./jira-Image-Upload";
import { SectionsList } from "./sections-list";
import { Stack } from "@mui/material";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { GoMakeTextInput } from "@/components/text-input/go-make-text-input";
import { PrimaryButton } from "@/components/button/primary-button";

//!here
const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  openModal,
  ticketTypeList,
  onClickClosModal,
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
  printHouses,
  onChangePrintHouse,
  selectedPrintHouse,
  isAdmin,
  onChangeInputs,
  createIssue,
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
        {isAdmin && (
          <GoMakeAutoComplate
            options={printHouses}
            style={classes.selectStyle}
            placeholder={t("customerService.selectPrintHouse")}
            key={`print-house-select-${selectedPrintHouse?.value || "null"}`}
            value={selectedPrintHouse || null}
            onChange={onChangePrintHouse}
            withArrow
          />
        )}
        <GoMakeTextInput
          key={"ticket-title"}
          onChange={(e) => onChangeInputs("title", e.target.value)}
          placeholder={t("customerService.typeTheTicketTitle")}
          value={ticketState?.title}
        />
        <SectionsList
          selectedSubSection={selectedSubSection}
          setSelectedSubSection={setSelectedSubSection}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          onChange={(val1, val2) => handleSectionChange(val1, val2)}
        />
        <GoMakeAutoComplate
          key={
            ticketState?.ticketType ? ticketState?.ticketType?.value : "reset"
          }
          options={ticketTypeList}
          style={classes.selectStyle}
          placeholder={t("customerService.chooseTheTicketType")}
          // onChange={(e, val) =>
          //   setTicketState({ ...ticketState, ticketType: val })
          // }
          onChange={(e, val) => onChangeInputs("ticketType", val)}
          value={ticketState?.ticketType || null}
          withArrow
        />
        <JiraImageUpload
          onUpload={true}
          onFileSelect={setFileBase64}
          ref={jiraImageUploadRef}
        />
        <GoMakeTextInput
          onChange={(e) => onChangeInputs("description", e.target.value)}
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
          <div
            style={{
              ...classes.inputLbl,
              color: createAnother ? "black" : "#a4a4a4",
            }}
          >
            <PrimaryCheckbox
              checked={createAnother}
              onChange={handleCheckboxChange}
            />
            {t("customerService.createAnother")}
          </div>
          <PrimaryButton
            variant="contained"
            style={classes.btnContainer}
            onClick={createIssue}
          >
            {t("customerService.addTicket")}
          </PrimaryButton>
        </Stack>
      </div>
    </GoMakeModal>
  );
};

export { CreateIssueModal };
