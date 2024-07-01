import { use, useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { createIssueApi, getAllIssuesApi } from "@/services/api-service/customer-service/customer-service-api";
import { useUserProfile } from "@/hooks/use-user-profile";

export type ticketTypeList = {
  label: string;
  value: string;
};
const useCustomerService = () => {
  const { callApi } = useGomakeAxios();
  const { profileState } = useUserProfile();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [AllIssues, setAllIssues] = useState([]);
  const [ticketType, setTicketType] = useState<ticketTypeList>();
  const [assignee, setAssignee] = useState<ticketTypeList>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const ticketTypeList: ticketTypeList[] = [
    { label: "Bug", value: "10005" },
    { label: "New Feature", value: "10004" },
    { label: "Support", value: "10083" },
  ];
  const assigneeList: ticketTypeList[] = [
    { label: "Ahmed Shehab", value: "11111" },
    { label: "Mohand", value: "2222" },
  ];
  const getIssues = useCallback(async () => {
    const callBack = (res) => {
      if (res.success) {
        console.log("issues2", res.data);
        const formattedData = res.data.map((item) => [
          item?.summary,
          item?.description.content[0].content[0].text,
          item?.issuetype.name,
          item?.reporterName,
          item?.created ? new Date(item.created).toLocaleDateString() : "N/A",
        ]);
        setAllIssues(formattedData);
      }
    };
    await getAllIssuesApi(callApi, callBack).then();
  }, [callApi]);

  const createIssue = async () => {
    const issueData = {
      fields: {
        project: { key: "GCS" },
        summary: title,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  text: description,
                  type: "text",
                },
              ],
            },
          ],
        },
        issuetype: {
          id: ticketType?.value || "10004",
        },
        priority: {
          id: "3",
        },
        customfield_10089: profileState.firstName + " " + profileState.lastName,
      },
    };

    const callBack = (res) => {
      if (res.success) {
        getIssues();
        onClickClosModal();
      } else {
        console.error("Failed to create issue", res);
      }
    };

    await createIssueApi(callApi, callBack, issueData);
  };

  useEffect(() => {
    getIssues();
  }, []);

  const tableHeaders = ["title", "description", "issue type", "reporter name", "created at"];

  const onClickClosModal = () => {
    setTicketType(null);
    setAssignee(null);
    setTitle("");
    setDescription("");
    setOpenModal(false);
  };
  const onClickOpenModal = (transaction) => {
    setOpenModal(true);
  };
  return {
    tableHeaders,
    // rowsMockData,
    AllIssues,
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
    onClickOpenModal,
    createIssue,
  };
};

export { useCustomerService };
