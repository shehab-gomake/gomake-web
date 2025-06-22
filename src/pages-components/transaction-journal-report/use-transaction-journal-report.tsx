import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  useCustomerDropDownList,
  useDocumentsType,
  useGomakeAxios,
  useSnackBar,
} from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { DocumentsTypeReportList, EReportType, ReportsType } from "@/enums";
import { endOfToday } from "date-fns";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { CLIENT_TYPE, DEFAULT_VALUES } from "@/pages/customers/enums";
import { IconButton } from "@mui/material";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useDateFormat } from "@/hooks/use-date-format";
import { downloadCpaFileApi } from "@/services/api-service/settings/finance-api";
import { initialFromDate } from "@/utils/helpers";
import { useClientTypesList } from "@/hooks/use-client-types";

export interface FilterState {
  fromAccount: string;
  toAccount: string;
  startDate: Date | null;
  endDate: Date | null;
  accountCode?: string;
}

interface TransactionJournalReportWidgetProps {
  reportType: EReportType;
  clientType?: CLIENT_TYPE;
}

export const getDocumentTypeName = (t, transType: number): string => {
  switch (transType) {
    case DocumentsTypeReportList.Invoice:
      return t("reports.invoice");
    case DocumentsTypeReportList.InvoiceRefund:
      return t("reports.invoiceRefund");
    case DocumentsTypeReportList.PurchaseInvoice:
      return t("reports.purchaseInvoice");
    case DocumentsTypeReportList.PurchaseInvoiceRefund:
      return t("reports.purchaseInvoiceRefund");
    case DocumentsTypeReportList.Payments:
      return t("reports.Payments");
    case DocumentsTypeReportList.Deposits:
      return t("reports.deposits");
    case DocumentsTypeReportList.JournalEntry:
      return t("reports.journalEntry");
    case DocumentsTypeReportList.OutGoingPayments:
      return t("reports.outGoingPayments");
    case DocumentsTypeReportList.SalesDocuments:
      return t("reports.salesDocuments");
    default:
      return "Unknown";
  }
};

