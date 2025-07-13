import { useCallback, useEffect, useRef, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAllPrintHousesApi } from "@/services/api-service/customer-service/customer-service-api";
import { JiraIssueType, JiraPrintHouse, Sections } from "../interface";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import config from "@/config";
import {
  createMondayTaskApi,
  getAllMondayIssuesApi,
} from "@/services/api-service/monday/monday-apis";
import { userProfileState } from "@/store/user-profile";

const useCustomerService = (isAdmin: boolean) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();

  const boardId = config.MONDAY_BOARD_ID;
  const groupId = config.TOPICS_GROUP_ID;

  const printHouseProfileState = useRecoilValue(printHouseProfile);
  const userProfile = useRecoilValue(userProfileState);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [AllIssues, setAllIssues] = useState([]);
  const [printHouses, setPrintHouses] = useState<JiraPrintHouse[]>([]);
  const [selectedPrintHouse, setSelectedPrintHouse] = useState<any>("");
  const [selectedModalPrintHouse, setSelectedModalPrintHouse] =
    useState<any>("");
  const [filteredIssues, setFilteredIssues] = useState([]);

  const [ticketState, setTicketState] = useState<JiraIssueType>(null);
  const [file, setFile] = useState<File | null>(null);
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
    : ["0%", "12%", "12%", "40%", "12%", "12%", "12%"];

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

  // const onChangeStatus = useCallback((e, value) => {
  //   setStatusFilter(value || null);
  // }, []);

  const statuses = [
    {
      label: t("customerService.workingOnIt"),
      value: "Working on it",
    },
    {
      label: t("customerService.waitingForResponse"),
      value: "Waiting for Response",
    },
    {
      label: t("customerService.underReviewWithRnD"),
      value: "Under Review with R&D",
    },
    {
      label: t("customerService.done"),
      value: "Done",
    },
    { label: t("customerService.backlog"), value: "Backlog" },
    { label: t("customerService.new"), value: "New" },
  ];

  const statusPriority: Record<string, number> = {
    New: 0,
    Backlog: 1,
    "Waiting for Response": 2,
    "Working on it": 3,
    "Under Review with R&D": 4,
    Done: 5,
  };

  const [statusFilters, setStatusFilters] = useState<string[]>(
    statuses.filter((s) => s.value !== "Done").map((s) => s.value)
  );

  const onToggleStatus = useCallback((id: string) => {
    setStatusFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const onToggleAllStatuses = useCallback(() => {
    const allIds = statuses.map((s) => s.value);

    const isAllSelected = allIds.every((id) => statusFilters.includes(id));
    setStatusFilters(isAllSelected ? [] : allIds);
  }, [statuses, statusFilters]);

  // const onChangeStatus = useCallback((e, values) => {
  //   setStatusFilters(values.map((v) => v.label));
  // }, []);

  const onChangeStatus = (updatedValues: string[]) => {
    setStatusFilters(updatedValues);
  };

  const filterIssues = useCallback(() => {
    const lowercasedSearch = debouncedPatternSearch.trim().toLowerCase();

    const filtered = AllIssues.filter((issue) => {
      // Filter by selected print house
      if (selectedPrintHouse && issue[0] !== selectedPrintHouse?.label)
        return false;

      // Filter by status
      const statusValue = statuses.find(
        (status) => status.label === issue[6]?.props?.children
      )?.value;

      if (statusFilters.length > 0 && !statusFilters.includes(statusValue)) {
        return false;
      }

      // Search input filter by title/description
      if (
        lowercasedSearch &&
        !issue[2]?.toLowerCase().includes(lowercasedSearch) &&
        !issue[3]?.toLowerCase().includes(lowercasedSearch)
      )
        return false;

      return true;
    });

    setFilteredIssues(filtered);
  }, [AllIssues, selectedPrintHouse, statusFilters, debouncedPatternSearch]);

  useEffect(() => {
    filterIssues();
  }, [AllIssues, selectedPrintHouse, statusFilters, debouncedPatternSearch]);

  const tableHeaders = [
    isAdmin ? t("customerService.printHouses") : null,
    t("customerService.CreatedAt"),
    t("customerService.title"),
    t("customerService.description"),
    t("customerService.issueType"),
    t("customerService.issueNumber"),
    t("customerService.status"),
    isAdmin ? "" : null,
  ];

  const statusColors = {
    Done: "green",
    "Working on it": "orange",
    "Waiting for Response": "orange",
    "Under Review with R&D": "orange",
  };

  const ticketTypeList = [
    {
      label: t("customerService.technicalSupport"),
      value: "Technical support",
    },
    {
      label: t("customerService.suggestImprovement"),
      value: "Suggest improvement",
    },
    {
      label: t("customerService.suggestNewFeature"),
      value: "Suggest a new feature",
    },
    { label: t("customerService.reportBug"), value: "Report a bug" },
    { label: t("customerService.otherQuestion"), value: "Other question" },
  ];

  const onClickClosModal = () => {
    setFile(null);
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
    const allIds = statuses.map((s) => s.value);
    const allExceptDone = allIds.filter((id) => id !== "Done");

    setSelectedPrintHouse(null);
    setStatusFilters(allExceptDone);
    // setStatusFilters([]);
  }, []);

  useEffect(() => {
    getAllPrintHouses();
  }, []);

  useEffect(() => {
    if (!isAdmin || printHouses.length > 0) {
      getIssues(); // Trigger getIssues only when printHouses are ready
    }
  }, [isAdmin, printHouses]);

  /* Monday Section */

  const sendToMonday = async () => {
    const domain = isAdmin
      ? selectedModalPrintHouse?.domain || selectedPrintHouse?.domain
      : printHouseProfileState?.domain;

    const formattedDomain =
      domain.startsWith("http://") || domain.startsWith("https://")
        ? domain
        : `https://${domain}`;

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
    let printHouseName =
      printHouses.find((ph) => ph.domain === domain)?.label ||
      (formattedDomain ?? null);
    if (printHouseName) {
      printHouseName = printHouseName.replaceAll('"', "'");
    }
    let columnValues = {
      long_text: ticketState?.description,
      status_11: ticketState?.ticketType?.value,
      email_mkm8782f: isAdmin ? ticketState?.reporter : userProfile?.email,
      link_mkm7eghn: {
        url: formattedDomain,
        text: printHouseName,
      },
    };
    if (columnValues.long_text) {
      columnValues.long_text = columnValues.long_text.replaceAll("\n", "\\n");
      columnValues.long_text = columnValues.long_text.replaceAll('"', "'");
    }
    let columnValuesString = JSON.stringify(columnValues).replace(/"/g, '\\"');

    const mutation = `mutation { create_item (board_id: "${boardId}", group_id: "${groupId}", item_name: "${
      ticketState?.title || "New task"
    }", column_values: "${columnValuesString}") { id }}`;

    const data = { query: mutation };
    const callBack = (res) => {
      if (res?.success) {
        const itemId = res?.data?.data?.create_item.id;
        if (file) {
          const fileName = file.name;
          const lambdaUrl =
            "https://kbbwamufjfte724rc4fcjopizi0jfwnw.lambda-url.eu-west-3.on.aws/";
          const reader = new FileReader();
          reader.onload = async () => {
            // Convert file to Base64
            const base64FileContent = reader.result?.toString().split(",")[1];
            const fileUploadPayload = {
              fileContent: base64FileContent,
              fileName: fileName,
              itemId: itemId,
            };

            try {
              const fileUploadResponse = await axios.post(
                lambdaUrl,
                fileUploadPayload,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (fileUploadResponse.data.errors) {
                console.error(
                  "File upload failed:",
                  fileUploadResponse.data.errors
                );
              }
            } catch (error) {
              console.error("An error occurred during the file upload:", error);
            }
          };

          reader.onerror = () => {
            console.error("Error reading file for Base64 conversion.");
            alertFaultAdded();
          };

          reader.readAsDataURL(file); // Convert file to Base64
        }

        getIssues();
        alertSuccessAdded();

        // Reset state and form if 'createAnother' is true
        if (createAnother) {
          setFile(null);
          setSelectedSection("");
          setSelectedSubSection("");
          setSelectedModalPrintHouse("");
          setTicketState({
            isAdmin: ticketState.isAdmin,
            openModal: ticketState.openModal,
            title: "",
            description: "",
            reporter: "",
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
    await createMondayTaskApi(callApi, callBack, data, false);
  };

  const getIssues = async () => {
    /*const query = `
    query {
      boards(ids: [${boardId}]) {
        name
        groups(ids: ["${groupId}"]) {
          id
          title
          items_page(limit: 100) {
            items {
              id
              name
              column_values {
                id
                text
                value
              }
            }
          }
        }
      }
    }
  `;*/
    let query = "";
    if (isAdmin) {
      query = `
        query { 
          boards (ids: ${boardId}) 
          { 
                items_page (limit: 500)
                 { 
                    cursor items { id name column_values { id text value
                  }
                }
              }
          }
        }
    `;
    } else {
      const sanitizedDomain = printHouseProfileState?.name.replace(/"/g, "'");
      const compareValueString = JSON.stringify([sanitizedDomain]);

      query = `
        query { 
          boards (ids: ${boardId}) 
          { 
                items_page (limit: 500, query_params: {
              rules: [
          {
            column_id: "link_mkm7eghn",
            compare_value: ${compareValueString}
          }
        ],
                    operator: and
                })
                 { 
                    cursor items { id name column_values { id text value
                  }
                }
              }
          }
        }
    `;
    }
    const data = { query };
    const callBack = (res) => {
      if (res?.success) {
        const issues = res.data.data.boards[0]?.items_page.items || [];

        const formattedData = issues.map(({ name, id, column_values }) => {
          const columnData =
            column_values?.reduce((acc, { id, text, value }) => {
              if (id === "status_11") acc.status_11 = text;
              if (id === "status") acc.status = text;
              if (id === "creation_log") acc.creation_log = text;
              if (id === "long_text") acc.long_text = text;
              if (id === "link_mkm7eghn") {
                const parsedValue = value ? JSON.parse(value) : {};
                acc.link_mkm7eghn = parsedValue?.url
                  ? parsedValue.url
                      .replace(/^https?:\/\//, "")
                      .replace(/\/$/, "")
                  : "";
              }
              return acc;
            }, {}) || {};

          const matchingStatus =
            statuses.find((status) => status.value === columnData.status)
              ?.label || null;

          const matchingStatusVal =
            statuses.find((status) => status.value === columnData.status)
              ?.value || null;

          const statusColor = statusColors[matchingStatusVal] || "inherit";

          const matchingType =
            ticketTypeList.find((type) => type.value === columnData.status_11)
              ?.label || null;

          return [
            isAdmin
              ? printHouses.find(
                  (ph) => ph.domain === columnData?.link_mkm7eghn
                )?.label ||
                (columnData?.link_mkm7eghn ?? null)
              : columnData?.link_mkm7eghn,

            columnData.creation_log
              ? new Date(columnData.creation_log).toLocaleDateString()
              : "N/A",
            name,
            columnData.long_text,
            matchingType,
            id, // consider this issue number
            // matchingStatus,
            <div style={{ color: statusColor }}>{matchingStatus}</div>,
            ,
          ];
        });

        const filteredFormattedData = isAdmin
          ? formattedData
          : formattedData.filter(
              (item) =>
                printHouses.find((ph) => ph.domain === item[0])?.domain ===
                  printHouseProfileState?.domain ||
                item[0] + "/" === printHouseProfileState?.domain
            );

        const sortedData = filteredFormattedData.sort((a, b) => {
          const statusA =
            statuses.find((s) => s.label === a[6]?.props?.children)?.value ||
            "";
          const statusB =
            statuses.find((s) => s.label === b[6]?.props?.children)?.value ||
            "";

          const priorityA = statusPriority[statusA] ?? 99;
          const priorityB = statusPriority[statusB] ?? 99;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          const nameA = (a[2] || "").toLowerCase();
          const nameB = (b[2] || "").toLowerCase();

          return nameA.localeCompare(nameB);
        });

        setAllIssues(sortedData);
        // setAllIssues(filteredFormattedData);
      } else {
        alertFaultGetData();
      }
    };
    await getAllMondayIssuesApi(callApi, callBack, data);
  };

  return {
    tableHeaders,
    AllIssues,
    handleClean,
    openModal,
    ticketTypeList,
    onClickClosModal,
    onClickOpenModal,
    onChangePrintHouse,
    printHouses,
    selectedPrintHouse,
    getIssues,
    setSelectedPrintHouse,
    statuses,
    onChangeStatus,
    filteredIssues,
    columnWidths,
    onChangeInputs,
    ticketState,
    setTicketState,
    setFile,
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
    sendToMonday,
    statusFilters,
    onToggleAllStatuses,
    onToggleStatus,
  };
};

export { useCustomerService };
