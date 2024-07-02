import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";

import { ticketTypeList, useCustomerService } from "./use-customer-service";
import { useStyle } from "./style";

const CustomerServicePageWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    tableHeaders,
    // rowsMockData,
    openModal,
    ticketType,
    ticketTypeList,
    title,
    description,
    assigneeList,
    AllIssues,
    assignee,
    setAssignee,
    setDescription,
    setTitle,
    setTicketType,
    onClickClosModal,
    onClickOpenModal,
    createIssue,
  } = useCustomerService();

  return (
    <div style={clasess.mainContainer}>
      <PrimaryTable
        stickyFirstCol={true}
        stickyHeader={true}
        columnWidths={["10%", "50%", "10%", "10%", "10%"]}
        rows={AllIssues}
        headers={tableHeaders}
      />
      <GomakePrimaryButton style={clasess.btnContainer} onClick={onClickOpenModal}>
        Add New Ticket
      </GomakePrimaryButton>
      <GoMakeModal
        insideStyle={clasess.insideStyle}
        openModal={openModal}
        onClose={onClickClosModal}
        modalTitle={"Add New Ticket"}
      >
        <div style={clasess.mainModalContainer}>
          <GoMakeAutoComplate
            options={ticketTypeList}
            style={{ height: "40px", width: "100%", border: "none" }}
            placeholder={"Choose the ticket type"}
            onChange={(e: any, item: ticketTypeList) => {
              setTicketType(item);
            }}
            value={ticketType}
          />
          {/* <GoMakeAutoComplate
            options={assigneeList}
            style={{ height: "40px", width: "100%", border: "none" }}
            placeholder={"Choose the Assignee"}
            onChange={(e: any, item: ticketTypeList) => {
              setAssignee(item);
            }}
            value={assignee}
          /> */}
          <GomakeTextInput
            onChange={(e) => setTitle(e.target.value)}
            style={{ height: "40px", width: "100%", border: "none" }}
            placeholder={"Type the ticket title"}
            value={title}
          />
          <GomakeTextInput
            onChange={(e) => setDescription(e.target.value)}
            style={clasess.multiTextInput}
            placeholder={"Type the ticket description"}
            value={description}
            multiline={true}
          />
          <GomakePrimaryButton style={clasess.btnContainer} onClick={createIssue}>
            Add Ticket
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </div>
  );
};

export { CustomerServicePageWidget };
