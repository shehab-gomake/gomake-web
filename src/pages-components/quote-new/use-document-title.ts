import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useTranslation } from "react-i18next";

const useDocumentTitle = (
  docType: DOCUMENT_TYPE,
  isOutgoingPayments: boolean
) => {
  const { t } = useTranslation();
  const documentsTitles = [
    {
      label: t("sales.quote.quote"),
      value: DOCUMENT_TYPE.quote,
    },
    {
      label: t("sales.quote.order"),
      value: DOCUMENT_TYPE.order,
    },
    {
      label: t("sales.quote.invoice"),
      value: DOCUMENT_TYPE.invoice,
    },
    {
      label: t("sales.quote.deliveryNote"),
      value: DOCUMENT_TYPE.deliveryNote,
    },
    {
      label: t("sales.quote.proformaInvoice"),
      value: DOCUMENT_TYPE.proformaInvoice,
    },
    {
      label: t("sales.quote.receipt"),
      value: DOCUMENT_TYPE.receipt,
    },
    {
      label: t("tabs.deliveryNoteRefund"),
      value: DOCUMENT_TYPE.deliveryNoteRefund,
    },
    {
      label: t("tabs.invoiceRefund"),
      value: DOCUMENT_TYPE.invoiceRefund,
    },
    {
      label: t("tabs.purchaseOrder"),
      value: DOCUMENT_TYPE.purchaseOrder,
    },
    {
      label: t("tabs.purchaseInvoice"),
      value: DOCUMENT_TYPE.purchaseInvoice,
    },
    {
      label: t("tabs.purchaseInvoiceRefund"),
      value: DOCUMENT_TYPE.purchaseInvoiceRefund,
    },
  ];

  const documentTitle = isOutgoingPayments
    ? t("supplierPayments.supplierPayment")
    : documentsTitles.find((item) => item.value === docType)?.label;
  return {
    documentTitle,
  };
};

export { useDocumentTitle };
