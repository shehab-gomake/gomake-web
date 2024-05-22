import { useCustomer, useGomakeRouter } from "@/hooks";
import { DOCUMENT_TYPE, QUOTE_STATUSES } from "../enums";
import { LoggerIcon } from "@/pages-components/admin/home/widgets/more-circle/icons/logger";
import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { TickCloceIcon, TickIcon, TickMoveIcon } from "@/icons";
import { DuplicateIcon } from "@/components/icons/icons";
import { useRecoilValue } from "recoil";
import { userQouteState } from "@/store";
import { useState } from "react";

const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();
  const userQuote = useRecoilValue<boolean>(userQouteState);
  const [isCancel, setIsCancel] = useState(true)
  const getMenuList = ({
    quote,
    documentType,
    onClickOpenModal,
    onClickPdf,
    onClickDuplicate,
    onClickLoggers,
    t,
    onClickOpenIrrelevantModal,
    onClickOpenDeliveryTimeModal,
    onClickOpenPriceModal,
    CloseDocument
  }) => {
    const documentPath = DOCUMENT_TYPE[documentType];
    const showNewDuplicate = documentType === DOCUMENT_TYPE.deliveryNote || documentType === DOCUMENT_TYPE.deliveryNoteRefund || documentType === DOCUMENT_TYPE.invoice || documentType === DOCUMENT_TYPE.invoiceRefund;
    return [
      {
        condition: documentType === DOCUMENT_TYPE.quote && ((quote?.documentStatus === QUOTE_STATUSES.Create && userQuote) || quote?.documentStatus === QUOTE_STATUSES.Open),
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
        icon: <DuplicateIcon />,
        name: t("sales.quote.duplicate")
      },
      {
        condition: showNewDuplicate,
        onClick: () => navigate(`/${documentPath}?isNewCreation=true&documentToDuplicateId=${quote?.id}`),
        icon: <DuplicateIcon />,
        name: t("sales.quote.duplicate")
      },
      {
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose,
        onClick: () => navigate(`/board-missions?orderNumber=${quote?.number}`),
        icon: <TickMoveIcon />,
        name: t("sales.quote.jobs")
      },
      {
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled",
        onClick: () => navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.closeAsDeliveryNote")
      },
      {
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled",
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
        onClick: () => navigate(`/purchaseInvoice?isNewCreation=true&orderId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.closeAsPurchaseInvoice")
      },
      {
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled",
        onClick: () => CloseDocument(quote),
        icon: <TickCloceIcon />,
        name: t("sales.quote.closed")
      },
      {
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled",
        onClick: () => onClickOpenIrrelevantModal(quote),
        icon: <TickCloceIcon />,
        name: t("sales.quote.cancel")
      },

      // {
      //   condition: !isCancel,
      //   onClick: () => onClickOpenIrrelevantModal(quote),
      //   icon: <TickCloceIcon />,
      //   name: t("sales.quote.irrelevant")
      // },
      // {
      //   condition: !isCancel,
      //   onClick: () => onClickOpenPriceModal(quote),
      //   icon: <TickCloceIcon />,
      //   name: t("sales.quote.price")
      // },
      // {
      //   condition: !isCancel,
      //   onClick: () => onClickOpenDeliveryTimeModal(quote),
      //   icon: <TickCloceIcon />,
      //   name: t("sales.quote.deliveryTime")
      // },
    ];
  };

  return {
    user,
    isCancel,
    navigate,
    getMenuList
  };
};

export { useMoreCircle };
