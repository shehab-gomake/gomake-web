import { useTranslation } from "react-i18next";
import {
  useAgentsList,
  useCustomerDropDownList,
  useGomakeAxios,
  useSnackBar,
} from "@/hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { useRouter } from "next/router";
import { useIsMobile } from "@/hooks/use-responsive";
import { useQuoteGetData } from "../quote-new/use-quote-get-data";
import { getDeliveriesTableApi } from "@/services/api-service/document-deliveries/get-deliveries-table";
import { useDateFormat } from "@/hooks/use-date-format";
import { useDebounce } from "@/utils/use-debounce";
import { ClickableStatusButton } from "../quotes/widgets/delivery-status-button/delivery-status-button";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useDeliveriesSocketIo } from "@/hooks/socket-io/use-deliveries-socket-io";
import { useListPagination } from "@/hooks/use-list-pagination";
import { useModal } from "@/hooks/use-modal";
import { moveOrderToReadyApi } from "@/services/api-service/generic-doc/documents-api";

interface Query {
  customerId?: string;
  customerName?: string;
  agentId?: string;
  pageNumber?: number;
  shipmentTypeId?: string;
}

const useDeliveries = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData, alertFaultUpdate } = useSnackBar();
  const router = useRouter();
  const { query } = useRouter();
  const { orderId, customerId, documentNumber } = query;

  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { initialPageSize, pageSize, setPageSize, pagesCount, setPagesCount } =
    useListPagination();

  useEffect(() => {
    if (initialPageSize && initialPageSize !== pageSize) {
      setPageSize(initialPageSize);
    }
  }, [initialPageSize]);
  const handlePageSizeChange = (event) => {
    setPage(1);
    setPageSize(event.target.value);
  };
  const [patternSearch, setPatternSearch] = useState<any>(
    router.query.finalPatternSearch || null
  );
  const [finalPatternSearch, setFinalPatternSearch] = useState<any>("");
  const searchInputRef = useRef(null);
  const open = Boolean(anchorEl);

  const { agent, setAgent, agentsCategories, handleAgentChange } =
    useAgentsList();

  const {
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({});

  const { getAllShipmentTypes, shipmentTypes } = useQuoteGetData();
  const [deliveryTypeValue, setDeliveryTypeValue] = useState<{
    label: string;
    value: string;
  }>();

  const tableHeaders = isMobile
    ? [
        t("sales.quote.client"),
        t("sales.documentDeliveries.deliveryStatus"),
        t("sales.quote.creationDate"),
        t("sales.quote.agent"),
        t("sales.quote.orderNumber"),
        t("sales.quote.worksName"),
        t("sales.quote.itemsNumber"),
        t("customers.modal.shipmentType"),
      ]
    : [
        t("sales.quote.creationDate"),
        t("sales.quote.client"),
        t("sales.quote.agent"),
        t("sales.quote.orderNumber"),
        t("sales.quote.worksName"),
        t("sales.quote.itemsNumber"),
        t("sales.documentDeliveries.deliveryStatus"),
        t("customers.modal.shipmentType"),
      ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChangeDocumentSearch = (value: string) => {
    setPatternSearch(value);
  };

  const onClickClearFilter = () => {
    handleClose();
    setPage(1);
    setCustomer(null);
    setAgent(null);
    setDeliveryTypeValue(null);
    setPatternSearch("");
    setFinalPatternSearch("");

    const query = {};
    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  const onClickSearchFilter = async () => {
    const query: Query = { ...router.query };

    if (customer?.id) query.customerId = customer.id;
    else delete query.customerId;

    if (customer?.name) query.customerName = customer.name;
    else delete query.customerName;

    if (agent?.id) query.agentId = agent.id;
    else delete query.agentId;

    if (page) query.pageNumber = page;
    else delete query.pageNumber;

    if (deliveryTypeValue?.value)
      query.shipmentTypeId = deliveryTypeValue?.value;
    else delete query.shipmentTypeId;

    handleClose();
    setPage(1);

    await router.push({
      pathname: router.pathname,
      query: { ...query },
    });
  };

  const { formatCustomDateTime } = useDateFormat();
  const [rawDeliveriesData, setRawDeliveriesData] = useState<any[]>([]);

  const getDeliveriesTable = async (isClear: boolean = false) => {
    const callBack = (res) => {
      if (res?.success) {
        const data = res?.data?.data;
        const totalItems = res?.data?.totalItems;
        // const mapData = data?.map((item: any) =>
        //   isMobile
        //     ? [
        //         item?.clientName,
        //         <ClickableStatusButton
        //           id={item?.orderId}
        //           document={{
        //             ...item,
        //             id: item?.orderId,
        //             customerId: item?.clientId,
        //             number: item?.orderNumber,
        //           }}
        //           documentType={DOCUMENT_TYPE.order}
        //           openModalOnClick={true}
        //         />,
        //         formatCustomDateTime(item?.createdDate).split(" ")[0],
        //         item?.agentName ?? "-",
        //         item?.orderNumber,
        //         item?.worksNames ?? "-",
        //         item?.numberOfItems,
        //         item?.isSelfCollection
        //           ? t("sales.documentDeliveries.selfCollection")
        //           : item?.shipmentTypeName,
        //       ]
        //     : [
        //         formatCustomDateTime(item?.createdDate).split(" ")[0],
        //         item?.clientName,
        //         item?.agentName ?? "-",
        //         item?.orderNumber,
        //         item?.worksNames ?? "-",
        //         item?.numberOfItems,
        //         <ClickableStatusButton
        //           id={item?.orderId}
        //           document={{
        //             ...item,
        //             id: item?.orderId,
        //             customerId: item?.clientId,
        //             number: item?.orderNumber,
        //           }}
        //           documentType={DOCUMENT_TYPE.order}
        //           openModalOnClick={true}
        //         />,

        //         item?.isSelfCollection
        //           ? t("sales.documentDeliveries.selfCollection")
        //           : item?.shipmentTypeName,
        //       ]
        // );

        setRawDeliveriesData(data || []);

        // setAllDeliveries(mapData);
        setPagesCount(Math.ceil(totalItems / pageSize));
      } else {
        alertFaultGetData();
      }
    };

    if (!router.isReady) {
      return;
    }

    const currentPageNumber = router.query.pageNumber;
    const currentFinalPatternSearch = router.query.finalPatternSearch;
    const currentCustomerId = router.query.customerId;
    const currentAgentId = router.query.agentId;
    const currentShipmentTypeId = router.query.shipmentTypeId;
    const isSelfCollection =
      currentShipmentTypeId === "self_pickup" ||
      deliveryTypeValue?.value === "self_pickup";

    await getDeliveriesTableApi(
      callApi,
      callBack,
      isClear
        ? {
            pageNumber: currentPageNumber || page,
            pageSize: pageSize,
          }
        : {
            pageNumber: currentPageNumber || page,
            pageSize: pageSize,
            clientId: currentCustomerId || customer?.id,
            agentId: currentAgentId || agent?.id,
            // If it's self pickup, pass isSelfCollection as true; otherwise, pass shipmentTypeId
            ...(isSelfCollection
              ? { isSelfCollection: true }
              : {
                  shipmentTypeId:
                    currentShipmentTypeId || deliveryTypeValue?.value,
                }),
            searchPattern:
              finalPatternSearch !== null &&
              finalPatternSearch !== undefined &&
              finalPatternSearch !== ""
                ? finalPatternSearch
                : currentFinalPatternSearch,
          }
    );
  };

  const MoveOrderToReady = useModal();
  const [selectedDocument, setSelectedDocument] = useState<any>({});

  const onClickOpenMoveOrderToReadyModal = (order) => {
    // Assume orderId is already being extracted from the URL query ( scanning case )
    setSelectedDocument(order?.id ? order : { id: orderId });
    MoveOrderToReady.open();
  };

  const onClickCloseMoveOrderToReadyModal = () => {
    setSelectedDocument({});
    MoveOrderToReady.close();
  };

  const moveOrderToReady = async (isSendMessage: boolean = false) => {
    const callBack = (res) => {
      if (res?.success) {
        getDeliveriesTable();
      } else {
        alertFaultUpdate();
      }
    };
    await moveOrderToReadyApi(callApi, callBack, {
      orderId: selectedDocument?.id,
      isSendMessage: isSendMessage,
    });
  };

  const allDeliveries = useMemo(() => {
    return rawDeliveriesData?.map((item: any) =>
      isMobile
        ? [
            item?.clientName,
            <ClickableStatusButton
              id={item?.orderId}
              document={{
                ...item,
                id: item?.orderId,
                customerId: item?.clientId,
                number: item?.orderNumber,
              }}
              documentType={DOCUMENT_TYPE.order}
              openModalOnClick={true}
              onClickOpenMoveOrderToReadyModal={
                onClickOpenMoveOrderToReadyModal
              }
            />,
            formatCustomDateTime(item?.createdDate).split(" ")[0],
            item?.agentName ?? "-",
            item?.orderNumber,
            item?.worksNames ?? "-",
            item?.numberOfItems,
            item?.isSelfCollection
              ? t("sales.documentDeliveries.selfCollection")
              : item?.shipmentTypeName,
          ]
        : [
            formatCustomDateTime(item?.createdDate).split(" ")[0],
            item?.clientName,
            item?.agentName ?? "-",
            item?.orderNumber,
            item?.worksNames ?? "-",
            item?.numberOfItems,
            <ClickableStatusButton
              id={item?.orderId}
              document={{
                ...item,
                id: item?.orderId,
                customerId: item?.clientId,
                number: item?.orderNumber,
              }}
              documentType={DOCUMENT_TYPE.order}
              openModalOnClick={true}
              onClickOpenMoveOrderToReadyModal={
                onClickOpenMoveOrderToReadyModal
              }
            />,
            item?.isSelfCollection
              ? t("sales.documentDeliveries.selfCollection")
              : item?.shipmentTypeName,
          ]
    );
  }, [rawDeliveriesData, isMobile, t, formatCustomDateTime]);

  const debouncePatternSearch = useDebounce(patternSearch, 1000);
  const [hasFetchedQuery, setHasFetchedQuery] = useState<string | null>(null);

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

  useEffect(() => {
    const {
      customerId,
      customerName,
      agentId,
      finalPatternSearch,
      shipmentTypeId,
      pageNumber,
    } = router.query;

    if (pageNumber) setPage(Number(pageNumber)); // Convert to number

    if (customerId) {
      setCustomer({ id: customerId as string, name: customerName as string });
    }

    if (agentId) {
      const selectedAgent = agentsCategories?.find(
        (agent: any) => agent?.id === agentId
      );
      setAgent(selectedAgent);
    }

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
    if (shipmentTypeId) {
      const shipmentTypeToSet = shipmentTypes?.find(
        (type) => type.value === shipmentTypeId
      );
      if (shipmentTypeToSet) {
        setDeliveryTypeValue(shipmentTypeToSet);
      }
    }
  }, [router, agentsCategories, shipmentTypes]);

  useEffect(() => {
    const isNotFilteredData = Object.keys(router?.query || {}).length === 0;

    // Serialize the current query for comparison
    const serializedQuery = JSON.stringify(router.query);

    if (isNotFilteredData) {
      getDeliveriesTable(true);
      setHasFetchedQuery(null);
    } else if (hasFetchedQuery !== serializedQuery) {
      getDeliveriesTable();
      setHasFetchedQuery(serializedQuery); // Mark this query as fetched
    }
  }, [pageSize, router.query]);

  const { isSocketUpdateDeliveriesTable, setIsSocketUpdateDeliveriesTable } =
    useDeliveriesSocketIo();

  useEffect(() => {
    if (isSocketUpdateDeliveriesTable) {
      getDeliveriesTable();
      setIsSocketUpdateDeliveriesTable(false);
    }
  }, [isSocketUpdateDeliveriesTable]);

  return {
    t,
    isMobile,
    tableHeaders,
    handlePageSizeChange,
    pageSize,
    page,
    pagesCount,
    setPage,
    router,
    handleClick,
    handleClose,
    open,
    anchorEl,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
    agent,
    setAgent,
    patternSearch,
    setPatternSearch,
    onChangeDocumentSearch,
    onClickClearFilter,
    searchInputRef,
    onClickSearchFilter,
    agentsCategories,
    handleAgentChange,
    deliveryTypeValue,
    setDeliveryTypeValue,
    getAllShipmentTypes,
    shipmentTypes,
    getDeliveriesTable,
    allDeliveries,
    orderId,
    customerId,
    documentNumber,
    initialPageSize,
    MoveOrderToReady,
    onClickCloseMoveOrderToReadyModal,
    onClickOpenMoveOrderToReadyModal,
    moveOrderToReady,
  };
};

export { useDeliveries };
