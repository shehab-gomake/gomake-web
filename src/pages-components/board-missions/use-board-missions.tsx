import {
  useAgentsList,
  useCustomerDropDownList,
  useGomakeAxios,
  useGomakeRouter,
  useSnackBar,
} from "@/hooks";
import { useBoardMissionsSignalr } from "@/hooks/signalr/use-board-missions-signalr";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PStatus } from "./widgets/enums";
import {
  getAllPurchaseJobsApi,
  getDeliveryTickerPdfApi,
  getOrderSummeryPdfApi,
  getWorkMissionPdfApi,
  printOrderJobUsingPrintNodeApi,
  setBoardMissionsFiltersApi,
} from "@/services/api-service/board-missions/board-missions-table";
import { useDateFormat } from "@/hooks/use-date-format";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { EWorkSource } from "@/widgets/product-pricing-widget/enums";
import { useDebounce } from "@/utils/use-debounce";
import { MoreMenuWidget } from "./widgets/more-circle";
import { DuplicateType, ORDER_STATUSES } from "@/enums";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useStyle } from "./style";
import { useRouter } from "next/router";
import {
  backToProcessApi,
  moveBoardMissionToDoneApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { downloadPdf } from "@/utils/helpers";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import { useQuoteGetData } from "../quote-new/use-quote-get-data";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { GomakeTextInput } from "@/components";

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
}

