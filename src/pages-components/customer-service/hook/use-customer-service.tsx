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
import axios from "axios";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";

const useCustomerService = (isAdmin: boolean) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { profileState } = useUserProfile();
  const printHouseProfileState = useRecoilValue(printHouseProfile);

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

  const onChangeStatus = useCallback((e, value) => {
    setStatusFilter(value?.value || null);
  }, []);

  const filterIssues = useCallback(() => {
    const lowercasedSearch = debouncedPatternSearch.trim().toLowerCase();

    const filtered = AllIssues.filter((issue) => {
      // Filter by selected print house
      if (selectedPrintHouse && issue[0] !== selectedPrintHouse?.label)
        return false;

      // Filter by status
      if (statusFilter && issue[6] !== statusFilter) return false;

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
    // t("customerService.reporterName"),
    t("customerService.status"),
    isAdmin ? "" : null,
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
    setSelectedPrintHouse(null);
    setStatusFilter(null);
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

    // if (!ticketState?.description) {
    //   alertFault("customerService.descriptionRequired");
    //   return;
    // }

    try {
      const apiUrl = "https://api.monday.com/v2";
      const fileApiUrl = "https://api.monday.com/v2/file";
      const apiToken =
        "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0OTc3MDg4OSwiYWFpIjoxMSwidWlkIjo2ODU0NjEzNiwiaWFkIjoiMjAyNC0xMi0xOFQxOTo0MTowNS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjYzNTkxNzQsInJnbiI6ImV1YzEifQ.WEXTXHhRTtJS9XTAXvlyGG8zjSxgE-uIWuhtIluvR1o";
      const boardId = "1767002989";
      const groupId = "topics";
      debugger;
      const printHouseName =
        printHouses.find((ph) => ph.domain === domain)?.label ||
        (formattedDomain ?? null);

      let columnValues = {
        long_text: ticketState?.description,
        status_11: ticketState?.ticketType,
        link_mkm7eghn: {
          url: formattedDomain,
          text: printHouseName,
        },
      };

      let columnValuesString = JSON.stringify(columnValues).replace(
        /"/g,
        '\\"'
      );

      let mutation = `mutation { create_item (board_id: "${boardId}", group_id: "${groupId}", item_name: "${
        ticketState?.title || "New task"
      }", column_values: "${columnValuesString}") { id }}`;

      const createItemResponse = await axios.post(
        apiUrl,
        { query: mutation },
        {
          headers: {
            Authorization: apiToken,
          },
        }
      );

      if (createItemResponse.data.errors) {
        alertFaultAdded();
      } else {
        /****************************/
        const itemId = createItemResponse.data.data.create_item.id;
        if (file) {
          const formData = new FormData();

          formData.append(
            "query",
            `mutation ($file: File!) { add_file_to_column (item_id: ${itemId}, column_id: "files", file: $file) { id } }`
          );
          formData.append("variables[file]", file);

          const fileUploadResponse = await axios.post(fileApiUrl, formData, {
            headers: {
              Authorization: apiToken,
              "Content-Type": "multipart/form-data",
            },
          });

          if (fileUploadResponse.data.errors) {
            alertFaultAdded();
            console.error(
              "File upload failed:",
              fileUploadResponse.data.errors
            );
            // return;
          }
        }
        /****************************/

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
      }
    } catch (error) {
      alertFaultAdded();
      console.error("Error sending request to Monday.com:", error);
    }
  };

  const getIssues = async () => {
    const apiUrl = "https://api.monday.com/v2";
    const apiToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0OTc3MDg4OSwiYWFpIjoxMSwidWlkIjo2ODU0NjEzNiwiaWFkIjoiMjAyNC0xMi0xOFQxOTo0MTowNS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjYzNTkxNzQsInJnbiI6ImV1YzEifQ.WEXTXHhRTtJS9XTAXvlyGG8zjSxgE-uIWuhtIluvR1o";
    const boardId = "1767002989";
    const groupId = "topics";

    try {
      const response = await axios.post(
        apiUrl,
        {
          query: `
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
}`,
        },
        {
          headers: {
            Authorization: apiToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.errors) {
        alertFaultGetData();
      } else {
        const issues =
          response.data.data.boards[0]?.groups[0]?.items_page.items || [];

        const formattedData = issues.map(({ name, id, column_values }) => {
          const columnData =
            column_values?.reduce((acc, { id, text, value }) => {
              if (id === "status_11") acc.status_11 = text;
              if (id === "status") acc.status = text;
              if (id === "creation_log") acc.creation_log = text;
              if (id === "long_text") acc.long_text = text;

              // if (id === "link_mkm7eghn")
              //   acc.link_mkm7eghn = text?.replace(/^https?:\/\//, "");

              if (id === "link_mkm7eghn") {
                const parsedValue = value ? JSON.parse(value) : {};
                acc.link_mkm7eghn = parsedValue?.url
                  ? parsedValue?.url.replace(/^https?:\/\//, "")
                  : "";
              }

              return acc;
            }, {}) || {};

          debugger;
          return [
            isAdmin
              ? printHouses.find(
                  (ph) => ph.domain === columnData?.link_mkm7eghn
                )?.label ||
                (columnData?.link_mkm7eghn ?? null)
              : null,
            columnData.creation_log
              ? new Date(columnData.creation_log).toLocaleDateString()
              : "N/A",
            name,
            columnData.long_text,
            columnData.status_11,
            id, // consider this issue number
            // " ",
            columnData.status,
          ];
        });

        const uniqueStatuses = Array.from(
          new Set(formattedData.map((item) => item[6])) // item[6]  contain the status
        )
          .filter((status) => status !== undefined && status !== null)
          .map((status) => ({ value: status, label: status }));

        setStatuses(uniqueStatuses.length > 0 ? uniqueStatuses : []);
        setAllIssues(formattedData);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
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
    statusFilter,
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
  };
};

export { useCustomerService };
