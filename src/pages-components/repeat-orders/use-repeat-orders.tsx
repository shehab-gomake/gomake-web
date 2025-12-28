import {
  useAgentsList,
  useCustomerDropDownList,
  useGomakeAxios,
  useGomakeRouter,
  useSnackBar,
} from "@/hooks";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { BoardMissionStatusForFilter } from "../board-missions/widgets/enums";
import {
  setBoardMissionsFiltersApi,
  repeatOrderApi,
} from "@/services/api-service/board-missions/board-missions-table";
import { useDateFormat } from "@/hooks/use-date-format";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { ORDER_STATUSES } from "@/enums";
import { useRouter } from "next/router";
import { useListPagination } from "@/hooks/use-list-pagination";
import { useRecoilValue } from "recoil";
import { exampleTypeState } from "@/store/example-type";
import { updateDocumentApi } from "@/services/api-service/generic-doc/documents-api";

type StatusOption = {
  label: string;
  value: ORDER_STATUSES;
};

const useRepeatOrders = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const {
    alertFault,
    alertFaultGetData,
    alertSuccess,
    alertSuccessUpdate,
    alertFaultUpdate,
  } = useSnackBar();
  const router = useRouter();
  const { navigate } = useGomakeRouter();
  const { GetDateFormat, formatISODateTime } = useDateFormat();
  const {
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({
    clientType: CLIENT_TYPE.CUSTOMER,
  });
  const { agent, setAgent, agentsCategories, handleAgentChange } =
    useAgentsList();
  const [productsList, setProductsList] = useState([]);
  const exampleTypeValues = useRecoilValue(exampleTypeState);

  const [status, setStatus] = useState<{
    label: string;
    value: BoardMissionStatusForFilter;
  } | null>();
  const [orderStatus, setOrderStatus] = useState<StatusOption>();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [proofTypes, setProofTypes] = useState([]);
  const [isPrintedState, setIsPrintedState] = useState<boolean | null>(null);
  const [isQualityFixJob, setIsQualityFixJob] = useState<boolean | null>(null);
  const [patternSearch, setPatternSearch] = useState<any>(null);
  const [finalPatternSearch, setFinalPatternSearch] = useState("");

  // Date filters
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [fromDueDate, setFromDueDate] = useState<Date>();
  const [toDueDate, setToDueDate] = useState<Date>();
  const [fromReadyDate, setFromReadyDate] = useState<Date>();
  const [toReadyDate, setToReadyDate] = useState<Date>();

  // Jobs data
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Track whether we've already fetched for the current query
  const [hasFetchedQuery, setHasFetchedQuery] = useState<string | null>(null);

  // Change Status Modal state for repeat order
  const [
    openChangeStatusModalForRepeatOrder,
    setOpenChangeStatusModalForRepeatOrder,
  ] = useState<boolean>(false);
  const [selectedQuoteIdForRepeatOrder, setSelectedQuoteIdForRepeatOrder] =
    useState<string | null>(null);

  const {
    pageSize,
    setPageSize,
    pagesCount,
    setPagesCount,
    pageNumber,
    setPageNumber,
    initialPageSize,
  } = useListPagination();

  // Quantity counters for each job card (keyed by job id)
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const productionStatuses = [
    {
      label: t("boardMissions.NoStations"),
      value: BoardMissionStatusForFilter.NoStations,
    },
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

  const handleProofTypesChange = (selectedValues) => {
    setProofTypes(selectedValues);
  };

  const onChangeMissionsSearch = (value: string) => {
    setPatternSearch(value);
  };

  const onSelectDeliveryTimeDates = (value) => {
    if (value && value.length === 2) {
      const [firstDate, secondDate] = value;
      if (firstDate <= secondDate) {
        setFromDate(firstDate);
        setToDate(secondDate);
      } else {
        setFromDate(secondDate);
        setToDate(firstDate);
      }
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  const onSelectDueTimeDates = (value) => {
    if (value && value.length === 2) {
      const [firstDate, secondDate] = value;
      if (firstDate <= secondDate) {
        setFromDueDate(firstDate);
        setToDueDate(secondDate);
      } else {
        setFromDueDate(secondDate);
        setToDueDate(firstDate);
      }
    } else {
      setFromDueDate(null);
      setToDueDate(null);
    }
  };

  const onSelectReadyTimeDates = (value) => {
    if (value && value.length === 2) {
      const [firstDate, secondDate] = value;
      if (firstDate <= secondDate) {
        setFromReadyDate(firstDate);
        setToReadyDate(secondDate);
      } else {
        setFromReadyDate(secondDate);
        setToReadyDate(firstDate);
      }
    } else {
      setFromReadyDate(null);
      setToReadyDate(null);
    }
  };

  const handleClickSearch = () => {
    const newQuery: any = { ...router.query };

    const trimmedSearch = patternSearch?.trim() || "";
    setFinalPatternSearch(trimmedSearch);

    if (trimmedSearch) {
      newQuery.finalPatternSearch = trimmedSearch;
    } else {
      delete newQuery.finalPatternSearch;
    }

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

    if (status?.value !== undefined) {
      newQuery.productionStatus = status.value;
    } else {
      delete newQuery.productionStatus;
    }

    if (orderStatus?.value !== undefined) {
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

    if (isPrintedState !== null) {
      newQuery.isPrinted = isPrintedState.toString();
    } else {
      delete newQuery.isPrinted;
    }

    if (isQualityFixJob !== null) {
      newQuery.isQualityFixJob = isQualityFixJob.toString();
    } else {
      delete newQuery.isQualityFixJob;
    }

    router.replace(
      {
        pathname: router.pathname,
        query: { ...newQuery, pageNumber: 1, pageSize: String(pageSize) },
      },
      undefined,
      { shallow: true }
    );

    setPageNumber(1);
  };

  const getAllProducts = useCallback(async () => {
    const products = await getAllProductsForDropDownList(
      callApi,
      setProductsList
    );
    setProductsList(
      products.map(({ id, name }) => ({ label: name, value: id }))
    );
  }, [callApi]);

  const handleClickClear = () => {
    setPatternSearch(null);
    setFinalPatternSearch("");
    setCustomer(null);
    setAgent(null);
    setStatus(null);
    setOrderStatus(null);
    setProductIds([]);
    setProofTypes([]);
    setIsPrintedState(null);
    setIsQualityFixJob(null);
    setFromDate(null);
    setToDate(null);
    setFromDueDate(null);
    setToDueDate(null);
    setFromReadyDate(null);
    setToReadyDate(null);
    setPageNumber(1);

    const query: any = {
      pageNumber: "1",
      pageSize: String(router.query.pageSize ?? pageSize),
    };

    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPageNumber(page);
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, pageNumber: String(page) },
      },
      undefined,
      { shallow: true }
    );
  };

  const handlePageSizeChange = (event: any, child?: React.ReactNode) => {
    const size = Number(event.target.value);
    setPageSize(size);
    setPageNumber(1);
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, pageNumber: "1", pageSize: String(size) },
      },
      undefined,
      { shallow: true }
    );
  };

  // Fetch jobs data
  const getAllJobs = async (isClear: boolean = false) => {
    setIsError(false);
    setIsLoading(true);

    const callBack = (res) => {
      if (res?.success) {
        const _data = res?.data;
        const jobsData = _data.data || [];

        // Initialize quantities with job quantities
        const newQuantities: Record<string, number> = {};
        jobsData.forEach((job: any) => {
          newQuantities[job.id] = job.quantity || 1;
        });
        setQuantities(newQuantities);

        setJobs(jobsData);
        const currentPageSize = router.query.pageSize
          ? Number(router.query.pageSize)
          : pageSize;
        setPagesCount(Math.ceil(_data?.totalItems / currentPageSize));
      } else {
        setIsError(true);
        alertFaultGetData();
        setJobs([]);
      }
      setIsLoading(false);
    };

    if (!router.isReady) {
      return;
    }

    // Read filter values from URL query params (like board-missions does)
    const currentFinalPatternSearch = router.query.finalPatternSearch;
    const currentClientId = router.query.clientId;
    const currentAgentId = router.query.agentId;
    const currentProductionStatus = router.query.productionStatus;
    const currentOrderStatus = router.query.orderStatus;
    const currentProductsIds = Array.isArray(router.query.productsIds)
      ? router.query.productsIds
      : router.query.productsIds
      ? [router.query.productsIds]
      : [];
    const currentProofTypes = Array.isArray(router.query.proofTypes)
      ? router.query.proofTypes
      : router.query.proofTypes
      ? [router.query.proofTypes]
      : [];
    const currentFromDate = router.query.fromDate;
    const currentToDate = router.query.toDate;
    const currentFromDueDate = router.query.fromDueDate;
    const currentToDueDate = router.query.toDueDate;
    const currentFromReadyDate = router.query.fromReadyDate;
    const currentToReadyDate = router.query.toReadyDate;
    const currentIsPrinted = router.query.isPrinted;
    const currentIsQualityFixJob = router.query.isQualityFixJob;

    // Format dates from query params
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

    const currentPageNumber = router.query.pageNumber ?? pageNumber;
    const currentPageSize = router.query.pageSize
      ? Number(router.query.pageSize)
      : pageSize;
    const currentIsPrintedValue =
      currentIsPrinted === "true"
        ? true
        : currentIsPrinted === "false"
        ? false
        : undefined;
    const currentIsQualityFixJobValue =
      currentIsQualityFixJob === "true"
        ? true
        : currentIsQualityFixJob === "false"
        ? false
        : undefined;

    const data = isClear
      ? {
          productsIds: [],
          pageNumber: currentPageNumber || 1,
          pageSize: currentPageSize,
        }
      : {
          clientId: currentClientId || customer?.id,
          agentId: currentAgentId || agent?.id,
          search: currentFinalPatternSearch || finalPatternSearch,
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
          productsIds:
            currentProductsIds.length > 0
              ? currentProductsIds
              : productIds.length > 0
              ? productIds
              : [],
          productionStatus: currentProductionStatus || status?.value,
          orderStatus: currentOrderStatus || orderStatus?.value,
          pageNumber: currentPageNumber || pageNumber,
          pageSize: currentPageSize,
          exampleTypes:
            currentProofTypes.length > 0 ? currentProofTypes : proofTypes,
          isPrinted:
            currentIsPrintedValue !== undefined
              ? currentIsPrintedValue
              : isPrintedState,
          isQualityFixJob:
            currentIsQualityFixJobValue !== undefined
              ? currentIsQualityFixJobValue
              : isQualityFixJob !== null
              ? isQualityFixJob
              : undefined,
        };

    await setBoardMissionsFiltersApi(callApi, callBack, data);
  };

  // Quantity counter handlers
  const handleQuantityIncrease = (jobId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [jobId]: (prev[jobId] || 1) + 1,
    }));
  };

  const handleQuantityDecrease = (jobId: string) => {
    setQuantities((prev) => {
      const current = prev[jobId] || 1;
      return {
        ...prev,
        [jobId]: Math.max(1, current - 1),
      };
    });
  };

  const onClickOpenChangeStatusModalForRepeatOrder = (quoteId: string) => {
    setSelectedQuoteIdForRepeatOrder(quoteId);
    setOpenChangeStatusModalForRepeatOrder(true);
  };

  const onClickCloseChangeStatusModalForRepeatOrder = () => {
    setOpenChangeStatusModalForRepeatOrder(false);
    setSelectedQuoteIdForRepeatOrder(null);
  };

  const updateQuoteStatusForRepeatOrder = async () => {
    if (!selectedQuoteIdForRepeatOrder) return;

    const callBack = (res) => {
      if (res?.success) {
        onClickCloseChangeStatusModalForRepeatOrder();
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
        documentId: selectedQuoteIdForRepeatOrder,
      },
    });
  };

  // Repeat order handler
  const handleRepeatOrder = async (job: any) => {
    const quantity = quantities[job.id] || job.quantity || 1;

    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllJobs(false);

        const isAnotherQuoteInCreate = res?.data?.isAnotherQuoteInCreate;
        const documentId = res?.data?.documentId;

        if (!isAnotherQuoteInCreate) {
          // No existing quote, redirect to quote cart
          navigate("/quote");
        } else {
          // Existing quote in Create status, show modal to save it
          onClickOpenChangeStatusModalForRepeatOrder(documentId);
        }
      } else {
        alertFault(res?.message || t("repeatOrders.repeatOrderError"));
      }
    };

    await repeatOrderApi(callApi, callBack, {
      boardMissionId: job.id,
      quantity: quantity,
      orderItemId: job.orderItemId || job.orderId,
    });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Sync with URL query params and fetch data when query changes
  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const isNotFilteredData = Object.keys(router?.query || {}).length === 0;

    const effectivePageSize = router.query.pageSize
      ? Number(router.query.pageSize)
      : pageSize;

    const signature = JSON.stringify({
      q: router.query,
      pageSize: effectivePageSize,
    });

    if (isNotFilteredData) {
      getAllJobs(true);
      setHasFetchedQuery(null);
    } else if (hasFetchedQuery !== signature) {
      getAllJobs(false);
      setHasFetchedQuery(signature);
    }
  }, [router.query, router.isReady, pageSize]);

  return {
    // Filters
    customer,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    agent,
    agentsCategories,
    handleAgentChange,
    status,
    handleStatusChange,
    productionStatuses,
    orderStatus,
    handleOrderStatusChange,
    orderStatuses,
    proofTypes,
    handleProofTypesChange,
    isPrintedState,
    setIsPrintedState,
    isQualityFixJob,
    setIsQualityFixJob,
    productsList,
    productIds,
    handleMultiSelectChange,
    fromDate,
    toDate,
    onSelectDeliveryTimeDates,
    fromDueDate,
    toDueDate,
    onSelectDueTimeDates,
    fromReadyDate,
    toReadyDate,
    onSelectReadyTimeDates,
    patternSearch,
    onChangeMissionsSearch,
    handleClickSearch,
    handleClickClear,
    handleCustomerChange,

    // Data
    jobs,
    isLoading,
    isError,

    // Pagination
    pageNumber,
    setPageNumber,
    pagesCount,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    initialPageSize,

    // Quantity management
    quantities,
    handleQuantityIncrease,
    handleQuantityDecrease,
    handleRepeatOrder,

    // Utils
    formatISODateTime,
    router,
    exampleTypeValues,

    // Change Status Modal
    openChangeStatusModalForRepeatOrder,
    onClickCloseChangeStatusModalForRepeatOrder,
    updateQuoteStatusForRepeatOrder,
  };
};

export { useRepeatOrders };
