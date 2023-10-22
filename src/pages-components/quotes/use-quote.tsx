import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { QUOTE_STATUSES } from "./enums";
import { MoreMenuWidget } from "./more-circle";
import { getAndSetAllCustomers } from "@/services/hooks";
import { useRecoilState } from "recoil";
import { agentsCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { useDebounce } from "@/utils/use-debounce";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useFormatedDate } from "@/hooks/use-formated-date";

const useQuotes = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const { errorColor } = useGomakeTheme();
  const [patternSearch, setPatternSearch] = useState("");
  const [finalPatternSearch, setFinalPatternSearch] = useState("");
  const debounce = useDebounce(patternSearch, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const {SetFormateDate} = useFormatedDate();
  const [statusId, setStatusId] = useState<any>();
  const [customerId, setCustomerId] = useState<any>();
  const [dateRange, setDateRange] = useState<any>();
  const [agentId, setAgentId] = useState<any>();
  const [canOrder, setCanOrder] = useState(false);
  const [allQuotes, setAllQuotes] = useState();
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [customersListCreateOrder, setCustomersListCreateOrder] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>();
  const onClcikCloseModal = () => {
    setOpenModal(false);
  };
 



  const onClcikOpenModal = (quote: any) => {
    setSelectedQuote(quote);
    setOpenModal(true);
  };
  const [agentsCategories, setAgentsCategories] = useRecoilState(
    agentsCategoriesState
  );
  useEffect(() => {
    setFinalPatternSearch(debounce);
  }, [debounce]);
  const getAgentCategories = async () => {
    const callBack = (res) => {
      if (res.success) {
        const agentNames = res.data.map((agent) => ({
          label: agent.text,
          id: agent.value,
        }));
        setAgentsCategories(agentNames);
      }
    };
    await getAndSetEmployees2(callApi, callBack, { isAgent: true });
  };
  const renderOptions = () => {
    if (!!canOrder) {
      return customersListCreateOrder;
    } else return customersListCreateQuote;
  };
  const getAllCustomersCreateQuote = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: "C",
      onlyCreateOrderClients: false,
    });
  }, []);
  const getAllCustomersCreateOrder = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateOrder, {
      ClientType: "C",
      onlyCreateOrderClients: true,
    });
  }, []);
  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      setCanOrder(true);
    } else {
      setCanOrder(false);
    }
  };
  const _renderQuoteStatus = (status: number, quote: any) => {
    if (status === QUOTE_STATUSES.Create) {
      return t("sales.quote.createdBy", { name: quote?.userName });
    }
    if (status === QUOTE_STATUSES.Open) {
      return t("sales.quote.open");
    }
    if (status === QUOTE_STATUSES.Closed) {
      return t("sales.quote.closed");
    }
    if (status === QUOTE_STATUSES.Canceled) {
      return t("sales.quote.canceled");
    }
    if (status === QUOTE_STATUSES.Waiting) {
      return t("sales.quote.waiting");
    }
    if (status === QUOTE_STATUSES.Approved) {
      return t("sales.quote.approved");
    }
    if (status === QUOTE_STATUSES.CanceledIrrelvant) {
      return t("sales.quote.canceledIrrelvant");
    }
    if (status === QUOTE_STATUSES.CanceledPrice) {
      return t("sales.quote.canceledPrice");
    }
    if (status === QUOTE_STATUSES.CanceledDeliveryTime) {
      return t("sales.quote.canceledDeliveryTime");
    }
    if (status === QUOTE_STATUSES.CanceledOther) {
      return t("sales.quote.canceledOther");
    }
    if (status === QUOTE_STATUSES.ApprovedByManager) {
      return t("sales.quote.approvedByManager");
    }
    if (status === QUOTE_STATUSES.RejectedByManager) {
      return t("sales.quote.rejectedByManager");
    }
    if (status === QUOTE_STATUSES.PartialClosed) {
      return t("sales.quote.partialClosed");
    }
    if (status === QUOTE_STATUSES.WaitForPrintHouseConfirm) {
      return t("sales.quote.waitForPrintHouseConfirm");
    }
  };
  const getAllQuotes = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/quote/get-all-quotes`,
      {
        model: {
          pageNumber: page,
          pageSize: limit,
        },
        statusId: statusId?.value,
        patternSearch: finalPatternSearch,
        customerId: customerId?.id,
        dateRange,
        agentId: agentId?.id,
      }
    );
    const data = res?.data?.data?.result;
    const totalItems = res?.data?.data?.totalItems;
    const mapData = data?.map((quote: any) => [
      SetFormateDate(quote?.createdDate),
      quote?.customerName,
      quote?.orderNumber,
      quote?.worksNames,
      quote?.totalPrice,
      quote?.notes,
      _renderQuoteStatus(quote?.statusID, quote),
      <MoreMenuWidget quote={quote} onClcikOpenModal={onClcikOpenModal} />,
    ]);
    setAllQuotes(mapData);
  }, [
    page,
    limit,
    statusId,
    customerId,
    dateRange,
    agentId,
    finalPatternSearch,
  ]);
  const getAllQuotesInitial = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/quote/get-all-quotes`,
      {
        model: {
          pageNumber: page,
          pageSize: limit,
        },
      }
    );
    const data = res?.data?.data?.result;
    const totalItems = res?.data?.data?.totalItems;
    const mapData = data?.map((quote: any) => [
      SetFormateDate(quote?.createdDate),
      quote?.customerName,
      quote?.orderNumber,
      quote?.worksNames,
      quote?.totalPrice,
      quote?.notes,
      _renderQuoteStatus(quote?.statusID, quote),
      <MoreMenuWidget quote={quote} onClcikOpenModal={onClcikOpenModal} />,
    ]);
    setAllQuotes(mapData);
  }, [page, limit]);
  useEffect(() => {
    getAllQuotes();
  }, []);
  const onClickSearchFilter = () => {
    getAllQuotes();
  };

  const onClcikClearFilter = () => {
    setStatusId(null);
    setAgentId(null);
    setCustomerId(null);
    getAllQuotesInitial();
  };

  const tableHeaders = [
    t("sales.quote.createdDate"),
    t("sales.quote.client"),
    t("sales.quote.orderNumber"),
    t("sales.quote.worksName"),
    t("sales.quote.totalPrice"),
    t("sales.quote.notes"),
    t("sales.quote.status"),
    t("sales.quote.more"),
  ];
  const quoteStatuses = [
    {
      label: t("sales.quote.create"),
      value: QUOTE_STATUSES.Create,
    },
    {
      label: t("sales.quote.open"),
      value: QUOTE_STATUSES.Open,
    },
    {
      label: t("sales.quote.closed"),
      value: QUOTE_STATUSES.Closed,
    },
    {
      label: t("sales.quote.canceled"),
      value: QUOTE_STATUSES.Canceled,
    },
    {
      label: t("sales.quote.waiting"),
      value: QUOTE_STATUSES.Waiting,
    },
    {
      label: t("sales.quote.approved"),
      value: QUOTE_STATUSES.Approved,
    },
    {
      label: t("sales.quote.canceledIrrelvant"),
      value: QUOTE_STATUSES.CanceledIrrelvant,
    },
    {
      label: t("sales.quote.canceledPrice"),
      value: QUOTE_STATUSES.CanceledPrice,
    },
    {
      label: t("sales.quote.canceledDeliveryTime"),
      value: QUOTE_STATUSES.CanceledDeliveryTime,
    },
    {
      label: t("sales.quote.canceledOther"),
      value: QUOTE_STATUSES.CanceledOther,
    },
    {
      label: t("sales.quote.approvedByManager"),
      value: QUOTE_STATUSES.ApprovedByManager,
    },
    {
      label: t("sales.quote.rejectedByManager"),
      value: QUOTE_STATUSES.RejectedByManager,
    },
    {
      label: t("sales.quote.partialClosed"),
      value: QUOTE_STATUSES.PartialClosed,
    },
    {
      label: t("sales.quote.waitForPrintHouseConfirm"),
      value: QUOTE_STATUSES.WaitForPrintHouseConfirm,
    },
  ];
  useEffect(() => {
    getAllCustomersCreateQuote();
    getAllCustomersCreateOrder();
    getAgentCategories();
  }, []);

  const updateQuoteStatus = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/quote/update-quote`,
      {
        quoteId: selectedQuote?.id,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      navigate("/quote");
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, []);
  return {
    patternSearch,
    tableHeaders,
    allQuotes,
    quoteStatuses,
    agentsCategories,
    openModal,
    statusId,
    customerId,
    agentId,
    errorColor,
    onClcikCloseModal,
    setPatternSearch,
    setStatusId,
    setCustomerId,
    setDateRange,
    setAgentId,
    renderOptions,
    checkWhatRenderArray,
    updateQuoteStatus,
    onClickSearchFilter,
    getAllQuotes,
    onClcikClearFilter,
    t,
  };
};

export { useQuotes };
