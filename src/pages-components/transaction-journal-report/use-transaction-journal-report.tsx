import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { DocumentsTypeReportList } from "@/enums";

const useTransactionJournalReport = () => {
  const { alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation()

  const documentsTypeList = [
    { id: DocumentsTypeReportList.Invoice, label: t("reports.invoice") },
    { id: DocumentsTypeReportList.InvoiceRefund, label: t("reports.invoiceRefund") },
    { id: DocumentsTypeReportList.PurchaseInvoice, label: t("reports.purchaseInvoice") },
    { id: DocumentsTypeReportList.PurchaseInvoiceRefund, label: t("reports.purchaseInvoiceRefund") },
    { id: DocumentsTypeReportList.Payments, label: t("reports.Payments") },
    { id: DocumentsTypeReportList.Deposits, label: t("reports.deposits") },
    { id: DocumentsTypeReportList.JournalEntry, label: t("reports.journalEntry") },
    { id: DocumentsTypeReportList.OutGoingPayments, label: t("reports.outGoingPayments") },
    { id: DocumentsTypeReportList.SalesDocuments, label: t("reports.salesDocuments") }
  ] as const;
  const [documentType, setDocumentType] = useState<{
    label: string;
    id: number;
  } | null>();
  const handleDocumentTypeChange = (e: any, value: any) => {
    setDocumentType(value);
  };


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
    t("reports.cardCode"),
    t("reports.cardName"),
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
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/export-ledger-report-pdf`,
        {
          // "clientId": customer?.id,
          "startDate": fromDate,
          "endDate": toDate,
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
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/get-transaction-journal-report`,
        {
          startDate: fromDate,
          endDate: toDate,
          documentsType: documentType?.id,
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
    [fromDate, toDate, documentType,]
  );
  return {
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
