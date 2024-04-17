import { useAgentsList, useCustomerDropDownList, useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useBoardMissionsSignalr } from "@/hooks/signalr/use-board-missions-signalr";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PStatus } from "./widgets/enums";
import { setBoardMissionsFiltersApi } from "@/services/api-service/board-missions-table/set-borad-missions-filters-api";
import { useDateFormat } from "@/hooks/use-date-format";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { EWorkSource } from "@/widgets/product-pricing-widget/enums";
import { useDebounce } from "@/utils/use-debounce";
import { MoreMenuWidget } from "./widgets/more-circle";
import { BoardMission } from "./widgets/interfaces";
import { DuplicateType } from "@/enums";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useRouter } from "next/router";

const useBoardMissions = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
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
  console.log("RRRR", router.query)

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
            mission?.number,
            EWorkSource[mission?.outSourceType],
            mission?.quantity,
            mission?.cost,
            mission?.price,
            mission?.jobName,
            mission?.numberOfBoardMissions,
            mission?.productName,
            mission?.status && t(`boardMissions.${PStatus[mission?.status]}`),
            <MoreMenuWidget
              mission={mission}
              onClickDuplicate={onOpenDuplicateModal}
              onClickMarksAsDone={onOpenMarkReadyModal}
              onClickReturnToProduction={onOpenReturnToProdModal}
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
    setOpenMarkReadyModal(false);
  };
  const onOpenMarkReadyModal = () => {
    setOpenMarkReadyModal(true);
  };

  const [openReturnToProdModal, setOpenReturnToProdModalModal] = useState<boolean>(false);
  const onCloseReturnToProdModal = () => {
    setOpenReturnToProdModalModal(false);
  };
  const onOpenReturnToProdModal = () => {
    setOpenReturnToProdModalModal(true);
  };

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
  };
};

export { useBoardMissions };