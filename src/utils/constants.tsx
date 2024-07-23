import { ETabsIcon } from "@/enums";
import { ErrorIcon, FinishingIcon, MessageLogsIcon, PricingIcon, PrintingDetailsIcon, SuccessIcon, WarningLogsIcon } from "@/icons";
import { DELIVERY_NOTE_STATUSES, DOCUMENT_TYPE, QUOTE_STATUSES } from "@/pages-components/quotes/enums";
import { ECalculationLogType } from "@/widgets/product-pricing-widget/enums";
import { Button } from "@mui/material";

export const _renderActiveIcon = (icon) => {
  if (icon === ETabsIcon.PRINTING_DETAILS) {
    return <PrintingDetailsIcon />;
  }
  if (icon === ETabsIcon.FINISHING) {
    return <FinishingIcon />;
  }
  if (icon === ETabsIcon.PRICING) {
    return <PricingIcon />;
  }
};

export const _renderUnActiveIcon = (icon) => {
  if (icon === ETabsIcon.PRINTING_DETAILS) {
    return <PrintingDetailsIcon stroke="#1C1D58" />;
  }
  if (icon === ETabsIcon.FINISHING) {
    return <FinishingIcon stroke="#1C1D58" />;
  }
  if (icon === ETabsIcon.PRICING) {
    return <PricingIcon stroke="#1C1D58" />;
  }
};

export const compareStrings = (string1, string2) => {
  return string1?.toLowerCase() === string2?.toLowerCase();
};

export const _renderQuoteStatus = (status: number, quote: any, t: any) => {
  if (status === QUOTE_STATUSES.Create) {
    if (quote?.agentId) {
      return t("sales.quote.create");
    } else {
      return t("sales.quote.createdBy", { name: quote?.userName });
    }
  }
  if (status === QUOTE_STATUSES.Open) {
    return t("sales.quote.open");
  }
  if (status === QUOTE_STATUSES.Closed) {
    return t("sales.quote.closed");
  }
  if (status === QUOTE_STATUSES.Canceled) {
    return t("sales.quote.canceled");
  }
  if (status === QUOTE_STATUSES.Waiting) {
    return t("sales.quote.waiting");
  }
  if (status === QUOTE_STATUSES.Approved) {
    return t("sales.quote.approved");
  }
  if (status === QUOTE_STATUSES.CanceledIrrelvant) {
    return t("sales.quote.canceledIrrelvant");
  }
  if (status === QUOTE_STATUSES.CanceledPrice) {
    return t("sales.quote.canceledPrice");
  }
  if (status === QUOTE_STATUSES.CanceledDeliveryTime) {
    return t("sales.quote.canceledDeliveryTime");
  }
  if (status === QUOTE_STATUSES.CanceledOther) {
    return t("sales.quote.canceledOther");
  }
  if (status === QUOTE_STATUSES.ApprovedByManager) {
    return t("sales.quote.approvedByManager");
  }
  if (status === QUOTE_STATUSES.RejectedByManager) {
    return t("sales.quote.rejectedByManager");
  }
  if (status === QUOTE_STATUSES.PartialClosed) {
    return t("sales.quote.partialClosed");
  }
  if (status === QUOTE_STATUSES.WaitForPrintHouseConfirm) {
    return t("sales.quote.waitForPrintHouseConfirm");
  }
};

// for receipts / delivery note / delivery note refund
export const _renderDocumentStatus = (status: number, t: any) => {
  if (status === DELIVERY_NOTE_STATUSES.Open) {
    return t("sales.quote.open");
  }
  if (status === DELIVERY_NOTE_STATUSES.Canceled) {
    return t("sales.quote.canceled");
  }
  if (status === DELIVERY_NOTE_STATUSES.Created) {
    return t("sales.quote.created");
  }
  if (status === DELIVERY_NOTE_STATUSES.Refunded) {
    return t("sales.quote.refunded");
  }
  if (status === DELIVERY_NOTE_STATUSES.Confirmed) {
    return t("sales.quote.confirmed");
  }
  if (status === DELIVERY_NOTE_STATUSES.Rejected) {
    return t("sales.quote.rejected");
  }
  if (status === DELIVERY_NOTE_STATUSES.PartialRefunded) {
    return t("sales.quote.partialRefunded");
  }
  if (status === DELIVERY_NOTE_STATUSES.ClosedAsInvoice) {
    return t("sales.quote.closedAsInvoice");
  }
  if (status === DELIVERY_NOTE_STATUSES.ClosedByMultiDocuments) {
    return t("sales.quote.closedByMultiDocuments");
  }
  if (status === DELIVERY_NOTE_STATUSES.ManualClose) {
    return t("sales.quote.manualClose");
  }
};

