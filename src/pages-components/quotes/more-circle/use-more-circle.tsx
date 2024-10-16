import { useCustomer, useGomakeAxios, useGomakeRouter } from "@/hooks";
import { DOCUMENT_TYPE, QUOTE_STATUSES } from "../enums";
import { LoggerIcon } from "@/pages-components/admin/home/widgets/more-circle/icons/logger";
import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { TickCancelIcon, TickIcon, TickMoveIcon } from "@/icons";
import { DuplicateIcon } from "@/components/icons/icons";
import { downloadPdf } from "@/utils/helpers";
import { getOrderBoardMissionPDF } from "@/services/api-service/generic-doc/documents-api";
import { JobsIcon } from "./icons/jobs";
import { LockIcon } from "./icons/lock";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PayIcon } from "./icons/pay";
import { PaymentIcon } from "./icons/payment";
import { useStyle } from "@/pages-components/quotes/more-circle/style";
import { useRouter } from "next/router";
import { TrackingIcon } from "./icons/tracking";
import { UnLockIcon } from "./icons/unlock";

const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();
  const { CheckPermission } = useUserPermission();

  const getMenuList = ({
    t,
    quote,
    documentType,
    onClickOpenModal,
    onClickPdf,
    onClickDuplicate,
    onClickLoggers,
    onClickOpenIrrelevantModal,
    onClickSendPayment,
    onClickOpenCloseOrderModal,
    onClickOpenCloseOrderNotesModal,
    onClickMakePayment,
    onClickCloseAndTrack,
    onClickOpenPrintPDFModal,
    onOpenCancelReceiptModal,
    onOpenCancelReceiptModalRefund,
    onClickOpenDocument,
    onClickOpenChangeProductionStatusModal
  }) => {
    console.log("quote", quote)
    const documentPath = DOCUMENT_TYPE[documentType];
    const { callApi } = useGomakeAxios();
    const { pathname } = useRouter();

    const onClickGetOrderBoardMissionPDF = async (quoteItem) => {
      const callBack = (res) => {
        if (res?.success) {
          const pdfLink = res.data;
          downloadPdf(pdfLink);
        } else {
        }
      };
      await getOrderBoardMissionPDF(callApi, callBack, {
        documentId: quoteItem?.id,
      });
    };
    const { classes } = useStyle();

    const isCanceledOrder = quote?.statusTitleText === "Order.Canceled";
    const isQuote = documentType === DOCUMENT_TYPE.quote;
    const isOrder = documentType === DOCUMENT_TYPE.order;
    const isDeliveryNote = documentType === DOCUMENT_TYPE.deliveryNote;
    const isDeliveryNoteRefund =
      documentType === DOCUMENT_TYPE.deliveryNoteRefund;
    const isInvoice = documentType === DOCUMENT_TYPE.invoice;
    const isInvoiceRefund = documentType === DOCUMENT_TYPE.invoiceRefund;
    const isPurchaseInvoice = documentType === DOCUMENT_TYPE.purchaseInvoice;
    const isPurchaseOrder = documentType === DOCUMENT_TYPE.purchaseOrder;
    const isReceipt = documentType === DOCUMENT_TYPE.receipt;
    const showNewDuplicate =
      isDeliveryNote || isDeliveryNoteRefund || isInvoice || isInvoiceRefund;
    const isOrdersTracking = pathname === "/ordersTracking";

    return [
      {
        condition: isQuote && quote?.isEditable,
        onClick: () => {
          const isCreateStatus =
            quote?.documentStatus === QUOTE_STATUSES.Create;
          isCreateStatus ? navigate(`/quote`) : onClickOpenModal(quote);
        },
        icon: <EditingIcon />,
        name: t("sales.quote.edit"),
      },
      {
        condition: documentType !== DOCUMENT_TYPE.quote,
        onClick: () => navigate(`/${documentPath}?Id=${quote?.id}`),
        icon: <EditingIcon />,
        name: (
          <a
            style={classes.rowTextStyle}
            href={`/${documentPath}?Id=${quote?.id}`}
          >
            {t("sales.quote.edit")}
          </a>
        ),
      },
      {
        condition: true,
        onClick: () => onClickLoggers(quote),
        icon: <LoggerIcon />,
        name: t("sales.quote.loggers"),
      },
      {
        condition: isDeliveryNote,
        onClick: () => onClickOpenPrintPDFModal(quote),
        icon: <PDFIcon />,
        name: t("sales.quote.pdf"),
      },
      {
        condition: !isDeliveryNote,
        onClick: () => onClickPdf(quote?.id),
        icon: <PDFIcon />,
        name: t("sales.quote.pdf"),
      },
      {
        condition: isOrder && quote?.isCanClose && !isCanceledOrder,
        onClick: () => onClickGetOrderBoardMissionPDF(quote),
        icon: <PDFIcon />,
        name: t("sales.quote.boardMissionsPdf"),
      },
      {
        condition: isOrder || isQuote,
        onClick: () => onClickDuplicate(quote?.id),
        icon: <DuplicateIcon />,
        name: t("sales.quote.duplicate"),
      },
      {
        condition: showNewDuplicate,
        onClick: () =>
          navigate(
            `/${documentPath}?isNewCreation=true&documentToDuplicateId=${quote?.id}`
          ),
        icon: <DuplicateIcon />,
        name: t("sales.quote.duplicate"),
      },
      {
        condition:
          isOrder &&
          quote?.isCanClose &&
          CheckPermission(Permissions.SHOW_BOARD_MISSIONS),
        onClick: () => navigate(`/jobs?orderNumber=${quote?.number}`),
        icon: <JobsIcon />,
        name: (
          <a
            style={classes.rowTextStyle}
            href={`/jobs?orderNumber=${quote?.number}`}
          >
            {t("sales.quote.jobs")}
          </a>
        ),
      },
      {
        condition: isOrder && quote?.isCanClose && !isCanceledOrder,
        onClick: () => {
          quote?.productionStatus ? navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`) : onClickOpenChangeProductionStatusModal(quote)
        },
        icon: <TickIcon />,
        name: t("sales.quote.closeAsDeliveryNote"),
      },
      {
        condition:
          (isOrder && quote?.isCanClose && !isCanceledOrder) ||
          (isDeliveryNote && quote?.isCanClose),
        onClick: () => {
          const path = isOrder
            ? `/invoice?isNewCreation=true&orderId=${quote?.id}`
            : `/invoice?isNewCreation=true&deliveryNoteId=${quote?.id}`;
          navigate(path);
        },
        icon: <TickIcon />,
        name: t("sales.quote.closeAsInvoice"),
      },
      {
        condition: isOrder && quote?.isCanClose && !isCanceledOrder,
        onClick: () => navigate(`/purchaseOrders?orderNumber=${quote?.number}`),
        icon: <TickMoveIcon />,
        name: t("sales.quote.purchaseOrders"),
      },
      {
        condition: isDeliveryNote && quote?.isCanClose,
        onClick: () =>
          navigate(
            `/deliveryNoteRefund?isNewCreation=true&documentId=${quote?.id}`
          ),
        icon: <TickIcon />,
        name: t("sales.quote.createDeliveryNoteRefund"),
      },
      {
        condition: isInvoice && quote?.isCanClose,
        onClick: () =>
          navigate(`/invoiceRefund?isNewCreation=true&documentId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.createInvoiceRefund"),
      },
      {
        condition: isPurchaseInvoice && quote?.isCanClose,
        onClick: () =>
          navigate(
            `/purchaseInvoiceRefund?isNewCreation=true&documentId=${quote?.id}`
          ),
        icon: <TickIcon />,
        name: t("sales.quote.createPurchaseInvoiceRefund"),
      },
      {
        condition: isPurchaseOrder && quote?.isCanClose,
        onClick: () =>
          navigate(`/purchaseInvoice?isNewCreation=true&orderId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.closeAsPurchaseInvoice"),
      },
      {
        condition:
          (isOrder && quote?.isCanClose && !isCanceledOrder) ||
          (isDeliveryNote && quote?.isCanClose) ||
          (isInvoice && quote?.isCanClose),
        onClick: () =>
          quote?.closeOrderNotes && quote?.closeOrderNotes.trim() !== ""
            ? onClickOpenCloseOrderNotesModal(quote)
            : onClickOpenCloseOrderModal(quote),
        icon: <LockIcon />,
        name: t("sales.quote.close"),
      },
      {
        condition:
          isOrder && (quote?.isCanCancelManualClose || isCanceledOrder),
        onClick: () => onClickOpenDocument(quote),
        icon: <UnLockIcon />,
        name: t("sales.quote.open"),
      },
      {
        condition: isOrder && quote?.isCanCloseForTracking && !isCanceledOrder,
        onClick: () => onClickCloseAndTrack(quote),
        icon: <TrackingIcon />,
        name: t("sales.quote.closeAndTrack"),
      },
      {
        condition:
          (isOrder && quote?.isCanClose && !isCanceledOrder) ||
          (isReceipt && quote?.status !== "Receipt.Canceled"),
        onClick: () =>
          isOrder
            ? onClickOpenIrrelevantModal(quote)
            : quote?.creditCardTotal > 0
              ? onOpenCancelReceiptModalRefund(quote)
              : onOpenCancelReceiptModal(quote),
        icon: <TickCancelIcon />,
        name: t("sales.quote.cancel"),
      },
      // {
      //   condition: isInvoice && quote?.isCanClose,
      //   onClick: () => navigate(`/receipt?isNewCreation=true&documentNumber=${quote?.number}&ClientId=${quote?.customerId}`),
      //   icon: <PayIcon />,
      //   name: t("sales.quote.pay")
      // },
      {
        condition: isOrder && quote?.isCanClose && !isCanceledOrder,
        onClick: () => onClickSendPayment(quote),
        icon: <PaymentIcon />,
        name: t("sales.quote.sendPayment"),
      },
      {
        condition:
          isOrdersTracking &&
          parseFloat(quote?.totalPrice) !== parseFloat(quote?.sumApplied),
        onClick: () => onClickMakePayment(quote),
        icon: <PaymentIcon />,
        name: t("sales.quote.makePayment"),
      },
    ];
  };

  return {
    user,
    navigate,
    getMenuList,
  };
};

export { useMoreCircle };
