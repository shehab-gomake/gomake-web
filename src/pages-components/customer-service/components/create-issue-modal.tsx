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
import { Stack } from "@mui/material";
import axios from "axios";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";

//!here
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
  printHouses,
  onChangePrintHouse,
  selectedPrintHouse,
  isAdmin,
  onChangeInputs,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  const sendToMonday = async () => {
    try {
      const apiUrl = "https://api.monday.com/v2";
      const apiToken =
        "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0OTc3MDg4OSwiYWFpIjoxMSwidWlkIjo2ODU0NjEzNiwiaWFkIjoiMjAyNC0xMi0xOFQxOTo0MTowNS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjYzNTkxNzQsInJnbiI6ImV1YzEifQ.WEXTXHhRTtJS9XTAXvlyGG8zjSxgE-uIWuhtIluvR1o";
      const boardId = "1767002989";
      const groupId = "topics";

      let columnValues = {
        long_text: ticketState?.description,
      };

      let columnValuesString = JSON.stringify(columnValues).replace(
        /"/g,
        '\\"'
      );

      let mutation = `mutation { create_item (board_id: "${boardId}", group_id: "${groupId}", item_name: "${
        ticketState?.title || "New task"
      }", column_values: "${columnValuesString}") { id }}`;

      const response = await axios.post(
        apiUrl,
        { query: mutation },
        {
          headers: {
            Authorization: apiToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.errors) {
        console.error("Monday.com API errors:", response.data.errors);
      } else {
        if (!createAnother) onClickClosModal();
      }
    } catch (error) {
      console.error("Error sending request to Monday.com:", error);
    }
  };

  const handleCreateIssue = () => {
    sendToMonday();
    if (createAnother) {
      setTicketState({ title: "", description: "", ticketType: null });
    }
  };

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
            style={{ height: "40px", width: "100%", border: "none" }}
            placeholder={t("customerService.selectPrintHouse")}
            key={`print-house-select-${selectedPrintHouse?.value || "null"}`}
            value={selectedPrintHouse || null}
            onChange={onChangePrintHouse}
            withArrow
          />
        )}
        <SectionsList
          selectedSubSection={selectedSubSection}
          setSelectedSubSection={setSelectedSubSection}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          onChange={(val1, val2) => handleSectionChange(val1, val2)}
        />
        <GomakeTextInput
          key={"ticket-title"}
          onChange={(e) => onChangeInputs("title", e.target.value)}
          style={{ height: "40px", width: "100%", border: "none" }}
          placeholder={t("customerService.typeTheTicketTitle")}
          value={ticketState?.title}
        />
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
        <JiraImageUpload
          onUpload={true}
          onFileSelect={setFileBase64}
          ref={jiraImageUploadRef}
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
          <GomakePrimaryButton
            style={classes.btnContainer}
            onClick={handleCreateIssue}
          >
            {t("customerService.addTicket")}
          </GomakePrimaryButton>
        </Stack>
      </div>
    </GoMakeModal>
  );
};

export { CreateIssueModal };
