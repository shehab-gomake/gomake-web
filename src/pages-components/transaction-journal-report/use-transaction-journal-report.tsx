import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from 'date-fns';
import { useDocumentsType, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { DocumentsTypeReportList } from "@/enums";

interface TransactionJournalReportWidgetProps {
  isPayment: boolean;
}
const useTransactionJournalReport = ({ isPayment }: TransactionJournalReportWidgetProps) => {
  const {alertFault, alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation()
  const { documentsTypeList, documentType, handleDocumentTypeChange } = useDocumentsType()
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [dataTable, setDataTable] = useState<any>([]);


  function getDocumentTypeName(transType: number): string {
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
  }

  const getTableDataRows = useCallback((dataTable) => {
    if (dataTable?.length) {
      return dataTable?.map((data) => [
        data?.dueDate?.split("T")[0],
        data?.docNumber,
        getDocumentTypeName(data?.transType),
        data?.transNumber,
        data?.accountCode,
        data?.accountName,
        data?.cardCode,
        data?.cardName,
        data?.credit?.toFixed(2),
      ]);
    }

  }, [dataTable]);


  const tableHeaders = [
    t("reports.dueDate"),
    t("reports.documentNumber"),
    t("reports.transType"),
    t("reports.TransNumber"),
    t("reports.AccountCode"),
    t("reports.accountName"),
    t("reports.cardcode"),
    t("reports.cardname"),
    t("reports.credit"),

  ];

  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const onClickPrintCard = () => {
    ExportLedgerReportPDF()
  }

  const onClickShowCard = () => {
    setShowTable(false);
    getTransactionJournalReportFilter()
  }

  const ExportLedgerReportPDF = useCallback(
    async () => {
      if (!fromDate || !toDate) {
        alertFault(("alerts.pleaseEnsureDatesSelected"))
        return;
      }

      const formattedStartDate = format(fromDate, 'yyyy-MM-dd');
      const formattedEndDate = format(toDate, 'yyyy-MM-dd');

      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/export-ledger-report-pdf`,
        {
          // "clientId": customer?.id,
          "startDate": formattedStartDate,
          "endDate": formattedEndDate,
        },
        true,
        null,
        "blob"
      );
      const downloadLink = document.createElement('a');
      const link = URL?.createObjectURL(res.data);
      downloadLink.href = link
      downloadLink.download = `aging report.pdf`;
      downloadLink.click();
    },
    [fromDate, toDate]
  );

  const getTransactionJournalReportFilter = useCallback(
    async () => {
      if (!fromDate || !toDate) {
        alertFault(("alerts.pleaseEnsureDatesSelected"))
        return;
      }

      const formattedStartDate = format(fromDate, 'yyyy-MM-dd');
      const formattedEndDate = format(toDate, 'yyyy-MM-dd');

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
        setDataTable(res.data?.data?.data)
        alertSuccessGetData();
        setShowTable(true)
      } else {
        alertFaultGetData();
        setShowTable(false)
      }
    },
    [fromDate, toDate, documentType, isPayment]
  );

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
    dataTable

  };
};

export { useTransactionJournalReport };
