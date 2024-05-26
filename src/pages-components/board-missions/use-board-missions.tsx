import { useAgentsList, useCustomerDropDownList, useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useBoardMissionsSignalr } from "@/hooks/signalr/use-board-missions-signalr";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PStatus } from "./widgets/enums";
import { getDeliveryTickerPdfApi, getOrderSummeryPdfApi, getWorkMissionPdfApi, setBoardMissionsFiltersApi } from "@/services/api-service/board-missions-table/board-missions-table";
import { useDateFormat } from "@/hooks/use-date-format";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { EWorkSource } from "@/widgets/product-pricing-widget/enums";
import { useDebounce } from "@/utils/use-debounce";
import { MoreMenuWidget } from "./widgets/more-circle";
import { DuplicateType } from "@/enums";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { GomakeTextInput } from "@/components/text-input/text-input";
import { useStyle } from "./style";
import { useRouter } from "next/router";
import { backToProcessApi, moveBoardMissionToDoneApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { downloadPdf } from "@/utils/helpers";

const useBoardMissions = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFault, alertFaultGetData, alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const { data, connectionId } = useBoardMissionsSignalr();
  const { navigate } = useGomakeRouter();
  const [status, setStatus] = useState<{
    label: string;
    value: PStatus;
  } | null>();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [productsList, setProductsList] = useState([]);
  const [patternSearch, setPatternSearch] = useState<string>();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [allBoardMissions, setAllBoardMissions] = useState([]);
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const { GetDateFormat } = useDateFormat();
  const [finalPatternSearch, setFinalPatternSearch] = useState("");
  const debounce = useDebounce(patternSearch, 500);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);
  const { customer, setCustomer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList()
  const { agent, setAgent, agentsCategories, handleAgentChange } = useAgentsList()
  const router = useRouter()
  const [selectedMission, setSelectedMission] = useState<any>({})
  console.log("selectedMission", selectedMission)
  const handlePageSizeChange = (event) => {
    setPageNumber(1);
    setPageSize(event.target.value);
  };


  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  useEffect(() => {
    setFinalPatternSearch(debounce);
  }, [debounce]);

  const productionStatuses = [
    { label: t("boardMissions.inProduction"), value: PStatus.IN_PROCESS },
    { label: t("boardMissions.done"), value: PStatus.DONE },
  ];

  const tableHeader = [
    // t("boardMissions.image"),
    t("boardMissions.creationDate"),
    t("boardMissions.dueDate"),
    t("boardMissions.clientName"),
    t("boardMissions.missionNumber"),
    t("mailingSettings.orderNumber"),
    t("boardMissions.outSourceType"),
    t("boardMissions.quantity"),
    t("boardMissions.costFromOrderItem"),
    t("boardMissions.priceFromOrderItem"),
    t("boardMissions.jobName"),
    t("boardMissions.numberOfBoardMissionsInOrder"),
    t("boardMissions.productName"),
    t("boardMissions.currentBoardMissionStatus"),
    t("properties.more")
  ];

  const handleMultiSelectChange = (newValues: string[]) => {
    setProductIds(newValues);
  };

  const handleStatusChange = (e: any, value: any) => {
    setStatus(value);
  };

  const handleClickSearch = () => {
    setPageNumber(1);
    getAllBoardMissions();
  };

  const handleClickClear = () => {
    setAgent(null);
    setCustomer(null);
    setStatus(null);
    setProductIds([]);
    setPatternSearch("");
    setFromDate(null);
    setToDate(null);
    setResetDatePicker(true);
    pageNumber === 1 ? getAllBoardMissions(true) : setPageNumber(1);
  };
  useEffect(() => {
    if (router.query.orderNumber) {
      setPatternSearch(router.query.orderNumber as string);
    }

  }, [router])
  const onChangeMissionsSearch = (value: string) => {
    setPatternSearch(value);
  };

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
  const getAllBoardMissions = async (isClear: boolean = false) => {
    if (connectionId) {
      const callBack = (res) => {
        if (res?.success) {
          const _data = res?.data;
          const mapData = _data.data?.map((mission: any) => [
            GetDateFormat(mission?.createdDate),
            GetDateFormat(mission?.dueDate),
            mission?.clientName,
            mission?.productType ? `${mission?.number} / ${mission?.orderNumber} / ${mission?.productType}` : mission?.number,
            mission?.orderNumber,
            EWorkSource[mission?.outSourceType],
            mission?.quantity,
            mission?.cost,
            mission?.price,
            mission?.jobName,
            mission?.numberOfBoardMissions,
            mission?.productName,
            `${mission?.boardMissionStatus?.name} / ${mission?.station?.actionName}`,
            <MoreMenuWidget
              mission={mission}
              onClickDuplicate={onOpenDuplicateModal}
              onOpenModal={onOpenModal}
              onClickPrintPackagingSlip={onOpenPackagesModal}
              onClickMarksAsDone={onOpenMarkReadyModal}
              onClickReturnToProduction={onOpenReturnToProdModal}
              onClickOrderSummeryPdf={onClickOrderSummeryPdf}
              onClickWorkMissionPdf={onClickWorkMissionPdf}
            />
          ]);
          setAllBoardMissions(mapData);
          setPagesCount(Math.ceil(_data?.totalItems / pageSize));
        }
        else {
          alertFaultGetData();
        }
      };
      await setBoardMissionsFiltersApi(callApi, callBack,
        isClear ?
          {
            // signalrConnectionId: connectionId,
            productsIds: [],
            pageNumber: pageNumber,
            pageSize: pageSize,
          }
          :
          {
            // signalrConnectionId: connectionId,
            clientId: customer?.id,
            agentId: agent?.id,
            search: finalPatternSearch,
            fromDate: fromDate && GetDateFormat(fromDate),
            toDate: toDate && GetDateFormat(toDate),
            productsIds: productIds,
            productionStatus: status?.value,
            pageNumber: pageNumber,
            pageSize: pageSize,
          });
    }
  };

  const onClickDuplicateMission = (duplicateType: DuplicateType) => {
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

  const onClickWorkMissionPdf = async (boardMissionId: string) => {
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        window.open(pdfLink, "_blank");
      } else {
        alertFaultGetData();
      }
    };
    await getWorkMissionPdfApi(callApi, callBack, { boardMissionId });
  };

  const onClickPrintPackagingSlip = async () => {
    if (quantityPerPackage > missionItem?.quantity) {
      alertFault("boardMissions.alertQuantity");
      return;
    }
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink)
        onClosePackagesModal()
      } else {
        alertFaultGetData();
      }
    };
    await getDeliveryTickerPdfApi(callApi, callBack, { boardMissionId: missionItem?.id, quantityOnPackages: quantityPerPackage });
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
    setSelectedMission({})
    setOpenMarkReadyModal(false);
  };
  const onOpenMarkReadyModal = (mission) => {
    setSelectedMission(mission)
    setOpenMarkReadyModal(true);
  };


  const [openMarkReadyThenPrintModal, setOpenMarkReadyThenPrintModal] = useState<boolean>(false);
  const onCloseMarkReadyThenPrintModal = () => {
    setOpenMarkReadyThenPrintModal(false);
  };
  const onOpenMarkReadyThenPrintModal = () => {
    setOpenMarkReadyThenPrintModal(true);
  };



  const [openReturnToProdModal, setOpenReturnToProdModalModal] = useState<boolean>(false);
  const onCloseReturnToProdModal = () => {
    setSelectedMission({})
    setOpenReturnToProdModalModal(false);
  };
  const onOpenReturnToProdModal = (mission) => {
    setSelectedMission(mission)
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
  }, [missionItem])

  // useEffect(() => {
  //   const mapData = data?.data?.map((mission: any) => [
  //     GetDateFormat(mission?.createdDate),
  //     GetDateFormat(mission?.dueDate),
  //     mission?.clientName,
  //     mission?.number,
  //     EWorkSource[mission?.outSourceType],
  //     mission?.quantity,
  //     mission?.cost,
  //     mission?.price,
  //     mission?.jobName,
  //     mission?.numberOfBoardMissions,
  //     mission?.productName,
  //     mission?.status,
  //   ]);
  //   setAllBoardMissions(mapData);
  //   setPagesCount(Math.ceil(data?.totalItems / pageSize));
  // }, [data, connectionId]);

  useEffect(() => {
    getAllBoardMissions();
  }, [connectionId, pageNumber, pageSize, finalPatternSearch]);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const [quantityOfPackages, setQuantityOfPackages] = useState(1);
  const [quantityPerPackage, setQuantityPerPackage] = useState(missionItem?.quantity || 0);

  const remainingQuantity = missionItem?.quantity - quantityPerPackage * (quantityOfPackages - 1);

  const handleQuantityOfPackagesChange = (event) => {
    const newQuantityOfPackages = parseInt(event.target.value, 10);
    const totalQuantity = missionItem?.quantity || 0;
    const newQuantityPerPackage = Math.ceil(totalQuantity / newQuantityOfPackages);
    setQuantityOfPackages(newQuantityOfPackages);
    setQuantityPerPackage(newQuantityPerPackage);
  };

  const handleQuantityPerPackageChange = (event) => {
    const newQuantityPerPackage = parseInt(event.target.value, 10);
    const totalQuantity = missionItem?.quantity;
    const newQuantityOfPackages = Math.ceil(totalQuantity / newQuantityPerPackage);
    setQuantityPerPackage(newQuantityPerPackage);
    setQuantityOfPackages(newQuantityOfPackages);
  };

  const packageInputs = useMemo(() => {
    return [...Array(quantityOfPackages)].map((_, index) => (
      <div key={index} style={{ width: "40%" }} >
        <h3 style={classes.packageLabelStyle}>
          {`${t("boardMissions.package")} ${index + 1}`}
        </h3>
        <div style={classes.inputValueStyle}>
          {
            index === quantityOfPackages - 1
              ? remainingQuantity
              : quantityPerPackage
          }
        </div>
      </div>
    ));
  }, [quantityOfPackages, quantityPerPackage, remainingQuantity]);


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
        alertSuccessUpdate()
      } else {
        alertFaultUpdate();
      }
    };
    await moveBoardMissionToDoneApi(callApi, callBack, { boardMissionId: selectedMission?.id, sendMessage });
  };
  const onClickBackToProcess = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate()
      } else {
        alertFaultUpdate();
      }
    };
    await backToProcessApi(callApi, callBack, { boardMissionId: selectedMission?.id, sendMessage: false });
  };


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    tableHeader,
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
    fromDate,
    toDate,
    resetDatePicker,
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
  };
};

export { useBoardMissions };