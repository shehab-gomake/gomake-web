import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  createIssueApi,
  getAllIssuesApi,
  getAllPrintHousesApi,
  getAllIssuesAdminApi,
} from "@/services/api-service/customer-service/customer-service-api";
import { useUserProfile } from "@/hooks/use-user-profile";
import { JiraIssueType, JiraPrintHouse } from "../interface";
import { useTranslation } from "react-i18next";
import { ticketTypeList } from "../enums";
import { logSessionData } from "@/utils/sessionManager";

const useCustomerService = (isAdmin: boolean) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { profileState } = useUserProfile();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [AllIssues, setAllIssues] = useState([]);
  const [printHouses, setPrintHouses] = useState<JiraPrintHouse[]>([]);
  const [selectedPrintHouseName, setSelectedPrintHouseName] = useState("");
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [ticketState, setTicketState] = useState<JiraIssueType>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const { alertFaultAdded, alertRequiredFields } = useSnackBar();
  const [createAnother, setCreateAnother] = useState(false);

  const handleCheckboxChange = () => {
    setCreateAnother(!createAnother);
  };

  const columnWidths = isAdmin
    ? ["10%", "10%", "10%", "40%", "10%", "10%", "10%"]
    : ["0%", "10%", "10%", "50%", "10%", "10%", "10%"];

  const onChangeInputs = useCallback((key, value) => {
    setTicketState((prevTicketState) => ({
      ...prevTicketState,
      [key]: value,
    }));
  }, []);

  // const handleSectionChange = (section: string, subSection: string) => {
  //   setTicketState({ ...ticketState, section, subSection });
  // };

  const handleSectionChange = useCallback(
    (section: string, subSection: string) => {
      setTicketState((prevTicketState) => ({
        ...prevTicketState,
        section,
        subSection,
      }));
    },
    []
  );

  const getIssues = useCallback(async () => {
    const callBack = (res) => {
      if (res.success) {
        const formattedData = res.data.map((item) => [
          isAdmin ? item?.printHouseName : null,
          item?.created ? new Date(item.created).toLocaleDateString() : "N/A",
          item?.summary,
          item?.description?.content[0]?.content[0]?.text || "",
          t(item?.issuetype.name),
          item?.issueNumber,
          item?.reporterName,
          t(item?.status),
        ]);
        setAllIssues(formattedData);

        const uniqueStatuses = Array.from(
          formattedData
            .reduce((map, item) => {
              const value = item[7];
              const label = t(item[7]);
              if (!map.has(value)) {
                map.set(value, { value, label });
              }
              return map;
            }, new Map())
            .values()
        );
        setStatuses(uniqueStatuses);
      } else {
        setAllIssues([]);
        setStatuses([]);
      }
    };
    if (isAdmin) {
      if (selectedPrintHouseName) {
        await getAllIssuesAdminApi(callApi, callBack, selectedPrintHouseName);
      } else {
        await getAllIssuesAdminApi(callApi, callBack, null);
      }
    } else {
      await getAllIssuesApi(callApi, callBack);
    }
  }, [callApi, isAdmin, selectedPrintHouseName]);

  const getAllPrintHouses = useCallback(async () => {
    const callBack = (res) => {
      if (res.success && res.data) {
        const formattedPrintHouses = res.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setPrintHouses(formattedPrintHouses);
      } else {
        console.error("Failed to fetch print houses or no data found", res);
      }
    };
    await getAllPrintHousesApi(callApi, callBack);
  }, [callApi]);

  const createIssue = async () => {
    if (!ticketState) {
      alertRequiredFields();
      return;
    }

    let issueData: any = {
      fields: {
        project: { key: "GCS" },
        summary: ticketState?.title,

        issuetype: {
          id: ticketState?.ticketType?.value || "10004",
        },
        priority: {
          id: "3",
        },
        customfield_10089: profileState.firstName + " " + profileState.lastName,
        customfield_10090: ticketState?.gomakeRouteUri,
        customfield_10092: ticketState?.section + "/" + ticketState?.subSection,
      },
    };

    if (ticketState?.description) {
      issueData.fields.description = {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: ticketState.description,
                type: "text",
              },
            ],
          },
        ],
      };
    }

    const callBack = (res) => {
      if (res.success) {
        getIssues();

        if (createAnother) {
          setTicketState({
            isAdmin: ticketState.isAdmin,
            openModal: ticketState.openModal,
            title: "",
            description: "",
            ticketType: undefined,
            ticketTypeList: [],
            screenShot: "",
            gomakeRouteUri: "",
            section: "",
            subSection: "",
          });
        } else {
          onClickClosModal();
        }
      } else {
        console.log("befor send ", ticketState);

        if (createAnother) {
          setTicketState({
            isAdmin: ticketState.isAdmin,
            openModal: ticketState.openModal,
            title: "",
            description: "",
            ticketType: undefined,
            ticketTypeList: [],
            screenShot: "",
            gomakeRouteUri: "",
            section: "",
            subSection: "",
          });
        } else {
          onClickClosModal();
        }

        alertFaultAdded();
      }
    };

    logSessionData();
    await createIssueApi(callApi, callBack, { issueData, fileBase64 });
  };

  const onChangePrintHouse = useCallback((e, value) => {
    setSelectedPrintHouseName(value?.label);
  }, []);

  const onChangeStatus = useCallback((e, value) => {
    setStatusFilter(value?.value || null);
  }, []);

  const filterIssues = useCallback(() => {
    let filtered = AllIssues;

    // Filter by selected print house
    if (selectedPrintHouseName) {
      filtered = filtered.filter(
        (issue) => issue[0] === selectedPrintHouseName
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((issue) => issue[7] === statusFilter);
    }

    // Sort issues so that "Done" is at the end
    const sortedIssues = filtered.sort((a, b) => {
      if (a[7] === "Done" && b[7] !== "Done") return 1;
      if (a[7] !== "Done" && b[7] === "Done") return -1;
      return 0;
    });

    setFilteredIssues(sortedIssues);
  }, [AllIssues, selectedPrintHouseName, statusFilter]);

  useEffect(() => {
    filterIssues();
  }, [AllIssues, selectedPrintHouseName, statusFilter]);

  const tableHeaders = [
    isAdmin ? t("customerService.printHouses") : null,
    t("customerService.CreatedAt"),
    t("customerService.title"),
    t("customerService.description"),
    t("customerService.issueType"),
    t("customerService.issueNumber"),
    t("customerService.reporterName"),
    t("customerService.status"),
    isAdmin ? "" : null,
  ];

  const onClickClosModal = () => {
    setFileBase64("");
    // setTicketState({ ...ticketState, ticketType: null, title: "", description: "" });
    setTicketState((prevTicketState) => ({
      ...prevTicketState,
      ticketType: null,
      title: "",
      description: "",
    }));
    setOpenModal(false);
  };
  const onClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleClean = useCallback(() => {
    setSelectedPrintHouseName(null);
    setStatusFilter(null);
  }, []);

  useEffect(() => {
    getIssues();
    if (isAdmin) {
      getAllPrintHouses();
    }
  }, []);

  return {
    tableHeaders,
    AllIssues,
    handleClean,
    openModal,
    ticketTypeList,
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
    onChangeInputs,
    ticketState,
    setTicketState,
    setFileBase64,
    handleSectionChange,
    createAnother,
    handleCheckboxChange,
  };
};

export { useCustomerService };
