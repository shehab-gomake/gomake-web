import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApprovalStatus, LogActionType, QUOTE_STATUSES } from "./enums";
import { MoreMenuWidget } from "./more-circle";
import {
  getAllProductsForDropDownList,
  getAndSetAllCustomers,
  getAndSetClientTypes,
} from "@/services/hooks";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import {
  agentsCategoriesState,
  clientTypesCategoriesState,
} from "@/pages/customers/customer-states";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { useDebounce } from "@/utils/use-debounce";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useDateFormat } from "@/hooks/use-date-format";
import { _renderStatus } from "@/utils/constants";
import { selectedClientState } from "./states";
import {
  cancelDocumentApi,
  closeAndTrackOrderApi,
  createNewDocumentApi,
  duplicateDocumentApi,
  ExportDocumentTableToExcelApi,
  getAllDocumentLogsApi,
  getAllDocumentsApi,
  getDocumentPdfApi,
  manuallyCloseDocumentApi,
  OpenCanceledDocumentApi,
  OpenDocumentApi,
  updateDocumentApi,
} from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "./enums";
import { useQuoteGetData } from "../quote-new/use-quote-get-data";
import { useStyle } from "./style";
import { CLIENT_TYPE_Id, DEFAULT_VALUES } from "@/pages/customers/enums";
import {
  cancelReceiptApi,
  getAllReceiptsApi,
  getReceiptPdfApi,
} from "@/services/api-service/generic-doc/receipts-api";
import {
  renderDocumentTypeForSourceDocumentNumber,
  renderURLDocumentType,
} from "@/widgets/settings-documenting/documentDesign/enums/document-type";
import { AStatus, PStatus } from "../board-missions/widgets/enums";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import {
  StatePayment,
  sendPaymentState,
} from "./widgets/send-payment-modal/states";
import { sendDocumentToClientForPaymentApi } from "@/services/api-service/pay/pay-api";
import { useRouter } from "next/router";
import { useQuoteWidget } from "../admin/home/widgets/quote-widget/use-quote-widget";
interface Query {
  customerId?: string;
  customerName?: string;
  agentId?: string;
  statusId?: string;
  approvalStatusId?: string;
  minPrice?: string;
  maxPrice?: string;
  fromDate?: string;
  toDate?: string;
  accountingStatus?: string;
  productionStatus?: string;
  isCanceled?: boolean;
  pageNumber?: number;
}

