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
import { PaymentIcon } from "./icons/payment";
import { useStyle } from "@/pages-components/quotes/more-circle/style";
import { useRouter } from "next/router";
import { TrackingIcon } from "./icons/tracking";
import { UnLockIcon } from "./icons/unlock";
import { useSetRecoilState } from "recoil";
import { isSelectedCLoseAsDeleveryNoteState } from "@/pages/customers/customer-states";
import { PauseIcon } from "@/icons/pause-icon";
import { ResumeIcon } from "@/icons/resume-icon";

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
    onClickOpenChangeProductionStatusModal,
    onClickPauseOrResume,
  }) => {
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
    const setIsSelectedCLoseAsDeleveryNote = useSetRecoilState(
      isSelectedCLoseAsDeleveryNoteState
    );

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

    const isCanceledOrder = quote?.statusTitleText === "Order.Canceled";
    const isClosedOrder = quote?.statusTitleText === "Order.Closed";
    const isPauseOrder = quote?.statusTitleText === "Order.Paused";

    return [
      {
        condition: !isPauseOrder && isQuote && quote?.isEditable,
        onClick: () => {
          const isCreateStatus =
            quote?.documentStatus === QUOTE_STATUSES.Create;
          isCreateStatus ? navigate(`/quote`) : onClickOpenModal(quote);
        },
        icon: <EditingIcon />,
        name: t("sales.quote.edit"),
      },
      {
        condition: !isPauseOrder && documentType !== DOCUMENT_TYPE.quote,
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
        condition: !isPauseOrder && true,
        onClick: () => onClickLoggers(quote),
        icon: <LoggerIcon />,
        name: t("sales.quote.loggers"),
      },
      {
        condition: !isPauseOrder && isDeliveryNote,
        onClick: () => onClickOpenPrintPDFModal(quote),
        icon: <PDFIcon />,
        name: t("sales.quote.pdf"),
      },
      {
        condition: !isPauseOrder && !isDeliveryNote,
        onClick: () => onClickPdf(quote?.id),
        icon: <PDFIcon />,
        name: t("sales.quote.pdf"),
      },
      {
        condition:
          !isPauseOrder && isOrder && quote?.isCanClose && !isCanceledOrder,
        onClick: () => onClickGetOrderBoardMissionPDF(quote),
        icon: <PDFIcon />,
        name: t("sales.quote.boardMissionsPdf"),
      },
      {
        condition: (!isPauseOrder && isOrder) || isQuote,
        onClick: () => onClickDuplicate(quote?.id),
        icon: <DuplicateIcon />,
        name: t("sales.quote.duplicate"),
      },
      {
        condition: !isPauseOrder && showNewDuplicate,
        onClick: () =>
          navigate(
            `/${documentPath}?isNewCreation=true&documentToDuplicateId=${quote?.id}`
          ),
        icon: <DuplicateIcon />,
        name: t("sales.quote.duplicate"),
      },
      {
        condition:
          !isPauseOrder &&
          isOrder &&
          quote?.isCanClose &&
          CheckPermission(Permissions.SHOW_BOARD_MISSIONS),
        onClick: () => navigate(`/jobs?finalPatternSearch=${quote?.number}`),
        icon: <JobsIcon />,
        name: (
          <a
            style={classes.rowTextStyle}
            href={`/jobs?finalPatternSearch=${quote?.number}`}
          >
            {t("sales.quote.jobs")}
          </a>
        ),
      },
      {
        condition:
          !isPauseOrder && isOrder && quote?.isCanClose && !isCanceledOrder,
        onClick: () => {
          quote?.productionStatus
            ? navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`)
            : onClickOpenChangeProductionStatusModal(quote);
          setIsSelectedCLoseAsDeleveryNote(true);
        },
        icon: <TickIcon />,
        name: t("sales.quote.closeAsDeliveryNote"),
      },
      {
        condition:
          (!isPauseOrder && isOrder && quote?.isCanClose && !isCanceledOrder) ||
          (isDeliveryNote && quote?.isCanClose),
        onClick: () => {
          if (isOrder) {
            if (quote?.productionStatus) {
              navigate(`/invoice?isNewCreation=true&orderId=${quote?.id}`);
            } else {
              onClickOpenChangeProductionStatusModal(quote);
              setIsSelectedCLoseAsDeleveryNote(false);
            }
          } else {
            navigate(`/invoice?isNewCreation=true&deliveryNoteId=${quote?.id}`);
          }
        },
        icon: <TickIcon />,
        name: t("sales.quote.closeAsInvoice"),
      },
      {
        condition:
          !isPauseOrder && isOrder && quote?.isCanClose && !isCanceledOrder,
        onClick: () => navigate(`/purchaseOrders?orderNumber=${quote?.number}`),
        icon: <TickMoveIcon />,
        name: t("sales.quote.purchaseOrders"),
      },
      {
        condition: !isPauseOrder && isDeliveryNote && quote?.isCanClose,
        onClick: () =>
          navigate(
            `/deliveryNoteRefund?isNewCreation=true&documentId=${quote?.id}`
          ),
        icon: <TickIcon />,
        name: t("sales.quote.createDeliveryNoteRefund"),
      },
      {
        condition: !isPauseOrder && isInvoice && quote?.isCanClose,
        onClick: () =>
          navigate(`/invoiceRefund?isNewCreation=true&documentId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.createInvoiceRefund"),
      },
      {
        condition: !isPauseOrder && isPurchaseInvoice && quote?.isCanClose,
        onClick: () =>
          navigate(
            `/purchaseInvoiceRefund?isNewCreation=true&documentId=${quote?.id}`
          ),
        icon: <TickIcon />,
        name: t("sales.quote.createPurchaseInvoiceRefund"),
      },
      {
        condition: !isPauseOrder && isPurchaseOrder && quote?.isCanClose,
        onClick: () =>
          navigate(`/purchaseInvoice?isNewCreation=true&orderId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.closeAsPurchaseInvoice"),
      },
      {
        condition:
          (!isPauseOrder && isOrder && quote?.isCanClose && !isCanceledOrder) ||
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
          !isPauseOrder &&
          isOrder &&
          (quote?.isCanCancelManualClose || isCanceledOrder),
        onClick: () => onClickOpenDocument(quote),
        icon: <UnLockIcon />,
        name: t("sales.quote.open"),
      },
      {
        condition:
          !isPauseOrder &&
          isOrder &&
          quote?.isCanCloseForTracking &&
          !isCanceledOrder,
        onClick: () => onClickCloseAndTrack(quote),
        icon: <TrackingIcon />,
        name: t("sales.quote.closeAndTrack"),
      },
      {
        condition:
          (!isPauseOrder && isOrder && quote?.isCanClose && !isCanceledOrder) ||
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
      //   condition: !isPauseOrder &&   isInvoice && quote?.isCanClose,
      //   onClick: () => navigate(`/receipt?isNewCreation=true&documentNumber=${quote?.number}&ClientId=${quote?.customerId}`),
      //   icon: <PayIcon />,
      //   name: t("sales.quote.pay")
      // },
      {
        condition:
          !isPauseOrder && isOrder && quote?.isCanClose && !isCanceledOrder,
        onClick: () => onClickSendPayment(quote),
        icon: <PaymentIcon />,
        name: t("sales.quote.sendPayment"),
      },
      {
        condition:
          !isPauseOrder &&
          isOrdersTracking &&
          parseFloat(quote?.totalPrice) !== parseFloat(quote?.sumApplied),
        onClick: () => onClickMakePayment(quote),
        icon: <PaymentIcon />,
        name: t("sales.quote.makePayment"),
      },
      {
        condition:
          isOrder && !isCanceledOrder && !isPauseOrder && !isClosedOrder,
        onClick: () => onClickPauseOrResume(quote?.id),
        icon: <PauseIcon />,
        name: t("sales.quote.pause"),
      },
      {
        condition: isOrder && isPauseOrder,
        onClick: () => onClickPauseOrResume(quote?.id),
        icon: <ResumeIcon />,
        name: t("sales.quote.resume"),
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
