import { useGomakeAxios } from "@/hooks";
import { getAllMailLogsApi } from "@/services/api-service/mailing/mailing-api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/utils/use-debounce";
import { SMSTemplatesEnum } from "../messageTemplates/enums/enum";
import { getAllEmployeesApi } from "@/services/api-service/users/users-api";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const useMessageLogs = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [mailLogs, setMailLogs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [patternSearch, setPatternSearch] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [customerId, setCustomerId] = useState<any>();
  const [templateType, setTemplateType] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [users, setUsers] = useState<any[]>([]);

  const debouncedPatternSearch = useDebounce(patternSearch, 500);

  const templateTypeOptions = [
    { value: SMSTemplatesEnum.ConfirmArtwork, label: t("mailingSettings.templateTypes.confirmArtwork") },
    { value: SMSTemplatesEnum.Quote, label: t("mailingSettings.templateTypes.quote") },
    { value: SMSTemplatesEnum.OrderAccepted, label: t("mailingSettings.templateTypes.orderAccepted") },
    { value: SMSTemplatesEnum.OrderCompleted, label: t("mailingSettings.templateTypes.orderCompleted") },
    { value: SMSTemplatesEnum.OrderPartiallyCompleted, label: t("mailingSettings.templateTypes.orderPartiallyCompleted") },
    { value: SMSTemplatesEnum.OrderUpdated, label: t("mailingSettings.templateTypes.orderUpdated") },
    { value: SMSTemplatesEnum.OrderCompletedWithDelivery, label: t("mailingSettings.templateTypes.orderCompletedWithDelivery") },
    { value: SMSTemplatesEnum.QuoteConfirmedByClient, label: t("mailingSettings.templateTypes.quoteConfirmedByClient") },
    { value: SMSTemplatesEnum.OrderReadyToAdmin, label: t("mailingSettings.templateTypes.orderReadyToAdmin") },
    { value: SMSTemplatesEnum.ClientOpinion, label: t("mailingSettings.templateTypes.clientOpinion") },
    { value: SMSTemplatesEnum.DeliveryNote, label: t("mailingSettings.templateTypes.deliveryNote") },
    { value: SMSTemplatesEnum.DeliveryNoteRefund, label: t("mailingSettings.templateTypes.deliveryNoteRefund") },
    { value: SMSTemplatesEnum.Invoice, label: t("mailingSettings.templateTypes.invoice") },
    { value: SMSTemplatesEnum.InvoiceRefund, label: t("mailingSettings.templateTypes.invoiceRefund") },
    { value: SMSTemplatesEnum.Receipt, label: t("mailingSettings.templateTypes.receipt") },
    { value: SMSTemplatesEnum.PurchaseOrder, label: t("mailingSettings.templateTypes.purchaseOrder") },
    { value: SMSTemplatesEnum.PurchaseInvoice, label: t("mailingSettings.templateTypes.purchaseInvoice") },
    { value: SMSTemplatesEnum.PurchaseInvoiceRefund, label: t("mailingSettings.templateTypes.purchaseInvoiceRefund") },
    { value: SMSTemplatesEnum.PaymentToSupplier, label: t("mailingSettings.templateTypes.paymentToSupplier") },
    { value: SMSTemplatesEnum.Prepayment, label: t("mailingSettings.templateTypes.prepayment") },
    { value: SMSTemplatesEnum.FixedPriceList, label: t("mailingSettings.templateTypes.fixedPriceList") },
    { value: SMSTemplatesEnum.OrderDelivery, label: t("mailingSettings.templateTypes.orderDelivery") },
    { value: SMSTemplatesEnum.ClientCreatedOrder, label: t("mailingSettings.templateTypes.clientCreatedOrder") },
    { value: SMSTemplatesEnum.GeneralLedgerReport, label: t("mailingSettings.templateTypes.generalLedgerReport") },
    { value: SMSTemplatesEnum.CustomerChat, label: t("mailingSettings.templateTypes.customerChat") },
    { value: SMSTemplatesEnum.AccountingAttachment, label: t("mailingSettings.templateTypes.accountingAttachment") },
    { value: SMSTemplatesEnum.ReadyExample, label: t("mailingSettings.templateTypes.readyExample") },
    { value: SMSTemplatesEnum.DebitsPayment, label: t("mailingSettings.templateTypes.debitsPayment") },
  ];

  const tableHeaders = [
    t("usersSettings.date"),
    t("mailingSettings.clientName2"),
    t("mailingSettings.employeeName"),
    t("mailingSettings.fromEmail"),
    t("mailingSettings.toEmail"),
    t("mailingSettings.templateType"),
    t("mailingSettings.messageBody"),
    t("mailingSettings.attachment"),
  ];

  const renderAttachmentLink = (mailLog: any) => {
    // Check if attachmentUrl exists
    if (mailLog.attachmentUrl) {
      return (
        <a
          href={mailLog.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#1976d2',
            textDecoration: 'none',
            fontSize: '18px',
            cursor: 'pointer',
          }}
          title="Download file"
        >
          <FileDownloadIcon />
        </a>
      );
    }
    // No attachment
    return '-';
  };
  const getAllMailLogs = async ({ pageNumber = 1, pageSizeInitial = 10, patternSearch = "", employeeId, clientId, templateType }
    : { pageNumber?: number, pageSizeInitial?: number, patternSearch?: string, employeeId?: string, clientId?: string, templateType?: number }) => {
    const callBackFunction = (res) => {
      if (res.success) {
        setMailLogs(res.data.data);
        setTotalCount(Math.ceil(res.data.totalItems / pageSize));
      }
    };
    return await getAllMailLogsApi(callApi, callBackFunction, {
      pageNumber,
      pageSize: pageSizeInitial,
      patternSearch,
      templateType,
      employeeId,
      clientId,
    });
  };
  const mailLogsTableRows = mailLogs.map((mailLog) => [
    mailLog.createdDate.split("T")[0],
    mailLog.clientName,
    mailLog.employeeName,
    mailLog.fromEmail,
    mailLog.toEmails?.join(", ") || "",
    templateTypeOptions.find((type) => type.value === mailLog.templateType)?.label || mailLog.templateType,
    mailLog.message,
    renderAttachmentLink(mailLog),

  ]);


  useEffect(() => {
    if (debouncedPatternSearch !== undefined) {
      setPageNumber(1);
      getAllMailLogs({
        pageNumber: 1,
        pageSizeInitial: pageSize,
        patternSearch: debouncedPatternSearch,
        templateType: templateType || undefined,
        employeeId: userId || undefined,
        clientId: customerId?.id || undefined,
      });
    }
  }, [debouncedPatternSearch, templateType, userId, customerId?.id]);

  const handlePageSizeChange = (event) => {
    setPageNumber(1);
    setPageSize(event.target.value);
    getAllMailLogs({
      pageSizeInitial: event.target.value,
      patternSearch: debouncedPatternSearch,
      templateType: templateType || undefined,
      employeeId: userId || undefined,
      clientId: customerId?.id || undefined,
    });
  };
  const handlePageNumberChange = (event, value) => {
    setPageNumber(value);
    getAllMailLogs({
      pageNumber: value,
      patternSearch: debouncedPatternSearch,
      templateType: templateType || undefined,
      employeeId: userId || undefined,
      clientId: customerId?.id || undefined,
    });
  };

  const handleSearchChange = (value: string) => {
    setPatternSearch(value);
  };

  const handleTemplateTypeChange = (event, value) => {
    setTemplateType(value?.value || null);
  };

  const getAllUsers = () => {
    const callBackFunction = (data) => {
      if (data.success) {
        setUsers(data.data);
      }
    };
    getAllEmployeesApi(callApi, callBackFunction, {
      IsAgent: null,
      IsGraphicArtist: null,
      isActive: true,
    }).then();
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleUserChange = (event, value) => {
    setUserId(value?.id || null);
  };

  return {
    tableHeaders,
    mailLogsTableRows,
    totalCount,
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
    handlePageSizeChange,
    handlePageNumberChange,
    patternSearch,
    handleSearchChange,
    templateType,
    templateTypeOptions,
    handleTemplateTypeChange,
    users,
    handleUserChange,
    userId,
    customerId,
    setCustomerId
  };
};

export { useMessageLogs };
