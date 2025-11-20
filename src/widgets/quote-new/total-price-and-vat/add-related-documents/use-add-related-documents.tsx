import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ERPDocumentsTypesEnum } from "@/enums/document-type-enum";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { addRelatedDocumentApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface DocumentTypeOption {
  label: string;
  value: ERPDocumentsTypesEnum;
}

interface UseAddRelatedDocumentsParams {
  documentId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  docType?: DOCUMENT_TYPE;
}

const useAddRelatedDocuments = ({
  documentId,
  onSuccess,
  onClose,
  docType,
}: UseAddRelatedDocumentsParams) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();

  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentTypeOption | null>(null);
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentTypeOptions: DocumentTypeOption[] = useMemo(
    () => [
      { label: t("tabs.quotes"), value: ERPDocumentsTypesEnum.quote },
      { label: t("tabs.orders"), value: ERPDocumentsTypesEnum.order },
      { label: t("tabs.deliveryNotes"), value: ERPDocumentsTypesEnum.deliveryNote },
      { label: t("tabs.invoices"), value: ERPDocumentsTypesEnum.invoice },
      { label: t("tabs.receipts"), value: ERPDocumentsTypesEnum.receipt },
      {
        label: t("documentType.DeliveryNoteRefund"),
        value: ERPDocumentsTypesEnum.deliveryNoteRefund,
      },
      {
        label: t("documentType.InvoiceRefund"),
        value: ERPDocumentsTypesEnum.invoiceRefund,
      },
      {
        label: t("sales.quote.purchaseOrder"),
        value: ERPDocumentsTypesEnum.purchase,
      },
      {
        label: t("documentingNumbering.PurchaseInvoice"),
        value: ERPDocumentsTypesEnum.purchaseInvoice,
      },
      {
        label: t("documentingNumbering.PurchaseInvoiceRefund"),
        value: ERPDocumentsTypesEnum.purchaseInvoiceRefund,
      },
    ],
    [t]
  );

  const resetForm = useCallback(() => {
    setSelectedDocumentType(null);
    setDocumentNumber("");
  }, []);

  const handleSelectDocumentType = (item: DocumentTypeOption | null) => {
    setSelectedDocumentType(item);
  };

  const handleDocumentNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(event.target.value);
  };

  const handleSubmit = async () => {
    if (
      !documentId ||
      !selectedDocumentType ||
      !documentNumber.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        docTypeText: selectedDocumentType.label,
        documentNumber: documentNumber.trim(),
        documentId,
        documentType: selectedDocumentType.value,
        docType: docType
      };

      const response = await addRelatedDocumentApi(callApi, () => { }, payload);

      if (response?.success) {
        alertSuccessAdded();
        onSuccess?.();
        resetForm();
        onClose?.();
      } else {
        alertFaultAdded();
      }
    } catch (error) {
      alertFaultAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    t,
    documentTypeOptions,
    selectedDocumentType,
    documentNumber,
    isSubmitting,
    isPrimaryDisabled:
      !documentId || !selectedDocumentType || !documentNumber.trim(),
    handleSelectDocumentType,
    handleDocumentNumberChange,
    handleSubmit,
    resetForm,
  };
};

export { useAddRelatedDocuments };
