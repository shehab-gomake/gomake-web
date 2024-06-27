import { useState } from "react";

export type ticketTypeList = {
  label: string,
  value: string
}
const useCustomerService = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ticketType, setTicketType] = useState<ticketTypeList>()
  const [assignee, setAssignee] = useState<ticketTypeList>()
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const ticketTypeList: ticketTypeList[] = [{ label: "Bug", value: "bug" }, { label: "Task", value: "task" }]
  const assigneeList: ticketTypeList[] = [{ label: "Ahmed Shehab", value: "11111" }, { label: "Mohand", value: "2222" }]


  const tableHeaders = [
    "title",
    "description",
    "type",
    "reporter name",
    "status"
  ]
  const rowsMockData = [
    [
      "related documents",
      `1.The related documents are being used incorrectly.  for example : the order should always include a quote number in the related document. However, this is not currently happening because we are relying on the document that closes the document
      2.Adding a new related document does not work.
      `,
      "Bug",
      "Ahmad Shehab",
      "URGENT BUGS"
    ],
    [
      "ticketing sytem",
      <div>
        OVERVIEW
        ticketing system is used by the system users to create bugs / features for the system

        this tickets should be opened in the Jira and the users can track the bugs / features  for the system



        REQUIREMENTS
        in the header add new icon to move to the customer service page

        inside the customer page create table with these columns: title , description , type , reporter name , status

        add button above the table to create new ticket “ Add Ticket “ this button should open a modal to create new ticket

        the modal new to include these fields :

        type → select bug or feature

        title

        description
      </div>,
      "Task",
      "Ahmad Shehab",
      "In Progress"
    ],
  ]


  const onClickClosModal = () => {
    setTicketType(null)
    setAssignee(null)
    setTitle("")
    setDescription("")
    setOpenModal(false);
  };
  const onClickOpenModal = (transaction) => {
    setOpenModal(true);
  };
  return {
    tableHeaders,
    rowsMockData,
    openModal,
    ticketType,
    ticketTypeList,
    title,
    description,
    assigneeList,
    assignee,
    setAssignee,
    setDescription,
    setTitle,
    setTicketType,
    onClickClosModal,
    onClickOpenModal
  };
};

export { useCustomerService };
