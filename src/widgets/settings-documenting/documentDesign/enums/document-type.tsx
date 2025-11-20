import { ERPDocumentsTypesEnum } from "@/enums/document-type-enum";

export function renderDocumentTypeForSourceDocumentNumber(
  documentType: ERPDocumentsTypesEnum
): string {
  switch (documentType) {
    case ERPDocumentsTypesEnum.order:
      return "SourceDocument.order";
    case ERPDocumentsTypesEnum.invoice:
      return "SourceDocument.invoice";
    case ERPDocumentsTypesEnum.deliveryNote:
      return "SourceDocument.deliveryNotes";
    case ERPDocumentsTypesEnum.purchase:
      return "SourceDocument.purchase";
    case ERPDocumentsTypesEnum.invoiceRefund:
      return "SourceDocument.invoiceRefund";
    case ERPDocumentsTypesEnum.receipt:
      return "SourceDocument.receipt";
    case ERPDocumentsTypesEnum.journalEntry:
      return "SourceDocument.journalEntry";
    case ERPDocumentsTypesEnum.purchaseInvoice:
      return "SourceDocument.purchaseInvoice";
    case ERPDocumentsTypesEnum.purchaseInvoiceRefund:
      return "SourceDocument.purchaseInvoiceRefund";
    case ERPDocumentsTypesEnum.foreignJournalEntry:
      return "SourceDocument.foreignJournalEntry";
    case ERPDocumentsTypesEnum.deliveryNoteRefund:
      return "SourceDocument.deliveryNoteRefund";
    case ERPDocumentsTypesEnum.quote:
      return "SourceDocument.quote";
    case ERPDocumentsTypesEnum.externalInvoice:
      return "SourceDocument.externalInvoice";
    case ERPDocumentsTypesEnum.all:
      return "SourceDocument.all";
    case ERPDocumentsTypesEnum.externalPayment:
      return "SourceDocument.externalPayment";
    case ERPDocumentsTypesEnum.boardMission:
      return "SourceDocument.boardMission";
    case ERPDocumentsTypesEnum.agingReport:
      return "SourceDocument.agingReport";
    case ERPDocumentsTypesEnum.ledgerReport:
      return "SourceDocument.ledgerReport";
    case ERPDocumentsTypesEnum.salesReport:
      return "SourceDocument.salesReport";
    case ERPDocumentsTypesEnum.supplierPayment:
      return "SourceDocument.supplierPayment";
    case ERPDocumentsTypesEnum.proformaInvoice:
      return "SourceDocument.proformaInvoice";
    default:
      return "SourceDocument.unknown";
  }
}

export function renderURLDocumentType(
  documentType: ERPDocumentsTypesEnum,
  documentId
): string {
  switch (documentType) {
    case ERPDocumentsTypesEnum.order:
      return `/order?Id=${documentId}`;
    case ERPDocumentsTypesEnum.invoice:
      return `/invoice?Id=${documentId}`;
    case ERPDocumentsTypesEnum.deliveryNote:
      return `/deliveryNote?Id=${documentId}`;
    case ERPDocumentsTypesEnum.purchase:
      return `/purchaseOrder?Id=${documentId}`;
    case ERPDocumentsTypesEnum.invoiceRefund:
      return `/invoiceRefund?Id=${documentId}`;
    case ERPDocumentsTypesEnum.purchaseInvoice:
      return `/purchaseInvoice?Id=${documentId}`;
    case ERPDocumentsTypesEnum.purchaseInvoiceRefund:
      return `/purchaseInvoiceRefund?Id=${documentId}`;
    case ERPDocumentsTypesEnum.foreignJournalEntry:
      return "Foreign Journal Entry";
    case ERPDocumentsTypesEnum.deliveryNoteRefund:
      return `/deliveryNoteRefund?Id=${documentId}`;
    case ERPDocumentsTypesEnum.proformaInvoice:
      return `/proformaInvoice?Id=${documentId}`;
    default:
      return "Unknown Document Type";
  }
}
