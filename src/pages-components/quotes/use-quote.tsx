import {
  useCustomerDropDownList,
  useGomakeAxios,
  useGomakeRouter,
  useSnackBar,
} from "@/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ApprovalStatus,
  LogActionType,
  QUOTE_STATUSES,
  StatusTitleText,
} from "./enums";
import { MoreMenuWidget } from "./more-circle";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import {
  agentsCategoriesState,
  isSelectedCLoseAsDeliveryNoteState,
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
  ExportDocumentTableToPdfApi,
  getAllDocumentLogsApi,
  getAllDocumentsApi,
  getDocumentPdfApi,
  manuallyCloseDocumentApi,
  moveOrderToReadyApi,
  OpenCanceledDocumentApi,
  OpenDocumentApi,
  pauseOrdResumeOrderApi,
  removeDraftDocumentApi,
  startOrderProductionApi,
  updateDocumentApi,
} from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "./enums";
import { useQuoteGetData } from "../quote-new/use-quote-get-data";
import { useStyle } from "./style";
import {
  CLIENT_TYPE,
  CLIENT_TYPE_Id,
  DEFAULT_VALUES,
} from "@/pages/customers/enums";
import {
  cancelReceiptApi,
  getAllReceiptsApi,
  getReceiptInvoicesPdfApi,
  getReceiptPdfApi,
} from "@/services/api-service/generic-doc/receipts-api";
import {
  renderDocumentTypeForSourceDocumentNumber,
  renderURLDocumentType,
} from "@/widgets/settings-documenting/documentDesign/enums/document-type";
import {
  AStatus,
  BoardMissionStatusForFilter,
  PStatus,
  ReceiptAccountingStatus,
} from "../board-missions/widgets/enums";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import {
  StatePayment,
  sendPaymentState,
} from "./widgets/send-payment-modal/states";
import {
  getDocumentContactApi,
  sendDocumentToClientForPaymentApi,
} from "@/services/api-service/pay/pay-api";
import { useRouter } from "next/router";
import { ICard } from "./widgets/statistics-section/statistics-sections";
import { ClickableStatusButton } from "./widgets/delivery-status-button/delivery-status-button";
import { DocumentDeliveryStatuses } from "./widgets/delivery-status-button/delivery-status-modal/use-delivery-status-modal";
import { EMessageStatus } from "@/enums/document-type-enum";
import { useDocumentsTableSocketIo } from "@/hooks/socket-io/use-documents-table-socket-io";
import { QuoteIfExistState } from "../quote-new/store/quote";
import { userQuoteState } from "@/store/user-qoute-state";
import { useClientTypesList } from "@/hooks/use-client-types";
import { useModal } from "@/hooks/use-modal";
import { getTaxConfirmationNumberApi } from "@/services/api-service/generic-doc/invoices";
import { getDeliveryTickerPdfApi } from "@/services/api-service/board-missions/board-missions-table";
import { GomakeTextInput } from "@/components";
import { downloadPdf } from "@/utils/helpers";
import { exportDeliveryTicketPDFApi } from "@/services/api-service/generic-doc/orders-api";
import { PAYMENT_TYPE } from "../deposit/enums";
import { useListPagination } from "@/hooks/use-list-pagination";
import {
  columnOrderStateFamily,
  columnVisibilityStateFamily,
} from "./states/documents-columns-settings-state";
import {
  DeliveryNotesTableColumns,
  OrdersTableColumns,
  QuotesTableColumns,
} from "./enums/document-table-columns-enum";

type PaymentTypeOption = {
  label: string;
  value: PAYMENT_TYPE;
};

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
  deliveryStatus?: string;
  productionStatus?: string;
  isCanceled?: boolean;
  isPaused?: boolean;
  pageNumber?: number;
  productsIds?: string[];
  paymentType?: string;
}

