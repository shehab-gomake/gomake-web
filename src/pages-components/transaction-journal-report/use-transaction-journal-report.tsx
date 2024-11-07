import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  useCustomerDropDownList,
  useDocumentsType,
  useGomakeAxios,
  useSnackBar,
} from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { DocumentsTypeReportList, EReportType } from "@/enums";
import { endOfToday, startOfYear } from "date-fns";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { useSetRecoilState } from "recoil";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetClientTypes } from "@/services/hooks";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";

// export interface FilterState {
//   fromCodeAccount: string;
//   toCodeAccount: string;
// }

export interface FilterState {
  fromAccount: string;
  toAccount: string;
  startDate: Date | null;
  endDate: Date | null;
  customerId: any;
}

interface TransactionJournalReportWidgetProps {
  reportType: EReportType;
}

const useTransactionJournalReport = ({
  reportType,
}: TransactionJournalReportWidgetProps) => {
  const { alertFault, alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { documentsTypeList, documentType, handleDocumentTypeChange } =
    useDocumentsType();
  const [showTable, setShowTable] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>(startOfYear(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfToday());
  const [dataTable, setDataTable] = useState<any>([]);
  // New states for customer modal
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForEdit, setCustomerForEdit] = useState(null);
  const isAccountingTransaction =
    reportType === EReportType.AccountingTransaction;
  const {
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({
    shouldRenderCustomersOnMount: isAccountingTransaction,
    shouldRenderSuppliersOnMount: false,
  });

  const [filterState, setFilterState] = useState<FilterState>({
    fromAccount: "",
    toAccount: "",
    startDate: startOfYear(new Date()),
    endDate: endOfToday(),
    customerId: "",
  });

  const getDocumentTypeName = (transType: number): string => {
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
            getDocumentTypeName(data?.transType),
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
                ? data?.credit?.toFixed(2)
                : data?.debit?.toFixed(2)
              : data?.credit?.toFixed(2),
          ];
        });
      }
    },
    [dataTable]
  );

  const tableHeaders = useMemo(() => {
    const headers = [
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
    } else {
      headers.push(t("reports.credit"));
    }
    return headers;
  }, [t, reportType]);

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
        ...filterState,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
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
  }, [customer, reportType, filterState]);

  const handleDateChange = (value) => {
    if (value && value.length === 2) {
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  const onClickShowCard = () => {
    setShowTable(false);
    if (isAccountingTransaction) getAccountingTransactionReportFilter();
    else getTransactionJournalReportFilter();
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

  useEffect(() => {
    getClientTypesCategories();
  }, []);

  // NEW
  const label = (() => {
    switch (reportType) {
      case EReportType.TransactionJournal:
        return t("tabs.transactionJournalReport");
      case EReportType.DailyPayments:
        return t("tabs.dailyPaymentsReport");
      case EReportType.AccountingTransaction:
        return t("tabs.accountingTransactionReport");
      default:
        return "";
    }
  })();

  const handleDatesChange = (value) => {
    if (value && value.length === 2) {
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
    //?new
    label,
    filterState,
    setFilterState,

    handleDatesChange,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    customer,
    handleCustomerChange,
  };
};

export { useTransactionJournalReport };
