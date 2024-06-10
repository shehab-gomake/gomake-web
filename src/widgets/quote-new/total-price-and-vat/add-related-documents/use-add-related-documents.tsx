import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DocumentTypeEnums } from "@/enums";

interface DocumentTypeOption {
  label: string;
  value: DocumentTypeEnums;
}

const useaddRelatedDocuments = () => {
  const { t } = useTranslation();

  const [selectedDocumentType, setSelectedDocumentTyp] = useState<DocumentTypeOption>()
  const [ducomentNumber, setDocumentNumber] = useState<string>("")
  const onChangeSelectedDocumentTyp = (item) => {
    setSelectedDocumentTyp(item)
  }
  const onChangetDocumentNumber = (e) => {
    setDocumentNumber(e.target.value)
  }

  const documentTypeOptions: DocumentTypeOption[] = [
    { label: t("tabs.quotes"), value: DocumentTypeEnums.Quote },
    { label: t("tabs.orders"), value: DocumentTypeEnums.Order },
    { label: t("tabs.deliveryNotes"), value: DocumentTypeEnums.DeliveryNote },
    { label: t("tabs.invoices"), value: DocumentTypeEnums.Invoice },
    { label: t("tabs.receipts"), value: DocumentTypeEnums.Receipt },
    { label: t("documentType.DeliveryNoteRefund"), value: DocumentTypeEnums.DeliveryNoteRefund },
    { label: t("documentType.InvoiceRefund"), value: DocumentTypeEnums.InvoiceRefund },
    { label: t("PurchaseOrder.title"), value: DocumentTypeEnums.PurchaseOrder },
    { label: t("documentingNumbering.PurchaseInvoice"), value: DocumentTypeEnums.PurchaseInvoice },
    { label: t("documentingNumbering.PurchaseInvoiceRefund"), value: DocumentTypeEnums.PurchaseInvoiceRefund },
  ];

  return {
    t,
    onChangeSelectedDocumentTyp,
    onChangetDocumentNumber,
    documentTypeOptions
  };
};

export { useaddRelatedDocuments };