const useQuotes = (docType: DOCUMENT_TYPE, isFromHomePage) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const {
    alertFaultUpdate,
    alertFaultDuplicate,
    alertFaultGetData,
    alertSuccessUpdate,
    alertFault,
    alertFaultDelete,
    alertSuccessGetData,
  } = useSnackBar();
  const router = useRouter();
  const documentPath =
    docType === DOCUMENT_TYPE.supplierPayments
      ? `${DOCUMENT_TYPE[DOCUMENT_TYPE.receipt]
      }?isOutgoingPayments=true&isNewCreation=true`
      : DOCUMENT_TYPE[docType];

  const searchInputRef = useRef(null);
  const { getCurrencyUnitText } = useQuoteGetData();
  const { navigate } = useGomakeRouter();
  const { CheckPermission } = useUserPermission();
  const { query, pathname } = useRouter();
  const {
    quoteNumber,
    deliveryOrderId,
    deliveryOrderNumber,
    deliveryCustomerId,
  } = query;
  const { errorColor } = useGomakeTheme();
  const { GetDateFormat, formatCustomDateTime, formatISODateTime } =
    useDateFormat();

  const [patternSearch, setPatternSearch] = useState<any>(
    router.query.finalPatternSearch || null
  );
  const [finalPatternSearch, setFinalPatternSearch] = useState<any>("");
  const [statusId, setStatusId] = useState<any>();
  const [approvalStatusId, setApprovalStatusId] = useState<any>();
  const [quoteStatusId, setQuoteStatusId] = useState<any>();
  const [customerId, setCustomerId] = useState<any>();
  const [isCanceledState, setIsCanceledState] = useState(false);
  const [isPausedOrders, setIsPausedOrders] = useState(false);
  const [dateRange, setDateRange] = useState<any>();
  const [agentId, setAgentId] = useState<any>();
  const [allQuotes, setAllQuotes] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [openLogsModal, setOpenLogsModal] = useState(false);
  const [logsModalTitle, setLogsModalTitle] = useState<string>();
  const [selectedQuote, setSelectedQuote] = useState<any>();
  const [allDocuments, setAllDocuments] = useState([]);
  const [allStatistics, setAllStatistics] = useState<{
    documentStatisticsList: any[];
    totalItems: number;
  }>({
    documentStatisticsList: [],
    totalItems: 0,
  });
  const [activeCard, setActiveCard] = useState(null);
  const [page, setPage] = useState(1);
  const { pageSize, setPageSize, pagesCount, setPagesCount, initialPageSize } =
    useListPagination();

  useEffect(() => {
    if (initialPageSize && initialPageSize !== pageSize) {
      setPageSize(initialPageSize);
    }
  }, [initialPageSize]);

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
  const [accountingStatus, setAccountingStatus] = useState<{
    label: string;
    value: BoardMissionStatusForFilter;
  } | null>();

  const [productionStatus, setProductionStatus] = useState<{
    label: string;
    value: BoardMissionStatusForFilter;
  } | null>();

  const [deliveryStatus, setDeliveryStatus] = useState<{
    label: string;
    value: any;
  } | null>();

  const [productsList, setProductsList] = useState([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [openCloseOrderNotesModal, setOpenCloseOrderNotesModal] =
    useState(false);
  const [selectedQuoteItemValue, setSelectedQuoteItemValue] = useState<any>();
  const [documentCloseNumber, setDocumentCloseNumber] = useState("");
  const selectedClient = useRecoilValue<any>(selectedClientState);
  const isSelectedCLoseAsDeliveryNote = useRecoilValue(
    isSelectedCLoseAsDeliveryNoteState
  );
  const [paymentType, setPaymentType] = useState<PaymentTypeOption | null>(
    null
  );

  const [currentSortOrder, setCurrentSortOrder] = useState<any>(null);

  const typeOfPayments = [
    { label: t("payment.cash"), value: PAYMENT_TYPE.Cash },
    { label: t("payment.check"), value: PAYMENT_TYPE.Checks },
    { label: t("payment.creditCard"), value: PAYMENT_TYPE.CreditCard },
    { label: t("payment.transfer"), value: PAYMENT_TYPE.Transfer },
  ];

  const handlePaymentTypeChange = (e: any, value: any) => {
    setPaymentType(value);
  };

  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const isQuote = docType === DOCUMENT_TYPE.quote;
  const isOrder = docType === DOCUMENT_TYPE.order;
  const isReceipt = docType === DOCUMENT_TYPE.receipt;
  const isSupplierPayments = docType === DOCUMENT_TYPE.supplierPayments;
  const isDeliveryNote = docType === DOCUMENT_TYPE.deliveryNote;
  const isDeliveryNoteRefund = docType === DOCUMENT_TYPE.deliveryNoteRefund;
  const isInvoice = docType === DOCUMENT_TYPE.invoice;
  const isInvoiceRefund = docType === DOCUMENT_TYPE.invoiceRefund;
  const isPurchaseOrder = docType === DOCUMENT_TYPE.purchaseOrder;
  const isPurchaseInvoice = docType === DOCUMENT_TYPE.purchaseInvoice;
  const isPurchaseInvoiceRefund =
    docType === DOCUMENT_TYPE.purchaseInvoiceRefund;

  const isPurchaseDocument =
    isPurchaseOrder ||
    isPurchaseInvoice ||
    isPurchaseInvoiceRefund ||
    isSupplierPayments;

  const { renderOptions, checkWhatRenderArray, isFetching } =
    useCustomerDropDownList({
      clientType: isPurchaseDocument
        ? CLIENT_TYPE.SUPPLIER
        : CLIENT_TYPE.CUSTOMER,
      shouldRenderOnMount: !isFromHomePage,
    });

  const handleDocumentNumberChange = (event) => {
    setDocumentCloseNumber(event.target.value);
  };

  const [closeModalSource, setCloseModalSource] = useState<
    "closeAsInvoice" | "closeManually" | "closeAsDeliveryNote"
  >(null);
  const [onClickCloseOrderCallback, setOnClickCloseOrderCallback] = useState<
    (() => void) | null
  >(null);

  const onClickOpenCloseOrderNotesModal = (
    order,
    source: "closeAsInvoice" | "closeManually" | "closeAsDeliveryNote",
    onClickCloseOrder: () => void
  ) => {
    setSelectedQuoteItemValue(order);
    setSelectedDocument(order);
    setCloseModalSource(source);
    setOnClickCloseOrderCallback(() => onClickCloseOrder);
    setOpenCloseOrderNotesModal(true);
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

  const userQuoteIfExist = useRecoilValue<any>(userQuoteState);
  const onClickEditQuote = (quote: any) => {
    if (userQuoteIfExist) onClickOpenModal(quote);
    else updateQuoteStatus(quote);
  };

  const onClickCloseLogsModal = () => {
    setOpenLogsModal(false);
    setEmployeeId(null);
    setFromLogsDate(null);
    setToLogsDate(null);
  };

  const onClickQuotePdf = async (
    id: string,
    withPrices?: boolean,
    withInvoices?: boolean
  ) => {
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
        downloadPdf(pdfLink);
      } else {
        alertFaultGetData();
      }
    };
    if (isReceipt || isSupplierPayments) {
      if (withInvoices)
        await getReceiptInvoicesPdfApi(callApi, callBack, {
          receiptId: id,
        });
      else
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

  const [openExportReceiptPdfModal, setOpenExportReceiptPdfModal] =
    useState<boolean>(false);

  const onOpenExportReceiptPdfModal = (receiptItem: any) => {
    setSelectedDocument(receiptItem);
    setOpenExportReceiptPdfModal(true);
  };

  const onCloseExportReceiptPdfModal = () => {
    setSelectedDocument({});
    setOpenExportReceiptPdfModal(false);
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
    const sortOrder = currentSortOrder;
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
          order: sortOrder,
        },
        statusId: quoteStatusId?.value || statusId?.value,
        approvalStatus: approvalStatusId?.value,
        closeStatus: accountingStatus?.value,
        productionStatus: productionStatus?.value,
        // deliveryStatus: deliveryStatus?.value,
        patternSearch: finalPatternSearch,
        customerId: customerId?.id,
        dateRange,
        agentId: agentId?.id,
        minPrice: minPrice,
        maxPrice: maxPrice,
        productList: productIds,
        isCanceled: isCanceledState,
        isPaused: isPausedOrders,
        isOrderInTracking: isOrdersTracking,
        fromDate: fromDate && GetDateFormat(fromDate),
        toDate: toDate && GetDateFormat(toDate),
      },
    });
  };

  const ExportDocumentTableToPdf = async () => {
    const sortOrder = currentSortOrder;
    const callBack = (res) => {
      if (res?.success) {
        let fileUrl =
          typeof res.data === "string"
            ? res.data
            : URL.createObjectURL(res.data);

        if (fileUrl) {
          window.open(fileUrl, "_blank");
        } else alertFaultGetData();
      } else {
        alertFaultGetData();
      }
    };
    await ExportDocumentTableToPdfApi(callApi, callBack, {
      documentType: docType,
      data: {
        model: {
          pageNumber: page,
          pageSize: pageSize,
          order: sortOrder,
        },
        statusId: quoteStatusId?.value || statusId?.value,
        approvalStatus: approvalStatusId?.value,
        closeStatus: accountingStatus?.value,
        productionStatus: productionStatus?.value,
        // deliveryStatus: deliveryStatus?.value,
        patternSearch: finalPatternSearch,
        customerId: customerId?.id,
        dateRange,
        agentId: agentId?.id,
        minPrice: minPrice,
        maxPrice: maxPrice,
        productList: productIds,
        isCanceled: isCanceledState,
        isPaused: isPausedOrders,
        isOrderInTracking: isOrdersTracking,
        fromDate: fromDate && GetDateFormat(fromDate),
        toDate: toDate && GetDateFormat(toDate),
      },
    });
  };

  const getAllQuotes = useCallback(
    async (order?: any) => {
      const sortOrder = order || currentSortOrder;

      const callBack = (res) => {
        if (res?.success) {
          const data = res?.data?.data;
          const totalItems = res?.data?.totalItems;
          const mapData = data?.map((quote: any) => {
            const baseRow = {
              creationDate: formatCustomDateTime(
                quote?.createdDate || quote?.creationDate
              ),
              client: (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    onClickOpenCustomerModal(
                      quote?.clientId || quote?.customerId
                    )
                  }
                >
                  {quote?.clientName || quote?.customerName}
                </div>
              ),
              agent: quote?.agentName,
              number: quote?.number,
              worksName: quote?.worksNames,
              discount: quote?.discount,
              totalPriceWithoutVat: isRTL
                ? `${quote?.totalPriceWithoutVat} ${getCurrencyUnitText(
                  quote?.currency
                )}`
                : `${getCurrencyUnitText(quote?.currency)} ${quote?.totalPriceWithoutVat
                }`,

              totalPrice: isRTL
                ? `${quote?.totalPrice} ${getCurrencyUnitText(quote?.currency)}`
                : `${getCurrencyUnitText(quote?.currency)} ${quote?.totalPrice
                }`,
              notes: quote?.notes,
              status: _renderStatus(docType, quote, t),
              more: (
                <MoreMenuWidget
                  quote={quote}
                  documentType={docType}
                  onClickEditQuote={onClickEditQuote}
                  onClickPdf={onClickQuotePdf}
                  onClickDuplicate={onClickDocumentDuplicate}
                  onClickLoggers={onClickDocumentLogs}
                  onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
                  onClickOpenChangeProductionStatusModal={
                    onClickOpenChangeProductionStatusModal
                  }
                  onClickSendPayment={onClickSendPayment}
                  onClickOpenCloseOrderModal={onClickOpenCloseOrderModal}
                  onClickOpenIrrelevantModal={onClickOpenIrrelevantModal}
                  onClickReopenDocument={onClickOpenReopenDocumentModal}
                  onClickOpenRemoveDraftModal={onClickOpenRemoveDraftModal}
                  onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
                  onClickOpenPriceModal={onClickOpenPriceModal}
                  onClickMakePayment={onClickMakePayment}
                  onClickPauseOrResume={onClickPauseOrResume}
                  onClickStartProduction={onClickOpenStartProductionModal}
                  onClickCloseAndTrack={onClickOpenTrackModal}
                  onClickOpenMoveOrderToReadyModal={
                    onClickOpenMoveOrderToReadyModal
                  }
                  onOpenPackagesModal={onOpenPackagesModal}
                  onClickOpenCloseOrderNotesModal={
                    onClickOpenCloseOrderNotesModal
                  }
                  onOpenDuplicateModal={onOpenDuplicateModal}
                  handleGetTaxConfirmNo={handleGetTaxConfirmNo}
                />
              ),
            };

            if (isPurchaseOrder) {
              return {
                ...baseRow,
                purchaseOrderNumber: quote?.number,
                orderNumber: quote?.orderNumber,
                supplierName: quote?.supplierName,
                itemsNumber: quote?.itemsNumber,
              };
            }

            if (isPurchaseInvoice || isPurchaseInvoiceRefund) {
              return {
                ...baseRow,
                purchaseInvoiceNumber: quote?.number,
                invoiceNumber: quote?.invoiceNumber,
                purchaseOrderNumber: quote?.orderNumbers
                  ? quote?.orderNumbers.join(", ")
                  : "",
                supplierName: (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => onClickOpenCustomerModal(quote?.customerId)}
                  >
                    {quote?.customerName}
                  </div>
                ),
                itemsNumber: quote?.itemsNumber,
                status:
                  isInvoice && quote?.isDraft ? (
                    <span style={{ color: "#e77676" }}>
                      {t("sales.quote.draft")}
                    </span>
                  ) : (
                    _renderStatus(docType, quote, t)
                  ),
              };
            }

            if (isQuote) {
              return {
                ...baseRow,
                agent: quote?.agentName,
                number: quote?.number,
                worksName: quote?.worksNames,
              };
            }

            if (isOrder) {
              const jobsElement = CheckPermission(
                Permissions.SHOW_BOARD_MISSIONS
              ) ? (
                <a
                  style={{
                    cursor: "pointer",
                    color: "inherit",
                    textDecoration: "unset",
                  }}
                  href={`/jobs?pageNumber=1&finalPatternSearch=${quote?.number}`}
                >
                  {quote?.jobs}
                </a>
              ) : (
                quote?.jobs
              );

              const paymentStatus = `${isRTL
                ? `${quote?.sumApplied} ${getCurrencyUnitText(
                  quote?.currency
                )}`
                : `${getCurrencyUnitText(quote?.currency)} ${quote?.sumApplied
                }`
                }/${isRTL
                  ? `${quote?.totalPrice} ${getCurrencyUnitText(
                    quote?.currency
                  )}`
                  : `${getCurrencyUnitText(quote?.currency)} ${quote?.totalPrice
                  }`
                }`;

              return {
                ...baseRow,
                orderNumber: quote?.number,
                quoteNumber: quote?.sourceDocumentNumber?.map((item, index) => (
                  <span key={index}>
                    {item?.documentNumber}
                    <br />
                  </span>
                )),
                purchaseNumber: quote?.purchaseNumber,
                productionStatus: quote?.productionStatus
                  ? t("boardMissions.done")
                  : t("boardMissions.inProduction"),
                jobs: jobsElement,
                cost: quote?.cost,
                paymentStatus: isOrdersTracking
                  ? paymentStatus
                  : baseRow.totalPrice,
                deliveryStatus: (
                  <ClickableStatusButton
                    id={quote?.id}
                    document={quote}
                    documentType={docType}
                    onClickOpenMoveOrderToReadyModal={
                      onClickOpenMoveOrderToReadyModal
                    }
                  />
                ),
              };
            }

            return {
              ...baseRow,
              sourceDocument: quote?.sourceDocumentNumber?.map(
                (item, index) => (
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
                )
              ),
              deliveryStatus:
                isInvoice || isDeliveryNote ? (
                  <ClickableStatusButton
                    id={quote?.id}
                    document={quote}
                    documentType={docType}
                    onClickOpenMoveOrderToReadyModal={
                      onClickOpenMoveOrderToReadyModal
                    }
                  />
                ) : (
                  <div>—</div>
                ),
              status:
                isInvoice && quote?.isDraft ? (
                  <span style={{ color: "#e77676" }}>
                    {t("sales.quote.draft")}
                  </span>
                ) : (
                  _renderStatus(docType, quote, t)
                ),
            };
          });

          // For receipts
          const mapReceiptData = data?.map((quote: any) => ({
            creationDate: formatCustomDateTime(quote?.creationDate).split(
              " "
            )[0],
            [isSupplierPayments ? "supplier" : "client"]: (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>
            ),
            supplier: (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(quote?.customerId)}
              >
                {quote?.customerName}
              </div>
            ),
            agent: quote?.agentName,
            number: quote?.number,
            paymentMethod: _renderPaymentType(quote?.paymentType),
            totalPrice: isRTL
              ? `${quote?.totalPrice} ${getCurrencyUnitText(quote?.currency)}`
              : `${getCurrencyUnitText(quote?.currency)} ${quote?.totalPrice}`,
            notes: quote?.notes,
            status: t(`documentStatus.${quote?.status}`),
            more: (
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickPdf={onOpenExportReceiptPdfModal}
                onClickDuplicate={onClickDocumentDuplicate}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
                onOpenCancelReceiptModal={onOpenCancelReceiptModal}
                onOpenCancelReceiptModalRefund={onOpenCancelReceiptModalRefund}
                onClickOpenChangeProductionStatusModal={
                  onClickOpenChangeProductionStatusModal
                }
                onClickSendPayment={onClickSendPayment}
              />
            ),
          }));

          setAllQuotes(
            isReceipt || isSupplierPayments ? mapReceiptData : mapData
          );
          setPagesCount(Math.ceil(totalItems / pageSize));
          setAllStatistics({
            documentStatisticsList: res?.data?.documentStatisticsList ?? [],
            totalItems: totalItems ?? 0,
          });
        }
      };

      if (!router.isReady) return;

      const currentPageNumber = router.query.pageNumber;
      const currentStatusId = router.query.statusId;
      const currentFinalPatternSearch = router.query.finalPatternSearch;
      const currentCustomerId = router.query.customerId;
      const currentAgentId = router.query.agentId;
      const currentApprovalStatusId = router.query.approvalStatusId;
      const currentMinPrice = router.query.minPrice || minPrice;
      const currentMaxPrice = router.query.maxPrice || maxPrice;
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

      const currentDeliveryStatusStatus = router.query.deliveryStatus
        ? deliveryStatuses.find(
          (status) => status.value === Number(router.query.deliveryStatus)
        )
        : null;

      const currentProductionStatus = router.query.productionStatus
        ? productionStatuses.find(
          (status) => status.value === Number(router.query.productionStatus)
        )
        : null;

      const currentIsCanceled = router.query.isCanceled;
      const currentIsPaused = router.query.isPaused;

      const currentProductsIds = Array.isArray(router.query.productsIds)
        ? router.query.productsIds
        : router.query.productsIds
          ? [router.query.productsIds]
          : productIds;

      const currentPaymentType = router.query.paymentType
        ? typeOfPayments.find(
          (type) => type.value === Number(router.query.paymentType)
        )
        : null;

      // keep your API call logic unchanged
      if (isReceipt || isSupplierPayments) {
        await getAllReceiptsApi(callApi, callBack, {
          ...(!isReceipt && {
            isOutgoingPayments: true,
          }),
          clientId: currentCustomerId || customerId?.id,
          agentId: currentAgentId || agentId?.id,
          status: currentAccountingStatus?.value ?? accountingStatus?.value,
          paymentType: currentPaymentType?.value ?? paymentType?.value,
          patternSearch:
            finalPatternSearch !== null &&
              finalPatternSearch !== undefined &&
              finalPatternSearch !== ""
              ? finalPatternSearch
              : currentFinalPatternSearch,

          ...(currentFromDate
            ? { fromDate: GetDateFormat(currentFromDate) }
            : {}),
          ...(currentToDate ? { toDate: GetDateFormat(currentToDate) } : {}),

          ...(currentMinPrice && currentMinPrice !== ""
            ? { minPrice: currentMinPrice }
            : {}),
          ...(currentMaxPrice && currentMaxPrice !== ""
            ? { maxPrice: currentMaxPrice }
            : {}),

          model: {
            pageNumber: currentPageNumber || page,
            pageSize: pageSize,
            order: sortOrder,
          },
        });
      } else {
        await getAllDocumentsApi(callApi, callBack, {
          documentType: docType,
          data: {
            model: {
              pageNumber: currentPageNumber || page,
              pageSize: pageSize,
              order: sortOrder,
            },
            dateRange,
            customerId: currentCustomerId || customerId?.id,
            agentId: currentAgentId || agentId?.id,
            statusId:
              quoteStatusId?.value || currentStatusId || statusId?.value,
            approvalStatus: currentApprovalStatusId || approvalStatusId?.value,

            ...(currentMinPrice && currentMinPrice !== ""
              ? { minPrice: currentMinPrice }
              : {}),
            ...(currentMaxPrice && currentMaxPrice !== ""
              ? { maxPrice: currentMaxPrice }
              : {}),

            patternSearch:
              finalPatternSearch !== null &&
                finalPatternSearch !== undefined &&
                finalPatternSearch !== ""
                ? finalPatternSearch
                : currentFinalPatternSearch,

            ...(currentFromDate
              ? { fromDate: GetDateFormat(currentFromDate) }
              : {}),
            ...(currentToDate ? { toDate: GetDateFormat(currentToDate) } : {}),

            ...(currentProductsIds?.length
              ? { productList: currentProductsIds }
              : {}),

            closeStatus:
              currentAccountingStatus?.value ?? accountingStatus?.value,
            deliveryStatus:
              currentDeliveryStatusStatus?.value ?? deliveryStatus?.value,
            productionStatus:
              currentProductionStatus?.value ?? productionStatus?.value,

            isCanceled: currentIsCanceled || isCanceledState,
            isPaused: currentIsPaused || isPausedOrders,
            isOrderInTracking: isOrdersTracking,
          },
        });
      }
    },
    [
      docType,
      callApi,
      finalPatternSearch,
      customerId,
      agentId,
      isReceipt,
      isSupplierPayments,
      page,
      pageSize,
      statusId,
      approvalStatusId,
      quoteStatusId,
      accountingStatus,
      deliveryStatus,
      productionStatus,
      dateRange,
      minPrice,
      maxPrice,
      productIds,
      isCanceledState,
      isPausedOrders,
      fromDate,
      toDate,
      onClickOpenModal,
      onClickQuotePdf,
      onClickDocumentLogs,
      paymentType,
    ]
  );

  const getAllQuotesInitial = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const data = res?.data?.data;
        const totalItems = res?.data?.totalItems;

        const mapData = data?.map((quote: any) => {
          const baseRow = {
            creationDate: formatCustomDateTime(
              quote?.createdDate || quote?.creationDate
            ),
            client: (
              <div
                style={{ cursor: "pointer" }}
                onClick={() =>
                  onClickOpenCustomerModal(quote?.clientId || quote?.customerId)
                }
              >
                {quote?.clientName || quote?.customerName}
              </div>
            ),
            agent: quote?.agentName,
            number: quote?.number,
            worksName: quote?.worksNames,
            discount: quote?.discount,
            totalPriceWithoutVat: isRTL
              ? `${quote?.totalPriceWithoutVat} ${getCurrencyUnitText(
                quote?.currency
              )}`
              : `${getCurrencyUnitText(quote?.currency)} ${quote?.totalPriceWithoutVat
              }`,

            totalPrice: isRTL
              ? `${quote?.totalPrice} ${getCurrencyUnitText(quote?.currency)}`
              : `${getCurrencyUnitText(quote?.currency)} ${quote?.totalPrice}`,
            notes: quote?.notes,
            status: _renderStatus(docType, quote, t),
            more: (
              <MoreMenuWidget
                quote={quote}
                documentType={docType}
                onClickEditQuote={onClickEditQuote}
                onClickPdf={onClickQuotePdf}
                onClickDuplicate={onClickDocumentDuplicate}
                onClickLoggers={onClickDocumentLogs}
                onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
                onClickOpenChangeProductionStatusModal={
                  onClickOpenChangeProductionStatusModal
                }
                onClickSendPayment={onClickSendPayment}
                onClickOpenCloseOrderModal={onClickOpenCloseOrderModal}
                onClickOpenIrrelevantModal={onClickOpenIrrelevantModal}
                onClickReopenDocument={onClickOpenReopenDocumentModal}
                onClickOpenRemoveDraftModal={onClickOpenRemoveDraftModal}
                onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
                onClickOpenPriceModal={onClickOpenPriceModal}
                onClickMakePayment={onClickMakePayment}
                onClickPauseOrResume={onClickPauseOrResume}
                onClickStartProduction={onClickOpenStartProductionModal}
                onClickCloseAndTrack={onClickOpenTrackModal}
                onClickOpenMoveOrderToReadyModal={
                  onClickOpenMoveOrderToReadyModal
                }
                onOpenPackagesModal={onOpenPackagesModal}
                onClickOpenCloseOrderNotesModal={
                  onClickOpenCloseOrderNotesModal
                }
                onOpenDuplicateModal={onOpenDuplicateModal}
                handleGetTaxConfirmNo={handleGetTaxConfirmNo}
              />
            ),
          };

          if (isPurchaseOrder) {
            return {
              ...baseRow,
              purchaseOrderNumber: quote?.number,
              orderNumber: quote?.orderNumber,
              supplierName: quote?.supplierName,
              itemsNumber: quote?.itemsNumber,
            };
          }

          if (isPurchaseInvoice || isPurchaseInvoiceRefund) {
            return {
              ...baseRow,
              purchaseInvoiceNumber: quote?.number,
              invoiceNumber: quote?.invoiceNumber,
              purchaseOrderNumber: quote?.orderNumbers
                ? quote?.orderNumbers.join(", ")
                : "",
              supplierName: (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => onClickOpenCustomerModal(quote?.customerId)}
                >
                  {quote?.customerName}
                </div>
              ),
              itemsNumber: quote?.itemsNumber,
              status:
                isInvoice && quote?.isDraft ? (
                  <span style={{ color: "#e77676" }}>
                    {t("sales.quote.draft")}
                  </span>
                ) : (
                  _renderStatus(docType, quote, t)
                ),
            };
          }

          if (isQuote) {
            return {
              ...baseRow,
              agent: quote?.agentName,
              number: quote?.number,
              worksName: quote?.worksNames,
            };
          }

          if (isOrder) {
            const jobsElement = CheckPermission(
              Permissions.SHOW_BOARD_MISSIONS
            ) ? (
              <a
                style={{
                  cursor: "pointer",
                  color: "inherit",
                  textDecoration: "unset",
                }}
                href={`/jobs?pageNumber=1&finalPatternSearch=${quote?.number}`}
              >
                {quote?.jobs}
              </a>
            ) : (
              quote?.jobs
            );

            const paymentStatus = `${isRTL
              ? `${quote?.sumApplied} ${getCurrencyUnitText(quote?.currency)}`
              : `${getCurrencyUnitText(quote?.currency)} ${quote?.sumApplied}`
              }/${isRTL
                ? `${quote?.totalPrice} ${getCurrencyUnitText(quote?.currency)}`
                : `${getCurrencyUnitText(quote?.currency)} ${quote?.totalPrice}`
              }`;

            return {
              ...baseRow,
              orderNumber: quote?.number,
              quoteNumber: quote?.sourceDocumentNumber?.map((item, index) => (
                <span key={index}>
                  {item?.documentNumber}
                  <br />
                </span>
              )),
              purchaseNumber: quote?.purchaseNumber,
              productionStatus: quote?.productionStatus
                ? t("boardMissions.done")
                : t("boardMissions.inProduction"),
              jobs: jobsElement,
              cost: quote?.cost,
              paymentStatus: isOrdersTracking
                ? paymentStatus
                : baseRow.totalPrice,
              deliveryStatus: (
                <ClickableStatusButton
                  id={quote?.id}
                  document={quote}
                  documentType={docType}
                  onClickOpenMoveOrderToReadyModal={
                    onClickOpenMoveOrderToReadyModal
                  }
                />
              ),
            };
          }

          return {
            ...baseRow,
            sourceDocument: quote?.sourceDocumentNumber?.map((item, index) => (
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
            )),
            deliveryStatus:
              isInvoice || isDeliveryNote ? (
                <ClickableStatusButton
                  id={quote?.id}
                  document={quote}
                  documentType={docType}
                  onClickOpenMoveOrderToReadyModal={
                    onClickOpenMoveOrderToReadyModal
                  }
                />
              ) : (
                <div>—</div>
              ),
            status:
              isInvoice && quote?.isDraft ? (
                <span style={{ color: "#e77676" }}>
                  {t("sales.quote.draft")}
                </span>
              ) : (
                _renderStatus(docType, quote, t)
              ),
          };
        });

        // For receipts
        const mapReceiptData = data?.map((quote: any) => ({
          creationDate: formatCustomDateTime(quote?.creationDate).split(" ")[0],
          [isSupplierPayments ? "supplier" : "client"]: (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => onClickOpenCustomerModal(quote?.customerId)}
            >
              {quote?.customerName}
            </div>
          ),
          agent: quote?.agentName,
          number: quote?.number,
          paymentMethod: _renderPaymentType(quote?.paymentType),
          totalPrice: isRTL
            ? `${quote?.totalPrice} ${getCurrencyUnitText(quote?.currency)}`
            : `${getCurrencyUnitText(quote?.currency)} ${quote?.totalPrice}`,
          notes: quote?.notes,
          status: t(`documentStatus.${quote?.status}`),
          more: (
            <MoreMenuWidget
              quote={quote}
              documentType={docType}
              onClickPdf={onOpenExportReceiptPdfModal}
              onClickDuplicate={onClickDocumentDuplicate}
              onClickLoggers={onClickDocumentLogs}
              onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              onOpenCancelReceiptModal={onOpenCancelReceiptModal}
              onOpenCancelReceiptModalRefund={onOpenCancelReceiptModalRefund}
              onClickOpenChangeProductionStatusModal={
                onClickOpenChangeProductionStatusModal
              }
              onClickSendPayment={onClickSendPayment}
              onOpenDuplicateModal={onOpenDuplicateModal}
            />
          ),
        }));

        setAllQuotes(
          isReceipt || isSupplierPayments ? mapReceiptData : mapData
        );
        setPagesCount(Math.ceil(totalItems / pageSize));
        setAllStatistics({
          documentStatisticsList: res?.data?.documentStatisticsList ?? [],
          totalItems: totalItems ?? 0,
        });
      }
    };

    if (!router.isReady) return;

    if (isReceipt || isSupplierPayments) {
      await getAllReceiptsApi(callApi, callBack, {
        model: {
          pageNumber: page,
          pageSize: pageSize,
        },
        ...(!isReceipt && {
          isOutgoingPayments: true,
        }),
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

  const { isSocketUpdateDocumentsTable, setIsSocketUpdateDocumentsTable } =
    useDocumentsTableSocketIo(docType);

  useEffect(() => {
    if (isSocketUpdateDocumentsTable) {
      getAllQuotes();
      setIsSocketUpdateDocumentsTable(false);
    }
  }, [isSocketUpdateDocumentsTable]);

  const onClickSearchFilter = async () => {
    const query: Query = { ...router.query };

    if (productIds.length > 0) {
      query.productsIds = productIds;
    } else {
      delete query.productsIds;
    }

    if (customerId?.id) query.customerId = customerId.id;
    else delete query.customerId;

    if (customerId?.name) query.customerName = customerId.name;
    else delete query.customerName;

    if (agentId?.id) query.agentId = agentId.id;
    else delete query.agentId;

    if (statusId?.value) query.statusId = statusId.value;
    else delete query.statusId;

    if (approvalStatusId?.value)
      query.approvalStatusId = approvalStatusId.value;
    else delete query.approvalStatusId;

    if (minPrice) query.minPrice = minPrice;
    else delete query.minPrice;

    if (maxPrice) query.maxPrice = maxPrice;
    else delete query.maxPrice;

    if (page) query.pageNumber = page;
    else delete query.pageNumber;

    if (fromDate instanceof Date) query.fromDate = fromDate.toISOString();
    else delete query.fromDate;

    if (toDate instanceof Date) query.toDate = toDate.toISOString();
    else delete query.toDate;

    if (accountingStatus)
      query.accountingStatus = accountingStatus.value.toString();
    else delete query.accountingStatus;

    if (paymentType) query.paymentType = paymentType.value.toString();
    else delete query.paymentType;

    if (deliveryStatus) query.deliveryStatus = deliveryStatus.value.toString();
    else delete query.deliveryStatus;

    if (productionStatus)
      query.productionStatus = productionStatus.value.toString();
    else delete query.productionStatus;

    if (isCanceledState) query.isCanceled = isCanceledState;
    else delete query.isCanceled;

    if (isPausedOrders) query.isPaused = isPausedOrders;
    else delete query.isPaused;

    handleClose();
    setPage(1);

    if (statusId !== null && statusId !== undefined) {
      handleSecondCardClick();
    }

    await router.push({
      pathname: router.pathname,
      query: { ...query },
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
    setPaymentType(null);
    setDeliveryStatus(null);
    setProductionStatus(null);
    setFromDate(null);
    setToDate(null);
    setResetDatePicker(true);
    setIsCanceledState(false);
    setIsPausedOrders(false);
    setPage(1);
    setMinPrice("");
    setMaxPrice("");
    setProductIds([]);
    setFinalPatternSearch("");
    setPatternSearch("");
    setCurrentSortOrder(null);
    const query = {};
    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  const [hasFetchedQuery, setHasFetchedQuery] = useState<string | null>(null);
  useEffect(() => {
    const isNotFilteredData = Object.keys(router?.query || {}).length === 0;

    // Serialize the current query for comparison
    const serializedQuery = JSON.stringify(router.query);

    if (!isFromHomePage) {
      if (isNotFilteredData) {
        getAllQuotesInitial();
        setHasFetchedQuery(null);
      } else if (hasFetchedQuery !== serializedQuery) {
        getAllQuotes();
        setHasFetchedQuery(serializedQuery); // Mark this query as fetched
      }
    }
  }, [pageSize, router.query]);

  const tableHeaders = isPurchaseOrder
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
    : isPurchaseInvoice || isPurchaseInvoiceRefund
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
      : isQuote
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
          isSupplierPayments
            ? t("sales.quote.supplier")
            : t("sales.quote.client"),
          t("sales.quote.agent"),
          (() => {
            switch (docType) {
              case DOCUMENT_TYPE.order:
                return t("sales.quote.orderNumber");
              default:
                return t("documentingDesign.TableSetting.number");
            }
          })(),
          isOrder
            ? t("sales.quote.quoteNumber")
            : isReceipt || isSupplierPayments
              ? null
              : t("sales.quote.sourceDocument"),

          isOrder && t("sales.quote.purchaseNumber"),
          isOrder && t("sales.quote.productionStatus"),
          isOrder && t("sales.quote.jobs"),
          isOrder && CheckPermission(Permissions.SHOW_COSTS_IN_ORDERS) && (
            <PermissionCheck userPermission={Permissions.SHOW_COSTS_IN_ORDERS}>
              {t("sales.quote.cost")}
            </PermissionCheck>
          ),
          isReceipt || isSupplierPayments
            ? t("sales.quote.paymentMethod")
            : t("sales.quote.worksName"),
          isOrdersTracking
            ? t("customers.modal.paymentStatus")
            : t("sales.quote.totalPrice"),
          t("sales.quote.notes"),
          (isOrder ||
            isInvoice ||
            isInvoiceRefund ||
            isDeliveryNote ||
            isDeliveryNoteRefund) &&
          t("sales.documentDeliveries.deliveryStatus"),
          t("sales.quote.status"),
          t("sales.quote.more"),
        ].filter(Boolean);

  const logsTableHeaders = [
    t("sales.quote.actionDate"),
    t("sales.quote.employeeName"),
    t("sales.quote.actionDescription"),
    t("sales.quote.status"),
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
    {
      label: t("sales.quote.supplierPaymentsList"),
      value: DOCUMENT_TYPE.supplierPayments,
    },
  ];

  const documentLabel = isOrdersTracking
    ? t("tabs.ordersTracking")
    : documentsLabels.find((item) => item.value === docType)?.label;

  const updateQuoteStatus = async (quote?) => {
    const callBack = (res) => {
      if (res?.success) {
        navigate("/quote");
      } else {
        if (res?.statusCode === 85) {
          alertFault(res?.message);
        } else {
          alertFaultUpdate();
        }
      }
    };
    await updateDocumentApi(callApi, callBack, {
      documentType: 0,
      document: {
        documentId: quote?.id ?? selectedQuote?.id,
      },
    });
  };

  const onClickDocumentDuplicate = async (
    id: string,
    withJobNumbers: boolean | null = false
  ) => {
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
      withJobNumbers,
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
        const mapData = data?.map((document: any) => {
          const baseRow = [
            <div
              style={{ cursor: "pointer" }}
              onClick={() => onClickOpenCustomerModal(document?.customerId)}
            >
              {document?.customerName}
            </div>,
            document?.agentName,
            document?.number,
            document?.clientType,
            document?.worksNames,
            isReceipt
              ? document?.creationDate?.split("T")[0]
              : formatCustomDateTime(document?.createdDate),
            isRTL
              ? document?.totalPrice +
              " " +
              getCurrencyUnitText(document?.currency)
              : getCurrencyUnitText(document?.currency) +
              " " +
              document?.totalPrice,
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h2
                style={
                  document?.documentStatus == 2
                    ? classes.openBtnStyle
                    : classes.closeBtnStyle
                }
              >
                {_renderStatus(docType, document, t)}
              </h2>
            </div>,
          ];

          if (isOrder) {
            baseRow.push(
              document?.productionStatus === true
                ? t("boardMissions.done")
                : t("boardMissions.inProduction")
            );
          }

          baseRow.push(
            <MoreMenuWidget
              quote={document}
              documentType={docType}
              onClickEditQuote={onClickEditQuote}
              onClickPdf={
                isReceipt || isSupplierPayments
                  ? onOpenExportReceiptPdfModal
                  : onClickQuotePdf
              }
              onClickDuplicate={onClickDocumentDuplicate}
              onClickLoggers={onClickDocumentLogs}
              onClickOpenIrrelevantModal={onClickOpenIrrelevantModal}
              onClickOpenPrintPDFModal={onClickOpenPrintPDFModal}
              onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
              onClickOpenPriceModal={onClickOpenPriceModal}
              onClickOpenCloseOrderModal={onClickOpenCloseOrderModal}
              onClickOpenCloseOrderNotesModal={onClickOpenCloseOrderNotesModal}
              onClickSendPayment={onClickSendPayment}
              onClickMakePayment={onClickMakePayment}
              onClickCloseAndTrack={onClickOpenTrackModal}
              onClickOpenChangeProductionStatusModal={
                onClickOpenChangeProductionStatusModal
              }
              onClickReopenDocument={onClickOpenReopenDocumentModal}
              onClickOpenMoveOrderToReadyModal={
                onClickOpenMoveOrderToReadyModal
              }
              onOpenPackagesModal={onOpenPackagesModal}
              onOpenDuplicateModal={onOpenDuplicateModal}
            />
          );

          return baseRow;
        });

        setAllDocuments(mapData);
      }
    };
    if (!router.isReady) {
      return;
    }
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
    t("sales.quote.client"),
    t("sales.quote.agent"),
    t("home.headers.documentNumber"),
    t("home.headers.clientType"),
    t("home.headers.jobName"),
    t("home.headers.productDate"),
    t("home.headers.finalPrice"),
    t("home.headers.status"),
    ...(isOrder ? [t("boardMissions.productionStatus")] : []),
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
        return `${t("logs.SEND_MAIL")} ${t("logs.to")} "${values.join(" , ")}"`;
      case LogActionType[16]: // SEND_SMS
        return `${t("logs.SEND_SMS")} ${t("logs.from")} "${values.join(
          " , "
        )}"`;
      case LogActionType[17]:
        return `${t("logs.PRINTING_PDF")}`;
      case LogActionType[18]:
        return `${t("logs.DOCUMENT_CANCEL")}`;
      case LogActionType[19]:
        return `${t("logs.REJECTED_BY_CLIENT")}`;
      case LogActionType[20]:
        return `${t("logs.APPROVAL_BY_CLIENT")}`;
      case LogActionType[21]:
        return `${t("logs.ADD")}`;
      case LogActionType[22]:
        return `${t("logs.CLOSE")}`;
      case LogActionType[23]:
        return `${t("logs.SEND_READY_BOARDMISSION_MAIL")}`;
      case LogActionType[24]:
        return `${t("logs.SEND_READY_BOARDMISSION_SMS")}`;
      case LogActionType[25]:
        return `${t("logs.SEND_READY_ORDER_MAIL")}`;
      case LogActionType[26]:
        return `${t("logs.SEND_READY_ORDER_SMS")}`;
      case LogActionType[27]:
        return `${t("logs.PAYMENT_LINK_GENERATED")}`;
      case LogActionType[28]:
        return `${t("logs.PAYMENT_SUCCESS")}`;
      case LogActionType[29]:
        return `${t("logs.PAYMENT_FAILED")}`;
      case LogActionType[30]:
        return `${t("logs.MOVE_JOB_TO_READY", {
          jobNumber: values[0],
        })}`;
      case LogActionType[31]:
        return `${t("logs.CURRENCY_UPDATE", {
          from: values[0],
          to: values[1],
        })}`;

      default:
        return "";
    }
  };

  const getMessageStatus = (status: number) => {
    const message = t(`messageStatus.${EMessageStatus[status]}`);
    return EMessageStatus[status] ? message : "";
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
            formatISODateTime(log?.actionDate),
            log?.employeeName,
            getLogDescription(log?.logAction, log?.values, log?.documentType),
            getMessageStatus(log?.messageStatus),
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

  const accountingStatuses =
    isReceipt || isSupplierPayments
      ? [
        {
          label: t("documentStatus.Receipt.Created"),
          value: ReceiptAccountingStatus.CREATED,
        },
        {
          label: t("documentStatus.Receipt.Canceled"),
          value: ReceiptAccountingStatus.CANCELED,
        },
      ]
      : isInvoice || isPurchaseInvoice
        ? [
          { label: t("sales.quote.open"), value: AStatus.OPEN },
          {
            label: t("sales.quote.partialClosed"),
            value: AStatus.PARTIAL_CLOSED,
          },
          { label: t("sales.quote.closed"), value: AStatus.CLOSED },
          { label: t("sales.quote.draft"), value: AStatus.DRAFT },
        ]
        : [
          { label: t("sales.quote.open"), value: AStatus.OPEN },
          {
            label: t("sales.quote.partialClosed"),
            value: AStatus.PARTIAL_CLOSED,
          },
          { label: t("sales.quote.closed"), value: AStatus.CLOSED },
        ];

  const deliveryStatuses = useMemo(
    () => [
      {
        label: t("sales.documentDeliveries.NotDelivered"),
        value: DocumentDeliveryStatuses.NotDelivered,
      },
      {
        label: t("sales.documentDeliveries.PartiallyDelivered"),
        value: DocumentDeliveryStatuses.PartiallyDelivered,
      },
      {
        label: t("sales.documentDeliveries.FullyDelivered"),
        value: DocumentDeliveryStatuses.FullyDelivered,
      },
    ],
    [t]
  );

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
      deliveryStatus: deliveryStatus?.value && deliveryStatus?.value,
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
      // paymentType: paymentType?.value && paymentType?.value,
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
    deliveryStatus,
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
    paymentType,
  ]);

  const [openIrrelevantCancelModal, setOpenIrrelevantCancelModal] =
    useState(false);
  const [openPriceCancelModal, setOpenPriceCancelModal] = useState(false);
  const [openCloseOrderModal, setOpenCloseOrderModal] = useState(false);
  const [openDeliveryTimeCancelModal, setOpenDeliveryTimeCancelModal] =
    useState(false);
  const [openStartProductionModal, setOpenStartProductionModal] =
    useState(false);

  const [openReopenDocModal, setOpenReopenDocModal] = useState(false);

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
    setSelectedDocument(null);
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

  const onClickOpenReopenDocumentModal = (document) => {
    setSelectedDocument(document);
    setOpenReopenDocModal(true);
  };

  const onClickCloseReopenDocumentModal = () => {
    setSelectedDocument(null);
    setOpenReopenDocModal(false);
  };

  const onClickOpenStartProductionModal = (order) => {
    setSelectedDocument(order);
    setOpenStartProductionModal(true);
  };

  const onClickCloseStartProductionModal = () => {
    setSelectedDocument(null);
    setOpenStartProductionModal(false);
  };

  const onClickOpenDeliveryTimeModal = (order) => {
    setSelectedDocument(order);
    setOpenDeliveryTimeCancelModal(true);
  };
  const onClickCloseDeliveryTimeModal = () => {
    setSelectedDocument(null);
    setOpenDeliveryTimeCancelModal(false);
  };

  const MoveOrderToReady = useModal();

  const onClickOpenMoveOrderToReadyModal = (order) => {
    // Assume deliveryOrderId is already being extracted from the URL query ( scanning case )
    setSelectedDocument(order?.id ? order : { id: deliveryOrderId });
    MoveOrderToReady.open();
  };

  const onClickCloseMoveOrderToReadyModal = () => {
    setSelectedDocument({});
    MoveOrderToReady.close();
  };

  const onClickPrintPackagingSlip = async () => {
    debugger;
    const lama = selectedDocument;
    if (quantityPerPackage > selectedDocument?.totalOrderQuantity) {
      alertFault("boardMissions.alertQuantity");
      return;
    }
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
        onClosePackagesModal();
      } else {
        alertFaultGetData();
      }
    };
    await exportDeliveryTicketPDFApi(callApi, callBack, {
      orderId: selectedDocument?.id,
      packageQuantities,
    });
  };

  const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);
  const onOpenPackagesModal = (order: any) => {
    setSelectedDocument(order);
    setOpenPackagesModal(true);
  };

  const onClosePackagesModal = () => {
    setSelectedDocument({});
    setOpenPackagesModal(false);
  };

  useEffect(() => {
    const total = selectedDocument?.totalOrderQuantity || 0;
    setQuantityOfPackages(1);
    setQuantityPerPackage(total);
  }, [selectedDocument]);

  const [quantityOfPackages, setQuantityOfPackages] = useState(1);
  const [quantityPerPackage, setQuantityPerPackage] = useState(
    selectedDocument?.totalOrderQuantity || 0
  );

  const handleQuantityOfPackagesChange = (event) => {
    const newQuantityOfPackages = parseInt(event.target.value, 10);
    const totalQuantity = selectedDocument?.totalOrderQuantity || 0;
    const newQuantityPerPackage = Math.ceil(
      totalQuantity / newQuantityOfPackages
    );
    setQuantityOfPackages(newQuantityOfPackages);
    setQuantityPerPackage(newQuantityPerPackage);
  };

  const handleQuantityPerPackageChange = (event) => {
    const newQuantityPerPackage = parseInt(event.target.value, 10);
    const totalQuantity = selectedDocument?.totalOrderQuantity;
    const newQuantityOfPackages = Math.ceil(
      totalQuantity / newQuantityPerPackage
    );
    setQuantityPerPackage(newQuantityPerPackage);
    setQuantityOfPackages(newQuantityOfPackages);
  };

  const [packageQuantities, setPackageQuantities] = useState<number[]>([]);

  useEffect(() => {
    if (selectedDocument?.totalOrderQuantity && quantityPerPackage > 0) {
      const totalQuantity = selectedDocument.totalOrderQuantity;
      const fullPackages = Math.max(
        0,
        Math.floor(totalQuantity / quantityPerPackage)
      );
      const remainingQuantity = totalQuantity % quantityPerPackage;

      let newPackageQuantities = Array(fullPackages).fill(quantityPerPackage);
      if (remainingQuantity > 0) {
        newPackageQuantities = [...newPackageQuantities, remainingQuantity];
      }

      setPackageQuantities(newPackageQuantities);
    } else {
      setPackageQuantities([]);
    }
  }, [selectedDocument, quantityPerPackage]);

  const handlePackageQuantityChange = (index: number, newValue: number) => {
    setPackageQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      const totalQuantity = selectedDocument?.totalOrderQuantity || 0;

      // Set the new value for the changed package
      updatedQuantities[index] = newValue;

      if (index === quantityOfPackages - 1) {
        // If last package is changed, put remaining in first package
        const sumOfOtherPackages = updatedQuantities
          .slice(1)
          .reduce((acc, val) => acc + val, 0);
        updatedQuantities[0] = totalQuantity - sumOfOtherPackages;
      } else {
        // If any other package is changed, put remaining in last package
        const sumOfOtherPackages = updatedQuantities
          .slice(0, -1)
          .reduce((acc, val) => acc + val, 0);
        updatedQuantities[quantityOfPackages - 1] =
          totalQuantity - sumOfOtherPackages;
      }

      return updatedQuantities;
    });
  };

  const packageInputs = useMemo(() => {
    if (!quantityOfPackages) return [];

    return [...Array(quantityOfPackages)].map((_, index) => (
      <div key={index} style={{ width: "30%" }}>
        <h3 style={classes.packageLabelStyle}>
          {`${t("boardMissions.package")} ${index + 1}`}
        </h3>
        <GomakeTextInput
          type="number"
          value={packageQuantities[index]}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10);
            handlePackageQuantityChange(index, newValue);
          }}
        />
      </div>
    ));
  }, [quantityOfPackages, packageQuantities]);

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
    if (document?.statusTitleText === StatusTitleText.OrderCanceled) {
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

  const startOrderProduction = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        isFromHomePage ? getAllDocuments(docType) : getAllQuotes();
      } else {
        alertFaultUpdate();
      }
    };
    await startOrderProductionApi(callApi, callBack, {
      orderId: selectedDocument?.id,
    });
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

  const { getClientTypesCategories } = useClientTypesList();

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [isSendToClient, setIsSendToClient] = useState(false);
  const [isSendOrderReadyToClient, setIsSendOrderReadyToClient] =
    useState(false);

  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [sendPayment, setSendPayment] =
    useRecoilState<StatePayment>(sendPaymentState);

  const onClickClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  const onClickSendPaymentOld = (
    document: any,
    isSendToClient: boolean
  ): Promise<void> => {
    if (isSendToClient) {
      return new Promise<void>((resolve, reject) => {
        const callBack = (res) => {
          if (res?.success) {
            const newSendPaymentState = { ...sendPayment };
            newSendPaymentState.documentId = document?.id;
            newSendPaymentState.documentContacts = res.data;
            setSendPayment(newSendPaymentState);
            resolve();
          } else {
            reject(new Error("Failed to update payment state"));
          }
        };
        getDocumentContactApi(callApi, callBack, {
          documentId: document?.id,
          documentType: docType,
        });
      });
    } else {
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
          documentType: docType,
        });
      });
    }
  };

  const onClickSendPayment = async (
    document: any,
    isSendToClient: boolean,
    isSendOrderReadyToClient: boolean = false
  ) => {
    setIsSendToClient(isSendToClient);
    setIsSendOrderReadyToClient(isSendOrderReadyToClient);
    try {
      await onClickSendPaymentOld(document, isSendToClient);
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

  const onClickPauseOrResume = async (documentId: string) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getAllQuotes();
      } else {
        alertFaultUpdate();
      }
    };
    await pauseOrdResumeOrderApi(callApi, callBack, {
      documentId,
      documentType: docType,
    });
  };

  const [openMakePaymentModal, setOpenMakePaymentModal] = useState(false);
  const onClickMakePayment = (order) => {
    setSelectedQuoteItemValue(order);
    setOpenMakePaymentModal(true);
  };

  const onClickCloseMakePaymentModal = () => {
    setOpenMakePaymentModal(false);
  };

  const [isMoveToReady, setIsMoveToReady] = useState(false);
  const handleCheckboxChange = () => {
    setIsMoveToReady(!isMoveToReady);
  };

  const [openCloseAndTrackOrderModal, setOpenCloseAndTrackOrderModal] =
    useState(false);
  const [openPrintPDFModal, setOpenPrintPDFModal] = useState(false);
  const [openChangeProductionStatusModal, setOpenChangeProductionStatusModal] =
    useState(false);

  const onClickCloseChangeProductionStatusModal = () => {
    setOpenChangeProductionStatusModal(false);
    setIsMoveToReady(false);
  };

  const onClickOpenChangeProductionStatusModal = (order) => {
    setSelectedDocument(order);
    setOpenChangeProductionStatusModal(true);
  };

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

  /*   Most Important   */
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
      deliveryStatus,
      productionStatus,
      isCanceled,
      pageNumber,
      isPaused,
      productsIds,
      paymentType,
    } = router.query;

    if (productsIds) {
      const productIdsArray = Array.isArray(productsIds)
        ? productsIds
        : [productsIds];
      setProductIds(productIdsArray); // Set the productsIds state if needed
    }

    if (customerId) {
      setCustomerId({ id: customerId, name: customerName });
    }

    if (agentId) {
      const selectedAgent = agentsCategories?.find(
        (agent: any) => agent?.id === agentId
      );
      setAgentId(selectedAgent);
    }

    if (statusId) {
      const statusToSet = quoteStatuses.find(
        (status) => status.value === Number(statusId)
      );
      if (statusToSet) {
        setStatusId(statusToSet);
      }
    }

    if (approvalStatusId) {
      const appStatusToSet = approvalStatuses.find(
        (status) => status.value === Number(approvalStatusId)
      );
      if (appStatusToSet) {
        setApprovalStatusId(appStatusToSet);
      }
    }

    if (pageNumber) setPage(Number(pageNumber)); // Convert to number

    if (typeof minPrice === "string") setMinPrice(minPrice);
    if (typeof maxPrice === "string") setMaxPrice(maxPrice);

    if (fromDate && typeof fromDate === "string")
      setFromDate(new Date(fromDate));
    if (toDate && typeof toDate === "string") setToDate(new Date(toDate));

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

    if (accountingStatus) {
      const statusToSet = accountingStatuses.find(
        (status) => status.value === Number(accountingStatus)
      );
      if (statusToSet) {
        setAccountingStatus(
          statusToSet as unknown as {
            label: string;
            value: BoardMissionStatusForFilter;
          }
        ); // Cast to unknown first
      }
    }

    if (paymentType) {
      const typeToSet = typeOfPayments.find(
        (type) => type.value === Number(paymentType)
      );
      if (typeToSet) {
        setPaymentType(
          typeToSet as unknown as {
            label: string;
            value: PAYMENT_TYPE;
          }
        );
      }
    }

    if (deliveryStatus) {
      const deliveryStatusToSet = deliveryStatuses.find(
        (status) => status.value === Number(deliveryStatus)
      );
      if (deliveryStatusToSet) {
        setDeliveryStatus(
          deliveryStatusToSet as unknown as {
            label: string;
            value: BoardMissionStatusForFilter;
          }
        );
      }
    }

    if (productionStatus) {
      const productionStatusToSet = productionStatuses.find(
        (status) => status.value === Number(productionStatus)
      );
      if (productionStatusToSet) {
        setProductionStatus(
          productionStatusToSet as unknown as {
            label: string;
            value: BoardMissionStatusForFilter;
          }
        );
      }
    }

    if (isCanceled) {
      setIsCanceledState(
        Array.isArray(isCanceled)
          ? isCanceled[0] === "true"
          : isCanceled === "true"
      );
    }

    if (isPaused) {
      setIsPausedOrders(
        Array.isArray(isPaused) ? isPaused[0] === "true" : isPaused === "true"
      );
    }
  }, [router, agentsCategories]);

  const moveOrderToReady = async (isSendMessage: boolean = false) => {
    const callBack = (res) => {
      if (res?.success) {
        getAllQuotes();
        if (isOrder) {
          onOpenPackagesModal(selectedDocument);
          return;
        }
        if (isSelectedCLoseAsDeliveryNote) {
          const path = `/deliveryNote?isNewCreation=true&orderId=${selectedDocument?.id}`;
          window.open(path, "_blank");
        } else {
          const path = isOrder
            ? `/invoice?isNewCreation=true&orderId=${selectedDocument?.id}`
            : `/invoice?isNewCreation=true&deliveryNoteId=${selectedDocument?.id}`;
          window.open(path, "_blank");
        }
      } else {
        alertFaultUpdate();
      }
    };
    await moveOrderToReadyApi(callApi, callBack, {
      orderId: selectedDocument?.id,
      isSendMessage: isSendMessage,
    });
  };

  const onChangeDocumentSearch = (value: string) => {
    setPatternSearch(value);
  };

  //!Old code please don't delete it
  // const debouncePatternSearch = useDebounce(patternSearch, 1000);
  // useEffect(() => {
  //   const trimmedSearch = debouncePatternSearch?.trim() || "";
  //   setFinalPatternSearch(trimmedSearch);
  //   if (trimmedSearch === "") {
  //     const { finalPatternSearch, ...remainingQuery } = router.query;
  //     router.push({
  //       pathname: router.pathname,
  //       query: {
  //         ...remainingQuery,
  //         pageNumber: 1, // Optional: reset page on clear
  //       },
  //     });
  //     return;
  //   }

  //   router.push({
  //     pathname: router.pathname,
  //     query: {
  //       ...router.query,
  //       finalPatternSearch: trimmedSearch,
  //       pageNumber: 1,
  //     },
  //   });
  // }, [debouncePatternSearch]);

  const debouncePatternSearch = useDebounce(patternSearch, 1000);
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

  const [openDuplicateModal, setOpenDuplicateModal] = useState<boolean>(false);
  const onCloseDuplicateModal = () => {
    setSelectedDocument({});
    setOpenDuplicateModal(false);
  };

  const onOpenDuplicateModal = (mission: any) => {
    setSelectedDocument(mission);
    setOpenDuplicateModal(true);
  };

  const getValueByKey = (statistics: ICard[], key: string) => {
    const card = statistics?.find((item) => item.key === key);
    return card ? card.value : "0";
  };

  // Alert mail not verified modal
  const alertNotVerifiedMailModal = useModal();
  const [alertNotVerifiedModalState, setAlertModalState] = useState<{
    message: string;
    onConfirm?: () => void;
  }>({
    message: "",
  });

  const showAlertModal = ({
    message,
    onConfirm,
  }: {
    message: string;
    onConfirm?: () => void;
  }) => {
    setAlertModalState({ message, onConfirm });
    alertNotVerifiedMailModal.open();
  };

  const removeDraftModal = useModal();

  const onClickOpenRemoveDraftModal = (document) => {
    setSelectedDocument(document);
    removeDraftModal.open();
  };

  const onCloseOpenRemoveDraftModal = () => {
    setSelectedDocument({});
    removeDraftModal.close();
  };

  const handleRemoveDraftBtnClick = async () => {
    const callBack = (res) => {
      if (res?.success) {
        getAllQuotes();
      } else {
        alertFaultDelete();
      }
    };
    await removeDraftDocumentApi(callApi, callBack, {
      documentType: docType,
      documentId: selectedDocument?.id,
    });
  };

  const handleGetTaxConfirmNo = async (documentId: string) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessGetData();
        getAllQuotes();
      } else alertFaultGetData();
    };

    await getTaxConfirmationNumberApi(callApi, callBack, documentId);
  };

  const [isDescOrderBE, setIsDescOrderBE] = useState(false);
  const columnMappings = {
    [DOCUMENT_TYPE.quote]: {
      creationDate: QuotesTableColumns.CreationDate,
      client: QuotesTableColumns.ClientName,
      number: QuotesTableColumns.Number,
      totalPrice: QuotesTableColumns.TotalPrice,
      orderNumber: QuotesTableColumns.OrderNumber,
      totalPriceWithoutVat: QuotesTableColumns.TotalPriceWithoutVat,
      discount: QuotesTableColumns.Discount,
    },
    [DOCUMENT_TYPE.order]: {
      creationDate: OrdersTableColumns.CreationDate,
      orderNumber: OrdersTableColumns.Number,
      client: OrdersTableColumns.ClientName,
      purchaseNumber: OrdersTableColumns.PurchaseNumber,
      jobs: OrdersTableColumns.OrderItemsNumber,
      worksName: OrdersTableColumns.WorksNames,
      cost: OrdersTableColumns.Cost,
      totalPrice: OrdersTableColumns.TotalPrice,
      totalPriceWithoutVat: OrdersTableColumns.TotalPriceWithoutVat,
      discount: OrdersTableColumns.Discount,
    },
    [DOCUMENT_TYPE.deliveryNote]: {
      creationDate: DeliveryNotesTableColumns.CreationDate,
      client: DeliveryNotesTableColumns.ClientName,
      worksName: DeliveryNotesTableColumns.WorksNames,
      notes: DeliveryNotesTableColumns.Notes,
      totalPrice: DeliveryNotesTableColumns.TotalPrice,
      deliveryStatus: DeliveryNotesTableColumns.DeliveryStatus,
      status: DeliveryNotesTableColumns.Status,
      totalPriceWithoutVat: DeliveryNotesTableColumns.TotalPriceWithoutVat,
      discount: DeliveryNotesTableColumns.Discount,
    },
    [DOCUMENT_TYPE.invoice]: {
      creationDate: DeliveryNotesTableColumns.CreationDate,
      client: DeliveryNotesTableColumns.ClientName,
      worksName: DeliveryNotesTableColumns.WorksNames,
      notes: DeliveryNotesTableColumns.Notes,
      totalPrice: DeliveryNotesTableColumns.TotalPrice,
      deliveryStatus: DeliveryNotesTableColumns.DeliveryStatus,
      status: DeliveryNotesTableColumns.Status,
      totalPriceWithoutVat: DeliveryNotesTableColumns.TotalPriceWithoutVat,
      discount: DeliveryNotesTableColumns.Discount,
    },
    default: {
      creationDate: 0,
      orderNumber: 1,
      client: 2,
      worksName: 3,
      notes: 6,
      totalPrice: 7,
      deliveryStatus: 8,
      status: 9,
    },
  };

  // Check if header is sortable
  const isHeaderSortable = (docType: string, header: string) => {
    const headers = columnMappings[docType] || columnMappings.default;
    return headers.hasOwnProperty(header);
  };

  const handleSortBE = (key: string) => {
    const direction = isDescOrderBE ? "desc" : "asc";

    const columnIndex =
      columnMappings[docType]?.[key] ?? columnMappings.default[key];

    if (columnIndex !== undefined) {
      const sortOrder = [
        {
          column: columnIndex,
          dir: direction,
        },
      ];

      // Save the sort order to state
      setCurrentSortOrder(sortOrder);

      getAllQuotes(sortOrder);
      setIsDescOrderBE(!isDescOrderBE);
    } else {
      console.error("Invalid key for sorting:", key);
    }
  };

  const documentTypeToTableKeyMap: Record<number, string> = {
    [DOCUMENT_TYPE.quote]: "quotes",
    [DOCUMENT_TYPE.order]: "orders",
    [DOCUMENT_TYPE.deliveryNote]: "deliveryNotes",
    [DOCUMENT_TYPE.deliveryNoteRefund]: "deliveryNotes",
    [DOCUMENT_TYPE.invoice]: "invoices",
    [DOCUMENT_TYPE.invoiceRefund]: "invoices",
    [DOCUMENT_TYPE.purchaseOrder]: "purchaseOrders",
    [DOCUMENT_TYPE.purchaseInvoice]: "purchaseInvoices",
    [DOCUMENT_TYPE.purchaseInvoiceRefund]: "purchaseInvoices",
    [DOCUMENT_TYPE.receipt]: "receipts",
    [DOCUMENT_TYPE.supplierPayments]: "supplierPayments",
  };

  const tableKey = documentTypeToTableKeyMap[docType] || "default";

  const [columnOrder] = useRecoilState(columnOrderStateFamily(tableKey));
  const [columnVisibility] = useRecoilState(
    columnVisibilityStateFamily(tableKey)
  );

  const setColumnVisibility = useSetRecoilState(
    columnVisibilityStateFamily(tableKey)
  );
  const setColumnOrder = useSetRecoilState(columnOrderStateFamily(tableKey));
  const [columnsReady, setColumnsReady] = useState(false);

  const visibleHeaders = columnOrder.filter((key) => columnVisibility[key]);

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
    openChangeProductionStatusModal,
    isSelectedCLoseAsDeliveryNote,
    onClickCloseChangeProductionStatusModal,
    moveOrderToReady,
    onChangeDocumentSearch,
    isPausedOrders,
    setIsPausedOrders,
    openDuplicateModal,
    onCloseDuplicateModal,
    onClickDocumentDuplicate,
    searchInputRef,
    openExportReceiptPdfModal,
    onCloseExportReceiptPdfModal,
    startOrderProduction,
    openStartProductionModal,
    onClickCloseStartProductionModal,
    getValueByKey,
    isOrder,
    isQuote,
    isReceipt,
    isSupplierPayments,
    isDeliveryNote,
    isInvoice,
    deliveryStatuses,
    deliveryStatus,
    setDeliveryStatus,
    isPurchaseDocument,
    isSendToClient,
    setFromDate,
    setToDate,
    onClickOpenCustomerModal,
    isPurchaseOrder,
    isMoveToReady,
    handleCheckboxChange,
    direction,
    handleSortBE,
    isDescOrderBE,
    isHeaderSortable,
    onClickCloseReopenDocumentModal,
    setOpenReopenDocModal,
    openReopenDocModal,
    OpenDocument,
    deliveryOrderId,
    deliveryOrderNumber,
    deliveryCustomerId,
    isSendOrderReadyToClient,
    alertNotVerifiedMailModal,
    alertNotVerifiedModalState,
    showAlertModal,
    onClickCloseOrderCallback,
    handleRemoveDraftBtnClick,
    removeDraftModal,
    onCloseOpenRemoveDraftModal,
    MoveOrderToReady,
    onClickCloseMoveOrderToReadyModal,
    onClickPrintPackagingSlip,
    handleQuantityPerPackageChange,
    handleQuantityOfPackagesChange,
    quantityPerPackage,
    quantityOfPackages,
    packageInputs,
    onClosePackagesModal,
    openPackagesModal,
    paymentType,
    handlePaymentTypeChange,
    typeOfPayments,
    initialPageSize,
    ExportDocumentTableToPdf,
    currentSortOrder,
    tableKey,
    visibleHeaders,
    columnsReady,
    setColumnsReady,
    setColumnOrder,
    setColumnVisibility,
    callApi,
    onClickOpenMoveOrderToReadyModal,
  };
};

export { useQuotes };