export const _renderStatus = (docType: DOCUMENT_TYPE , document: any, t: any, navigate: any): JSX.Element => {
  if (document) {

    let statusContent: JSX.Element | null = null;
    const docTypeText = DOCUMENT_TYPE[docType].charAt(0).toUpperCase() + DOCUMENT_TYPE[docType].slice(1);
    const openStatus = `${docTypeText}.Open`;

    if (document?.statusTitleText === openStatus || document?.statusTitleText === "DeliveryNote.Open" || document?.statusTitleText === "Invoice.Open" || document?.statusTitleText === "PurchaseOrder.Open") {
      return <div style={{ fontWeight: 'bold' }}>{t("sales.quote.open")}</div>;
    }
    else if (document?.statusTitleText === "Quote.Create") {
      if (document?.agentId) {
        return <div style={{ fontWeight: 'bold' }}>{t("sales.quote.create")}</div>;
      } else {
        return <div style={{ fontWeight: 'bold' }}>{t("sales.quote.createdBy", { name: document?.userName })}</div>;
      }
    }
    else if (document.externalDocumentNumber) {
    const externalDocument = document.externalDocumentNumber ;
    let result: JSX.Element[] = [];
    if (externalDocument.length > 0) {
      result.push(
        <div>
          {t(`documentStatus.${document.titleExternalDocumentNumber}.title`)}: {externalDocument}
        </div>
      ); 
    }
    statusContent = <>{result}</>;
  }
    else if ((document.documentNumbers && document.documentNumbers.length > 0) ||
      (document.secondDocumentNumbers && document.secondDocumentNumbers.length > 0)) {

      const firstDocuments = document.documentNumbers ? document.documentNumbers.map((item: any, index: number) => (
        <span key={index}>
          <Button
            sx={{
              minWidth: "auto",
              height: "auto",
              padding: 0,
              color: "#2e3092"
            }}
            variant={'text'}
            onClick={() => navigate(`/${document.titleDocumentNumber.charAt(0).toLowerCase() + document.titleDocumentNumber.slice(1)}?Id=${item.documentId}`)}>
            {item.documentNumber}</Button>
          {index < document.documentNumbers.length - 1 && ', '}
        </span>
      )) : [];

      const secondDocuments = document.secondDocumentNumbers ? document.secondDocumentNumbers.map((item: any, index: number) => (
        <span key={index}>
          <Button
            sx={{
              minWidth: "auto",
              height: "auto",
              padding: 0,
              color: "#2e3092"
            }}
            variant={'text'}
            onClick={() => navigate(`/${document.titleSecondDocumentNumber.charAt(0).toLowerCase() + document.titleSecondDocumentNumber.slice(1)}?Id=${item.documentId}`)}>
            {item.documentNumber}</Button>
          {index < document.secondDocumentNumbers.length - 1 && ', '}
        </span>
      )) : [];

      let result: JSX.Element[] = [];

      if (firstDocuments.length > 0) {
        result.push(
          <div key="first-documents">
            {t(`documentStatus.${document.titleDocumentNumber}.title`)}: {firstDocuments}
          </div>
        );
      }

      if (secondDocuments.length > 0) {
        result.push(
          <div key="second-documents">
            {t(`documentStatus.${document.titleSecondDocumentNumber}.title`)}: {secondDocuments}
          </div>
        );
      }
      statusContent = <>{result}</>;
    }

    return (
      <div>
        {<div style={{ fontWeight: 'bold' }}>{t(`documentStatus.${document.statusTitleText}`)}</div>}
        {statusContent}
      </div>
    );
  }
  return <></>;
};



export function getParameterByParameterCode(subProductArray, code) {
  for (let i = 0; i < subProductArray.length; i++) {
    const parameters = subProductArray[i].parameters;
    for (let j = 0; j < parameters.length; j++) {
      if (parameters[j].parameterCode === code) {
        return parameters[j];
      }
    }
  }
  return null;
}

export const _renderIconLogs = (type, width, height) => {
  if (type === ECalculationLogType.ERROR) {
    return <ErrorIcon width={width} height={height} />;
  } else if (type === ECalculationLogType.MESSAGE) {
    return <MessageLogsIcon width={width} height={height} />;
  } else if (type === ECalculationLogType.SUCCESS) {
    return <SuccessIcon width={width} height={height} />;
  } else if (type === ECalculationLogType.WARN) {
    return <WarningLogsIcon width={width} height={height} />;
  }
};