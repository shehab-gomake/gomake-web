import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { QUOTE_STATUSES } from "./enums";
import { MoreMenuWidget } from "./more-circle";
import { getAndSetAllCustomers } from "@/services/hooks";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { agentsCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { useDebounce } from "@/utils/use-debounce";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useDateFormat } from "@/hooks/use-date-format";
import { _renderQuoteStatus } from "@/utils/constants";
import { employeesListsState, selectedClientState } from "./states";
import {
  createNewDocumentApi,
  duplicateDocumentApi,
  getAllDocumentsApi,
  getDocumentPdfApi,
  updateDocumentApi,
} from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "./enums";
import { useQuoteGetData } from "../quote-new/use-quote-get-data";
import { useStyle } from "./style";
import { DEFAULT_VALUES } from "@/pages/customers/enums";

const useQuotes = (docType: DOCUMENT_TYPE) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertFaultDuplicate } = useSnackBar();
  const { getCurrencyUnitText } = useQuoteGetData();
  const { navigate } = useGomakeRouter();
  const { errorColor } = useGomakeTheme();
  const [patternSearch, setPatternSearch] = useState("");
  const [finalPatternSearch, setFinalPatternSearch] = useState("");
  const debounce = useDebounce(patternSearch, 500);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const pageSize = DEFAULT_VALUES.PageSize;
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
  const setEmployeeListValue = useSetRecoilState<string[]>(employeesListsState);
  const [selectedQuote, setSelectedQuote] = useState<any>();
  const [allDocuments, setAllDocuments] = useState([]);
  const [allStatistics, setAllStatistics] = useState([]);
  const selectedClient = useRecoilValue<any>(selectedClientState);

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
    setModalLogsTitle(quoteNumber);
    setOpenLogsModal(true);
  };

  useEffect(() => {
    setFinalPatternSearch(debounce);
  }, [debounce]);

  const getAgentCategories = async (isAgent: boolean, setState: any) => {
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

  const getAllQuotes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const data = res?.data?.data;
        const totalItems = res?.data?.totalItems;
        const mapData = data?.map((quote: any) => [
          GetDateFormat(quote?.createdDate),
          quote?.customerName,
          quote?.agentName,
          quote?.number,
          quote?.worksNames,
          quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
          quote?.notes,
          _renderQuoteStatus(quote?.documentStatus, quote, t),
          <MoreMenuWidget
            quote={quote}
            documentType={docType}
            onClickOpenModal={onClickOpenModal}
            onClickPdf={onClickQuotePdf}
            onClickDuplicate={onClickQuoteDuplicate}
            onClickLoggers={() => onClickOpenLogsModal(quote?.number)}
          />,
        ]);
        setAllQuotes(mapData);
        setPagesCount(Math.ceil(totalItems / pageSize));
        setAllStatistics(res?.data?.documentStatisticsList)
      }
    };
    await getAllDocumentsApi(callApi, callBack, {
      documentType: docType,
      data: {
        model: {
          pageNumber: page,
          pageSize: pageSize,
        },
        statusId: statusId?.value,
        patternSearch: finalPatternSearch,
        customerId: customerId?.id,
        dateRange,
        agentId: agentId?.id,
      },
    });
  };

  const getAllQuotesInitial = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const data = res?.data?.data;
        const totalItems = res?.data?.totalItems;
        const mapData = data?.map((quote: any) => [
          GetDateFormat(quote?.createdDate),
          quote?.customerName,
          quote?.agentName,
          quote?.number,
          quote?.worksNames,
          quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
          quote?.notes,
          _renderQuoteStatus(quote?.documentStatus, quote, t),
          <MoreMenuWidget
            quote={quote}
            documentType={docType}
            onClickOpenModal={onClickOpenModal}
            onClickPdf={onClickQuotePdf}
            onClickDuplicate={onClickQuoteDuplicate}
            onClickLoggers={() => onClickOpenLogsModal(quote?.number)}
          />,
        ]);
        setAllQuotes(mapData);
        setPagesCount(Math.ceil(totalItems / pageSize));
        setAllStatistics(res?.data?.documentStatisticsList)
      }
    };
    await getAllDocumentsApi(callApi, callBack, {
      documentType: docType,
      data: {
        model: {
          pageNumber: page,
          pageSize: pageSize,
        },
      },
    });
  };

  const onClickSearchFilter = () => {
    getAllQuotes();
    setPage(1);
  };

  const onClickClearFilter = () => {
    setStatusId(null);
    setAgentId(null);
    setCustomerId(null);
    getAllQuotesInitial();
    setPage(1);
  };

  const tableHeaders = [
    t("sales.quote.createdDate"),
    t("sales.quote.client"),
    t("sales.quote.agent"),
    docType === DOCUMENT_TYPE.quote
      ? t("sales.quote.quoteNumber")
      : docType === DOCUMENT_TYPE.order
      ? t("sales.quote.orderNumber")
      : docType === DOCUMENT_TYPE.deliveryNote
      ? t("sales.quote.deliveryNoteNumber")
      : docType === DOCUMENT_TYPE.invoice
      ? t("sales.quote.invoiceNumber")
      : t("sales.quote.receiptNumber"),
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

  const documentsLabels = [
    {
      label: t("sales.quote.quoteList"),
      value: DOCUMENT_TYPE.quote,
    },
    {
      label: t("sales.quote.orderList"),
      value: DOCUMENT_TYPE.order,
    },
    {
      label: t("sales.quote.invoiceList"),
      value: DOCUMENT_TYPE.invoice,
    },
    {
      label: t("sales.quote.deliveryNoteList"),
      value: DOCUMENT_TYPE.deliveryNote,
    },
    {
      label: t("sales.quote.receiptList"),
      value: DOCUMENT_TYPE.receipt,
    },
  ];

  const documentLabel = documentsLabels.find(
    (item) => item.value === docType
  ).label;

  const updateQuoteStatus = async () => {
    const callBack = (res) => {
      if (res?.success) {
        navigate("/quote");
      } else {
        alertFaultUpdate();
      }
    };
    await updateDocumentApi(callApi, callBack, {
      documentType: 0,
      document: {
        documentId: selectedQuote?.id,
      },
    });
  };

  const onClickQuotePdf = async (id: string) => {
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        window.open(pdfLink, "_blank");
      } else {
        alertFaultUpdate();
      }
    };
    await getDocumentPdfApi(callApi, callBack, {
      documentId: id,
      documentType: docType,
    });
  };

  const onClickQuoteDuplicate = async (id: string) => {
    const callBack = (res) => {
      if (res?.success) {
        const isAnotherQuoteInCreate = res?.data?.isAnotherQuoteInCreate;
        const documentId = res?.data?.documentId;
        if (!isAnotherQuoteInCreate) {
          navigate("/quote");
        } else {
          onClickOpenModal({ id: documentId });
        }
      } else {
        alertFaultDuplicate();
      }
    };
    await duplicateDocumentApi(callApi, callBack, {
      documentId: id,
      documentType: docType,
    });
  };

  const onclickCreateNew = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const isAnotherQuoteInCreate = res?.data?.isAnotherQuoteInCreate;
        const documentId = res?.data?.documentId;
        if (!isAnotherQuoteInCreate) {
          navigate("/quote");
        } else {
          onClickOpenModal({ id: documentId });
        }
        } else {
        alertFaultUpdate();
      }
    };
    await createNewDocumentApi(callApi, callBack, {documentType: docType});
  };

  useEffect(() => {
    getAllCustomersCreateQuote();
    getAllCustomersCreateOrder();
    getAgentCategories(true, setAgentsCategories);
    getAgentCategories(null, setEmployeeListValue);
  }, []);

  useEffect(() => {
    getAllQuotes();
  }, [page, finalPatternSearch]);

  const getAllDocuments = async (docType) => {
    const callBack = (res) => {
      if (res?.success) {
        const data = res?.data?.data;
        const mapData = data?.map((document: any) => [
          document?.number,
          document?.clientType,
          document?.worksNames,
          GetDateFormat(document?.createdDate),
          document?.totalPrice + " " + getCurrencyUnitText(document?.currency),
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h2
              style={
                document?.documentStatus == 2
                  ? classes.openBtnStyle
                  : classes.closeBtnStyle
              }
            >
              {_renderQuoteStatus(document?.documentStatus, document, t)}
            </h2>
          </div>,
          document?.notes,
          <MoreMenuWidget
            quote={document}
            documentType={docType}
            onClickOpenModal={onClickOpenModal}
            onClickPdf={onClickQuotePdf}
            onClickDuplicate={onClickQuoteDuplicate}
            onClickLoggers={() => onClickOpenLogsModal(document?.number)}
          />,
        ]);
        setAllDocuments(mapData);
      }
    };
    selectedClient?.id &&
      (await getAllDocumentsApi(callApi, callBack, {
        documentType: docType,
        data: {
          model: {
            pageNumber: page,
            pageSize: 10,
          },
          customerId: selectedClient?.id,
        },
      }));
  };

  useEffect(() => {
    getAllDocuments(docType);
  }, [selectedClient]);

  const tableHomeHeader = [
    t("home.headers.documentNumber"),
    t("home.headers.clientType"),
    t("home.headers.jobName"),
    t("home.headers.productDate"),
    t("home.headers.finalPrice"),
    t("home.headers.status"),
    t("home.headers.remark"),
    t("home.headers.more"),
  ];

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
    logsTableHeaders,
    documentsLabels,
    documentLabel,
    allDocuments,
    tableHomeHeader,
    pagesCount,
    page,
    setPage,
    allStatistics,
    onclickCreateNew
  };
};

export { useQuotes };