const useBoardMissions = ({ isPurchaseJobs }) => {
  const { CheckPermission } = useUserPermission();
  const { getCurrencyUnitText } = useQuoteGetData();
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const {
    alertFault,
    alertFaultGetData,
    alertFaultUpdate,
    alertSuccessUpdate,
  } = useSnackBar();
  const { connectionId } = useBoardMissionsSignalr();
  const { navigate } = useGomakeRouter();
  const [status, setStatus] = useState<{
    label: string;
    value: PStatus;
  } | null>();
  const searchInputRef = useRef(null);
  const [orderStatus, setOrderStatus] = useState<StatusOption>();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [productsList, setProductsList] = useState([]);

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
  const { GetDateFormat, getFormattedLocalDate, GetJobDateFormat } =
    useDateFormat();
  const [finalPatternSearch, setFinalPatternSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);

  const {
    customer,
    supplierList,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({
    shouldRenderCustomersOnMount: !isPurchaseJobs,
    shouldRenderSuppliersOnMount: isPurchaseJobs,
  });

  const { agent, setAgent, agentsCategories, handleAgentChange } =
    useAgentsList();
  const router = useRouter();
  const [selectedMission, setSelectedMission] = useState<any>({});
  const handlePageSizeChange = (event) => {
    setPageNumber(1);
    setPageSize(event.target.value);
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
    { label: t("boardMissions.inProduction"), value: PStatus.IN_PROCESS },
    { label: t("boardMissions.done"), value: PStatus.DONE },
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
    t("mailingSettings.orderNumber"),
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

  const handleClickSearch = () => {
    const newQuery: Query = { ...router.query };

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

    router.replace(
      {
        pathname: router.pathname,
        query: { ...newQuery },
      },
      undefined,
      { shallow: true }
    );
    handleClose();
    setPageNumber(1);
    //getAllData(isPurchaseJobs, false); // moved to useEffect below
  };

  const handleClickClear = () => {
    setAgent(null);
    setCustomer(null);
    setStatus(null);
    setOrderStatus(null);
    setProductIds([]);
    setPatternSearch("");
    setFromDate(null);
    setFromDueDate(null);
    setFromReadyDate(null);
    setToDate(null);
    setToDueDate(null);
    setToReadyDate(null);
    setResetDatePicker(true);
    setResetDueDatePicker(true);
    setResetReadyDatePicker(true);
    setPageNumber(1);

    const query = {};
    router.replace(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { shallow: true }
    );
    handleClose();
    //getAllData(isPurchaseJobs, true); // moved to useEffect below
  };

  const [hasFetchedQuery, setHasFetchedQuery] = useState<string | null>(null);
  useEffect(() => {
    const isNotFilteredData = Object.keys(router?.query || {}).length === 0;
    const serializedQuery = JSON.stringify(router.query);

    if (isNotFilteredData) {
      getAllData(isPurchaseJobs, true);
    } else if (hasFetchedQuery !== serializedQuery) {
      getAllData(isPurchaseJobs, false);
      setHasFetchedQuery(serializedQuery); // Mark this query as fetched
    }
  }, [connectionId, pageSize, router]);

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
    isClear: boolean = false
  ) => {
    if (isPurchaseJobs) {
      return await getAllPurchaseJobs(isClear);
    } else {
      return await getAllBoardMissions(isClear);
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
    if (mission?.isReady) {
      return t("boardMissions.done");
    }
    if (mission?.boardMissionStatus && mission?.station) {
      const empName =
        mission.station.machineName && mission.station.machineId
          ? mission.station.machineName
          : mission.station.employeeName;
      if (empName)
        return `${mission.boardMissionStatus.name} \n\r ${mission.station.actionName} \n\r ${empName}`;
      return `${mission.boardMissionStatus.name} \n\r ${mission.station.actionName}`;
    }
    return "";
  };

  const getAllBoardMissions = async (isClear: boolean = false) => {
    if (connectionId || true) {
      const callBack = (res) => {
        if (res?.success) {
          const _data = res?.data;
          const mapData = _data.data?.map((mission: any) => {
            const itemCalculatedPrice =
              mission?.calculatedPrice &&
              mission?.calculatedPrice != mission?.price
                ? mission?.calculatedPrice
                : 0;
            return [
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
              </a>,
              GetJobDateFormat(mission?.createdDate),
              GetJobDateFormat(mission?.dueDate),
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(mission?.customerID)}
              >
                {mission?.clientName}
              </div>,
              mission?.productType
                ? `${mission?.number} / ${mission?.productType}`
                : mission?.number,
              <a
                style={classes.tableAtagStyle}
                href={`/order?Id=${mission?.orderID}`}
              >
                {mission?.orderNumber}
              </a>,
              mission?.outSourceType === null
                ? EWorkSource[0]
                : EWorkSource[mission?.outSourceType],
              mission?.quantity,
              ...(CheckPermission(Permissions.SHOW_COSTS_IN_BOARD_MISSIONS)
                ? [mission?.cost + " " + getCurrencyUnitText(mission?.currency)]
                : []),
              ...(CheckPermission(Permissions.SHOW_COSTS_IN_BOARD_MISSIONS)
                ? [
                    mission?.price +
                      (itemCalculatedPrice
                        ? ` (${itemCalculatedPrice})`
                        : " ") +
                      getCurrencyUnitText(mission?.currency),
                  ]
                : []),
              mission?.jobName,
              mission?.numberOfBoardMissions,
              mission?.productName,
              <div style={{ whiteSpace: "break-spaces" }}>
                {getJobStatus(mission)}
              </div>,
              <MoreMenuWidget
                mission={mission}
                onClickDuplicate={onOpenDuplicateModal}
                onOpenModal={onOpenModal}
                onClickPrintPackagingSlip={onOpenPackagesModal}
                onClickMarksAsDone={onOpenMarkReadyModal}
                onClickReturnToProduction={onOpenReturnToProdModal}
                onClickOrderSummeryPdf={onClickOrderSummeryPdf}
                onClickWorkMissionPdf={onClickWorkMissionPdf}
              />,
            ];
          });
          setAllBoardMissions(mapData);
          setPagesCount(Math.ceil(_data?.totalItems / pageSize));
        } else {
          alertFaultGetData();
        }
      };

      const currentFinalPatternSearch = router.query.finalPatternSearch;
      const currentPageNumber = router.query.pageNumber;

      await setBoardMissionsFiltersApi(
        callApi,
        callBack,
        isClear
          ? {
              productsIds: [],
              pageNumber: pageNumber,
              pageSize: pageSize,
            }
          : {
              clientId: customer?.id || router?.query?.clientId,
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
              pageNumber: currentPageNumber || pageNumber,
              pageSize: pageSize,
              orderNumber: router?.query?.orderNumber,
            }
      );
    }
  };

  const getAllPurchaseJobs = async (isClear: boolean = false) => {
    if (connectionId) {
      const callBack = (res) => {
        if (res?.success) {
          const _data = res?.data;
          const mapData = _data.data?.map((mission: any) => [
            // mission?.createdDate?.split("T")[0],
            // mission?.dueDate?.split("T")[0],
            GetJobDateFormat(mission?.createdDate),
            GetJobDateFormat(mission?.dueDate),
            <div
              style={{ cursor: "pointer" }}
              onClick={() => onClickOpenCustomerModal(mission?.customerID)}
            >
              {mission?.clientName}
            </div>,
            mission?.supplierName,
            mission?.productType
              ? `${mission?.number} / ${mission?.productType}`
              : mission?.number,
            mission?.orderNumber,
            mission?.purchaseOrderNumber,
            mission?.outSourceType === null
              ? EWorkSource[0]
              : EWorkSource[mission?.outSourceType],
            mission?.quantity,
            mission?.cost,
            mission?.price,
            mission?.jobName,
            mission?.numberOfBoardMissions,
            mission?.productName,
            mission?.isReady
              ? t("boardMissions.done")
              : mission?.boardMissionStatus && mission?.station
              ? `${mission.boardMissionStatus.name} / ${mission.station.actionName}`
              : "",
            <MoreMenuWidget
              mission={mission}
              onClickDuplicate={onOpenDuplicateModal}
              onOpenModal={onOpenModal}
              onClickPrintPackagingSlip={onOpenPackagesModal}
              onClickMarksAsDone={onOpenMarkReadyModal}
              onClickReturnToProduction={onOpenReturnToProdModal}
              onClickOrderSummeryPdf={onClickOrderSummeryPdf}
              onClickWorkMissionPdf={onClickWorkMissionPdf}
            />,
          ]);
          setAllPurchaseJobs(mapData);
          setPagesCount(Math.ceil(_data?.totalItems / pageSize));
        } else {
          alertFaultGetData();
        }
      };
      const currentFinalPatternSearch = router.query.finalPatternSearch;
      const currentPageNumber = router.query.pageNumber;

      await getAllPurchaseJobsApi(
        callApi,
        callBack,
        isClear
          ? {
              productsIds: [],
              pageNumber: pageNumber,
              pageSize: pageSize,
            }
          : {
              ...(isPurchaseJobs
                ? { supplierId: customer?.id }
                : { clientId: customer?.id }),

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
                pageNumber: currentPageNumber || pageNumber,

                pageSize: pageSize,
              isPurchaseJobs: true,
            }
      );
    }
  };

  const onClickDuplicateMission = (duplicateType: DuplicateType) => {
    const { targetOrderId, targetOrderNumber } = router?.query;
    if (targetOrderId)
      navigate(
        `/products/duplicate?clientTypeId=${
          missionItem?.clientTypeId
        }&customerId=${
          missionItem?.customerID
        }&customerName=${encodeURIComponent(
          missionItem?.clientName || ""
        )}&productId=${missionItem?.productID}&documentItemId=${
          missionItem?.orderItemId
        }&documentType=${
          DOCUMENT_TYPE.order
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
    actionId: string
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
  const onCloseMarkReadyModal = () => {
    setSelectedMission({});
    setOpenMarkReadyModal(false);
  };
  const onOpenMarkReadyModal = (mission) => {
    setSelectedMission(mission);
    setOpenMarkReadyModal(true);
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
    setSelectedMission({});
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

  //!here
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
      updatedQuantities[index] = newValue;

      if (index === quantityOfPackages - 1) {
        const totalQuantity = missionItem?.quantity || 0;
        const sumOfOtherPackages = updatedQuantities
          .slice(0, -1)
          .reduce((acc, val) => acc + val, 0);
        updatedQuantities[index] = totalQuantity - sumOfOtherPackages;
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
              console.log("newValue", { newValue, index });
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

  /* Most Important*/
  /* Read URL parameters and set state accordingly*/
  //!here
  useEffect(() => {
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
    } = router.query;

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
  }, [router, agentsCategories]);

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
    onCloseMarkReadyModal,
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
    onClickPrintPackagingSlip,
    openMarkReadyThenPrintModal,
    onCloseMarkReadyThenPrintModal,
    onOpenMarkReadyThenPrintModal,
    selectedMission,
    supplierList,
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
  };
};

export { useBoardMissions };
