import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from 'date-fns';
import { useDocumentsType, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { DocumentsTypeReportList } from "@/enums";
import { endOfToday, startOfYear } from "date-fns";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { useSetRecoilState } from "recoil";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetClientTypes } from "@/services/hooks";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";

interface TransactionJournalReportWidgetProps {
  isPayment: boolean;
}

const useTransactionJournalReport = ({ isPayment }: TransactionJournalReportWidgetProps) => {
  const { alertFault, alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { documentsTypeList, documentType, handleDocumentTypeChange } = useDocumentsType();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>(startOfYear(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfToday());
  const [dataTable, setDataTable] = useState<any>([]);

  // New states for customer modal
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForEdit, setCustomerForEdit] = useState(null);

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
              documentPath = 'invoices';
              break;
            case DocumentsTypeReportList.InvoiceRefund:
              documentPath = 'invoiceRefunds';
              break;
            default:
              documentPath = null;
          }
          return [
            data?.dueDate?.split("T")[0],
            documentPath ? (
              <a
                style={{ cursor: "pointer", color: "inherit", textDecoration: 'unset' }}
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
            <div style={{ cursor: "pointer" }} onClick={() => onClickOpenCustomerModal(data?.clientId)}>
              {data?.cardName}
            </div>,
            isPayment ? data?.credit > 0 ? data?.credit?.toFixed(2) : data?.debit?.toFixed(2) : data?.credit?.toFixed(2),
          ];
        });
      }
    },
    [dataTable]
  );

  const tableHeaders = [
    t("reports.dueDate"),
    t("reports.documentNumber"),
    t("reports.transType"),
    t("reports.TransNumber"),
    t("reports.AccountCode"),
    t("reports.accountName"),
    t("reports.cardcode"),
    t("reports.cardname"),
    isPayment ? `${t("reports.credit")} / ${t("reports.debit")}` : t("reports.credit"),
  ];

  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const onClickPrintCard = () => {
    ExportLedgerReportPDF();
  };

  const onClickShowCard = () => {
    setShowTable(false);
    getTransactionJournalReportFilter();
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
        documentsType: isPayment ? DocumentsTypeReportList.Payments : documentType?.id,
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
  }, [fromDate, toDate, documentType, isPayment]);

  const handleDateChange = (value) => {
    if (value && value.length === 2) {
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  const onClickOpenCustomerModal = async (customerId) => {
    console.log("customerId", customerId)
    const callBack = (res) => {
      if (res.success) {
        setCustomerForEdit(res.data);
        setShowCustomerModal(true);
      }
    };
    await getAndSetCustomerById(callApi, callBack, { customerId });
  };
  const setClientTypesCategories = useSetRecoilState(clientTypesCategoriesState);

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
    await getAndSetClientTypes(callApi, callBack, { cardType: CLIENT_TYPE_Id.CUSTOMER });
  };

  useEffect(() => {
    getClientTypesCategories();
  }, []);
  return {
    t,
    onSelectDeliveryTimeDates,
    handleDocumentTypeChange,
    onClickPrintCard,
    onClickShowCard,
    getTableDataRows,
    documentType,
    resetDatePicker,
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
    onClickOpenCustomerModal
  };
};

export { useTransactionJournalReport };
