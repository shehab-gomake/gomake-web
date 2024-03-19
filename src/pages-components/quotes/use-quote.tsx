import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DELIVERY_NOTE_STATUSES, LogActionType, QUOTE_STATUSES } from "./enums";
import { MoreMenuWidget } from "./more-circle";
import { getAndSetAllCustomers } from "@/services/hooks";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { agentsCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { useDebounce } from "@/utils/use-debounce";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useDateFormat } from "@/hooks/use-date-format";
import { _renderDocumentStatus, _renderQuoteStatus, _renderStatus } from "@/utils/constants";
import { employeesListsState, selectedClientState } from "./states";
import {
  createNewDocumentApi,
  duplicateDocumentApi,
  getAllDocumentLogsApi,
  getAllDocumentsApi,
  getDocumentPdfApi,
  updateDocumentApi,
} from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "./enums";
import { useQuoteGetData } from "../quote-new/use-quote-get-data";
import { useStyle } from "./style";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { getAllReceiptsApi, getReceiptPdfApi } from "@/services/api-service/generic-doc/receipts-api";

const useQuotes = (docType: DOCUMENT_TYPE) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertFaultDuplicate, alertFaultGetData } = useSnackBar();
  const { getCurrencyUnitText } = useQuoteGetData();
  const { navigate } = useGomakeRouter();
  const { errorColor } = useGomakeTheme();
  const [patternSearch, setPatternSearch] = useState("");
  const [finalPatternSearch, setFinalPatternSearch] = useState("");
  const debounce = useDebounce(patternSearch, 500);
  const { GetDateFormat, GetShortDateFormat } = useDateFormat();
  const [statusId, setStatusId] = useState<any>();
  const [quoteStatusId, setQuoteStatusId] = useState<any>();
  const [customerId, setCustomerId] = useState<any>();
  const [dateRange, setDateRange] = useState<any>();
  const [agentId, setAgentId] = useState<any>();
  const [canOrder, setCanOrder] = useState(false);
  const [allQuotes, setAllQuotes] = useState();
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [customersListCreateOrder, setCustomersListCreateOrder] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openLogsModal, setOpenLogsModal] = useState(false);
  const [logsModalTitle, setLogsModalTitle] = useState<string>();
  const setEmployeeListValue = useSetRecoilState<string[]>(employeesListsState);
  const [selectedQuote, setSelectedQuote] = useState<any>();
  const [allDocuments, setAllDocuments] = useState([]);
  const [allStatistics, setAllStatistics] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);
  const selectedClient = useRecoilValue<any>(selectedClientState);
  const [openAddRule, setOpenAddRule] = useState<boolean>(false);
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [documentIdLogState, setDocumentIdLogState] = useState<string>();
  const [documentLogsData, setDocumentLogsData] = useState<any>();
  const [employeeId, setEmployeeId] = useState<any>();
  const [resetLogsDatePicker, setResetLogsDatePicker] = useState<boolean>(false);
  const [fromLogsDate, setFromLogsDate] = useState<Date>();
  const [toLogsDate, setToLogsDate] = useState<Date>();
  const [agentsCategories, setAgentsCategories] = useRecoilState(agentsCategoriesState);
  const documentPath = DOCUMENT_TYPE[docType];
  const isReceipt = docType === DOCUMENT_TYPE.receipt;

  const onCloseAddRuleModal = () => {
    setOpenAddRule(false);
  };
  const onOpenAddRuleModal = () => {
    setOpenAddRule(true);
  };
  const handlePageSizeChange = (event) => {
    setPage(1);
    setPageSize(event.target.value);
  };

  const onClickCloseModal = () => {
    setOpenModal(false);
  };

  const onClickOpenModal = (quote: any) => {
    setSelectedQuote(quote);
    setOpenModal(true);
  };

  const onClickCloseLogsModal = () => {
    setOpenLogsModal(false);
    setEmployeeId(null)
    setFromLogsDate(null);
    setToLogsDate(null);
  };

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

  const _renderPaymentType = (paymentType) => {
    if (!paymentType) return '';
    const types = paymentType.split(',').map(type => type.trim());
    const translatedTypes = types.map(type => {
      switch (type) {
        case 'מזומן':
          return t('payment.cash');
        case 'המחאה':
          return t('payment.check');
        case 'bit':
          return t('payment.bit');
        case 'אשראי':
          return t('payment.creditCard');
        case 'העברה':
          return t('payment.transfer');
        default:
          return type;
      }
    });
    return translatedTypes.join(', ');
  }

  const getAllQuotes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const data = res?.data?.data;
        const totalItems = res?.data?.totalItems;
        const mapData = data?.map((quote: any) => {
          if (docType === DOCUMENT_TYPE.purchaseOrder) {
            return [
              GetDateFormat(quote?.creationDate),
              quote?.number,
              quote?.orderNumber,
              quote?.supplierName,
              quote?.clientName,
              quote?.itemsNumber,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
              />,
            ];
          }
          else if (docType === DOCUMENT_TYPE.purchaseInvoice || docType === DOCUMENT_TYPE.purchaseInvoiceRefund) {
            const purchaseOrderNumbers = quote?.orderNumbers ? quote?.orderNumbers.join(', ') : '';
            return [
              GetDateFormat(quote?.createdDate),
              quote?.number,
              quote?.invoiceNumber,
              purchaseOrderNumbers,
              quote?.customerName,
              quote?.itemsNumber,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
              />,
            ];
          }
          else {
            return [
              GetDateFormat(quote?.createdDate),
              quote?.customerName,
              quote?.agentName,
              quote?.number,
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickQuoteDuplicate}
                onClickLoggers={onClickDocumentLogs}

              />,
            ];
          }
        });
        const mapReceiptData = data?.map((quote: any) => [
          GetDateFormat(quote?.creationDate),
          quote?.customerName,
          quote?.agentName,
          quote?.number,
          _renderPaymentType(quote?.paymentType),
          quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
          quote?.notes,
          _renderDocumentStatus(quote?.status, t),
          <MoreMenuWidget
            quote={quote}
            documentType={docType}
            onClickOpenModal={onClickOpenModal}
            onClickPdf={onClickQuotePdf}
            onClickDuplicate={onClickQuoteDuplicate}
            onClickLoggers={onClickDocumentLogs}
          />,
        ]);
        setAllQuotes(isReceipt ? mapReceiptData : mapData);
        setPagesCount(Math.ceil(totalItems / (pageSize)));
        setAllStatistics(res?.data?.documentStatisticsList);
      }
    };
    if (isReceipt) {
      await getAllReceiptsApi(callApi, callBack, {
        clientId: customerId?.id,
        agentId: agentId?.id,
        patternSearch: finalPatternSearch,
        fromDate: fromDate && GetDateFormat(fromDate),
        toDate: toDate && GetDateFormat(toDate),

        status: quoteStatusId?.value || statusId?.value,
        model: {
          pageNumber: page,
          pageSize: pageSize,
        }
      }
      );
    } else {
      await getAllDocumentsApi(callApi, callBack, {
        documentType: docType,
        data: {
          model: {
            pageNumber: page,
            pageSize: pageSize,
          },
          statusId: quoteStatusId?.value || statusId?.value,
          patternSearch: finalPatternSearch,
          customerId: customerId?.id,
          dateRange,
          agentId: agentId?.id,
        },
      });
    }
  };

  const getAllQuotesInitial = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const data = res?.data?.data;
        const totalItems = res?.data?.totalItems;
        const mapData = data?.map((quote: any) => {
          if (docType === DOCUMENT_TYPE.purchaseOrder) {
            return [
              GetDateFormat(quote?.creationDate),
              quote?.number,
              quote?.orderNumber,
              quote?.supplierName,
              quote?.clientName,
              quote?.itemsNumber,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
              />,
            ];
          }
          else if (docType === DOCUMENT_TYPE.purchaseInvoice || docType === DOCUMENT_TYPE.purchaseInvoiceRefund) {
            const purchaseOrderNumbers = quote?.orderNumbers ? quote?.orderNumbers.join(', ') : '';
            return [
              GetDateFormat(quote?.createdDate),
              quote?.number,
              quote?.invoiceNumber,
              quote?.purchaseOrderNumbers,
              quote?.customerName,
              quote?.itemsNumber,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
              />,
            ];
          }
          else {
            return [
              GetDateFormat(quote?.createdDate),
              quote?.customerName,
              quote?.agentName,
              quote?.number,
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickQuoteDuplicate}
                onClickLoggers={onClickDocumentLogs}

              />,
            ];
          }
        });
        const mapReceiptData = data?.map((quote: any) => [
          GetDateFormat(quote?.creationDate),
          quote?.customerName,
          quote?.agentName,
          quote?.number,
          _renderPaymentType(quote?.paymentType),
          quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
          quote?.notes,
          _renderDocumentStatus(quote?.status, t),
          <MoreMenuWidget
            quote={quote}
            documentType={docType}
            onClickOpenModal={onClickOpenModal}
            onClickPdf={onClickQuotePdf}
            onClickDuplicate={onClickQuoteDuplicate}
            onClickLoggers={onClickDocumentLogs}
          />,
        ]);
        setAllQuotes(isReceipt ? mapReceiptData : mapData);
        setPagesCount(Math.ceil(totalItems / pageSize));
        setAllStatistics(res?.data?.documentStatisticsList);
      }
    };
    if (docType === DOCUMENT_TYPE.receipt) {
      await getAllReceiptsApi(callApi, callBack, {
        model: {
          pageNumber: page,
          pageSize: pageSize,
        },
      });
    } else {
      await getAllDocumentsApi(callApi, callBack, {
        documentType: docType,
        data: {
          model: {
            pageNumber: page,
            pageSize: pageSize,
          },
        },
      });
    }
  };

  const onClickSearchFilter = () => {
    setPage(1);
    if (statusId !== null) {
      handleSecondCardClick();
    }
    getAllQuotes();
  };

  const onClickClearFilter = () => {
    handleSecondCardClick();
    setAgentId(null);
    setCustomerId(null);
    setStatusId(null);
    setFromDate(null);
    setToDate(null);
    setResetDatePicker(true);
    getAllQuotesInitial();
    setPage(1);
  };

  const tableHeaders = docType === DOCUMENT_TYPE.purchaseOrder ? [
    t("sales.quote.creationDate"),
    t("sales.quote.purchaseOrderNumber"),
    t("sales.quote.orderNumber"),
    t("sales.quote.supplierName"),
    t("sales.quote.client"),
    t("sales.quote.itemsNumber"),
    t("sales.quote.totalPrice"),
    t("sales.quote.notes"),
    t("sales.quote.status"),
    t("sales.quote.more"),
  ] : (docType === DOCUMENT_TYPE.purchaseInvoice || docType === DOCUMENT_TYPE.purchaseInvoiceRefund) ? [
    t("sales.quote.creationDate"),
    t("sales.quote.purchaseInvoiceNumber"),
    t("sales.quote.invoiceNumber"),
    t("sales.quote.purchaseOrderNumber"),
    t("sales.quote.supplierName"),
    t("sales.quote.itemsNumber"),
    t("sales.quote.totalPrice"),
    t("sales.quote.notes"),
    t("sales.quote.status"),
    t("sales.quote.more"),
  ] : [
    t("sales.quote.createdDate"),
    t("sales.quote.client"),
    t("sales.quote.agent"),
    (() => {
      switch (docType) {
        case DOCUMENT_TYPE.quote:
          return t("sales.quote.quoteNumber");
        case DOCUMENT_TYPE.order:
          return t("sales.quote.orderNumber");
        case DOCUMENT_TYPE.deliveryNote:
          return t("sales.quote.deliveryNoteNumber");
        case DOCUMENT_TYPE.deliveryNoteRefund:
          return t("sales.quote.deliveryNoteNumber");
        case DOCUMENT_TYPE.invoice:
          return t("sales.quote.invoiceNumber");
        case DOCUMENT_TYPE.invoiceRefund:
          return t("sales.quote.invoiceNumber");
        case DOCUMENT_TYPE.receipt:
          return t("sales.quote.receiptNumber");
      }
    })(),
    docType === DOCUMENT_TYPE.receipt ? t("sales.quote.paymentMethod") : t("sales.quote.worksName"),
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

  const deliveryNoteStatuses = [
    {
      label: t("sales.quote.open"),
      value: DELIVERY_NOTE_STATUSES.Open,
    },
    {
      label: t("sales.quote.canceled"),
      value: DELIVERY_NOTE_STATUSES.Canceled,
    },
    {
      label: t("sales.quote.created"),
      value: DELIVERY_NOTE_STATUSES.Created,
    },
    {
      label: t("sales.quote.refunded"),
      value: DELIVERY_NOTE_STATUSES.Refunded,
    },
    {
      label: t("sales.quote.confirmed"),
      value: DELIVERY_NOTE_STATUSES.Confirmed,
    },
    {
      label: t("sales.quote.rejected"),
      value: DELIVERY_NOTE_STATUSES.Rejected,
    },
    {
      label: t("sales.quote.partialRefunded"),
      value: DELIVERY_NOTE_STATUSES.PartialRefunded,
    },
    {
      label: t("sales.quote.closedAsInvoice"),
      value: DELIVERY_NOTE_STATUSES.ClosedAsInvoice,
    },
    {
      label: t("sales.quote.closedByMultiDocuments"),
      value: DELIVERY_NOTE_STATUSES.ClosedByMultiDocuments,
    },
    {
      label: t("sales.quote.manualClose"),
      value: DELIVERY_NOTE_STATUSES.ManualClose,
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
    {
      label: t("sales.quote.deliveryNoteRefundList"),
      value: DOCUMENT_TYPE.deliveryNoteRefund,
    },
    {
      label: t("sales.quote.invoiceRefundList"),
      value: DOCUMENT_TYPE.invoiceRefund,
    },
    {
      label: t("sales.quote.purchaseOrderList"),
      value: DOCUMENT_TYPE.purchaseOrder,
    },
    {
      label: t("sales.quote.purchaseInvoiceList"),
      value: DOCUMENT_TYPE.purchaseInvoice,
    },
    {
      label: t("sales.quote.purchaseInvoiceRefundList"),
      value: DOCUMENT_TYPE.purchaseInvoiceRefund,
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
    if (isReceipt) {
      await getReceiptPdfApi(callApi, callBack, {
        receiptId: id,
      });
    }
    else {
      await getDocumentPdfApi(callApi, callBack, {
        documentId: id,
        documentType: docType,
      });
    }
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
    await createNewDocumentApi(callApi, callBack, { documentType: docType });
  };

  // table in home page
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
            onClickLoggers={onClickDocumentLogs}
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

  const handleCardClick = (cardKey, statusValue) => {
    setPage(1);
    setActiveCard(cardKey);
    setStatusId(null);
    setQuoteStatusId({ label: t(`sales.quote.${cardKey}`), value: statusValue });
  };

  const handleSecondCardClick = () => {
    setQuoteStatusId(null)
    setActiveCard(null);
  };

  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

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

  const onSelectDateRange = (fromDate: Date, toDate: Date) => {
    setResetLogsDatePicker(false);
    setFromLogsDate(fromDate);
    setToLogsDate(toDate);
  };

  const handleSelectEmployee = (e: any, value: any) => {
    setEmployeeId(value);
  }

  ////////////// LOGS //////////////

  const getLogDescription = (logAction: any, values: any): string => {
    switch (logAction) {
      case LogActionType[1]:
        return `${t("logs.theWorkMission")} "${values[0]}" ${t("logs.ITEM_ADD")}`;
      case LogActionType[2]:
        return `${t("logs.theWorkMission")} "${values[0]}" ${t("logs.ITEM_UPADTED")}`;
      case LogActionType[3]:
        return `${t("logs.theWorkMission")} "${values[0]}" ${t("logs.ITEM_DELETED")}`;
      case LogActionType[4]:
        return `${t("logs.ITEM_PRICE_UPDATE")} : "${values[0]}" ${t("logs.from")} ${parseFloat(values[1]).toFixed(2)} ${t("logs.to")} ${parseFloat(values[2]).toFixed(2)}`;
      case LogActionType[5]:
        return `${t("logs.DOCUMENT_PRICE_UPDATE")} ${t("logs.from")} ${parseFloat(values[0]).toFixed(2)} ${t("logs.to")} ${parseFloat(values[1]).toFixed(2)}`;
      case LogActionType[6]:
        if (values[0] === "" || null) {
          return `${t("logs.DOCUMENT_DISCUOUNT_UPDATE")} ${t("logs.from")} ${0.00} ${t("logs.to")} ${parseFloat(values[1]).toFixed(2)}`;
        } else {
          return `${t("logs.DOCUMENT_DISCUOUNT_UPDATE")} ${t("logs.from")} ${parseFloat(values[0]).toFixed(2)} ${t("logs.to")} ${parseFloat(values[1]).toFixed(2)}`;
        }
      case LogActionType[7]:
        return t("logs.ADDRESS_UPDATED");
      case LogActionType[8]:
        return t("logs.CONTACTS_UPDATED");
      case LogActionType[9]:
        return `${t("logs.CLIENT_UPDATED")} ${t("logs.from")} "${values[0]}" ${t("logs.to")} "${values[1]}"`;
      case LogActionType[10]:
        if (values[0] === null) {
          return `${t("logs.AGENT_UPDATED")} ${t("logs.to")} ${values[1]}`;
        } else {
          return `${t("logs.AGENT_UPDATED")} ${t("logs.from")} ${values[0]} ${t("logs.to")} ${values[1]}`;
        }
      case LogActionType[11]:
        if (values[0] === null) {
          return `${t("logs.PURCHASE_NUMBER_UPDATE")} ${t("logs.to")} "${values[1]}"`;
        } else {
          return `${t("logs.PURCHASE_NUMBER_UPDATE")} ${t("logs.from")} ${values[0]} ${t("logs.to")} ${values[1]}`;
        }
      case LogActionType[12]:
        if (values[0] === null) {
          return `${t("logs.COMMENTS_UPDATE")} ${t("logs.to")} "${values[1]}"`;
        } else {
          return `${t("logs.COMMENTS_UPDATE")} ${t("logs.from")} "${values[0]}" ${t("logs.to")} "${values[1]}"`;
        }
      default:
        return '';
    }
  };


  const getAllDocumentLogs = (documentId?: string, isClear: boolean = false): Promise<void> => {
    setDocumentIdLogState(documentId);
    return new Promise(async (resolve, reject) => {
      const callBack = (res) => {
        if (res?.success) {
          const mapData = res?.data?.map((log: any) => [
            GetShortDateFormat(log?.actionDate),
            log?.employeeName,
            getLogDescription(log?.logAction, log?.values)
          ]);
          setDocumentLogsData(mapData);
          resolve();
        } else {
          alertFaultGetData();
          setDocumentIdLogState("");
          reject();
        }
      };
      try {
        await getAllDocumentLogsApi(callApi, callBack,
          {
            documentType: docType,
            documentId: documentId,
            data:
              isClear ?
                {
                  fromDate: fromLogsDate && GetDateFormat(fromLogsDate),
                  toDate: toLogsDate && GetDateFormat(toLogsDate),
                }
                :
                {
                  userId: employeeId?.id,
                  fromDate: fromLogsDate && GetDateFormat(fromLogsDate),
                  toDate: toLogsDate && GetDateFormat(toLogsDate),
                },
          });
      } catch (error) {
        reject();
      }
    });
  };

  const onClickDocumentLogs = async (document: any) => {
    try {
      await getAllDocumentLogs(document?.id);
      setLogsModalTitle(`${t("sales.quote.logsFor")} ${t(`sales.quote.${DOCUMENT_TYPE[docType]}`).toLowerCase()} ${t("sales.quote.number")} - ${document?.number}`)
      setOpenLogsModal(true);
    } catch (error) {
      console.error("Error fetching document logs:", error);
    }
  };

  const onClickClearLogsFilter = () => {
    setEmployeeId(null)
    getAllDocumentLogs(documentIdLogState, true);
  };

  const onClickSearchLogsFilter = () => {
    getAllDocumentLogs(documentIdLogState);
  };

  ////////////// LOGS //////////////

  useEffect(() => {
    getAllCustomersCreateQuote();
    getAllCustomersCreateOrder();
    getAgentCategories(true, setAgentsCategories);
    getAgentCategories(null, setEmployeeListValue);
  }, []);

  useEffect(() => {
    getAllQuotes();
  }, [page, quoteStatusId, pageSize, finalPatternSearch]);

  useEffect(() => {
    setFinalPatternSearch(debounce);
  }, [debounce]);

  useEffect(() => {
    getAllDocuments(docType);
  }, [selectedClient]);


  return {
    t,
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
    openLogsModal,
    onClickCloseLogsModal,
    logsModalTitle,
    logsTableHeaders,
    documentsLabels,
    documentLabel,
    allDocuments,
    tableHomeHeader,
    pagesCount,
    page,
    setPage,
    allStatistics,
    onclickCreateNew,
    pageSize,
    handlePageSizeChange,
    activeCard,
    handleCardClick,
    handleSecondCardClick,
    onCloseAddRuleModal,
    onOpenAddRuleModal,
    openAddRule,
    navigate,
    documentPath,
    deliveryNoteStatuses,
    resetDatePicker,
    onSelectDeliveryTimeDates,
    employeeId,
    handleSelectEmployee,
    resetLogsDatePicker,
    onSelectDateRange,
    onClickSearchLogsFilter,
    onClickClearLogsFilter,
    documentLogsData
  };
};

export { useQuotes };