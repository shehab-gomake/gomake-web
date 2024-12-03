import { useCallback, useEffect, useRef, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  createIssueApi,
  getAllIssuesApi,
  getAllPrintHousesApi,
  getAllIssuesAdminApi,
} from "@/services/api-service/customer-service/customer-service-api";
import { useUserProfile } from "@/hooks/use-user-profile";
import { JiraIssueType, JiraPrintHouse, Sections } from "../interface";
import { useTranslation } from "react-i18next";
import { ticketTypeList } from "../enums";
import { logSessionData } from "@/utils/sessionManager";
import { useDebounce } from "use-debounce";

const useCustomerService = (isAdmin: boolean) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { profileState } = useUserProfile();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [AllIssues, setAllIssues] = useState([]);
  const [printHouses, setPrintHouses] = useState<JiraPrintHouse[]>([]);
  const [selectedPrintHouse, setSelectedPrintHouse] = useState<any>("");
  const [selectedModalPrintHouse, setSelectedModalPrintHouse] =
    useState<any>("");
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [ticketState, setTicketState] = useState<JiraIssueType>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const { alertFault, alertSuccessAdded, alertFaultAdded, alertFaultGetData } =
    useSnackBar();
  const [createAnother, setCreateAnother] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Sections | "">("");
  const [selectedSubSection, setSelectedSubSection] = useState<string>("");
  const jiraImageUploadRef = useRef<{ resetAttachment: () => void } | null>(
    null
  );
  const [patternSearch, setPatternSearch] = useState<string>("");
  const [debouncedPatternSearch] = useDebounce(patternSearch, 300);

  const handleCheckboxChange = () => {
    setCreateAnother(!createAnother);
  };

  const onChangePrintHouse = useCallback((e, value) => {
    setSelectedPrintHouse(value);
  }, []);

  const onChangeModalPrintHouse = useCallback((e, value) => {
    setSelectedModalPrintHouse(value);
  }, []);

  const columnWidths = isAdmin
    ? ["10%", "10%", "10%", "40%", "10%", "10%", "10%"]
    : ["0%", "10%", "10%", "50%", "10%", "10%", "10%"];

  const onChangeInputs = useCallback((key, value) => {
    setTicketState((prevTicketState) => ({
      ...prevTicketState,
      [key]: value,
    }));
  }, []);

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
          isAdmin
            ? printHouses.find((ph) => ph.domain === item?.printHouseName)
                ?.label ||
              (item?.printHouseName ?? null)
            : null,
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
      if (selectedPrintHouse) {
        await getAllIssuesAdminApi(
          callApi,
          callBack,
          selectedPrintHouse?.label
        );
      } else {
        await getAllIssuesAdminApi(callApi, callBack, null);
      }
    } else {
      await getAllIssuesApi(callApi, callBack);
    }
  }, [callApi, isAdmin, selectedPrintHouse, printHouses]);

  const getAllPrintHouses = useCallback(async () => {
    const callBack = (res) => {
      if (res.success && res.data) {
        const formattedPrintHouses = res.data.map((item) => ({
          value: item.id,
          label: item.name,
          domain: item?.domain,
        }));
        setPrintHouses(formattedPrintHouses);
      } else {
        alertFaultGetData();
      }
    };
    await getAllPrintHousesApi(callApi, callBack);
  }, [callApi]);

  const createIssue = async () => {
    if (isAdmin && !selectedPrintHouse && !selectedModalPrintHouse) {
      alertFault("customerService.selectPrintHouseAlert");
      return;
    }

    if (!ticketState?.ticketType) {
      alertFault("customerService.ticketTypeRequired");
      return;
    }

    if (!ticketState?.title) {
      alertFault("customerService.titleRequired");
      return;
    }

    if (!ticketState?.description) {
      alertFault("customerService.descriptionRequired");
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
        alertSuccessAdded();
        if (createAnother) {
          setFileBase64("");
          setSelectedSection("");
          setSelectedSubSection("");
          setSelectedModalPrintHouse("");
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
          jiraImageUploadRef.current?.resetAttachment();
        } else {
          onClickClosModal();
        }
      } else {
        alertFaultAdded();
      }
    };
    logSessionData();

    await createIssueApi(callApi, callBack, {
      issueData,
      fileBase64,
      ...(isAdmin && {
        printHouseDomain:
          selectedModalPrintHouse?.domain || selectedPrintHouse?.domain,
      }),
    });
  };

  const onChangeStatus = useCallback((e, value) => {
    setStatusFilter(value?.value || null);
  }, []);

  // const filterIssues = useCallback(() => {
  //   let filtered = AllIssues;

  //   // Filter by selected print house
  //   if (selectedPrintHouse) {
  //     filtered = filtered.filter(
  //       (issue) => issue[0] === selectedPrintHouse?.label
  //     );
  //   }

  //   // Filter by status
  //   if (statusFilter) {
  //     filtered = filtered.filter((issue) => issue[7] === statusFilter);
  //   }

  //   // Search input filter by title / description
  //   if (debouncedPatternSearch.trim()) {
  //     const lowercasedSearch = debouncedPatternSearch.toLowerCase();
  //     filtered = filtered.filter(
  //       (issue) =>
  //         issue[2]?.toLowerCase().includes(lowercasedSearch) ||
  //         issue[3]?.toLowerCase().includes(lowercasedSearch)
  //     );
  //   }

  //   // Sort issues so that "Done" is at the end
  //   const sortedIssues = filtered.sort((a, b) => {
  //     if (a[7] === "Done" && b[7] !== "Done") return 1;
  //     if (a[7] !== "Done" && b[7] === "Done") return -1;
  //     return 0;
  //   });

  //   setFilteredIssues(sortedIssues);
  // }, [AllIssues, selectedPrintHouse, statusFilter, debouncedPatternSearch]);

  const filterIssues = useCallback(() => {
    const lowercasedSearch = debouncedPatternSearch.trim().toLowerCase();

    const filtered = AllIssues.filter((issue) => {
      // Filter by selected print house
      if (selectedPrintHouse && issue[0] !== selectedPrintHouse?.label)
        return false;

      // Filter by status
      if (statusFilter && issue[7] !== statusFilter) return false;

      // Search input filter by title/description
      if (
        lowercasedSearch &&
        !issue[2]?.toLowerCase().includes(lowercasedSearch) &&
        !issue[3]?.toLowerCase().includes(lowercasedSearch)
      )
        return false;

      return true;
    }).sort((a, b) => {
      if (a[7] === "Done" && b[7] !== "Done") return 1;
      if (a[7] !== "Done" && b[7] === "Done") return -1;
      return 0;
    });

    setFilteredIssues(filtered);
  }, [AllIssues, selectedPrintHouse, statusFilter, debouncedPatternSearch]);

  useEffect(() => {
    filterIssues();
  }, [AllIssues, selectedPrintHouse, statusFilter, debouncedPatternSearch]);

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
    setSelectedSection("");
    setSelectedSubSection("");
    setSelectedModalPrintHouse("");
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
    setSelectedPrintHouse(null);
    setStatusFilter(null);
  }, []);

  // useEffect(() => {
  //   getIssues();
  //   if (isAdmin) {
  //     getAllPrintHouses();
  //   }
  // }, []);

  useEffect(() => {
    if (isAdmin) {
      getAllPrintHouses(); // Load printHouses first
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || printHouses.length > 0) {
      getIssues();
    }
  }, [isAdmin, printHouses, getIssues]);

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
    selectedPrintHouse,
    getIssues,
    setSelectedPrintHouse,
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

    selectedSubSection,
    setSelectedSubSection,
    selectedSection,
    setSelectedSection,
    jiraImageUploadRef,
    patternSearch,
    setPatternSearch,
    onChangeModalPrintHouse,
    selectedModalPrintHouse,
  };
};

export { useCustomerService };
