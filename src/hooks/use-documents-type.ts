import {  useState } from "react";
import { DocumentsTypeReportList } from "@/enums";
import { useTranslation } from "react-i18next";

const useDocumentsType = () => {
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
    return {
      documentsTypeList,
      documentType,
      handleDocumentTypeChange
    };
};

export {useDocumentsType};
