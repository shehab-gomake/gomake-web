import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { QUOTE_STATUSES } from "./enums";
import { MoreMenuWidget } from "./more-circle";
import { getAndSetAllCustomers, getAndSetAllEmployees } from "@/services/hooks";
import { useRecoilState , useSetRecoilState } from "recoil";
import { agentsCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { useDebounce } from "@/utils/use-debounce";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useDateFormat } from "@/hooks/use-date-format";
import { _renderQuoteStatus } from "@/utils/constants";
import { duplicateQuoteApi, getQuotePdfApi } from "@/services/api-service/quotes/quotes-table-endpoints";
import { employeesListsState } from "./states";

const useQuotes = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue, alertFaultUpdate, alertFaultDuplicate } = useSnackBar();

  const { navigate } = useGomakeRouter();
  const { errorColor } = useGomakeTheme();
  const [patternSearch, setPatternSearch] = useState("");
  const [finalPatternSearch, setFinalPatternSearch] = useState("");
  const debounce = useDebounce(patternSearch, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const { GetDateFormat } = useDateFormat();
  const [statusId, setStatusId] = useState<any>();
  const [customerId, setCustomerId] = useState<any>();
  const [dateRange, setDateRange] = useState<any>();
  const [agentId, setAgentId] = useState<any>();
  const [canOrder, setCanOrder] = useState(false);
  const [allQuotes, setAllQuotes] = useState();
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [customersListCreateOrder, setCustomersListCreateOrder] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openLogsModal, setOpenLogsModal] = useState(false);
  const [modalLogsTitle, setModalLogsTitle] = useState<string>();
  //const [agentsCategories, setAgentsCategories] = useRecoilState(agentsCategoriesState);
  const setEmployeeListValue = useSetRecoilState<string[]>(employeesListsState);
  const [selectedQuote, setSelectedQuote] = useState<any>();
  const onClickCloseModal = () => {
    setOpenModal(false);
  };

  const onClickOpenModal = (quote: any) => {
    setSelectedQuote(quote);
    setOpenModal(true);
  };

  const [agentsCategories, setAgentsCategories] = useRecoilState(
    agentsCategoriesState
  );

  const onClickCloseLogsModal = () => {
    setOpenLogsModal(false);
  };

  const onClickOpenLogsModal = (quoteNumber: string) => {
    setModalLogsTitle(quoteNumber)
    setOpenLogsModal(true);
  };

  useEffect(() => {
    setFinalPatternSearch(debounce);
  }, [debounce]);

  const getAgentCategories = async (isAgent: boolean , setState: any) => {
    const callBack = (res) => {
      if (res.success) {
        const agentNames = res.data.map((agent) => ({
          label: agent.text,
          id: agent.value,
        }));
        setState(agentNames);
        
      }
    };
    await getAndSetEmployees2(callApi, callBack, { isAgent: isAgent });
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
      GetDateFormat(quote?.createdDate),
      quote?.customerName,
      quote?.orderNumber,
      quote?.quoteNumber,
      quote?.worksNames,
      quote?.totalPrice,
      quote?.notes,
      _renderQuoteStatus(quote?.statusID, quote, t),
      <MoreMenuWidget quote={quote} onClickOpenModal={onClickOpenModal} onClickPdf={onClickQuotePdf} onClickDuplicate={onClickQuoteDuplicate} onClickLoggers={()=>onClickOpenLogsModal(quote?.quoteNumber)} />,
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
      GetDateFormat(quote?.createdDate),
      quote?.customerName,
      quote?.orderNumber,
      quote?.quoteNumber,
      quote?.worksNames,
      quote?.totalPrice,
      quote?.notes,
      _renderQuoteStatus(quote?.statusID, quote, t),
      <MoreMenuWidget quote={quote} onClickOpenModal={onClickOpenModal} />,
    ]);
    setAllQuotes(mapData);
  }, [page, limit]);

  useEffect(() => {
    getAllQuotes();
  }, []);

  const onClickSearchFilter = () => {
    getAllQuotes();
  };

  const onClickClearFilter = () => {
    setStatusId(null);
    setAgentId(null);
    setCustomerId(null);
    getAllQuotesInitial();
  };

  const tableHeaders = [
    t("sales.quote.createdDate"),
    t("sales.quote.client"),
    t("sales.quote.orderNumber"),
    t("sales.quote.quoteNumber"),
    t("sales.quote.worksName"),
    t("sales.quote.totalPrice"),
    t("sales.quote.notes"),
    t("sales.quote.status"),
    t("sales.quote.more"),
  ];

  const logsTableHeaders = [
    t("sales.quote.actionDate"),
    t("sales.quote.employeeName"),
    t("sales.quote.actionDescription"),
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
    // get agents
    getAgentCategories(true,setAgentsCategories);
    // get employees
    getAgentCategories(null,setEmployeeListValue);
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
  }, [selectedQuote]);


  const onClickQuotePdf = async (id: string) => {
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        window.open(pdfLink, "_blank");
      } else {
        alertFaultUpdate();
      }
    };
    await getQuotePdfApi(callApi, callBack, { quoteId: id });
  };

  const onClickQuoteDuplicate = async (id: string) => {
    const callBack = (res) => {
      if (res?.success) {
        const isAnotherQuoteInCreate = res?.data?.isAnotherQuoteInCreate;
        const quoteId = res?.data?.quoteId;
        console.log(quoteId)
        if (!isAnotherQuoteInCreate) {
          navigate("/quote");
        }
        else {
          onClickOpenModal({id:quoteId })
        }
      } else {
        alertFaultDuplicate();
      }
    };
    await duplicateQuoteApi(callApi, callBack, { quoteId: id });
  };

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
    onClickCloseModal,
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
    onClickClearFilter,
    onClickQuotePdf,
    t,
    openLogsModal,
    onClickOpenLogsModal,
    onClickCloseLogsModal,
    modalLogsTitle,
    logsTableHeaders
  };
};

export { useQuotes };
