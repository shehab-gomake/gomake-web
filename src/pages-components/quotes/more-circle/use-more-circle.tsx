import { useCustomer, useGomakeRouter } from "@/hooks";
import { DOCUMENT_TYPE, QUOTE_STATUSES } from "../enums";
import { LoggerIcon } from "@/pages-components/admin/home/widgets/more-circle/icons/logger";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { TickIcon } from "@/icons";
const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();

  const getMenuList = ({ quote, documentType, onClickOpenModal, onClickPdf, onClickDuplicate, onClickLoggers, t }) => {
    const documentPath = DOCUMENT_TYPE[documentType];
    const showNewDuplicate = documentType === DOCUMENT_TYPE.deliveryNote || documentType === DOCUMENT_TYPE.deliveryNoteRefund || documentType === DOCUMENT_TYPE.invoice || documentType === DOCUMENT_TYPE.invoiceRefund;
    return [
      {
        condition: documentType === DOCUMENT_TYPE.quote && ((quote?.documentStatus === QUOTE_STATUSES.Create && quote?.userID === user?.id) || quote?.documentStatus === QUOTE_STATUSES.Open),
        onClick: () => {
          const isCreateStatus = quote?.documentStatus === QUOTE_STATUSES.Create;
          isCreateStatus ? navigate(`/quote`) : onClickOpenModal(quote);
        },
        icon: <EditingIcon />,
        name: t("sales.quote.edit")
      },
      {
        condition: documentType !== DOCUMENT_TYPE.quote,
        onClick: () => navigate(`/${documentPath}?Id=${quote?.id}`),
        icon: <EditingIcon />,
        name: t("sales.quote.edit")
      },
      {
        condition: true,
        onClick: () => onClickLoggers(quote),
        icon: <LoggerIcon />,
        name: t("sales.quote.loggers")
      },
      {
        condition: true,
        onClick: () => onClickPdf(quote?.id),
        icon: <PDFIcon />,
        name: t("sales.quote.pdf")
      },
      {
        condition: documentType === DOCUMENT_TYPE.order || documentType === DOCUMENT_TYPE.quote,
        onClick: () => onClickDuplicate(quote?.id),
        icon: <ConvertIcon />,
        name: t("sales.quote.duplicate")
      },
      {
        condition: showNewDuplicate,
        onClick: () => navigate(`/${documentPath}?isNewCreation=true&documentToDuplicateId=${quote?.id}`),
        icon: <ConvertIcon />,
        name: t("sales.quote.duplicate")
      },
      {
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose,
        onClick: () => navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.closeAsDeliveryNote")
      },
      {
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose,
        onClick: () => navigate(`/invoice?isNewCreation=true&orderId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.closeAsInvoice")
      },
      {
        condition: documentType === DOCUMENT_TYPE.deliveryNote && quote?.isCanClose,
        onClick: () => navigate(`/invoice?isNewCreation=true&deliveryNoteId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.closeAsInvoice")
      },
      {
        condition: documentType === DOCUMENT_TYPE.deliveryNote && quote?.isCanClose,
        onClick: () => navigate(`/deliveryNoteRefund?isNewCreation=true&documentId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.createDeliveryNoteRefund")
      },
      {
        condition: documentType === DOCUMENT_TYPE.invoice && quote?.isCanClose,
        onClick: () => navigate(`/invoiceRefund?isNewCreation=true&documentId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.createInvoiceRefund")
      },
      {
        condition: documentType === DOCUMENT_TYPE.purchaseInvoice && quote?.isCanClose,
        onClick: () => navigate(`/purchaseInvoiceRefund?isNewCreation=true&documentId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.createPurchaseInvoiceRefund")
      },
      {
        condition: documentType === DOCUMENT_TYPE.purchaseOrder && quote?.isCanClose,
        onClick: () => navigate(`/purchaseInvoice?isNewCreation=true&documentId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.closeAsPurchaseInvoice")
      }
    ];
  };

  return {
    user,
    navigate,
    getMenuList
  };
};

export { useMoreCircle };
