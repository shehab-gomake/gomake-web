import {
  SampleTypeOption,
  useAgentsList,
  useCustomerDropDownList,
  useGomakeAxios,
  useGomakeRouter,
  useSnackBar,
} from "@/hooks";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BoardMissionStatusForFilter } from "./widgets/enums";
import {
  exportJobTableToExcelApi,
  getAllPurchaseJobsApi,
  getDeliveryTickerPdfApi,
  getOrderSummeryPdfApi,
  getWorkMissionPdfApi,
  printNodeModalCancelLog,
  printOrderJobUsingPrintNodeApi,
  setBoardMissionsFiltersApi,
} from "@/services/api-service/board-missions/board-missions-table";
import { useDateFormat } from "@/hooks/use-date-format";
import { CLIENT_TYPE, DEFAULT_VALUES } from "@/pages/customers/enums";
import { EWorkSource } from "@/widgets/product-pricing-widget/enums";
import { useDebounce } from "@/utils/use-debounce";
import { MoreMenuWidget } from "./widgets/more-circle";
import { DuplicateType, ORDER_STATUSES } from "@/enums";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useStyle } from "./style";
import { useRouter } from "next/router";
import {
  backToProcessApi,
  moveBoardMissionStatusToWaitingApi,
  moveBoardMissionToDoneApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { downloadPdf } from "@/utils/helpers";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import { useQuoteGetData } from "../quote-new/use-quote-get-data";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { GomakeTextInput } from "@/components";
import { useJobsTableSocketIo } from "@/hooks/socket-io/use-jobs-table-socket-io";
import { Stack } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userQuoteState } from "@/store";
import { updateDocumentApi } from "@/services/api-service/generic-doc/documents-api";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { selectedMissionsState } from "@/widgets/production-floor/state/boards";
import { useListPagination } from "@/hooks/use-list-pagination";
import { JobsTableColumns } from "../quotes/enums/document-table-columns-enum";
import { exampleTypeState } from "@/store/example-type";
import {
  columnOrderStateFamily,
  columnVisibilityStateFamily,
} from "./states/board-missions-columns-settings-state";

type StatusOption = {
  label: string;
  value: ORDER_STATUSES;
};

interface Query {
  customerId?: string;
  agentId?: string;
  statusId?: string;
  approvalStatusId?: string;
  minPrice?: string;
  maxPrice?: string;
  fromDate?: string;
  toDate?: string;
  accountingStatus?: string;
  productionStatus?: any;
  isCanceled?: boolean;
  clientId?: string;
  clientName?: string;
  orderStatus?: any;
  fromDueDate?: string;
  toDueDate?: string;
  fromReadyDate?: string;
  toReadyDate?: string;
  productsIds?: string[];
  sampleType?: number;
  proofTypes?: string[];
}