const useQuotes = (docType: DOCUMENT_TYPE, isFromHomePage) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const {
    alertFaultUpdate,
    alertFaultDuplicate,
    alertFaultGetData,
    alertSuccessUpdate,
  } = useSnackBar();
  const { getCurrencyUnitText } = useQuoteGetData();
  const { navigate } = useGomakeRouter();
  const { errorColor } = useGomakeTheme();
  const [patternSearch, setPatternSearch] = useState("");
  const [finalPatternSearch, setFinalPatternSearch] = useState("");
  const { GetDateFormat, GetShortDateFormat } = useDateFormat();
  const [statusId, setStatusId] = useState<any>();
  const [approvalStatusId, setApprovalStatusId] = useState<any>();
  const [quoteStatusId, setQuoteStatusId] = useState<any>();
  const [customerId, setCustomerId] = useState<any>();
  const [isCanceledState, setIsCanceledState] = useState(null);
  const [dateRange, setDateRange] = useState<any>();
  const [agentId, setAgentId] = useState<any>();
  const [allQuotes, setAllQuotes] = useState();
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [customersListCreateOrder, setCustomersListCreateOrder] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openLogsModal, setOpenLogsModal] = useState(false);
  const [logsModalTitle, setLogsModalTitle] = useState<string>();
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
  const [resetLogsDatePicker, setResetLogsDatePicker] =
    useState<boolean>(false);
  const [fromLogsDate, setFromLogsDate] = useState<Date>();
  const [toLogsDate, setToLogsDate] = useState<Date>();
  const agentsCategories = useRecoilValue(agentsCategoriesState);
  const documentPath = DOCUMENT_TYPE[docType];
  const isReceipt = docType === DOCUMENT_TYPE.receipt;
  const { CheckPermission } = useUserPermission();
  const { query, pathname } = useRouter();
  const router = useRouter();
  const { quoteNumber } = query;
  const { renderOptions, checkWhatRenderArray, isFetching } = useQuoteWidget();
  const [accountingStatus, setAccountingStatus] = useState<{
    label: string;
    value: PStatus;
  } | null>();

  const [productionStatus, setProductionStatus] = useState<{
    label: string;
    value: PStatus;
  } | null>();
  const [productsList, setProductsList] = useState([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [openCloseOrderNotesModal, setOpenCloseOrderNotesModal] =
    useState(false);
  const [selectedQuoteItemValue, setSelectedQuoteItemValue] = useState<any>();
  const [documentCloseNumber, setDocumentCloseNumber] = useState("");

  const handleDocumentNumberChange = (event) => {
    setDocumentCloseNumber(event.target.value);
  };

  const onClickOpenCloseOrderNotesModal = (order) => {
    setOpenCloseOrderNotesModal(true);
    setSelectedQuoteItemValue(order);
    setSelectedDocument(order);
  };
  const onClickCloseCloseOrderNotesModal = () => {
    setOpenCloseOrderNotesModal(false);
  };

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
    setEmployeeId(null);
    setFromLogsDate(null);
    setToLogsDate(null);
  };
  const onClickQuotePdf = async (id: string, withPrices?: boolean) => {
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
    } else {
      await getDocumentPdfApi(callApi, callBack, {
        documentId: id,
        documentType: docType,
        withPrices: withPrices ?? false,
      });
    }
  };

  const getEmployeeCategories = async (isAgent: boolean, setState: any) => {
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

  const getAllCustomersCreateQuote = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      clientType: "C",
      onlyCreateOrderClients: false,
      searchTerm: SearchTerm,
      isOccasionalCustomer: true,
    });
  }, []);

  const onClickDocumentLogs = async (document: any) => {
    try {
      await getAllDocumentLogs(document?.id);
      setLogsModalTitle(
        `${t("sales.quote.logsFor")} ${t(
          `sales.quote.${DOCUMENT_TYPE[docType]}`
        ).toLowerCase()} ${t("sales.quote.number")} - ${document?.number}`
      );
      setOpenLogsModal(true);
    } catch (error) {
      console.error("Error fetching document logs:", error);
    }
  };

  const _renderPaymentType = (paymentType) => {
    if (!paymentType) return "";
    const types = paymentType.split(",").map((type) => type.trim());
    const translatedTypes = types.map((type) => {
      switch (type) {
        case "מזומן":
          return t("payment.cash");
        case "המחאה":
          return t("payment.check");
        case "bit":
          return t("payment.bit");
        case "אשראי":
          return t("payment.creditCard");
        case "העברה":
          return t("payment.transfer");
        default:
          return type;
      }
    });
    return translatedTypes.join(", ");
  };

  const isOrdersTracking = pathname === "/ordersTracking";

  const ExportDocumentTableToExcel = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const downloadLink = document.createElement("a");
        if (typeof res.data === "string") {
          downloadLink.href = res.data;
        } else {
          const link = URL.createObjectURL(res.data);
          downloadLink.href = link;
        }
        downloadLink.download = "table.xlsx";
        downloadLink.click();
      } else {
      }
    };
    await ExportDocumentTableToExcelApi(callApi, callBack, {
      documentType: docType,
      data: {
        model: {
          pageNumber: page,
          pageSize: pageSize,
        },
        statusId: quoteStatusId?.value || statusId?.value,
        approvalStatus: approvalStatusId?.value,
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
        isOrderInTracking: isOrdersTracking,
        fromDate: fromDate && GetDateFormat(fromDate),
        toDate: toDate && GetDateFormat(toDate),
      },
    });
  };

  const getAllQuotes = useCallback(async () => {
    const callBack = (res) => {
      if (res?.success) {
        const data = res?.data?.data;
        const totalItems = res?.data?.totalItems;
        const mapData = data?.map((quote: any) => {
          if (docType === DOCUMENT_TYPE.purchaseOrder) {
            // Split the creationDate to get the date and time separately
            const [date, time] = quote?.creationDate?.split(" ") || ["", ""];

            return [
              // Display the date on the first line and time on the second line
              <div>
                {date}
                <br />
                {time}
              </div>,
              quote?.number,
              quote?.orderNumber,
              quote?.supplierName,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.clientId)}
              >
                {quote?.clientName}
              </div>,
              quote?.itemsNumber,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              />,
            ];
          } else if (
            docType === DOCUMENT_TYPE.purchaseInvoice ||
            docType === DOCUMENT_TYPE.purchaseInvoiceRefund
          ) {
            const purchaseOrderNumbers = quote?.orderNumbers
              ? quote?.orderNumbers.join(", ")
              : "";
            const [date, time] = quote?.createdDate?.split(" ") || ["", ""];
            return [
              <div>
                {date}
                <br />
                {time}
              </div>,
              quote?.number,
              quote?.invoiceNumber,
              purchaseOrderNumbers,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>,
              quote?.itemsNumber,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              />,
            ];
          } else if (docType === DOCUMENT_TYPE.quote) {
            const [date, time] = quote?.createdDate?.split(" ") || ["", ""];
            return [
              <div>
                {date}
                <br />
                {time}
              </div>,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>,
              quote?.agentName,
              quote?.number,
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickQuoteDuplicate}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              />,
            ];
          } else if (docType === DOCUMENT_TYPE.order) {
            // Split the createdDate to get the date and time separately
            const [date, time] = quote?.createdDate?.split(" ") || ["", ""];

            const jobsElement = CheckPermission(
              Permissions.SHOW_BOARD_MISSIONS
            ) ? (
              <a
                style={{
                  cursor: "pointer",
                  color: "inherit",
                  textDecoration: "unset",
                }}
                href={`/jobs?orderNumber=${quote?.number}`}
              >
                {quote?.jobs}
              </a>
            ) : (
              quote?.jobs
            );

            const statusPayment = `${quote?.sumApplied + " " + getCurrencyUnitText(quote?.currency)
              }/${quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency)
              }`;

            return [
              // Display the date on the first line and time on the second line
              <div>
                {date}
                <br />
                {time}
              </div>,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>,
              quote?.agentName,
              quote?.number,
              quote?.sourceDocumentNumber?.map((item, index) => {
                return (
                  <span key={index}>
                    {item?.documentNumber}
                    <br />
                  </span>
                );
              }),
              quote?.purchaseNumber,
              quote?.productionStatus === true
                ? t("boardMissions.done")
                : t("boardMissions.inProduction"),
              jobsElement,
              ...(CheckPermission(Permissions.SHOW_COSTS_IN_ORDERS)
                ? [quote?.cost]
                : []),
              quote?.worksNames,
              isOrdersTracking
                ? statusPayment
                : quote?.totalPrice +
                " " +
                getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
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
                onClickOpenCloseOrderModal={onClickOpenCloseOrderModal}
                onClickOpenCloseOrderNotesModal={
                  onClickOpenCloseOrderNotesModal
                }
                onClickSendPayment={onClickSendPayment}
                onClickMakePayment={onClickMakePayment}
                onClickCloseAndTrack={onClickOpenTrackModal}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
                onClickOpenDocument={OpenDocument}
              />,
            ];
          } else {
            // Split the createdDate to get the date and time separately
            const [date, time] = quote?.createdDate?.split(" ") || ["", ""];

            return [
              // Display the date on the first line and time on the second line
              <div>
                {date}
                <br />
                {time}
              </div>,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>,
              quote?.agentName,
              quote?.number,
              quote?.sourceDocumentNumber?.map((item, index) => {
                return (
                  <a
                    key={index}
                    // onClick={() => navigate(renderURLDocumentType(item?.sourceDocumentType, item.documentId))}
                    href={`${renderURLDocumentType(
                      item?.sourceDocumentType,
                      item.documentId
                    )}`}
                    style={{
                      cursor: "pointer",
                      color: "inherit",
                      textDecoration: "unset",
                    }}
                  >
                    {t(
                      renderDocumentTypeForSourceDocumentNumber(
                        item?.sourceDocumentType
                      )
                    )}
                    :{item?.documentNumber}
                    <br />
                  </a>
                );
              }),
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickQuoteDuplicate}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenCloseOrderModal={onClickOpenCloseOrderModal}
                onClickOpenCloseOrderNotesModal={
                  onClickOpenCloseOrderNotesModal
                }
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              />,
            ];
          }
        });

        const mapReceiptData = data?.map((quote: any) => [
          // GetDateFormat(quote?.creationDate),
          quote?.creationDate?.split(" ")[0],
          <div
            style={{ cursor: "pointer" }}
            onClick={() => onClickOpenCustomerModal(quote?.customerId)}
          >
            {quote?.customerName}
          </div>,
          quote?.agentName,
          quote?.number,
          _renderPaymentType(quote?.paymentType),
          quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
          quote?.notes,
          t(`documentStatus.${quote?.status}`),
          <MoreMenuWidget
            quote={quote}
            documentType={docType}
            onClickOpenModal={onClickOpenModal}
            onClickPdf={onClickQuotePdf}
            onClickDuplicate={onClickQuoteDuplicate}
            onClickLoggers={onClickDocumentLogs}
            onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
            onOpenCancelReceiptModal={onOpenCancelReceiptModal}
            onOpenCancelReceiptModalRefund={onOpenCancelReceiptModalRefund}
          />,
        ]);
        setAllQuotes(isReceipt ? mapReceiptData : mapData);
        setPagesCount(Math.ceil(totalItems / pageSize));
        setAllStatistics(res?.data?.documentStatisticsList);
      }
    };
    const currentPageNumber = router.query.pageNumber;
    const currentStatusId = router.query.statusId;
    const currentFinalPatternSearch = router.query.finalPatternSearch;
    const currentCustomerId = router.query.customerId;
    const currentCustomerName = router.query.customerName;
    const currentAgentId = router.query.agentId;
    const currentApprovalStatusId = router.query.approvalStatusId;
    const currentMinPrice = router.query.minPrice;
    const currentMaxPrice = router.query.maxPrice;
    const currentFromDate = router.query.fromDate
      ? new Date(
        Array.isArray(router.query.fromDate)
          ? router.query.fromDate[0]
          : router.query.fromDate
      )
      : null;
    const currentToDate = router.query.toDate
      ? new Date(
        Array.isArray(router.query.toDate)
          ? router.query.toDate[0]
          : router.query.toDate
      )
      : null;
    const currentAccountingStatus = router.query.accountingStatus
      ? accountingStatuses.find(
        (status) => status.value === Number(router.query.accountingStatus)
      )
      : null;
    const currentProductionStatus = router.query.productionStatus
      ? productionStatuses.find(
        (status) => status.value === Number(router.query.productionStatus)
      )
      : null;
    const currentIsCanceled = router.query.isCanceled;

    if (isReceipt) {
      await getAllReceiptsApi(callApi, callBack, {
        clientId: currentCustomerId || customerId?.id,
        agentId: currentAgentId || agentId?.id,
        patternSearch: finalPatternSearch || currentFinalPatternSearch,
        fromDate: currentFromDate && GetDateFormat(currentFromDate),
        toDate: currentToDate && GetDateFormat(currentToDate),
        status: currentStatusId || statusId?.value,
        isCanceled: currentIsCanceled || isCanceledState,
        minPrice: currentMinPrice || minPrice,
        maxPrice: currentMaxPrice || maxPrice,
        model: {
          pageNumber: currentPageNumber || page,
          pageSize: pageSize,
        },
      });
    } else {
      await getAllDocumentsApi(callApi, callBack, {
        documentType: docType,
        data: {
          model: {
            pageNumber: currentPageNumber || page,
            pageSize: pageSize,
          },
          statusId: quoteStatusId?.value || currentStatusId || statusId?.value,
          approvalStatus: currentApprovalStatusId || approvalStatusId?.value,
          closeStatus:
            currentAccountingStatus?.value || accountingStatus?.value,
          productionStatus:
            currentProductionStatus?.value || productionStatus?.value,
          patternSearch: finalPatternSearch || currentFinalPatternSearch,
          customerId: currentCustomerId || customerId?.id,
          dateRange,
          agentId: currentAgentId || agentId?.id,
          minPrice: currentMinPrice || minPrice,
          maxPrice: currentMaxPrice || maxPrice,
          productList: productIds,
          isCanceled: currentIsCanceled || isCanceledState,
          isOrderInTracking: isOrdersTracking,
          fromDate: currentFromDate && GetDateFormat(currentFromDate),
          toDate: currentToDate && GetDateFormat(currentToDate),
        },
      });
    }
  }, [
    docType,
    callApi,
    finalPatternSearch,
    customerId,
    agentId,
    isReceipt,
    page,
    pageSize,
    statusId,
    approvalStatusId,
    quoteStatusId,
    accountingStatus,
    productionStatus,
    dateRange,
    minPrice,
    maxPrice,
    productIds,
    isCanceledState,
    fromDate,
    toDate,
    onClickOpenModal,
    onClickQuotePdf,
    onClickDocumentLogs,
  ]);

  const getAllQuotesInitial = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const data = res?.data?.data;
        const totalItems = res?.data?.totalItems;
        const mapData = data?.map((quote: any) => {
          if (docType === DOCUMENT_TYPE.purchaseOrder) {
            // Split the creationDate to get the date and time separately
            const [date, time] = quote?.creationDate?.split(" ") || ["", ""];

            return [
              // Display the date on the first line and time on the second line
              <div>
                {date}
                <br />
                {time}
              </div>,
              quote?.number,
              quote?.orderNumber,
              quote?.supplierName,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.clientId)}
              >
                {quote?.clientName}
              </div>,
              quote?.itemsNumber,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              />,
            ];
          } else if (
            docType === DOCUMENT_TYPE.purchaseInvoice ||
            docType === DOCUMENT_TYPE.purchaseInvoiceRefund
          ) {
            const purchaseOrderNumbers = quote?.orderNumbers
              ? quote?.orderNumbers.join(", ")
              : "";
            const [date, time] = quote?.createdDate?.split(" ") || ["", ""];
            return [
              <div>
                {date}
                <br />
                {time}
              </div>,
              quote?.number,
              quote?.invoiceNumber,
              purchaseOrderNumbers,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>,
              quote?.itemsNumber,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              />,
            ];
          } else if (docType === DOCUMENT_TYPE.quote) {
            const [date, time] = quote?.createdDate?.split(" ") || ["", ""];
            return [
              <div>
                {date}
                <br />
                {time}
              </div>,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>,
              quote?.agentName,
              quote?.number,
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickQuoteDuplicate}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              />,
            ];
          } else if (docType === DOCUMENT_TYPE.order) {
            // Split the createdDate to get the date and time separately
            const [date, time] = quote?.createdDate?.split(" ") || ["", ""];

            const jobsElement = CheckPermission(
              Permissions.SHOW_BOARD_MISSIONS
            ) ? (
              <a
                style={{
                  cursor: "pointer",
                  color: "inherit",
                  textDecoration: "unset",
                }}
                href={`/jobs?orderNumber=${quote?.number}`}
              >
                {quote?.jobs}
              </a>
            ) : (
              quote?.jobs
            );

            const statusPayment = `${quote?.sumApplied + " " + getCurrencyUnitText(quote?.currency)
              }/${quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency)
              }`;
            return [
              // Display the date on the first line and time on the second line
              <div>
                {date}
                <br />
                {time}
              </div>,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>,
              quote?.agentName,
              quote?.number,
              quote?.sourceDocumentNumber?.map((item, index) => {
                return (
                  <span key={index}>
                    {item?.documentNumber}
                    <br />
                  </span>
                );
              }),
              quote?.purchaseNumber,
              quote?.productionStatus === true
                ? t("boardMissions.done")
                : t("boardMissions.inProduction"),
              jobsElement,
              ...(CheckPermission(Permissions.SHOW_COSTS_IN_ORDERS)
                ? [quote?.cost]
                : []),
              quote?.worksNames,
              isOrdersTracking
                ? statusPayment
                : quote?.totalPrice +
                " " +
                getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickQuoteDuplicate}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenIrrelevantModal={onClickOpenIrrelevantModal}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
                onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
                onClickOpenPriceModal={onClickOpenPriceModal}
                onClickOpenCloseOrderModal={onClickOpenCloseOrderModal}
                onClickOpenCloseOrderNotesModal={
                  onClickOpenCloseOrderNotesModal
                }
                onClickSendPayment={onClickSendPayment}
                onClickMakePayment={onClickMakePayment}
                onClickCloseAndTrack={onClickOpenTrackModal}
                onClickOpenDocument={OpenDocument}
              />,
            ];
          } else {
            // Split the createdDate to get the date and time separately
            const [date, time] = quote?.createdDate?.split(" ") || ["", ""];

            return [
              // Display the date on the first line and time on the second line
              <div>
                {date}
                <br />
                {time}
              </div>,
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>,
              quote?.agentName,
              quote?.number,
              quote?.sourceDocumentNumber?.map((item, index) => {
                return (
                  <a
                    key={index}
                    href={`${renderURLDocumentType(
                      item?.sourceDocumentType,
                      item.documentId
                    )}`}
                    style={{
                      cursor: "pointer",
                      color: "inherit",
                      textDecoration: "unset",
                    }}
                  >
                    {t(
                      renderDocumentTypeForSourceDocumentNumber(
                        item?.sourceDocumentType
                      )
                    )}
                    :{item?.documentNumber}
                    <br />
                  </a>
                );
              }),
              quote?.worksNames,
              quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
              quote?.notes,
              _renderStatus(docType, quote, t, navigate),
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickOpenModal={onClickOpenModal}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickQuoteDuplicate}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenCloseOrderModal={onClickOpenCloseOrderModal}
                onClickOpenCloseOrderNotesModal={
                  onClickOpenCloseOrderNotesModal
                }
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              />,
            ];
          }
        });
        const mapReceiptData = data?.map((quote: any) => [
          // GetDateFormat(quote?.creationDate),
          quote?.creationDate?.split(" ")[0],
          <div
            style={{ cursor: "pointer" }}
            onClick={() => onClickOpenCustomerModal(quote?.customerId)}
          >
            {quote?.customerName}
          </div>,
          quote?.agentName,
          quote?.number,
          _renderPaymentType(quote?.paymentType),
          quote?.totalPrice + " " + getCurrencyUnitText(quote?.currency),
          quote?.notes,
          t(`documentStatus.${quote?.status}`),
          <MoreMenuWidget
            quote={quote}
            documentType={docType}
            onClickOpenModal={onClickOpenModal}
            onClickPdf={onClickQuotePdf}
            onClickDuplicate={onClickQuoteDuplicate}
            onClickLoggers={onClickDocumentLogs}
            onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
            onOpenCancelReceiptModal={onOpenCancelReceiptModal}
            onOpenCancelReceiptModalRefund={onOpenCancelReceiptModalRefund}
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
          isOrderInTracking: isOrdersTracking,
          model: {
            pageNumber: page,
            pageSize: pageSize,
          },
        },
      });
    }
  };

  const onClickSearchFilter = () => {
    console.log("customerId", customerId)
    const query: Query = {};
    if (customerId?.id) query.customerId = customerId.id;
    if (customerId?.name) query.customerName = customerId.name;
    if (agentId?.id) query.agentId = agentId.id;
    if (statusId?.value) query.statusId = statusId.value;
    if (approvalStatusId?.value)
      query.approvalStatusId = approvalStatusId.value;
    if (minPrice) query.minPrice = minPrice;
    if (maxPrice) query.maxPrice = maxPrice;
    if (page) query.pageNumber = page;
    if (fromDate) query.fromDate = fromDate.toISOString();
    if (toDate) query.toDate = toDate.toISOString();
    if (accountingStatus)
      query.accountingStatus = accountingStatus.value.toString();
    if (productionStatus)
      query.productionStatus = productionStatus.value.toString();
    query.isCanceled = isCanceledState;

    handleClose();
    setPage(1);
    if (statusId !== null && statusId !== undefined) {
      handleSecondCardClick();
    }
    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...query },
    });
  };

  const onClickClearFilter = () => {
    handleClose();
    handleSecondCardClick();
    setAgentId(null);
    setCustomerId(null);
    setStatusId(null);
    setApprovalStatusId(null);
    setAccountingStatus(null);
    setProductionStatus(null);
    setFromDate(null);
    setToDate(null);
    setResetDatePicker(true);
    setIsCanceledState(false);
    setPage(1);
    setMinPrice("");
    setMaxPrice("");
    setProductIds([]);
    setFinalPatternSearch("");
    setPatternSearch("");
    // getAllQuotesInitial();
    const query = {};
    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  const tableHeaders =
    docType === DOCUMENT_TYPE.purchaseOrder
      ? [
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
      ]
      : docType === DOCUMENT_TYPE.purchaseInvoice ||
        docType === DOCUMENT_TYPE.purchaseInvoiceRefund
        ? [
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
        ]
        : docType === DOCUMENT_TYPE.quote
          ? [
            t("sales.quote.createdDate"),
            t("sales.quote.client"),
            t("sales.quote.agent"),
            t("documentingDesign.TableSetting.number"),
            t("sales.quote.worksName"),
            t("sales.quote.totalPrice"),
            t("sales.quote.notes"),
            t("sales.quote.status"),
            t("sales.quote.more"),
          ]
          : [
            t("sales.quote.createdDate"),
            t("sales.quote.client"),
            t("sales.quote.agent"),
            (() => {
              switch (docType) {
                case DOCUMENT_TYPE.order:
                  return t("sales.quote.orderNumber");
                // case DOCUMENT_TYPE.deliveryNote:
                //   return t("documentingDesign.TableSetting.number");
                // case DOCUMENT_TYPE.deliveryNoteRefund:
                //   return t("sales.quote.deliveryNoteNumber");
                // case DOCUMENT_TYPE.invoice:
                //   return t("sales.quote.invoiceNumber");
                // case DOCUMENT_TYPE.invoiceRefund:
                //   return t("sales.quote.invoiceNumber");
                // case DOCUMENT_TYPE.receipt:
                //   return t("sales.quote.receiptNumber");
                default:
                  return t("documentingDesign.TableSetting.number");
              }
            })(),
            docType === DOCUMENT_TYPE.order
              ? t("sales.quote.quoteNumber")
              : docType === DOCUMENT_TYPE.receipt
                ? null
                : t("sales.quote.sourceDocument"),
            docType === DOCUMENT_TYPE.order && t("sales.quote.purchaseNumber"),
            docType === DOCUMENT_TYPE.order && t("sales.quote.productionStatus"),
            docType === DOCUMENT_TYPE.order && t("sales.quote.jobs"),
            docType === DOCUMENT_TYPE.order &&
            CheckPermission(Permissions.SHOW_COSTS_IN_ORDERS) && (
              <PermissionCheck
                userPermission={Permissions.SHOW_COSTS_IN_ORDERS}
              >
                {t("sales.quote.cost")}
              </PermissionCheck>
            ),
            docType === DOCUMENT_TYPE.receipt
              ? t("sales.quote.paymentMethod")
              : t("sales.quote.worksName"),
            isOrdersTracking
              ? t("customers.modal.paymentStatus")
              : t("sales.quote.totalPrice"),
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
      label: t("sales.quote.partialClosed"),
      value: QUOTE_STATUSES.PartialClosed,
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

  const documentLabel = isOrdersTracking
    ? t("tabs.ordersTracking")
    : documentsLabels.find((item) => item.value === docType).label;

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
          document?.createdDate?.split("T")[0],
          // GetDateFormat(document?.createdDate),
          document?.totalPrice + " " + getCurrencyUnitText(document?.currency),
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h2
              style={
                document?.documentStatus == 2
                  ? classes.openBtnStyle
                  : classes.closeBtnStyle
              }
            >
              {_renderStatus(docType, document, t, navigate)}
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
            onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
            onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
            onClickOpenPriceModal={onClickOpenPriceModal}
            onClickOpenCloseOrderModal={onClickOpenCloseOrderModal}
            onClickOpenCloseOrderNotesModal={onClickOpenCloseOrderNotesModal}
            onClickOpenDocument={OpenDocument}
            onClickSendPayment={onClickSendPayment}
            onClickMakePayment={onClickMakePayment}
            onClickCloseAndTrack={onClickOpenTrackModal}
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
    setQuoteStatusId({
      label: t(`sales.quote.${cardKey}`),
      value: statusValue,
    });
  };

  const handleSecondCardClick = () => {
    setQuoteStatusId(undefined);
    setActiveCard(null);
  };

  // const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
  //   setResetDatePicker(false);
  //   setFromDate(fromDate);
  //   setToDate(toDate);
  // };
  const onSelectDeliveryTimeDates = (value) => {
    if (value && value.length === 2) {
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
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
  };

  ////////////// LOGS //////////////

  const getLogDescription = (
    logAction: string,
    values: any,
    documentType: DOCUMENT_TYPE
  ): string => {
    switch (logAction) {
      case LogActionType[1]:
        return `${t("logs.theWorkMission")} "${values[0]}" ${t(
          "logs.ITEM_ADD"
        )}`;
      case LogActionType[2]:
        return `${t("logs.theWorkMission")} "${values[0]}" ${t(
          "logs.ITEM_UPADTED"
        )}`;
      case LogActionType[3]:
        return `${t("logs.theWorkMission")} "${values[0]}" ${t(
          "logs.ITEM_DELETED"
        )}`;
      case LogActionType[4]:
        return `${t("logs.ITEM_PRICE_UPDATE")} : "${values[0]}" ${t(
          "logs.from"
        )} ${parseFloat(values[1]).toFixed(2)} ${t("logs.to")} ${parseFloat(
          values[2]
        ).toFixed(2)}`;
      case LogActionType[5]:
        return `${t("logs.DOCUMENT_PRICE_UPDATE")} ${t(
          "logs.from"
        )} ${parseFloat(values[0]).toFixed(2)} ${t("logs.to")} ${parseFloat(
          values[1]
        ).toFixed(2)}`;
      case LogActionType[6]:
        if (values[0] === "" || null) {
          return `${t("logs.DOCUMENT_DISCUOUNT_UPDATE")} ${t(
            "logs.from"
          )} ${0.0} ${t("logs.to")} ${parseFloat(values[1]).toFixed(2)}`;
        } else {
          return `${t("logs.DOCUMENT_DISCUOUNT_UPDATE")} ${t(
            "logs.from"
          )} ${parseFloat(values[0]).toFixed(2)} ${t("logs.to")} ${parseFloat(
            values[1]
          ).toFixed(2)}`;
        }
      case LogActionType[7]:
        return t("logs.ADDRESS_UPDATED");
      case LogActionType[8]:
        return t("logs.CONTACTS_UPDATED");
      case LogActionType[9]:
        return `${t("logs.CLIENT_UPDATED")} ${t("logs.from")} "${values[0]
          }" ${t("logs.to")} "${values[1]}"`;
      case LogActionType[10]:
        if (values[0] === null) {
          return `${t("logs.AGENT_UPDATED")} ${t("logs.to")} ${values[1]}`;
        } else {
          return `${t("logs.AGENT_UPDATED")} ${t("logs.from")} ${values[0]} ${t(
            "logs.to"
          )} ${values[1]}`;
        }
      case LogActionType[11]:
        if (values[0] === null) {
          return `${t("logs.PURCHASE_NUMBER_UPDATE")} ${t("logs.to")} "${values[1]
            }"`;
        } else {
          return `${t("logs.PURCHASE_NUMBER_UPDATE")} ${t("logs.from")} ${values[0]
            } ${t("logs.to")} ${values[1]}`;
        }
      case LogActionType[12]:
        if (values[0] === null) {
          return `${t("logs.COMMENTS_UPDATE")} ${t("logs.to")} "${values[1]}"`;
        } else {
          return `${t("logs.COMMENTS_UPDATE")} ${t("logs.from")} "${values[0]
            }" ${t("logs.to")} "${values[1]}"`;
        }
      case LogActionType[13]:
        return `${t("logs.DOCUMENT_DUPLICATED", {
          documentType: t(`sales.quote.${DOCUMENT_TYPE[documentType]}`),
          documentNumber: values[0],
        })}`;
      case LogActionType[14]:
        return `${t("logs.DOCUMENT_DUPLICATED_FROM_ORDER", {
          documentNumber: values[0],
        })}`;
      // New cases
      case LogActionType[15]: // SEND_MAIL
        return `${t("logs.SEND_MAIL")} ${t("logs.from")} "${values[0]}"`;
      case LogActionType[16]: // SEND_SMS
        return `${t("logs.SEND_SMS")} ${t("logs.from")} "${values[0]}"`;
      case LogActionType[17]:
        return `${t("logs.PRINTING_PDF")}`;
      case LogActionType[18]:
        return `${t("logs.DOCUMENT_CANCEL")}`;
      case LogActionType[19]:
        return `${t("logs.REJECTED_BY_CLIENT")}`;
      case LogActionType[20]:
        return `${t("logs.APPROVAL_BY_CLIENT")}`;

      default:
        return "";
    }
  };

  const getAllDocumentLogs = (
    documentId?: string,
    isClear: boolean = false
  ): Promise<void> => {
    setDocumentIdLogState(documentId);
    return new Promise(async (resolve, reject) => {
      const callBack = (res) => {
        if (res?.success) {
          const mapData = res?.data?.map((log: any) => [
            GetShortDateFormat(log?.actionDate),
            log?.employeeName,
            getLogDescription(log?.logAction, log?.values, log?.documentType),
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
        await getAllDocumentLogsApi(callApi, callBack, {
          documentType: docType,
          documentId: documentId,
          data: isClear
            ? {
              fromDate: fromLogsDate && GetDateFormat(fromLogsDate),
              toDate: toLogsDate && GetDateFormat(toLogsDate),
            }
            : {
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

  const onClickClearLogsFilter = () => {
    setEmployeeId(null);
    getAllDocumentLogs(documentIdLogState, true);
  };

  const onClickSearchLogsFilter = () => {
    getAllDocumentLogs(documentIdLogState);
  };

  useEffect(() => {
    if (!isFromHomePage) {
      getAllCustomersCreateQuote();
      // this for client type list in customer modal
      getClientTypesCategories();
    }
  }, []);

  useEffect(() => {
    if (quoteNumber) {
      setPage(1);
      const pattern = quoteNumber?.toString();
      setPatternSearch(pattern);
      setFinalPatternSearch(pattern);
    }
  }, [quoteNumber, query]);

  useEffect(() => {
    const isNotFilteredData = Object.keys(router?.query || {}).length === 0;
    if (!isFromHomePage) {
      if (isNotFilteredData) getAllQuotesInitial();
      else getAllQuotes();
    }
  }, [page, pageSize, router]);

  const debouncePatternSearch = useDebounce(patternSearch, 1000);
  useEffect(() => {
    setFinalPatternSearch(debouncePatternSearch.trim());

    if (debouncePatternSearch === null || debouncePatternSearch.trim() === "") {
      const { finalPatternSearch, ...remainingQuery } = router.query;
      router.push({
        pathname: router.pathname,
        query: {
          ...remainingQuery,
        },
      });
      return;
    }
    console.log("debouncePatternSearch", debouncePatternSearch)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        finalPatternSearch: debouncePatternSearch,
      },
    });
  }, [debouncePatternSearch]);

  // For HomeTableWidget
  useEffect(() => {
    if (isFromHomePage) {
      getAllDocuments(docType);
    }
  }, [selectedClient]);

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

  const approvalStatuses: { value: number; label: string }[] = Object.values(
    ApprovalStatus
  )
    .filter((value) => typeof value === "number")
    .map((value) => ({
      value: value as number,
      label: t(`documentStatus.${ApprovalStatus[value]}`),
    }));

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
      Object.entries(obj).filter(
        ([_, value]) =>
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
      approvalStatus: approvalStatusId?.value,
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

    if (
      JSON.stringify(filteredDataWithoutEmptyValues) !==
      JSON.stringify(filterData)
    ) {
      setFilterData(filteredDataWithoutEmptyValues);
    }
  }, [
    quoteStatusId,
    approvalStatusId,
    statusId,
    accountingStatus,
    productionStatus,
    finalPatternSearch,
    customerId,
    dateRange,
    agentId,
    minPrice,
    maxPrice,
    productIds,
    fromDate,
    toDate,
  ]);

  const [openIrrelevantCancelModal, setOpenIrrelevantCancelModal] =
    useState(false);
  const [openPriceCancelModal, setOpenPriceCancelModal] = useState(false);
  const [openCloseOrderModal, setOpenCloseOrderModal] = useState(false);
  const [openDeliveryTimeCancelModal, setOpenDeliveryTimeCancelModal] =
    useState(false);

  // Use this state when opening any modal from the "More" menu list.
  const [selectedDocument, setSelectedDocument] = useState<any>({});

  const onClickOpenIrrelevantModal = (order) => {
    setSelectedDocument(order);
    setOpenIrrelevantCancelModal(true);
  };

  const onClickCloseIrrelevantModal = () => {
    setOpenIrrelevantCancelModal(false);
  };

  const onClickOpenPriceModal = (order) => {
    setSelectedDocument(order);
    setOpenPriceCancelModal(true);
  };
  const onClickClosePriceModal = () => {
    setOpenPriceCancelModal(false);
  };

  const onClickOpenCloseOrderModal = (order) => {
    setSelectedDocument(order);
    setOpenCloseOrderModal(true);
  };
  const onClickCloseCloseOrderModal = () => {
    setOpenCloseOrderModal(false);
    setDocumentCloseNumber("");
  };

  const onClickOpenDeliveryTimeModal = (order) => {
    setSelectedDocument(order);
    setOpenDeliveryTimeCancelModal(true);
  };
  const onClickCloseDeliveryTimeModal = () => {
    setOpenDeliveryTimeCancelModal(false);
  };

  const updateCancelQuote = async (quoteStatus: number) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllQuotes();
      } else {
        alertFaultUpdate();
      }
    };
    await cancelDocumentApi(callApi, callBack, {
      DocumentType: docType,
      Document: {
        documentId: selectedDocument?.id,
        quoteStatus: quoteStatus,
      },
    });
  };

  const ManuallyCloseDocument = async (quoteItemValue) => {
    setSelectedQuoteItemValue(quoteItemValue);
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        isFromHomePage ? getAllDocuments(docType) : getAllQuotes();
      } else {
        alertFaultUpdate();
      }
    };
    await manuallyCloseDocumentApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
        documentNumber: documentCloseNumber,
      },
    });
  };

  const OpenDocument = async (document) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        isFromHomePage ? getAllDocuments(docType) : getAllQuotes();
      } else {
        alertFaultUpdate();
      }
    };

    if (document?.statusTitleText === "Order.Canceled") {
      await OpenCanceledDocumentApi(callApi, callBack, {
        documentType: docType,
        data: { documentId: document?.id },
      });
    } else {
      await OpenDocumentApi(callApi, callBack, {
        documentType: docType,
        documentId: document?.id,
      });
    }
  };

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForEdit, setCustomerForEdit] = useState([]);
  const onClickOpenCustomerModal = (customerId: any) => {
    setShowCustomerModal(true);
    getCustomerForEdit(customerId);
  };

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

  const setClientTypesCategories = useSetRecoilState(
    clientTypesCategoriesState
  );

  const getClientTypesCategories = async () => {
    const callBack = (res) => {
      if (res) {
        const clientTypes = res.map((types) => ({
          label: types.name,
          id: types.id,
          additionProfits: types?.additionProfits ?? 0,
        }));
        setClientTypesCategories(clientTypes);
      }
    };
    await getAndSetClientTypes(callApi, callBack, {
      cardType: CLIENT_TYPE_Id.CUSTOMER,
    });
  };

  ///////////////////////// SEND PAYMENT //////////////////////////
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [sendPayment, setSendPayment] =
    useRecoilState<StatePayment>(sendPaymentState);

  const onClickClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  const onClickSendPaymentOld = (document: any): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const callBack = (res) => {
        if (res?.success) {
          const newSendPaymentState = { ...sendPayment, ...res.data };
          setSendPayment(newSendPaymentState);
          resolve();
        } else {
          reject(new Error("Failed to update payment state"));
        }
      };
      sendDocumentToClientForPaymentApi(callApi, callBack, {
        id: document?.id,
        documentType: DOCUMENT_TYPE.order,
      });
    });
  };

  const onClickSendPayment = async (document: any) => {
    try {
      await onClickSendPaymentOld(document);
      setPaymentModalTitle(
        `${t("prePayment.paymentPageFor")} ${t(
          `sales.quote.${DOCUMENT_TYPE[docType]}`
        ).toLowerCase()} ${t("sales.quote.number")} - ${document?.number}`
      );
      setOpenPaymentModal(true);
    } catch (error) {
      alertFaultGetData();
    }
  };

  ///// order tracking
  const [openMakePaymentModal, setOpenMakePaymentModal] = useState(false);
  const onClickMakePayment = (order) => {
    setSelectedQuoteItemValue(order);
    setOpenMakePaymentModal(true);
  };

  const onClickCloseMakePaymentModal = () => {
    setOpenMakePaymentModal(false);
  };

  const [openCloseAndTrackOrderModal, setOpenCloseAndTrackOrderModal] =
    useState(false);
  const [openPrintPDFModal, setOpenPrintPDFModal] = useState(false);
  const onClickClosePrintPDFModal = () => {
    setOpenPrintPDFModal(false);
  };
  const onClickOpenPrintPDFModal = (order) => {
    setSelectedDocument(order);
    setOpenPrintPDFModal(true);
  };

  const onClickOpenTrackModal = (order) => {
    setSelectedQuoteItemValue(order);
    setOpenCloseAndTrackOrderModal(true);
  };

  const onClickCloseTrackModal = () => {
    setOpenCloseAndTrackOrderModal(false);
  };

  const closeAndTrackOrder = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllQuotes();
      } else {
        alertFaultUpdate();
      }
    };
    await closeAndTrackOrderApi(callApi, callBack, {
      documentType: docType,
      documentId: selectedQuoteItemValue?.id,
    });
  };

  // State and functions for receipt cancellation modals

  const [openCancelReceiptModal, setOpenCancelReceiptModal] = useState(false);
  const onOpenCancelReceiptModal = (receipt: any) => {
    setSelectedDocument(receipt);
    setOpenCancelReceiptModal(true);
  };
  const onCloseCancelReceiptModal = () => {
    setSelectedDocument(null);
    setOpenCancelReceiptModal(false);
  };

  const [openCancelReceiptModalRefund, setOpenCancelReceiptModalRefund] =
    useState(false);
  const onOpenCancelReceiptModalRefund = (receipt: any) => {
    setSelectedDocument(receipt);
    setOpenCancelReceiptModalRefund(true);
  };
  const onCloseCancelReceiptModalRefund = () => {
    setSelectedDocument(null);
    setOpenCancelReceiptModalRefund(false);
  };

  // Function to handle receipt cancellation

  const onClickCancelReceipt = async (refundCredit?: boolean | null) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllQuotes();
      } else {
        alertFaultUpdate();
      }
    };
    await cancelReceiptApi(callApi, callBack, {
      id: selectedDocument?.id,
      refundCredit,
    });
  };

  useEffect(() => {
    const {
      customerId,
      customerName,
      agentId,
      statusId,
      approvalStatusId,
      minPrice,
      maxPrice,
      fromDate,
      toDate,
      finalPatternSearch,
      accountingStatus,
      productionStatus,
      isCanceled,
      pageNumber,
    } = router.query;
    if (customerId) {
      // const customerIdSelect = renderOptions().find(
      //   (c1) => c1.id === customerId
      // );
      setCustomerId({ id: customerId, name: customerName });
    }
    if (agentId) {
      const selectedAgent = agentsCategories?.find(
        (agent: any) => agent?.id === agentId
      );
      setAgentId(selectedAgent);
    }
    if (statusId) setStatusId({ value: statusId });
    if (pageNumber) setPage(Number(pageNumber)); // Convert to number
    if (approvalStatusId) setApprovalStatusId({ value: approvalStatusId });
    if (typeof minPrice === "string") setMinPrice(minPrice);
    if (typeof maxPrice === "string") setMaxPrice(maxPrice);
    if (fromDate && typeof fromDate === "string")
      setFromDate(new Date(fromDate));
    if (toDate && typeof toDate === "string") setToDate(new Date(toDate));
    if (finalPatternSearch && typeof finalPatternSearch === "string")
      setPatternSearch(finalPatternSearch);
    if (accountingStatus) {
      const statusToSet = accountingStatuses.find(
        (status) => status.value === Number(accountingStatus)
      );
      if (statusToSet) {
        setAccountingStatus(
          statusToSet as unknown as { label: string; value: PStatus }
        ); // Cast to unknown first
      }
    }
    if (productionStatus) {
      const productionStatusToSet = productionStatuses.find(
        (status) => status.value === Number(productionStatus)
      );
      if (productionStatusToSet) {
        setProductionStatus(
          productionStatusToSet as unknown as { label: string; value: PStatus }
        );
      }
    }
    if (isCanceled) {
      setIsCanceledState(isCanceledState);
    }
  }, [router, renderOptions(), agentsCategories]);

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
    selectedQuoteItemValue,
    paymentModalTitle,
    openPaymentModal,
    onClickClosePaymentModal,
    onClickCloseCloseOrderModal,
    openCloseOrderModal,
    selectedDocument,
    onClickOpenCloseOrderModal,
    getEmployeeCategories,
    ManuallyCloseDocument,
    documentCloseNumber,
    handleDocumentNumberChange,
    approvalStatuses,
    setApprovalStatusId,
    approvalStatusId,
    openMakePaymentModal,
    onClickCloseMakePaymentModal,
    isOrdersTracking,
    onClickCloseTrackModal,
    openCloseAndTrackOrderModal,
    closeAndTrackOrder,
    onClickClosePrintPDFModal,
    openPrintPDFModal,
    fromDate,
    toDate,
    openCancelReceiptModal,
    onCloseCancelReceiptModal,
    onClickCancelReceipt,
    openCancelReceiptModalRefund,
    onCloseCancelReceiptModalRefund,
    ExportDocumentTableToExcel,
    isFetching,
  };
};

export { useQuotes };
