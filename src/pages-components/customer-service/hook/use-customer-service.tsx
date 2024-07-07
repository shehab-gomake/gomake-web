import { use, useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import {
  createIssueApi,
  getAllIssuesApi,
  getAllPrintHousesApi,
  getAllIssuesAdminApi,
} from "@/services/api-service/customer-service/customer-service-api";
import { useUserProfile } from "@/hooks/use-user-profile";
import { JiraPrintHouse, TicketTypeList } from "../interface";
import { useTranslation } from "react-i18next";
import { ticketTypeList } from "../enums";

const useCustomerService = (isAdmin: boolean) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { profileState } = useUserProfile();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [AllIssues, setAllIssues] = useState([]);
  const [ticketType, setTicketType] = useState<TicketTypeList>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [printHouses, setPrintHouses] = useState<JiraPrintHouse[]>([]);
  const [selectedPrintHouseName, setSelectedPrintHouseName] = useState("");
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [statusKey, setStatusKey] = useState<string>("flag");
  const columnWidths = isAdmin
    ? ["10%", "10%", "10%", "40%", "10%", "10%", "10%"]
    : ["0%", "10%", "10%", "50%", "10%", "10%", "10%"];

  const getIssues = useCallback(async () => {
    const callBack = (res) => {
      if (res.success) {
        const formattedData = res.data.map((item) => [
          isAdmin ? item?.printHouseName : null,
          item?.created ? new Date(item.created).toLocaleDateString() : "N/A",
          item?.summary,
          item?.description?.content[0]?.content[0]?.text || "",
          t(item?.issuetype.name),
          item?.reporterName,
          t(item?.status),
        ]);
        setAllIssues(formattedData);
        const uniqueStatuses = Array.from(new Set(formattedData.map((issue) => issue[6])));
        setStatuses(uniqueStatuses);
      } else {
        setAllIssues([]);
      }
    };
    if (isAdmin) {
      // debugger;
      if (selectedPrintHouseName) {
        await getAllIssuesAdminApi(callApi, callBack, selectedPrintHouseName);
      } else {
        await getAllIssuesAdminApi(callApi, callBack, null);
      }
    } else {
      await getAllIssuesApi(callApi, callBack);
    }
  }, [callApi, isAdmin, selectedPrintHouseName]);

  const filterIssues = (issues, filter) => {
    const filtered = filter ? issues.filter((issue) => issue[6] === filter) : issues;
    setFilteredIssues(filtered);
  };

  const getAllPrintHouses = useCallback(async () => {
    const callBack = (res) => {
      if (res.success && res.data) {
        setPrintHouses(res.data);
      } else {
        console.error("Failed to fetch print houses or no data found", res);
      }
    };
    await getAllPrintHousesApi(callApi, callBack);
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
    if (isAdmin) {
      getAllPrintHouses();
    }
  }, []);

  const onChangePrintHouse = useCallback((e, value) => {
    setSelectedPrintHouseName(value?.name);
    setStatuses([]);
    setStatusFilter(null);
  }, []);

  const onChangeStatus = useCallback((e, value) => {
    setStatusFilter(value?.id || null);
  }, []);

  useEffect(() => {
    filterIssues(AllIssues, statusFilter);
  }, [statusFilter, AllIssues]);

  const tableHeaders = [
    isAdmin ? t("printHouses") : null,
    t("customerService.CreatedAt"),
    t("customerService.title"),
    t("customerService.description"),
    t("customerService.issueType"),
    t("customerService.reporterName"),
    t("customerService.status"),
  ];

  const onClickClosModal = () => {
    setTicketType(null);
    setTitle("");
    setDescription("");
    setOpenModal(false);
  };
  const onClickOpenModal = (transaction) => {
    setOpenModal(true);
  };

  const handleClean = useCallback(() => {
    setSelectedPrintHouseName(null);
    setStatusFilter(null);
    setStatusKey("flag2");
  }, []);

  useEffect(() => {
    getIssues();
  }, [getIssues]);

  useEffect(() => {
    if (isAdmin) {
      getAllPrintHouses();
    }
  }, [isAdmin, getAllPrintHouses]);
  return {
    tableHeaders,
    AllIssues,
    handleClean,
    statusKey,
    openModal,
    ticketType,
    ticketTypeList,
    title,
    description,
    setDescription,
    setTitle,
    setTicketType,
    onClickClosModal,
    onClickOpenModal,
    createIssue,
    onChangePrintHouse,
    printHouses,
    selectedPrintHouseName,
    getIssues,
    setSelectedPrintHouseName,
    statuses,
    onChangeStatus,
    statusFilter,
    filteredIssues,
    columnWidths,
  };
};

export { useCustomerService };
