import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DELIVERY_NOTE_STATUSES, LogActionType, QUOTE_STATUSES } from "./enums";
import { MoreMenuWidget } from "./more-circle";
import { getAllProductsForDropDownList, getAndSetAllCustomers, getAndSetClientTypes } from "@/services/hooks";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { agentsCategoriesState, clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { useDebounce } from "@/utils/use-debounce";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useDateFormat } from "@/hooks/use-date-format";
import { _renderDocumentStatus, _renderQuoteStatus, _renderStatus } from "@/utils/constants";
import { employeesListsState, selectedClientState } from "./states";
import {
  CloseDocumentApi,
  cancelDocumentApi,
  createNewDocumentApi,
  duplicateDocumentApi,
  getAllDocumentLogsApi,
  getAllDocumentsApi,
  getDocumentPdfApi,
  updateDocumentApi,
  updateOccasionalClientNameApi,
} from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "./enums";
import { useQuoteGetData } from "../quote-new/use-quote-get-data";
import { useStyle } from "./style";
import { CLIENT_TYPE_Id, DEFAULT_VALUES } from "@/pages/customers/enums";
import { getAllReceiptsApi, getReceiptPdfApi } from "@/services/api-service/generic-doc/receipts-api";
import { renderDocumentTypeForSourceDocumentNumber, renderURLDocumentType } from "@/widgets/settings-documenting/documentDesign/enums/document-type";
import { AStatus, PStatus } from "../board-missions/widgets/enums";
import { getAndSetCustomerById, getAndSetCustomersPagination } from "@/services/api-service/customers/customers-api";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";