const useBoardMissions = ({ isPurchaseJobs }) => {
  const { CheckPermission } = useUserPermission();
  const { getCurrencyUnitText } = useQuoteGetData();
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const [selectedMission, setSelectedMission] = useRecoilState<any>(
    selectedMissionsState
  );
  const {
    alertFault,
    alertFaultGetData,
    alertFaultUpdate,
    alertSuccessUpdate,
  } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const [status, setStatus] = useState<{
    label: string;
    value: BoardMissionStatusForFilter;
  } | null>();
  const searchInputRef = useRef(null);
  const [orderStatus, setOrderStatus] = useState<StatusOption>();
  const [supplierId, selectedSupplierId] = useState<any>();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [productsList, setProductsList] = useState([]);
  const exampleTypeValues = useRecoilValue(exampleTypeState);
  const [sampleType, setSampleType] = useState<SampleTypeOption | null>(null);
  // Add state for multiple proof types (similar to productIds)
  const [proofTypes, setProofTypes] = useState([]);

  // Handler for proof types multi-select change
  const handleProofTypesChange = (selectedValues) => {
    setProofTypes(selectedValues);
  };
  // const [patternSearch, setPatternSearch] = useState<string>("");
  const [patternSearch, setPatternSearch] = useState<any>(null);

  //DATE
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  //DUE DATE
  const [fromDueDate, setFromDueDate] = useState<Date>();
  const [toDueDate, setToDueDate] = useState<Date>();
  const [resetDueDatePicker, setResetDueDatePicker] = useState<boolean>(false);

  //Ready DATE
  const [fromReadyDate, setFromReadyDate] = useState<Date>();
  const [toReadyDate, setToReadyDate] = useState<Date>();
  const [resetReadyDatePicker, setResetReadyDatePicker] =
    useState<boolean>(false);
  const [allBoardMissions, setAllBoardMissions] = useState([]);
  const [allPurchaseJobs, setAllPurchaseJobs] = useState([]);
  const { GetDateFormat, formatISODateTime } = useDateFormat();
  const [finalPatternSearch, setFinalPatternSearch] = useState("");
  const {
    pageSize,
    setPageSize,
    pagesCount,
    setPagesCount,
    pageNumber,
    setPageNumber,
    initialPageSize,
  } = useListPagination();

  useEffect(() => {
    if (initialPageSize && initialPageSize !== pageSize) {
      setPageSize(initialPageSize);
    }
  }, [initialPageSize]);

  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const {
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({
    clientType: isPurchaseJobs ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER,
  });

  const { agent, setAgent, agentsCategories, handleAgentChange } =
    useAgentsList();

  const router = useRouter();

  const handlePageSizeChange = (event) => {
    const size = Number(event.target.value);

    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, pageNumber: "1", pageSize: String(size) },
      },
      undefined,
      { shallow: true }
    );
  };

  const onSelectDeliveryTimeDates = (value) => {
    if (value && value.length === 2) {
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  const onSelectDueTimeDates = (value) => {
    if (value && value.length === 2) {
      setFromDueDate(value[0]);
      setToDueDate(value[1]);
    } else {
      setFromDueDate(null);
      setToDueDate(null);
    }
  };

  const onSelectReadyTimeDates = (value) => {
    if (value && value.length === 2) {
      setFromReadyDate(value[0]);
      setToReadyDate(value[1]);
    } else {
      setFromReadyDate(null);
      setToReadyDate(null);
    }
  };

  const productionStatuses = [
    {
      label: t("boardMissions.NotReady"),
      value: BoardMissionStatusForFilter.NotReady,
    },
    {
      label: t("boardMissions.waiting"),
      value: BoardMissionStatusForFilter.WAITING,
    },
    {
      label: t("boardMissions.urgent"),
      value: BoardMissionStatusForFilter.URGENT,
    },
    {
      label: t("boardMissions.inProduction"),
      value: BoardMissionStatusForFilter.IN_PROCESS,
    },
    {
      label: t("boardMissions.stuck"),
      value: BoardMissionStatusForFilter.STUCK,
    },
    {
      label: t("boardMissions.approvalRequired"),
      value: BoardMissionStatusForFilter.APPROVAL_REQUIRED,
    },
    { label: t("boardMissions.done"), value: BoardMissionStatusForFilter.DONE },
  ];

  const orderStatuses = [
    { label: t("boardMissions.open"), value: ORDER_STATUSES.Open },
    { label: t("boardMissions.canceled"), value: ORDER_STATUSES.Canceled },
    {
      label: t("boardMissions.waitingForPayment"),
      value: ORDER_STATUSES.WaitingForPayment,
    },
    { label: t("boardMissions.paused"), value: ORDER_STATUSES.Paused },
    { label: t("boardMissions.ready"), value: ORDER_STATUSES.Ready },
  ];

  const tableHeader = [
    t("boardMissions.image"),
    t("boardMissions.creationDate"),
    t("boardMissions.dueDate"),
    t("boardMissions.clientName"),
    t("boardMissions.missionNumber"),
    t("sales.quote.relatedDocuments"),
    t("boardMissions.outSourceType"),
    t("boardMissions.quantity"),
    CheckPermission(Permissions.SHOW_COSTS_IN_BOARD_MISSIONS) &&
    t("boardMissions.costFromOrderItem"),
    CheckPermission(Permissions.SHOW_COSTS_IN_BOARD_MISSIONS) &&
    t("boardMissions.priceFromOrderItem"),
    t("boardMissions.jobName"),
    t("boardMissions.numberOfBoardMissionsInOrder"),
    t("boardMissions.productName"),
    t("boardMissions.currentBoardMissionStatus"),
    t("properties.more"),
  ].filter(Boolean); // This filters out falsy values

  const tableHeaderForPurchaseJobs = [
    t("boardMissions.creationDate"),
    t("boardMissions.dueDate"),
    t("boardMissions.clientName"),
    t("sales.quote.supplierName"),
    t("boardMissions.missionNumber"),
    t("mailingSettings.orderNumber"),
    t("sales.quote.purchaseOrderNumber"),
    t("boardMissions.outSourceType"),
    t("boardMissions.quantity"),
    t("boardMissions.outSourceCost"),
    t("boardMissions.priceFromOrderItem"),
    t("boardMissions.jobName"),
    t("boardMissions.numberOfBoardMissionsInOrder"),
    t("boardMissions.productName"),
    t("boardMissions.currentBoardMissionStatus"),
    t("properties.more"),
  ];

  const handleMultiSelectChange = (newValues: string[]) => {
    setProductIds(newValues);
  };

  const handleStatusChange = (e: any, value: any) => {
    setStatus(value);
  };
  const handleOrderStatusChange = (e: any, value: any) => {
    setOrderStatus(value);
  };

  const handledSupplierIdChange = (e: any, value: any) => {
    selectedSupplierId(value);
  };

  const handleClickSearch = () => {
    const newQuery: Query = { ...router.query };

    if (productIds.length > 0) {
      newQuery.productsIds = productIds;
    } else {
      delete newQuery.productsIds;
    }

    if (proofTypes.length > 0) {
      newQuery.proofTypes = proofTypes;
    } else {
      delete newQuery.proofTypes;
    }

    if (customer?.id) {
      newQuery.clientId = customer.id;
    } else {
      delete newQuery.clientId;
    }

    if (customer?.name) {
      newQuery.clientName = customer.name;
    } else {
      delete newQuery.clientName;
    }

    if (agent?.id) {
      newQuery.agentId = agent.id;
    } else {
      delete newQuery.agentId;
    }

    if (status?.value) {
      newQuery.productionStatus = status.value;
    } else {
      delete newQuery.productionStatus;
    }

    if (orderStatus) {
      newQuery.orderStatus = orderStatus.value;
    } else {
      delete newQuery.orderStatus;
    }

    if (fromDate instanceof Date) {
      newQuery.fromDate = fromDate.toISOString();
    } else {
      delete newQuery.fromDate;
    }

    if (toDate instanceof Date) {
      newQuery.toDate = toDate.toISOString();
    } else {
      delete newQuery.toDate;
    }

    if (fromDueDate instanceof Date) {
      newQuery.fromDueDate = fromDueDate.toISOString();
    } else {
      delete newQuery.fromDueDate;
    }

    if (toDueDate instanceof Date) {
      newQuery.toDueDate = toDueDate.toISOString();
    } else {
      delete newQuery.toDueDate;
    }

    if (fromReadyDate instanceof Date) {
      newQuery.fromReadyDate = fromReadyDate.toISOString();
    } else {
      delete newQuery.fromReadyDate;
    }

    if (toReadyDate instanceof Date) {
      newQuery.toReadyDate = toReadyDate.toISOString();
    } else {
      delete newQuery.toReadyDate;
    }

    if (sampleType?.value) {
      newQuery.sampleType = sampleType.value;
    } else {
      delete newQuery.sampleType;
    }

    router.replace(
      {
        pathname: router.pathname,
        query: { ...newQuery, pageNumber: 1, pageSize: String(pageSize) },
      },
      undefined,
      { shallow: true }
    );

    handleClose();
    setPageNumber(1);
  };

  const handleClickClear = () => {
    setAgent(null);
    setCustomer(null);
    setStatus(null);
    setOrderStatus(null);
    setSampleType(null);
    setProofTypes([]);
    selectedSupplierId(null);
    setProductIds([]);
    setPatternSearch("");
    setFinalPatternSearch("");
    setFromDate(null);
    setFromDueDate(null);
    setFromReadyDate(null);
    setToDate(null);
    setToDueDate(null);
    setToReadyDate(null);
    setResetDatePicker(true);
    setResetDueDatePicker(true);
    setResetReadyDatePicker(true);
    setCurrentSortOrder(null);
    setPageNumber(1);

    setHasFetchedQuery(null); // ✅ force next fetch on empty query

    const query = {
      pageNumber: "1",
      pageSize: String(router.query.pageSize ?? pageSize),
    };
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });

    handleClose();
  };

  const [hasFetchedQuery, setHasFetchedQuery] = useState<string | null>(null);

  // track whether we've already fetched for the exact combo of (query + pageSize)
  useEffect(() => {
    const isNotFilteredData = Object.keys(router?.query || {}).length === 0;

    const effectivePageSize = router.query.pageSize
      ? Number(router.query.pageSize)
      : pageSize;

    const signature = JSON.stringify({
      q: router.query,
      pageSize: effectivePageSize,
    });

    if (isNotFilteredData) {
      getAllData(isPurchaseJobs, true);
      setHasFetchedQuery(null);
    } else if (hasFetchedQuery !== signature) {
      getAllData(isPurchaseJobs, false);
      setHasFetchedQuery(signature);
    }
  }, [router.query, pageSize, isPurchaseJobs]); // include isPurchaseJobs just in case

  const { isSocketUpdateJobsTable, setIsSocketUpdateJobsTable } =
    useJobsTableSocketIo();

  useEffect(() => {
    if (isSocketUpdateJobsTable) {
      getAllData(false, false);
      setIsSocketUpdateJobsTable(false);
    }
  }, [isSocketUpdateJobsTable]);

  const getAllProducts = useCallback(async () => {
    const products = await getAllProductsForDropDownList(
      callApi,
      setProductsList
    );
    setProductsList(
      products.map(({ id, name }) => ({ label: name, value: id }))
    );
  }, []);

  const [missionItem, setMissionItem] = useState<any>();

  const getAllData = async (
    isPurchaseJobs: boolean,
    isClear: boolean = false,
    sortOrder?: any
  ) => {
    if (isPurchaseJobs) {
      return await getAllPurchaseJobs(isClear);
    } else {
      return await getAllBoardMissions(isClear, sortOrder);
    }
  };

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForEdit, setCustomerForEdit] = useState([]);

  const getCustomerForEdit = async (customerId) => {
    const callBack = (res) => {
      if (res.success) {
        let customer = res.data;
        if (customer.contacts && customer.contacts.length > 0) {
          let index = 0;
          customer.contacts.forEach((x) => {
            x.index = index;
            index++;
          });
        }
        if (customer.addresses && customer.addresses.length > 0) {
          let index = 0;
          customer.addresses.forEach((x) => {
            x.index = index;
            index++;
          });
        }
        if (customer.users && customer.users.length > 0) {
          let index = 0;
          customer.users.forEach((x) => {
            x.index = index;
            index++;
          });
        }
        setCustomerForEdit(customer);
        setShowCustomerModal(true);
      }
    };
    await getAndSetCustomerById(callApi, callBack, { customerId: customerId });
  };

  const onClickOpenCustomerModal = (customerId: any) => {
    setShowCustomerModal(true);
    getCustomerForEdit(customerId);
  };


  const getJobStatus = (mission) => {
    console.log("mission", mission);
    if (mission?.isReady) {
      return (
        <>
          <div>{t("boardMissions.done")}</div>

          <div>
            {mission?.storage === "undefined"
              ? ""
              : mission?.storage
                ? ` ${mission.storage}`
                : " "}
          </div>
        </>
      );
    }
    if (mission?.orderStatus === ORDER_STATUSES.WaitingForPayment) {
      return (
        <>
          <div>{t("boardMissions.waitingForPayment")}</div>
        </>
      );
    }
    if (mission?.boardMissionStatus && mission?.station) {
      const empName =
        mission.station.machineName && mission.station.machineId
          ? mission.station.machineName
          : mission.station?.supplierId
            ? mission.station.supplierName
            : mission.station.employeeName;
      if (empName)
        return `${t(
          "productionStatuses." + mission.boardMissionStatus.name
        )} \n\r ${mission.station.actionName} \n\r ${empName}`;
      return `${t(
        "productionStatuses." + mission.boardMissionStatus.name
      )} \n\r ${mission.station.actionName}`;
    }
    return "";
  };
  // const getJobStatus = (mission) => {
  //   if (mission?.isReady) {
  //     return (
  //       <>
  //         <div>{t("boardMissions.done")}</div>

  //         <div>
  //           {mission?.storage === "undefined"
  //             ? ""
  //             : mission?.storage
  //             ? ` ${mission.storage}`
  //             : " "}
  //         </div>
  //       </>
  //     );
  //   }
  //   if (mission?.orderStatus === ORDER_STATUSES.WaitingForPayment) {
  //     return (
  //       <>
  //         <div>{t("boardMissions.waitingForPayment")}</div>
  //       </>
  //     );
  //   }
  //   if (mission?.boardMissionStatus && mission?.station) {
  //     const empName =
  //       mission.station.machineName && mission.station.machineId
  //         ? mission.station.machineName
  //         : mission.station.employeeName;
  //     if (empName)
  //       return `${t(
  //         "productionStatuses." + mission.boardMissionStatus.name
  //       )} \n\r ${mission.station.actionName} \n\r ${empName}`;
  //     return `${t(
  //       "productionStatuses." + mission.boardMissionStatus.name
  //     )} \n\r ${mission.station.actionName}`;
  //   }
  //   return "";
  // };

  const updateQuoteStatus = async (quoteId?) => {
    const callBack = (res) => {
      if (res?.success) {
        navigate("/quote");
      } else {
        if (res?.statusCode === 85) {
          alertFault(res?.message);
        } else {
          alertFaultUpdate();
        }
      }
    };
    await updateDocumentApi(callApi, callBack, {
      documentType: 0,
      document: {
        documentId: quoteId ?? selectedQuote,
      },
    });
  };

  const [selectedQuote, setSelectedQuote] = useState<string>("");
  const [openQuoteModal, setOpenQuoteModal] = useState(false);

  const onClickCloseModal = () => {
    setOpenQuoteModal(false);
  };

  const onClickOpenModal = (quoteId: string) => {
    setSelectedQuote(quoteId);
    setOpenModal(true);
  };

  const userQuoteIfExist = useRecoilValue<any>(userQuoteState);
  const onClickEditQuote = (quoteId: string) => {
    if (userQuoteIfExist) onClickOpenModal(quoteId);
    else updateQuoteStatus(quoteId);
  };

  const getAllBoardMissions = async (isClear: boolean = false, order?: any) => {
    const sortOrder = order || currentSortOrder;

    const callBack = (res) => {
      if (res?.success) {
        const _data = res?.data;

        const mapData = _data.data?.map((mission: any) => {
          const itemCalculatedPrice =
            mission?.calculatedPrice &&
              mission?.calculatedPrice != mission?.price
              ? mission?.calculatedPrice
              : 0;

          const row: Record<string, React.ReactNode> = {
            image: (
              <a
                href={mission?.boardMissionImage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={mission?.boardMissionImage}
                  alt=""
                  style={{
                    width: "45px",
                    height: "45px",
                    objectFit: "contain",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                />
              </a>
            ),
            creationDate: formatISODateTime(mission?.createdDate),
            dueDate: formatISODateTime(mission?.dueDate),
            clientName: (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(mission?.customerID)}
              >
                {mission?.clientName}
              </div>
            ),
            missionNumber: mission?.productType
              ? `${mission?.number} / ${mission?.productTypeName ?? mission?.productType
              }`
              : mission?.number,
            relatedDocuments: (
              <Stack
                direction="column"
                spacing={0.5}
                width="100%"
                sx={{ textAlign: "center" }}
              >
                {mission?.quoteNumber && (
                  <a
                    href={`/quotes?finalPatternSearch=${mission?.quoteNumber}`}
                    style={classes.tableAtagStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mission?.quoteNumber}
                  </a>
                )}
                <a
                  href={`/orders?finalPatternSearch=${mission?.orderNumber}`}
                  style={classes.tableAtagStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {mission?.orderNumber}
                </a>
              </Stack>
            ),
            purchaseNumber: mission?.purchaseNumber,
            outSourceType: t(
              "boardMissions." + EWorkSource[mission?.outSourceType ?? 0]
            ),
            quantity: mission?.quantity,
            ...(CheckPermission(Permissions.SHOW_COSTS_IN_BOARD_MISSIONS) && {
              costFromOrderItem: isRTL
                ? `${mission?.cost} ${getCurrencyUnitText(mission?.currency)}`
                : `${getCurrencyUnitText(mission?.currency)} ${mission?.cost}`,
              priceFromOrderItem: isRTL
                ? `${mission?.price}${itemCalculatedPrice ? ` (${itemCalculatedPrice})` : ""
                } ${getCurrencyUnitText(mission?.currency)}`
                : `${getCurrencyUnitText(mission?.currency)} ${mission?.price}${itemCalculatedPrice ? ` (${itemCalculatedPrice})` : ""
                }`,
            }),
            jobName: mission?.jobName,
            numberOfBoardMissionsInOrder: mission?.numberOfBoardMissions,
            productName: mission?.productName,
            currentBoardMissionStatus: (
              <div style={{ whiteSpace: "break-spaces" }}>
                {getJobStatus(mission)}
              </div>
            ),
            more: (
              <MoreMenuWidget
                mission={mission}
                onClickDuplicate={onOpenDuplicateModal}
                onOpenModal={onOpenModal}
                onClickPrintPackagingSlip={onOpenPackagesModal}
                onClickMarksAsDone={onOpenMarkReadyModal}
                handleClickBackToProcess={handleClickBackToProcess}
                onClickMarksAsDoneForProductType={
                  onOpenMarkReadyModalForProductType
                }
                onClickReturnToProduction={onOpenReturnToProdModal}
                onClickOrderSummeryPdf={onClickOrderSummeryPdf}
                onClickWorkMissionPdf={onClickWorkMissionPdf}
                onOpenMarkReadyModalForHasJobs={onOpenMarkReadyModalForHasJobs}
              />
            ),
          };

          return row;
        });

        setAllBoardMissions(mapData);
        setPagesCount(Math.ceil(_data?.totalItems / currentPageSize));
      } else {
        alertFaultGetData();
      }
    };
    if (!router.isReady) {
      return;
    }
    const currentFinalPatternSearch = router.query.finalPatternSearch;
    const currentProductionStatus = router.query.productionStatus;
    const currentProductsIds = Array.isArray(router.query.productsIds)
      ? router.query.productsIds
      : router.query.productsIds
        ? [router.query.productsIds]
        : productIds;

    const currentProofTypes = Array.isArray(router.query.proofTypes)
      ? router.query.proofTypes
      : router.query.proofTypes
        ? [router.query.proofTypes]
        : proofTypes;

    const currentOrderStatus = router.query.orderStatus;

    const currentFromDate = router.query.fromDate;
    const currentToDate = router.query.toDate;

    const currentFromDueDate = router.query.fromDueDate;
    const currentToDueDate = router.query.toDueDate;

    const currentFromReadyDate = router.query.fromReadyDate;
    const currentToReadyDate = router.query.toReadyDate;

    const currentFormattedFromDate =
      typeof currentFromDate === "string"
        ? GetDateFormat(new Date(currentFromDate))
        : undefined;

    const currentFormattedToDate =
      typeof currentToDate === "string"
        ? GetDateFormat(new Date(currentToDate))
        : undefined;

    const currentFormattedFromDueDate =
      typeof currentFromDueDate === "string"
        ? GetDateFormat(new Date(currentFromDueDate))
        : undefined;

    const currentFormattedToDueDate =
      typeof currentToDueDate === "string"
        ? GetDateFormat(new Date(currentToDueDate))
        : undefined;

    const currentFormattedFromReadyDate =
      typeof currentFromReadyDate === "string"
        ? GetDateFormat(new Date(currentFromReadyDate))
        : undefined;

    const currentFormattedToReadyDate =
      typeof currentToReadyDate === "string"
        ? GetDateFormat(new Date(currentToReadyDate))
        : undefined;

    const currentSampleType = router.query.sampleType;

    const currentPageNumber = router.query.pageNumber ?? 1;
    const currentPageSize = router.query.pageSize
      ? Number(router.query.pageSize)
      : pageSize;

    const data = isClear
      ? {
        productsIds: [],
        pageNumber: currentPageNumber || pageNumber,
        pageSize: currentPageSize,
      }
      : {
        clientId: router?.query?.clientId || customer?.id,
        agentId: router?.query?.agentId || agent?.id,
        search:
          finalPatternSearch !== null &&
            finalPatternSearch !== undefined &&
            finalPatternSearch !== ""
            ? finalPatternSearch
            : currentFinalPatternSearch,
        fromDate:
          currentFormattedFromDate || (fromDate && GetDateFormat(fromDate)),
        toDate: currentFormattedToDate || (toDate && GetDateFormat(toDate)),
        fromDueDate:
          currentFormattedFromDueDate ||
          (fromDueDate && GetDateFormat(fromDueDate)),
        toDueDate:
          currentFormattedToDueDate ||
          (toDueDate && GetDateFormat(toDueDate)),

        fromReadyDate:
          currentFormattedFromReadyDate ||
          (fromReadyDate && GetDateFormat(fromReadyDate)),
        toReadyDate:
          currentFormattedToReadyDate ||
          (toReadyDate && GetDateFormat(toReadyDate)),
        productsIds: currentProductsIds,
        productionStatus: currentProductionStatus || status?.value,
        orderStatus: currentOrderStatus || orderStatus?.value,
        pageNumber: currentPageNumber || pageNumber,
        pageSize: currentPageSize,
        orderNumber: router?.query?.orderNumber,
        order: sortOrder,
        exampleTypes: currentProofTypes,
      };
    await setBoardMissionsFiltersApi(callApi, callBack, data);
  };

  const getAllPurchaseJobs = async (isClear: boolean = false) => {
    const callBack = (res) => {
      if (res?.success) {
        const _data = res?.data;
        const mapData = _data.data?.map((mission: any) => {
          const row: Record<string, React.ReactNode> = {
            creationDate: formatISODateTime(mission?.createdDate),
            dueDate: formatISODateTime(mission?.dueDate),
            clientName: (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(mission?.customerID)}
              >
                {mission?.clientName}
              </div>
            ),
            supplierName: mission?.supplierName,
            missionNumber: mission?.productType
              ? `${mission?.number} / ${mission?.productTypeName ?? mission?.productType
              }`
              : mission?.number,
            orderNumber: mission?.orderNumber,
            purchaseOrderNumber: mission?.purchaseOrderNumber,
            outSourceType:
              mission?.outSourceType === null
                ? t("boardMissions." + EWorkSource[0])
                : t("boardMissions." + EWorkSource[mission?.outSourceType]),
            quantity: mission?.quantity,
            outSourceCost: isRTL
              ? `${mission?.cost} ${getCurrencyUnitText(mission?.currency)}`
              : `${getCurrencyUnitText(mission?.currency)} ${mission?.cost}`,
            priceFromOrderItem: isRTL
              ? `${mission?.price} ${getCurrencyUnitText(mission?.currency)}`
              : `${getCurrencyUnitText(mission?.currency)} ${mission?.price}`,
            jobName: mission?.jobName,
            numberOfBoardMissionsInOrder: mission?.numberOfBoardMissions,
            productName: mission?.productName,
            currentBoardMissionStatus: mission?.isReady
              ? t("boardMissions.done")
              : mission?.boardMissionStatus && mission?.station
                ? `${mission.boardMissionStatus.name} / ${mission.station.actionName}`
                : "",
            more: (
              <MoreMenuWidget
                mission={mission}
                onClickDuplicate={onOpenDuplicateModal}
                onOpenModal={onOpenModal}
                onClickPrintPackagingSlip={onOpenPackagesModal}
                onClickMarksAsDone={onOpenMarkReadyModal}
                handleClickBackToProcess={handleClickBackToProcess}
                onClickMarksAsDoneForProductType={
                  onOpenMarkReadyModalForProductType
                }
                onClickReturnToProduction={onOpenReturnToProdModal}
                onClickOrderSummeryPdf={onClickOrderSummeryPdf}
                onClickWorkMissionPdf={onClickWorkMissionPdf}
                onOpenMarkReadyModalForHasJobs={onOpenMarkReadyModalForHasJobs}
              />
            ),
          };

          return row;
        });
        setAllPurchaseJobs(mapData);
        setPagesCount(Math.ceil(_data?.totalItems / currentPageSize));
      } else {
        alertFaultGetData();
      }
    };

    if (!router.isReady) {
      return;
    }
    const currentFinalPatternSearch = router.query.finalPatternSearch;
    const currentSampleType = router.query.sampleType;

    const currentPageNumber = router.query.pageNumber ?? 1;

    const currentPageSize = router.query.pageSize
      ? Number(router.query.pageSize)
      : pageSize;

    const currentProofTypes = Array.isArray(router.query.proofTypes)
      ? router.query.proofTypes
      : router.query.proofTypes
        ? [router.query.proofTypes]
        : proofTypes;
    await getAllPurchaseJobsApi(
      callApi,
      callBack,
      isClear
        ? {
          productsIds: [],
          pageNumber: currentPageNumber || pageNumber,
          pageSize: currentPageSize,
        }
        : {
          clientId: customer?.id,
          agentId: agent?.id,
          search:
            finalPatternSearch !== null &&
              finalPatternSearch !== undefined &&
              finalPatternSearch !== ""
              ? finalPatternSearch
              : currentFinalPatternSearch,
          fromDate: fromDate && GetDateFormat(fromDate),
          toDate: toDate && GetDateFormat(toDate),

          fromDueDate: fromDueDate && GetDateFormat(fromDueDate),
          toDueDate: toDueDate && GetDateFormat(toDueDate),

          fromReadyDate: fromReadyDate && GetDateFormat(fromReadyDate),
          toReadyDate: toReadyDate && GetDateFormat(toReadyDate),

          productsIds: productIds,
          productionStatus: status?.value,
          orderStatus: orderStatus?.value,
          exampleTypes: currentProofTypes,
          pageNumber: currentPageNumber || pageNumber,
          pageSize: currentPageSize,
          supplierId: supplierId?.value,
          isPurchaseJobs: true,
        }
    );
  };

  const onClickDuplicateMission = (duplicateType: DuplicateType) => {
    const { targetOrderId, targetOrderNumber } = router?.query;
    if (targetOrderId)
      navigate(
        `/products/duplicate?clientTypeId=${missionItem?.clientTypeId
        }&customerId=${missionItem?.customerID
        }&customerName=${encodeURIComponent(
          missionItem?.clientName || ""
        )}&productId=${missionItem?.productID}&documentItemId=${missionItem?.orderItemId
        }&documentType=${DOCUMENT_TYPE.order
        }&documentNumber=${targetOrderNumber}&documentId=${targetOrderId}&duplicateType=${duplicateType}`
      );
    else
      navigate(
        `/products/duplicate?clientTypeId=${missionItem?.clientTypeId}&customerId=${missionItem?.customerID}&productId=${missionItem?.productID}&documentItemId=${missionItem?.orderItemId}&documentType=${DOCUMENT_TYPE.order}&documentId=${missionItem?.orderItemId}&duplicateType=${duplicateType}`
      );
  };

  const onClickOrderSummeryPdf = async (boardMissionId: string) => {
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        window.open(pdfLink, "_blank");
      } else {
        alertFaultGetData();
      }
    };
    await getOrderSummeryPdfApi(callApi, callBack, { boardMissionId });
  };

  const onClickWorkMissionPdf = async (
    boardMissionId: string,
    actionId: string,
    productType: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        window.open(pdfLink, "_blank");
      } else {
        alertFaultGetData();
      }
    };
    await getWorkMissionPdfApi(callApi, callBack, {
      boardMissionId,
      isPurchaseJobs,
      actionId: actionId,
      productType: productType ?? "",
    });
  };

  const onClickPrintPackagingSlip = async () => {
    if (quantityPerPackage > missionItem?.quantity) {
      alertFault("boardMissions.alertQuantity");
      return;
    }
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
        onClosePackagesModal();
      } else {
        alertFault("boardMissions.alertPrintPackingSlip");
      }
    };
    await getDeliveryTickerPdfApi(callApi, callBack, {
      boardMissionId: missionItem?.id,
      packageQuantities,
    });
  };

  const [openDuplicateModal, setOpenDuplicateModal] = useState<boolean>(false);
  const onCloseDuplicateModal = () => {
    setOpenDuplicateModal(false);
  };
  const onOpenDuplicateModal = (mission: any) => {
    setMissionItem(mission);
    setOpenDuplicateModal(true);
  };

  const [openMarkReadyModal, setOpenMarkReadyModal] = useState<boolean>(false);
  const [openMarkReadyModalForHasJobs, setOpenMarkReadyModalForHasJobs] =
    useState<boolean>(false);

  const [
    openMarkReadyModalForProductType,
    setOpenMarkReadyModalForProductType,
  ] = useState<boolean>(false);
  const onCloseMarkReadyModal = () => {
    setSelectedMission(null);
    setOpenMarkReadyModal(false);
  };
  const onOpenMarkReadyModal = (mission) => {
    setSelectedMission(mission);
    setOpenMarkReadyModal(true);
  };
  const onOpenMarkReadyModalForProductType = (mission) => {
    setSelectedMission(mission);
    setOpenMarkReadyModalForProductType(true);
  };
  const onCloseMarkReadyModalForProductType = () => {
    setSelectedMission(null);
    setOpenMarkReadyModalForProductType(false);
  };

  const onOpenMarkReadyModalForHasJobs = (mission) => {
    setSelectedMission(mission);
    setOpenMarkReadyModalForHasJobs(true);
  };
  const onCloseMarkReadyModalForHasJobs = () => {
    setSelectedMission(null);
    setOpenMarkReadyModalForHasJobs(false);
  };
  const [openMarkReadyThenPrintModal, setOpenMarkReadyThenPrintModal] =
    useState<boolean>(false);
  const onCloseMarkReadyThenPrintModal = () => {
    setOpenMarkReadyThenPrintModal(false);
  };
  const onOpenMarkReadyThenPrintModal = () => {
    setOpenMarkReadyThenPrintModal(true);
  };

  const [openReturnToProdModal, setOpenReturnToProdModalModal] =
    useState<boolean>(false);
  const onCloseReturnToProdModal = () => {
    setSelectedMission(null);
    setOpenReturnToProdModalModal(false);
  };
  const onOpenReturnToProdModal = (mission) => {
    setSelectedMission(mission);
    setOpenReturnToProdModalModal(true);
  };

  const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);
  const onOpenPackagesModal = (mission: any) => {
    setMissionItem(mission);
    setOpenPackagesModal(true);
  };

  const onClosePackagesModal = () => {
    setOpenPackagesModal(false);
  };

  useEffect(() => {
    setQuantityOfPackages(1);
    setQuantityPerPackage(missionItem?.quantity || 0);
  }, [missionItem]);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, pageNumber: value },
    });
  };

  const [quantityOfPackages, setQuantityOfPackages] = useState(1);
  const [quantityPerPackage, setQuantityPerPackage] = useState(
    missionItem?.quantity || 0
  );

  const [remainingQuantity, setRemainingQuantity] = useState(
    missionItem?.quantity - quantityPerPackage * (quantityOfPackages - 1)
  );

  useEffect(() => {
    setRemainingQuantity(
      missionItem?.quantity - quantityPerPackage * (quantityOfPackages - 1)
    );
  }, [quantityPerPackage, quantityOfPackages]);

  const handleQuantityOfPackagesChange = (event) => {
    const newQuantityOfPackages = parseInt(event.target.value, 10);
    const totalQuantity = missionItem?.quantity || 0;
    const newQuantityPerPackage = Math.ceil(
      totalQuantity / newQuantityOfPackages
    );
    setQuantityOfPackages(newQuantityOfPackages);
    setQuantityPerPackage(newQuantityPerPackage);
  };

  const handleQuantityPerPackageChange = (event) => {
    const newQuantityPerPackage = parseInt(event.target.value, 10);
    const totalQuantity = missionItem?.quantity;
    const newQuantityOfPackages = Math.ceil(
      totalQuantity / newQuantityPerPackage
    );
    setQuantityPerPackage(newQuantityPerPackage);
    setQuantityOfPackages(newQuantityOfPackages);
  };

  const [packageQuantities, setPackageQuantities] = useState<number[]>(() => {
    const initialQuantityPerPackage = missionItem?.quantity
      ? Math.ceil(missionItem.quantity / quantityOfPackages)
      : 0;
    return Array(quantityOfPackages).fill(initialQuantityPerPackage);
  });

  useEffect(() => {
    if (missionItem?.quantity && quantityPerPackage > 0) {
      const totalQuantity = missionItem.quantity;
      const fullPackages = Math.max(
        0,
        Math.floor(totalQuantity / quantityPerPackage)
      );
      const remainingQuantity = totalQuantity % quantityPerPackage;

      let newPackageQuantities = Array(fullPackages).fill(quantityPerPackage);
      if (remainingQuantity > 0) {
        newPackageQuantities = [...newPackageQuantities, remainingQuantity];
      }

      setPackageQuantities(newPackageQuantities);
    } else {
      setPackageQuantities([]);
    }
  }, [missionItem, quantityPerPackage]);

  const handlePackageQuantityChange = (index: number, newValue: number) => {
    setPackageQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      const totalQuantity = missionItem?.quantity || 0;

      // Set the new value for the changed package
      updatedQuantities[index] = newValue;

      if (index === quantityOfPackages - 1) {
        // If last package is changed, put remaining in first package
        const sumOfOtherPackages = updatedQuantities
          .slice(1)
          .reduce((acc, val) => acc + val, 0);
        updatedQuantities[0] = totalQuantity - sumOfOtherPackages;
      } else {
        // If any other package is changed, put remaining in last package
        const sumOfOtherPackages = updatedQuantities
          .slice(0, -1)
          .reduce((acc, val) => acc + val, 0);
        updatedQuantities[quantityOfPackages - 1] =
          totalQuantity - sumOfOtherPackages;
      }

      return updatedQuantities;
    });
  };

  const packageInputs = useMemo(() => {
    if (quantityOfPackages) {
      return [...Array(quantityOfPackages)].map((_, index) => (
        <div key={index} style={{ width: "30%" }}>
          <h3 style={classes.packageLabelStyle}>
            {`${t("boardMissions.package")} ${index + 1}`}
          </h3>
          <GomakeTextInput
            type="number"
            value={packageQuantities[index]}
            onChange={(e) => {
              const newValue = parseInt(e.target.value, 10);
              handlePackageQuantityChange(index, newValue);
            }}
          />
        </div>
      ));
    }
  }, [quantityOfPackages, packageQuantities]);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const onCloseModal = () => {
    setOpenModal(false);
  };
  const onOpenModal = (mission: any) => {
    setMissionItem(mission);
    setOpenModal(true);
  };

  const onClickMoveBoardMissionToDone = async (sendMessage: boolean) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllData(isPurchaseJobs, false);
        if (!selectedMission?.productType) {
          onOpenPackagesModal(selectedMission);
        }
      } else {
        alertFaultUpdate();
      }
    };
    if (selectedMission?.isReady) {
      onClickBackToProcess();
    } else {
      await moveBoardMissionToDoneApi(callApi, callBack, {
        boardMissionId: selectedMission?.id,
        sendMessage,
        productType: selectedMission?.productType ?? "",
        storage: selectedMission?.storage ?? "",
      });
    }
  };

  const onClickBackToProcess = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllData(isPurchaseJobs, false);
      } else {
        alertFaultUpdate();
      }
    };
    await backToProcessApi(callApi, callBack, {
      boardMissionId: selectedMission?.id,
      sendMessage: false,
      productType: selectedMission?.productType ?? "",
    });
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const printOrderJobsUsingPrintNode = async (orderId: string) => {
    const callBack = (res) => {
      if (res.success) {
      }
    };
    await printOrderJobUsingPrintNodeApi(callApi, callBack, orderId);
  };
  const cancelPrintNodeModal = async (orderId: string) => {
    if (!orderId) {
      return;
    }
    const callBack = (res) => {
      if (res.success) {
      }
    };
    await printNodeModalCancelLog(callApi, callBack, { orderId: orderId });
  };

  /* Most Important*/
  /* Read URL parameters and set state accordingly*/
  useEffect(() => {
    const q = router.query;
    const hasQuery = Object.keys(q || {}).length > 0;

    if (!hasQuery) {
      // clear all URL-derived filters/state so the inputs look empty
      setCustomer(null);
      setAgent(null);
      setStatus(null);
      setOrderStatus(null);
      setSampleType(null);
      setProductIds([]);
      setFromDate(undefined);
      setToDate(undefined);
      setFromDueDate(undefined);
      setToDueDate(undefined);
      setFromReadyDate(undefined);
      setToReadyDate(undefined);
      setPatternSearch("");
      setFinalPatternSearch("");
      setProofTypes([]);
      selectedSupplierId(null);
      setResetDatePicker(true);
      setResetDueDatePicker(true);
      setResetReadyDatePicker(true);
      setCurrentSortOrder(null);
      setPageNumber(1);

      return; // nothing else to hydrate
    }

    const {
      clientId,
      clientName,
      agentId,
      productionStatus,
      orderStatus,
      fromDate,
      toDate,
      fromDueDate,
      toDueDate,
      fromReadyDate,
      toReadyDate,
      finalPatternSearch,
      pageNumber,
      productsIds,
      sampleType,
      proofTypes,
      pageSize: qPageSize, // <-- add this
    } = q;

    if (proofTypes) {
      const proofTypesArray = Array.isArray(proofTypes)
        ? proofTypes
        : [proofTypes];
      setProofTypes(proofTypesArray);
    }

    if (sampleType) {
      const sampleTypeValue = Array.isArray(sampleType)
        ? sampleType[0]
        : sampleType;
      const selectedSampleType = exampleTypeValues?.find(
        (option) => option.key === sampleTypeValue
      );
      if (selectedSampleType) {
        setSampleType({
          value: selectedSampleType.key,
          text: t(`products.proofTypes.${selectedSampleType.value}`),
        });
      }
    }
    if (productsIds) {
      const productIdsArray = Array.isArray(productsIds)
        ? productsIds
        : [productsIds];
      setProductIds(productIdsArray); // Set the productsIds state if needed
    }

    if (clientId) {
      setCustomer({
        id: Array.isArray(clientId) ? clientId[0] : clientId,
        name: Array.isArray(clientName) ? clientName[0] : clientName,
      });
    }

    if (agentId) {
      const selectedAgent = agentsCategories?.find(
        (agent: any) => agent?.id === agentId
      );
      setAgent(selectedAgent);
    }

    if (productionStatus) {
      const statusToSet = productionStatuses.find(
        (status) => status.value === Number(productionStatus)
      );
      if (statusToSet) {
        setStatus(statusToSet);
      }
    }
    if (pageNumber) {
      setPageNumber(Number(pageNumber));
    }

    if (qPageSize) setPageSize(Number(qPageSize)); // <-- hydrate from URL

    if (orderStatus) {
      const orderStatusToSet = orderStatuses.find(
        (status) => status.value === Number(orderStatus)
      );
      if (orderStatusToSet) {
        setOrderStatus(orderStatusToSet);
      }
    }
    if (fromDate && typeof fromDate === "string")
      setFromDate(new Date(fromDate));
    if (toDate && typeof toDate === "string") setToDate(new Date(toDate));
    if (fromDueDate && typeof fromDueDate === "string")
      setFromDueDate(new Date(fromDueDate));
    if (toDueDate && typeof toDueDate === "string")
      setToDueDate(new Date(toDueDate));
    if (fromReadyDate && typeof fromReadyDate === "string")
      setFromReadyDate(new Date(fromReadyDate));
    if (toReadyDate && typeof toReadyDate === "string")
      setToReadyDate(new Date(toReadyDate));
    if (finalPatternSearch && typeof finalPatternSearch === "string") {
      if (
        !(
          searchInputRef &&
          searchInputRef.current &&
          document.activeElement.id == searchInputRef.current.id
        )
      ) {
        setPatternSearch(finalPatternSearch);
        setFinalPatternSearch(finalPatternSearch);
      }
    }
  }, [router.query, agentsCategories]);

  const onChangeMissionsSearch = (value: string) => {
    setPatternSearch(value);
  };

  const debouncePatternSearch = useDebounce(patternSearch, 1000);
  useEffect(() => {
    if (router.query.targetOrderNumber) {
      setPatternSearch(router.query.targetOrderNumber);
    }
  }, []);

  useEffect(() => {
    if (debouncePatternSearch == null) return;

    const trimmedSearch = debouncePatternSearch.trim();
    setFinalPatternSearch(trimmedSearch);

    // Create a new query object
    const newQuery = { ...router.query };

    if (trimmedSearch) {
      newQuery.finalPatternSearch = trimmedSearch;
      newQuery.pageNumber = "1";
    } else {
      delete newQuery.finalPatternSearch; // Remove the parameter if empty
      newQuery.pageNumber = "1";
    }

    // Only push if the query is actually changing
    const hasQueryChanged =
      JSON.stringify(newQuery) !== JSON.stringify(router.query);

    if (hasQueryChanged) {
      router.push(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true } // Optional: prevents full page reload
      );
    }
  }, [debouncePatternSearch]);

  const ExportJobsTableToExcel = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const downloadLink = document.createElement("a");
        if (typeof res.data === "string") {
          downloadLink.href = res.data;
        } else {
          const link = URL.createObjectURL(res.data);
          downloadLink.href = link;
        }
        downloadLink.download = "table.xlsx";
        downloadLink.click();
      } else {
      }
    };

    const currentFinalPatternSearch = router.query.finalPatternSearch;
    const currentProductionStatus = router.query.productionStatus;
    const currentProductsIds = Array.isArray(router.query.productsIds)
      ? router.query.productsIds
      : router.query.productsIds
        ? [router.query.productsIds]
        : productIds;

    const currentProofTypes = Array.isArray(router.query.proofTypes)
      ? router.query.proofTypes
      : router.query.proofTypes
        ? [router.query.proofTypes]
        : proofTypes;

    const currentOrderStatus = router.query.orderStatus;

    const currentFromDate = router.query.fromDate;
    const currentToDate = router.query.toDate;

    const currentFromDueDate = router.query.fromDueDate;
    const currentToDueDate = router.query.toDueDate;

    const currentFromReadyDate = router.query.fromReadyDate;
    const currentToReadyDate = router.query.toReadyDate;
    const currentSampleType = router.query.sampleType;
    const currentFormattedFromDate =
      typeof currentFromDate === "string"
        ? GetDateFormat(new Date(currentFromDate))
        : undefined;

    const currentFormattedToDate =
      typeof currentToDate === "string"
        ? GetDateFormat(new Date(currentToDate))
        : undefined;

    const currentFormattedFromDueDate =
      typeof currentFromDueDate === "string"
        ? GetDateFormat(new Date(currentFromDueDate))
        : undefined;

    const currentFormattedToDueDate =
      typeof currentToDueDate === "string"
        ? GetDateFormat(new Date(currentToDueDate))
        : undefined;

    const currentFormattedFromReadyDate =
      typeof currentFromReadyDate === "string"
        ? GetDateFormat(new Date(currentFromReadyDate))
        : undefined;

    const currentFormattedToReadyDate =
      typeof currentToReadyDate === "string"
        ? GetDateFormat(new Date(currentToReadyDate))
        : undefined;

    const currentPageNumber = router.query.pageNumber ?? 1;
    const currentPageSize = router.query.pageSize
      ? Number(router.query.pageSize)
      : pageSize;

    const data = {
      clientId: router?.query?.clientId || customer?.id,
      agentId: router?.query?.agentId || agent?.id,
      search:
        finalPatternSearch !== null &&
          finalPatternSearch !== undefined &&
          finalPatternSearch !== ""
          ? finalPatternSearch
          : currentFinalPatternSearch,
      fromDate:
        currentFormattedFromDate || (fromDate && GetDateFormat(fromDate)),
      toDate: currentFormattedToDate || (toDate && GetDateFormat(toDate)),
      fromDueDate:
        currentFormattedFromDueDate ||
        (fromDueDate && GetDateFormat(fromDueDate)),
      toDueDate:
        currentFormattedToDueDate || (toDueDate && GetDateFormat(toDueDate)),

      fromReadyDate:
        currentFormattedFromReadyDate ||
        (fromReadyDate && GetDateFormat(fromReadyDate)),
      toReadyDate:
        currentFormattedToReadyDate ||
        (toReadyDate && GetDateFormat(toReadyDate)),
      productsIds: currentProductsIds,
      productionStatus: currentProductionStatus || status?.value,
      orderStatus: currentOrderStatus || orderStatus?.value,
      pageNumber: currentPageNumber || pageNumber,
      pageSize: currentPageSize,
      orderNumber: router?.query?.orderNumber,
      exampleTypes: currentProofTypes,
    };

    await exportJobTableToExcelApi(callApi, callBack, data);
  };

  const handleClickBackToProcess = async (mission) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllData(isPurchaseJobs, false);
      } else {
        alertFaultUpdate();
      }
    };
    const params = {
      boardMissionId: mission?.id,
      ...(mission?.productType && { productType: mission.productType }),
    };
    await moveBoardMissionStatusToWaitingApi(callApi, callBack, params);
  };

  /*  //////////////////////////////////////////////////////////////////////////////////////////////////// */

  const [isDescOrderBE, setIsDescOrderBE] = useState(false);
  const [currentSortOrder, setCurrentSortOrder] = useState<any>(null);

  const columnMappings: Record<string, Record<string, number>> = {
    boardMissions: {
      creationDate: JobsTableColumns.CreationDate,
      dueDate: JobsTableColumns.DueDate,
    },
    purchaseJobs: {
      creationDate: JobsTableColumns.CreationDate,
      dueDate: JobsTableColumns.DueDate,
    },
    default: {
      creationDate: 0,
      dueDate: 1,
    },
  };

  const isHeaderSortable = (docType: string, header: string): boolean => {
    const mapping = columnMappings[tableKey] || columnMappings.default;
    return mapping.hasOwnProperty(header);
  };

  const handleSortBE = (key: string) => {
    const direction = isDescOrderBE ? "desc" : "asc";

    const columnIndex =
      columnMappings[tableKey]?.[key] ?? columnMappings.default[key];

    if (columnIndex !== undefined) {
      const sortOrder = [
        {
          column: columnIndex,
          dir: direction,
        },
      ];

      setCurrentSortOrder(sortOrder);

      getAllData(isPurchaseJobs, false, sortOrder); // Ensure this calls getAllBoardMissions or getAllPurchaseJobs
      setIsDescOrderBE(!isDescOrderBE);
    } else {
      console.error("Invalid key for sorting:", key);
    }
  };

  const tableKey = isPurchaseJobs ? "purchaseJobs" : "boardMissions";

  const [columnOrder] = useRecoilState(columnOrderStateFamily(tableKey));
  const [columnVisibility] = useRecoilState(
    columnVisibilityStateFamily(tableKey)
  );

  const setColumnVisibility = useSetRecoilState(
    columnVisibilityStateFamily(tableKey)
  );
  const setColumnOrder = useSetRecoilState(columnOrderStateFamily(tableKey));

  const [columnsReady, setColumnsReady] = useState(false);

  const visibleHeaders = columnOrder.filter((key) => columnVisibility[key]);

  return {
    tableHeader,
    tableHeaderForPurchaseJobs,
    agentsCategories,
    renderOptions,
    customer,
    agent,
    status,
    productionStatuses,
    handleMultiSelectChange,
    productIds,
    productsList,
    getAllProducts,
    handleClickSearch,
    handleClickClear,
    onChangeMissionsSearch,
    allBoardMissions,
    allPurchaseJobs,
    patternSearch,
    handleAgentChange,
    handleStatusChange,
    handledSupplierIdChange,
    handleCustomerChange,
    checkWhatRenderArray,
    pagesCount,
    pageNumber,
    setPageNumber,
    handlePageChange,
    onSelectDeliveryTimeDates,
    onSelectDueTimeDates,
    onSelectReadyTimeDates,
    fromDate,
    toDate,
    resetDatePicker,
    resetDueDatePicker,
    resetReadyDatePicker,
    handlePageSizeChange,
    setPageSize,
    pageSize,
    openDuplicateModal,
    onCloseDuplicateModal,
    openMarkReadyModal,
    openMarkReadyModalForProductType,
    onCloseMarkReadyModal,
    onCloseMarkReadyModalForProductType,
    openReturnToProdModal,
    onCloseReturnToProdModal,
    onClickDuplicateMission,
    onClickMoveBoardMissionToDone,
    onClickBackToProcess,
    handleClick,
    handleClose,
    open,
    anchorEl,
    missionItem,
    openPackagesModal,
    onClosePackagesModal,
    quantityPerPackage,
    quantityOfPackages,
    packageInputs,
    handleQuantityPerPackageChange,
    handleQuantityOfPackagesChange,
    openModal,
    onCloseModal,
    onOpenPackagesModal,
    onOpenMarkReadyModal,
    onOpenMarkReadyModalForProductType,
    onClickPrintPackagingSlip,
    openMarkReadyThenPrintModal,
    onCloseMarkReadyThenPrintModal,
    onOpenMarkReadyThenPrintModal,
    supplierId,
    orderStatuses,
    orderStatus,
    handleOrderStatusChange,
    fromReadyDate,
    toReadyDate,
    fromDueDate,
    toDueDate,
    router,
    isFetching,
    printOrderJobsUsingPrintNode,
    searchInputRef,
    showCustomerModal,
    customerForEdit,
    setShowCustomerModal,
    setCustomerForEdit,
    updateQuoteStatus,
    onClickCloseModal,
    openQuoteModal,
    ExportJobsTableToExcel,
    selectedMission,
    handleClickBackToProcess,
    onOpenMarkReadyModalForHasJobs,
    onCloseMarkReadyModalForHasJobs,
    openMarkReadyModalForHasJobs,
    cancelPrintNodeModal,
    initialPageSize,
    isHeaderSortable,
    isDescOrderBE,
    handleSortBE,
    exampleTypeValues,
    sampleType,
    setSampleType,
    proofTypes,
    handleProofTypesChange,
    columnsReady,
    setColumnsReady,
    setColumnOrder,
    visibleHeaders,
    setColumnVisibility,
    tableKey,
  };
};

export { useBoardMissions };
