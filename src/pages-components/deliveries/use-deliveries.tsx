import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import {
  useAgentsList,
  useCustomerDropDownList,
  useGomakeAxios,
  useSnackBar,
} from "@/hooks";
import { useRef, useState } from "react";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { useRouter } from "next/router";
import { useIsMobile } from "@/hooks/use-responsive";
import { useQuoteGetData } from "../quote-new/use-quote-get-data";

interface Query {
  customerId?: string;
  customerName?: string;
  agentId?: string;
  pageNumber?: number;
}

const useDeliveries = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const direction = t("direction");
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const {
    alertFaultUpdate,
    alertFaultDuplicate,
    alertFaultGetData,
    alertSuccessUpdate,
    alertFault,
  } = useSnackBar();

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);
  const handlePageSizeChange = (event) => {
    setPage(1);
    setPageSize(event.target.value);
  };
  const [patternSearch, setPatternSearch] = useState<any>(
    router.query.finalPatternSearch || null
  );

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
  } = useCustomerDropDownList();

  const { getAllShipmentTypes, shipmentTypes } = useQuoteGetData();
  const [deliveryTypeValue, setDeliveryTypeValue] = useState<{
    label: string;
    value: string;
  }>();

  const tableHeaders = [
    t("sales.quote.creationDate"),
    t("sales.quote.client"),
    t("sales.quote.agent"),
    t("sales.quote.orderNumber"),
    t("sales.quote.worksName"),
    t("sales.quote.itemsNumber"),
    t("sales.documentDeliveries.deliveryStatus"),
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
    setPatternSearch("");
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

    handleClose();
    setPage(1);

    await router.push({
      pathname: router.pathname,
      query: { ...query },
    });
  };

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
  };
};

export { useDeliveries };