const useQuotes = (docType: DOCUMENT_TYPE) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertFaultDuplicate, alertFaultGetData, alertSuccessUpdate } = useSnackBar();
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
  const [isCanceledState, setIsCanceledState] = useState(null)
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
  const { CheckPermission } = useUserPermission();

  const [openCloseOrderNotesModal, setOpenCloseOrderNotesModal] = useState(false)
  const [selectedQuoteItemValue, setSelectedQuoteItemValue] = useState()

  const onClickOpenCloseOrderNotesModal = () => {
    setOpenCloseOrderNotesModal(true)
  }
  const onClickCloseCloseOrderNotesModal = () => {
    setOpenCloseOrderNotesModal(false)
  }

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
  console.log("customersListCreateQuote", { customersListCreateQuote, customersListCreateOrder, canOrder })

  const getAllCustomersCreateQuote = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: "C",
      onlyCreateOrderClients: false,
      searchTerm: SearchTerm,
      isOccasionalCustomer: true
    });
  }, []);

  const getAllCustomersCreateOrder = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateOrder, {
      ClientType: "C",
      onlyCreateOrderClients: true,
      searchTerm: SearchTerm,
      isOccasionalCustomer: true
    });
  }, []);

  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      setCanOrder(true);
      getAllCustomersCreateOrder(e.target.value);
    } else {
      setCanOrder(false);
      getAllCustomersCreateQuote(e.target.value);

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
              _renderStatus(quote, t, navigate),
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
              _renderStatus(quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
              />,
            ];
          }
          else if (docType === DOCUMENT_TYPE.quote) {
            return [
              GetDateFormat(quote?.createdDate),
              <div style={{ cursor: "pointer" }} onClick={() => onClickOpenCustomerModal(quote?.customerId)}>{quote?.customerName}</div>,
              quote?.agentName,
              quote?.number,
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t, navigate),
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
          else if (docType === DOCUMENT_TYPE.order) {
            const jobsElement = CheckPermission(Permissions.SHOW_BOARD_MISSIONS)
              ? (<div style={{ cursor: "pointer" }} onClick={() => navigate(`/board-missions?orderNumber=${quote?.number}`)}>
                {quote?.jobs}
              </div>
              ) : quote?.jobs;
            return [
              GetDateFormat(quote?.createdDate),
              <div style={{ cursor: "pointer" }} onClick={() => onClickOpenCustomerModal(quote?.customerId)}>{quote?.customerName}</div>,
              quote?.agentName,
              quote?.number,
              quote?.sourceDocumentNumber?.map((item, index) => {
                return (
                  <>
                    <span style={{ cursor: "pointer" }} onClick={() => navigate(`/quote?Id=${item.documentId}`)} key={index}>{item?.documentNumber}
                      <br />
                    </span>
                  </>
                )
              }),
              quote?.purchaseNumber,
              quote?.productionStatus === true ? t('boardMissions.done') : t('boardMissions.inProduction'),
              jobsElement,
              CheckPermission(Permissions.SHOW_COSTS_IN_ORDERS) && quote?.cost,
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickQuoteDuplicate}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenIrrelevantModal={onClickOpenIrrelevantModal}
                onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
                onClickOpenPriceModal={onClickOpenPriceModal}
                CloseDocument={CloseDocument}

              />,
            ];
          }
          else {
            return [
              GetDateFormat(quote?.createdDate),
              quote?.customerName,
              quote?.agentName,
              quote?.number,
              quote?.sourceDocumentNumber?.map((item, index) => {
                return (
                  <>
                    <span key={index} onClick={() => navigate(renderURLDocumentType(item?.sourceDocumentType, item.documentId))} style={{ cursor: "pointer" }}>
                      {renderDocumentTypeForSourceDocumentNumber(item?.sourceDocumentType)}:{item?.documentNumber}
                      <br />
                    </span>
                  </>
                )
              }),
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t, navigate),
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
          //_renderDocumentStatus(quote?.status, t),
          quote?.status,
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
        status: statusId?.value,
        isCanceled: isCanceledState,
        minPrice: minPrice,
        maxPrice: maxPrice,
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
          closeStatus: accountingStatus?.value,
          productionStatus: productionStatus?.value,
          patternSearch: finalPatternSearch,
          customerId: customerId?.id,
          dateRange,
          agentId: agentId?.id,
          minPrice: minPrice,
          maxPrice: maxPrice,
          productList: productIds,
          isCanceled: isCanceledState,
          fromDate: fromDate && GetDateFormat(fromDate),
          toDate: toDate && GetDateFormat(toDate),
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
              _renderStatus(quote, t, navigate),
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
              _renderStatus(quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
              />,
            ];
          }
          else if (docType === DOCUMENT_TYPE.quote) {
            return [
              GetDateFormat(quote?.createdDate),
              <div style={{ cursor: "pointer" }} onClick={() => onClickOpenCustomerModal(quote?.customerId)}>{quote?.customerName}</div>,
              quote?.agentName,
              quote?.number,
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t, navigate),
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
          else if (docType === DOCUMENT_TYPE.order) {
            const jobsElement = CheckPermission(Permissions.SHOW_BOARD_MISSIONS)
              ? (<div style={{ cursor: "pointer" }} onClick={() => navigate(`/board-missions?orderNumber=${quote?.number}`)}>
                {quote?.jobs}
              </div>
              ) : quote?.jobs;

            return [
              GetDateFormat(quote?.createdDate),
              <div style={{ cursor: "pointer" }} onClick={() => onClickOpenCustomerModal(quote?.customerId)}>{quote?.customerName}</div>,
              quote?.agentName,
              quote?.number,
              quote?.sourceDocumentNumber?.map((item, index) => {
                return (
                  <>
                    <span style={{ cursor: "pointer" }} onClick={() => navigate(`/quote?Id=${item.documentId}`)} key={index}>{item?.documentNumber}
                      <br />
                    </span>
                  </>
                )
              }),
              quote?.purchaseNumber,
              quote?.productionStatus === true ? t('boardMissions.done') : t('boardMissions.inProduction'),
              jobsElement,
              CheckPermission(Permissions.SHOW_COSTS_IN_ORDERS) && quote?.cost,
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickQuoteDuplicate}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenIrrelevantModal={onClickOpenIrrelevantModal}
                onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
                onClickOpenPriceModal={onClickOpenPriceModal}
                CloseDocument={CloseDocument}

              />,
            ]
          }
          else {
            return [
              GetDateFormat(quote?.createdDate),
              quote?.customerName,
              quote?.agentName,
              quote?.number,
              quote?.sourceDocumentNumber?.map((item, index) => {
                return (
                  <>
                    <span key={index} onClick={() => navigate(renderURLDocumentType(item?.sourceDocumentType, item.documentId))} style={{ cursor: "pointer" }}>
                      {renderDocumentTypeForSourceDocumentNumber(item?.sourceDocumentType)}:{item?.documentNumber}
                      <br />
                    </span>
                  </>
                )
              }),
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(quote, t, navigate),
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
          // _renderDocumentStatus(quote?.status, t),
          t(quote?.status),
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
    setAccountingStatus(null);
    setProductionStatus(null);
    setFromDate(null);
    setToDate(null);
    setResetDatePicker(true);
    setIsCanceledState(false)
    getAllQuotesInitial();
    setPage(1);
    setMinPrice("");
    setMaxPrice("");
    setProductIds([]);
  };

  const tableHeaders = docType === DOCUMENT_TYPE.purchaseOrder ? [
    t("sales.quote.creationDate"),
    t("sales.quote.purchaseOrderNumber"),
    t("sales.quote.orderNumber"),
    // t("sales.quote.sourceDocument"),
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
    // t("sales.quote.sourceDocument"),
    t("sales.quote.supplierName"),
    t("sales.quote.itemsNumber"),
    t("sales.quote.totalPrice"),
    t("sales.quote.notes"),
    t("sales.quote.status"),
    t("sales.quote.more"),
  ] : docType === DOCUMENT_TYPE.quote ? [
    t("sales.quote.createdDate"),
    t("sales.quote.client"),
    t("sales.quote.agent"),
    t("sales.quote.quoteNumber"),
    t("sales.quote.worksName"),
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
    docType === DOCUMENT_TYPE.order ? t("sales.quote.quoteNumber") : docType === DOCUMENT_TYPE.receipt ? null : t("sales.quote.sourceDocument"),
    docType === DOCUMENT_TYPE.order && t("sales.quote.purchaseNumber"),
    docType === DOCUMENT_TYPE.order && t("sales.quote.productionStatus"),
    docType === DOCUMENT_TYPE.order && t("sales.quote.jobs"),
    docType === DOCUMENT_TYPE.order && <PermissionCheck userPermission={Permissions.SHOW_COSTS_IN_ORDERS}>
      {t("sales.quote.cost")}
    </PermissionCheck>,
    docType === DOCUMENT_TYPE.receipt ? t("sales.quote.paymentMethod") : t("sales.quote.worksName"),
    t("sales.quote.totalPrice"),
    t("sales.quote.notes"),
    t("sales.quote.status"),
    t("sales.quote.more"),
  ].filter(Boolean);

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
    const downloadPdf = (url) => {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.addEventListener("click", () => {
        setTimeout(() => {
          anchor.remove();
        }, 100);
      });
      anchor.click();
    };
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        // window.open(pdfLink, "_blank");
        downloadPdf(pdfLink);
      } else {
        alertFaultGetData();
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

  // const onClickQuotePdf = useCallback(async (id: string) => {
  //   let requestBody;

  //   if (isReceipt) {
  //     requestBody = {
  //       receiptId: id,
  //     };
  //   } else {
  //     requestBody = {
  //       documentId: id,
  //       documentType: docType,
  //     };
  //   }
  //   const res = await callApi(
  //     EHttpMethod.POST,
  //     `/v1/erp-service/documents/get-document-pdf`,
  //     requestBody,
  //     true,
  //     null,
  //     "blob"
  //   );
  //   const downloadLink = document.createElement('a');
  //   const link = URL?.createObjectURL(res.data);
  //   downloadLink.href = link
  //   downloadLink.download = 'Reports Rule engine.xlsx';
  //   downloadLink.click();
  //   if (res?.success) {

  //   } else {
  //     alertFaultGetData();
  //   }
  // }, [isReceipt]);

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
    await createNewDocumentApi(callApi, callBack, { documentType: 0 });
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
              {_renderStatus(document, t, navigate)}
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
            onClickOpenIrrelevantModal={onClickOpenIrrelevantModal}
            onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
            onClickOpenPriceModal={onClickOpenPriceModal}
            CloseDocument={CloseDocument}
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


  //////////////////////////////////////////////////////////////////
  const [productsList, setProductsList] = useState([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');


  const getAllProducts = useCallback(async () => {
    const products = await getAllProductsForDropDownList(
      callApi,
      setProductsList
    );
    setProductsList(
      products.map(({ id, name }) => ({ label: name, value: id }))
    );
  }, []);

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleMultiSelectChange = (newValues: string[]) => {
    setProductIds(newValues);
  };

  const productionStatuses = [
    { label: t("boardMissions.inProduction"), value: PStatus.IN_PROCESS },
    { label: t("boardMissions.done"), value: PStatus.DONE },
  ];

  const accountingStatuses = [
    { label: t("sales.quote.open"), value: AStatus.OPEN },
    { label: t("sales.quote.partialClosed"), value: AStatus.PARTIAL_CLOSED },
    { label: t("sales.quote.closed"), value: AStatus.CLOSED },
  ];

  const [accountingStatus, setAccountingStatus] = useState<{
    label: string;
    value: PStatus;
  } | null>();

  const [productionStatus, setProductionStatus] = useState<{
    label: string;
    value: PStatus;
  } | null>();

  const handleProductionStatusChange = (e: any, value: any) => {
    setProductionStatus(value);
  };

  const handleAccountingStatusChange = (e: any, value: any) => {
    setAccountingStatus(value);
  };
  const [filterData, setFilterData] = useState({});

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const removeEmptyValues = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      )
    );
  };
  useEffect(() => {
    const filteredData = {
      statusId: quoteStatusId?.value || statusId?.value,
      closeStatus: accountingStatus?.value && accountingStatus?.value,
      productionStatus: productionStatus?.value && productionStatus?.value,
      patternSearch: finalPatternSearch && finalPatternSearch,
      customerId: customerId?.id && customerId?.id,
      dateRange: dateRange && dateRange,
      agentId: agentId?.id && agentId?.id,
      minPrice: minPrice && minPrice,
      maxPrice: maxPrice && maxPrice,
      productList: productIds && productIds,
      fromDate: fromDate,
      toDate: toDate,
    };

    const filteredDataWithoutEmptyValues = removeEmptyValues(filteredData);

    if (JSON.stringify(filteredDataWithoutEmptyValues) !== JSON.stringify(filterData)) {
      setFilterData(filteredDataWithoutEmptyValues);
    }
  }, [quoteStatusId, statusId, accountingStatus, productionStatus, finalPatternSearch, customerId, dateRange, agentId, minPrice, maxPrice, productIds, fromDate, toDate]);

  const [openIrrelevantCancelModal, setOpenIrrelevantCancelModal] = useState(false);
  const [openPriceCancelModal, setOpenPriceCancelModal] = useState(false);
  const [openDeliveryTimeCancelModal, setOpenDeliveryTimeCancelModal] = useState(false);
  const [selectedOrder, setselectedOrder] = useState<any>({})

  const onClickOpenIrrelevantModal = (order) => {
    setselectedOrder(order)
    setOpenIrrelevantCancelModal(true);
  };
  const onClickCloseIrrelevantModal = () => {
    setOpenIrrelevantCancelModal(false);
  };


  const onClickOpenPriceModal = (order) => {
    setselectedOrder(order)
    setOpenPriceCancelModal(true);
  };
  const onClickClosePriceModal = () => {
    setOpenPriceCancelModal(false);
  };

  const onClickOpenDeliveryTimeModal = (order) => {
    setselectedOrder(order)
    setOpenDeliveryTimeCancelModal(true);
  };
  const onClickCloseDeliveryTimeModal = () => {
    setOpenDeliveryTimeCancelModal(false);
  };



  const updateCancelQuote = async (quoteStatus: number) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllQuotes()
      } else {
        alertFaultUpdate();
      }
    }
    await cancelDocumentApi(callApi, callBack, {
      DocumentType: docType,
      Document: {
        documentId: selectedOrder?.id,
        quoteStatus: quoteStatus,
      }
    })
  }

  const CloseDocument = async (quoteItemValue) => {
    console.log("quoteItemValue", quoteItemValue)
    setSelectedQuoteItemValue(quoteItemValue)
    if (quoteItemValue?.closeOrderNotes && quoteItemValue?.closeOrderNotes.tirm !== "") {
      onClickOpenCloseOrderNotesModal()
    }
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllQuotes()
        getAllDocuments(docType)
      } else {
        alertFaultUpdate();
      }
    };
    await CloseDocumentApi(callApi, callBack, {
      documentId: quoteItemValue?.id,
      documentType: docType

    });
  };


  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForEdit, setCustomerForEdit] = useState([]);
  const onClickOpenCustomerModal = (customerId: any) => {
    setShowCustomerModal(true)
    getCustomerForEdit(customerId)
  }

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
  const [clientTypesCategories, setClientTypesCategories] = useRecoilState(
    clientTypesCategoriesState
  );
  const getClientTypesCategories = async () => {
    const callBack = (res) => {
      if (res) {
        const clientTypes = res.map((types) => ({
          label: types.name,
          id: types.id,
        }));
        setClientTypesCategories(clientTypes);
      }
    };
    await getAndSetClientTypes(callApi, callBack, { cardType: CLIENT_TYPE_Id.CUSTOMER });
  };
  useEffect(() => {
    getClientTypesCategories()
  }, [])




  return {
    showCustomerModal,
    customerForEdit,
    setCustomerForEdit,
    setShowCustomerModal,
    updateCancelQuote,
    openIrrelevantCancelModal,
    onClickCloseIrrelevantModal,
    openPriceCancelModal,
    openDeliveryTimeCancelModal,
    onClickCloseDeliveryTimeModal,
    onClickClosePriceModal,
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
    setIsCanceledState,
    isCanceledState,
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
    documentLogsData,
    handleMaxPriceChange,
    handleMinPriceChange,
    minPrice,
    maxPrice,
    handleMultiSelectChange,
    productIds,
    productsList,
    getAllProducts,
    accountingStatuses,
    accountingStatus,
    productionStatuses,
    productionStatus,
    handleProductionStatusChange,
    handleAccountingStatusChange,
    handleClick,
    handleClose,
    open,
    anchorEl,
    filterData,
    openCloseOrderNotesModal,
    onClickCloseCloseOrderNotesModal,
    selectedQuoteItemValue
  };
};

export { useQuotes };