const useTransactionJournalReport = ({
  reportType,
  clientType,
}: TransactionJournalReportWidgetProps) => {
  const isPurchaseReport = clientType === CLIENT_TYPE.SUPPLIER;
  const isDailyReport = reportType === EReportType.DailyPayments;

  const { alertFault, alertFaultGetData, alertSuccessGetData, alertSuccess } =
    useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { formatISODateTime } = useDateFormat();
  const { documentsTypeList, documentType, handleDocumentTypeChange } =
    useDocumentsType();
  const [showTable, setShowTable] = useState<boolean>(false);

  const defaultStartDate = isDailyReport ? new Date() : undefined;
  const [fromDate, setFromDate] = useState<Date>(
    initialFromDate("transaction-journal-report-date", defaultStartDate)
  );
  const [toDate, setToDate] = useState<Date>(endOfToday());
  const [dataTable, setDataTable] = useState<any>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForEdit, setCustomerForEdit] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);
  const [isOpenCreateTransactionModal, setIsCreateTransactionModal] =
    useState<boolean>(false);
  const {
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({});

  const onClickCloseCreateTransactionModal = () => {
    setIsCreateTransactionModal(false);
  };
  const onClickOpenCreateTransactionModal = () => {
    setIsCreateTransactionModal(true);
  };

  const handlePageSizeChange = (event) => {
    setPageNumber(1);
    setPageSize(event.target.value);
  };

  const [filterState, setFilterState] = useState<FilterState>({
    fromAccount: "",
    toAccount: "",
    startDate: initialFromDate("accounting-transactions-report-date"),
    endDate: endOfToday(),
  });

  const getTableDataRows = useCallback(
    (dataTable, onClickOpenCustomerModal) => {
      if (dataTable?.length) {
        return dataTable?.map((data) => {
          let documentPath;
          switch (data?.transType) {
            case DocumentsTypeReportList.Invoice:
              documentPath = "invoices";
              break;
            case DocumentsTypeReportList.InvoiceRefund:
              documentPath = "invoiceRefunds";
              break;
            default:
              documentPath = null;
          }
          return [
            data?.dueDate?.split("T")[0],
            documentPath ? (
              <a
                style={{
                  cursor: "pointer",
                  color: "inherit",
                  textDecoration: "unset",
                }}
                href={`/${documentPath}?documentNumber=${data?.docNumber}`}
              >
                {data?.docNumber}
              </a>
            ) : (
              <span>{data?.docNumber}</span>
            ),
            getDocumentTypeName(t, data?.transType),
            data?.transNumber,
            data?.accountCode,
            data?.accountName,
            data?.cardCode,
            <div
              style={{ cursor: "pointer" }}
              onClick={() => onClickOpenCustomerModal(data?.clientId)}
            >
              {data?.cardName}
            </div>,
            reportType === EReportType.DailyPayments
              ? data?.credit > 0
                ? `(${data?.credit?.toFixed(2)})`
                : data?.debit?.toFixed(2)
              : data?.credit?.toFixed(2),
          ];
        });
      }
    },
    [reportType, dataTable]
  );

  const getAccountingTableRows = useCallback(() => {
    return dataTable?.map((data, index) => [
      data?.transNumber,
      data?.transType,
      data?.documentDate?.split("T")[0],
      data?.valueDate?.split("T")[0],
      data?.debAccountKey,
      data?.debitAccountName,
      data?.credAccountKey,
      data?.creditAccountName,
      data?.debitAmount?.toFixed(2),
      data?.creditAmount?.toFixed(2),
      data?.reference,
      data?.ref2,
      data?.description,
    ]);
  }, [reportType, dataTable]);

  const tableHeaders = useMemo(() => {
    let headers = [
      t("reports.dueDate"),
      t("reports.documentNumber"),
      t("reports.transType"),
      t("reports.TransNumber"),
      t("reports.AccountCode"),
      t("reports.accountName"),
      t("reports.cardcode"),
      t("reports.cardname"),
    ];
    if (reportType === EReportType.DailyPayments) {
      headers.push(`${t("reports.credit")} / ${t("reports.debit")}`);
    } else if (reportType === EReportType.AccountingTransaction) {
      headers = [
        t("reports.transNum"),
        t("reports.transType"),
        t("reports.documentDate"),
        t("reports.valueDate"),
        t("reports.debAccountKey"),
        t("reports.debitAccountName"),
        t("reports.credAccountKey"),
        t("reports.creditAccountName"),
        t("reports.debitAmount"),
        t("reports.creditAmount"),
        t("reports.reference"),
        t("reports.ref2"),
        t("reports.description"),
      ];
    } else {
      headers.push(t("reports.credit"));
    }

    return headers;
  }, [reportType, t]);

  const onClickPrintCard = () => {
    ExportLedgerReportPDF();
  };

  const ExportLedgerReportPDF = useCallback(async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/export-ledger-report-pdf`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      },
      true,
      null
    );
    const pdfLink = res?.data?.data?.data;
    downloadPdf(pdfLink);
  }, [fromDate, toDate]);

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

  const getTransactionJournalReportFilter = useCallback(async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/get-transaction-journal-report`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        documentsType:
          reportType === EReportType.DailyPayments
            ? DocumentsTypeReportList.Payments
            : documentType?.id,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      }
    );
    if (res?.success) {
      setDataTable(res.data?.data?.data);
      alertSuccessGetData();
      setShowTable(true);
    } else {
      alertFaultGetData();
      setShowTable(false);
    }
  }, [fromDate, toDate, documentType, reportType]);

  const getAccountingTransactionReportFilter = useCallback(async () => {
    if (!filterState.startDate || !filterState.endDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(filterState.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(filterState.endDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/get-accounting-transaction-report`,
      {
        // ...filterState,
        accountCode: filterState?.accountCode,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        pageNumber: pageNumber,
        pageSize,
      }
    );
    if (res?.success) {
      const tableData = res.data?.data?.data;
      setDataTable(tableData.data);
      setPagesCount(Math.ceil(tableData.totalRecords / pageSize));

      alertSuccessGetData();
    } else {
      alertFaultGetData();
    }
  }, [reportType, filterState, pageNumber, pageSize]);

  const [rows, setRows] = useState<any[]>([]);

  const headers = [
    "accountName",
    "accountKey",
    "adjustmentRecordNumber",
    "deleteButton",
  ];
  const getAdjustmentsReports = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/get-adjustments-report`,
      {
        clientId: customer?.id,
        pageNumber,
        pageSize,
      }
    );
    if (res?.success) {
      const data = res.data?.data?.data;
      const mappedRows = data.items.map((item: any) => ({
        accountName: item?.relatedAccountName,
        accountKey: item?.relatedAccountKey,
        adjustmentRecordNumber: item?.recordNumber,
        deleteButton: item?.isDeletable ? (
          <IconButton onClick={() => DeleteAdjustment(item.id)}>
            <DeleteIcon />
          </IconButton>
        ) : null,
        history:
          item?.adjustments?.map((adjustment: any) => ({
            transNum: adjustment?.recordNumber,
            reference: adjustment?.document?.documentNumber,
            sum: adjustment?.amount,
            adjustmentSum: adjustment?.allocatedAmount,
            valueDate: formatISODateTime(adjustment?.document?.dueDate).split(
              " "
            )[0],
            docDate: formatISODateTime(adjustment?.document?.docDate).split(
              " "
            )[0],
          })) || [],
      }));

      setRows(mappedRows);
      setPagesCount(Math.ceil(data.totalRecords / pageSize));
      alertSuccessGetData();
    } else {
      alertFaultGetData();
    }
  }, [reportType, pageNumber, pageSize, customer]);

  const ExportAccountingReportPDF = useCallback(async () => {
    if (!filterState.startDate || !filterState.endDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }
    const formattedStartDate = format(filterState.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(filterState.endDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/export-accounting-transaction-report-pdf`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      },
      true,
      null
    );
    if (res?.success) {
      const pdfLink = res?.data?.data?.data;
      downloadPdf(pdfLink);
    } else {
      alertFaultGetData();
    }
  }, [reportType, filterState]);

  const DeleteAdjustment = useCallback(
    async (AdjustmentGroupId: string) => {
      const res = await callApi(
        EHttpMethod.DELETE,
        `/v1/erp-service/reports/delete-adjustment-by-group-id`,
        {
          AdjustmentGroupId,
        },
        true,
        null
      );
      if (res?.success) {
        getAdjustmentsReports();
      } else {
        alertFaultGetData();
      }
    },
    [reportType]
  );

  const handleDateChange = (value) => {
    if (value && value.length === 2) {
      localStorage.setItem("transaction-journal-report-date", value[0]);
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  const onClickShowCard = () => {
    setShowTable(false);
    switch (reportType) {
      case EReportType.AccountingTransaction:
        getAccountingTransactionReportFilter();
        break;
      case EReportType.AdjustmentsReport:
        getAdjustmentsReports();
        break;
      default:
        getTransactionJournalReportFilter();
        break;
    }
  };

  const onClickOpenCustomerModal = async (customerId) => {
    const callBack = (res) => {
      if (res.success) {
        setCustomerForEdit(res.data);
        setShowCustomerModal(true);
      }
    };
    await getAndSetCustomerById(callApi, callBack, { customerId });
  };

  const { getClientTypesCategories } = useClientTypesList();

  useEffect(() => {
    getClientTypesCategories();
  }, []);

  const label = (() => {
    switch (reportType) {
      case EReportType.TransactionJournal:
        return t("tabs.transactionJournalReport");
      case EReportType.DailyPayments:
        return isPurchaseReport
          ? t("tabs.paymentsReport")
          : t("tabs.receiptsReport");
      case EReportType.AccountingTransaction:
        return t("tabs.accountingTransactionReport");
      case EReportType.AdjustmentsReport:
        return t("tabs.adjustmentsReport");
      default:
        return "";
    }
  })();

  const handleDatesChange = (value) => {
    if (value && value.length === 2) {
      localStorage.setItem("accounting-transactions-report-date", value[0]);
      setFilterState((prevState) => ({
        ...prevState,
        startDate: value[0],
        endDate: value[1],
      }));
    } else {
      setFilterState((prevState) => ({
        ...prevState,
        startDate: null,
        endDate: null,
      }));
    }
  };

  const handleClearFilters = () => {
    setFilterState({
      fromAccount: "",
      toAccount: "",
      startDate: null,
      endDate: null,
    });
    setPageNumber(1);
  };

  const [isOpenAdjustmentsModal, setIsOpenAdjustmentsModal] =
    useState<boolean>(false);

  const onClickCloseAdjustmentsModal = () => {
    setClientPaymentsList([]);
    setIsOpenAdjustmentsModal(false);
    setHasFetchedOnce(false);
  };

  const onClickOpenAdjustmentsModal = () => {
    if (customer?.id) {
      setIsOpenAdjustmentsModal(true);
    } else {
      alertFault("reports.pleaseSelectCustomer");
    }
  };

  const [clientPaymentsList, setClientPaymentsList] = useState<any>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const getClientPaymentItems = useCallback(async () => {
    setIsLoadingPayments(true);
    setHasFetchedOnce(false);

    const res = await callApi(
      EHttpMethod.GET,
      `/v1/erp-service/receipts/get-client-payment-items`,
      {
        clientId: customer?.id,
      }
    );

    setIsLoadingPayments(false);
    setHasFetchedOnce(true);

    if (res?.success) {
      let data = res.data?.data?.data;
      if (data?.length > 0) {
        const newData = data?.map((item) => ({
          ...item,
          fixedPrice:
            item?.totalPrice?.toFixed(2) ??
            (item?.creditOrDebit === 1
              ? Math.abs(item?.price)?.toFixed(2)
              : -Math.abs(item?.price)?.toFixed(2)),

          price:
            item?.creditOrDebit === 1
              ? Math.abs(item?.price)?.toFixed(2)
              : -Math.abs(item?.price)?.toFixed(2),
        }));
        setClientPaymentsList(newData);
        alertSuccessGetData();
      } else {
        setClientPaymentsList([]);
      }
    } else {
      setClientPaymentsList([]);
      alertFaultGetData();
    }
  }, [customer]);

  const onClickExportAccountingReportExcel = useCallback(async () => {
    if (!filterState.startDate || !filterState.endDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(filterState.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(filterState.endDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/export-accounting-report-excel`,
      {
        myBody: {
          // ...filterState,
          accountCode: filterState?.accountCode,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          pageNumber: 0,
          pageSize: 0,
        },
      },
      true,
      null
    );
    if (res?.success) {
      const base64Data = res?.data?.data?.data?.base64Excel;
      const contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const linkSource = `data:${contentType};base64,${base64Data}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = "AccountingTransactionReport.xlsx";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      alertFaultGetData();
    }
  }, [reportType, filterState, pageNumber, pageSize]);

  const onClickExportJournalExcelReport = useCallback(async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }
    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/export-transaction-journal-report-to-excel`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        documentsType:
          reportType === EReportType.DailyPayments
            ? DocumentsTypeReportList.Payments
            : documentType?.id,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      },
      true,
      null
    );

    if (res?.success) {
      const base64Data = res?.data?.data?.data?.base64Excel;
      const contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const linkSource = `data:${contentType};base64,${base64Data}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = isPurchaseReport
        ? "PaymentReport.xlsx"
        : "ReceiptsReport.xlsx";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      alertFaultGetData();
    }
  }, [fromDate, toDate, documentType, reportType]);

  const [erpAccountsList, setErpAccountsList] = useState([]);

  const getErpAccountsList = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.GET,
      `/v1/erp-service/receipts/get-erp-accounts`
    );
    if (res?.success) {
      setErpAccountsList(res.data?.data?.data || []);
    } else {
      alertFaultGetData();
    }
  }, []);

  const onClickDownloadMovingFiles = async () => {
    const formattedStartDate = format(filterState.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(filterState.endDate, "yyyy-MM-dd");

    const callBack = (res) => {
      if (res.success) {
        alertSuccess("financesWidget.filesSentSuccessfully");
        // const downloadLink = document.createElement("a");
        // downloadLink.href = res.data;
        // downloadLink.download = "Account_Files.zip";
        // downloadLink.click();
      } else {
        alertFaultGetData();
      }
    };

    await downloadCpaFileApi(callApi, callBack, {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  };
  const onClickExportJournalPDFReport = async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/get-transaction-journal-report-pdf`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        documentsType:
          reportType === EReportType.DailyPayments
            ? DocumentsTypeReportList.Payments
            : documentType?.id,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      }
    );
    if (res?.success) {
      const pdfLink = res?.data?.data?.data;
      downloadPdf(pdfLink);
      alertSuccessGetData();
    } else {
      alertFaultGetData();
    }
  };
  return {
    t,
    handleDocumentTypeChange,
    onClickPrintCard,
    onClickShowCard,
    getTableDataRows,
    documentType,
    documentsTypeList,
    showTable,
    tableHeaders,
    dataTable,
    handleDateChange,
    fromDate,
    toDate,
    showCustomerModal,
    setShowCustomerModal,
    customerForEdit,
    setCustomerForEdit,
    onClickOpenCustomerModal,
    label,
    filterState,
    setFilterState,
    handleDatesChange,
    handlePageSizeChange,
    pageSize,
    pagesCount,
    pageNumber,
    setPageNumber,
    getAccountingTransactionReportFilter,
    ExportAccountingReportPDF,
    handleClearFilters,
    getAccountingTableRows,
    rows,
    headers,
    getAdjustmentsReports,
    onClickOpenCreateTransactionModal,
    onClickCloseCreateTransactionModal,
    isOpenCreateTransactionModal,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
    isOpenAdjustmentsModal,
    onClickCloseAdjustmentsModal,
    onClickOpenAdjustmentsModal,
    getClientPaymentItems,
    clientPaymentsList,
    setClientPaymentsList,
    onClickExportAccountingReportExcel,
    erpAccountsList,
    getErpAccountsList,
    onClickDownloadMovingFiles,
    onClickExportJournalExcelReport,
    onClickExportJournalPDFReport,
    isLoadingPayments,
    hasFetchedOnce,
  };
};

export { useTransactionJournalReport };
