import {
  useCustomer,
  useGomakeAxios,
  useGomakeRouter,
  useSnackBar,
} from "@/hooks";
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
import { useStyle } from "@/pages-components/quotes/more-circle/style";
import { useRouter } from "next/router";
import { TrackingIcon } from "./icons/tracking";
import { UnLockIcon } from "./icons/unlock";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isSelectedCLoseAsDeliveryNoteState } from "@/pages/customers/customer-states";
import { PauseIcon } from "@/icons/pause-icon";
import { ResumeIcon } from "@/icons/resume-icon";
import { PayIcon } from "./icons/pay";
import { StartProductionIcon } from "./icons/start-productions";
import { printHouseProfile } from "@/store/print-house-profile";
import { addOrderBoardMissionsToFileUploaderApi } from "@/services/api-service/board-missions/board-missions-table";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
} from "@/store/file-uploader-state";

const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();
  const { CheckPermission } = useUserPermission();
  const isSendPaymentToClient = CheckPermission(
    Permissions.SHOW_PRODUCTION_FLOOR
  );
  const canCloseDocumentManually = CheckPermission(
    Permissions.CAN_CLOSE_MANUALLY
  );
  const [companyProfile] = useRecoilState(printHouseProfile);
  const [, setOpenFileUploader] = useRecoilState(openFileUploaderList);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const setIsSelectedCLoseAsDeliveryNote = useSetRecoilState(
    isSelectedCLoseAsDeliveryNoteState
  );
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
    onOpenDuplicateModal,
    onClickStartProduction,
  }) => {
    const documentPath = DOCUMENT_TYPE[documentType];
    const isSupplierPayments = documentType === DOCUMENT_TYPE.supplierPayments;

    const getDocumentPath = (id?: string, extraParams: string = "") => {
      if (isSupplierPayments) {
        return `/${
          DOCUMENT_TYPE[DOCUMENT_TYPE.receipt]
        }?isOutgoingPayments=true${id ? `&Id=${id}` : ""}${extraParams}`;
      }
      return `/${documentPath}${id ? `?Id=${id}` : ""}${extraParams}`;
    };

    const { callApi } = useGomakeAxios();
    const { pathname } = useRouter();
    const { alertFaultAdded } = useSnackBar();

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

    const addOrderBoardMissionsToFileUploader = async (orderId) => {
      const callBack = (res) => {
        if (res?.success) {
          setOpenFileUploader(true);
          setShowFileUploader(true);
        } else {
          alertFaultAdded();
        }
      };
      await addOrderBoardMissionsToFileUploaderApi(callApi, callBack, {
        orderId: orderId,
        connectionId: connectionId,
      });
    };
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
    const isPrePaymentOrder =
      isOrder && quote?.statusTitleText === "Order.WaitingForPayment";

    const isShowLogs = CheckPermission(Permissions.SHOW_LOGS);
    const isSendPaymentToClient = CheckPermission(
      Permissions.SEND_PAYMENT_TO_CLIENT
    );
    const isShowPurchaseOrders = CheckPermission(
      Permissions.SHOW_PURCHASE_ORDERS
    );

    const isCreateStatus =
      isQuote && quote?.documentStatus === QUOTE_STATUSES.Create;

    return [
      {
        condition: !isPauseOrder && isQuote && quote?.isEditable,
        onClick: () => {
          isCreateStatus ? navigate(`/quote`) : onClickOpenModal(quote);
        },
        icon: <EditingIcon />,
        name: t("sales.quote.edit"),
        isLink: isCreateStatus,
        href: `/quote`,
      },

      {
        condition:
          !isPauseOrder &&
          documentType !== DOCUMENT_TYPE.quote &&
          quote?.isEditable,
        onClick: () => navigate(getDocumentPath(quote?.id)),
        icon: <EditingIcon />,
        name: t("sales.quote.edit"),
        isLink: true,
        href: getDocumentPath(quote?.id),
      },
      {
        condition:
          !isPauseOrder &&
          isOrder &&
          quote?.isCanClose &&
          quote?.isWaitingForPayment &&
          CheckPermission(Permissions.SHOW_BOARD_MISSIONS),
        onClick: () => onClickStartProduction(quote),
        icon: <StartProductionIcon />,
        name: t("sales.tables.startProduction"),
      },
      {
        condition: !isPauseOrder && isShowLogs,
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
        onClick: () =>
          onClickPdf(isReceipt || isSupplierPayments ? quote : quote?.id),
        icon: <PDFIcon />,
        name: t("sales.quote.pdf"),
      },
      {
        condition: !isPauseOrder && isOrder && !isCanceledOrder,
        onClick: () => onClickGetOrderBoardMissionPDF(quote),
        icon: <PDFIcon />,
        name: t("sales.quote.boardMissionsPdf"),
      },
      {
        condition: (!isPauseOrder && isOrder) || isQuote,
        onClick: () => {
          isOrder ? onOpenDuplicateModal(quote) : onClickDuplicate(quote?.id);
        },
        icon: <DuplicateIcon />,
        name: t("sales.quote.duplicate"),
      },
      // {
      //   condition: !isPauseOrder && showNewDuplicate,
      //   onClick: () =>
      //     navigate(
      //       `/${documentPath}?isNewCreation=true&documentToDuplicateId=${quote?.id}`
      //     ),
      //   icon: <DuplicateIcon />,
      //   name: t("sales.quote.duplicate"),
      //   isLink: true,
      //   href: `/${documentPath}?isNewCreation=true&documentToDuplicateId=${quote?.id}`,
      // },
      {
        condition: !isPauseOrder && showNewDuplicate,
        onClick: () =>
          navigate(
            getDocumentPath(
              null,
              "?isNewCreation=true&documentToDuplicateId=" + quote?.id
            )
          ),
        icon: <DuplicateIcon />,
        name: t("sales.quote.duplicate"),
        isLink: true,
        href: getDocumentPath(
          null,
          "?isNewCreation=true&documentToDuplicateId=" + quote?.id
        ),
      },
      {
        condition:
          !isPauseOrder &&
          isOrder &&
          quote?.isCanClose &&
          !quote?.isWaitingForPayment &&
          CheckPermission(Permissions.SHOW_BOARD_MISSIONS),
        onClick: () => navigate(`/jobs?finalPatternSearch=${quote?.number}`),
        icon: <JobsIcon />,
        name: t("sales.quote.jobs"),
        isLink: true,
        href: `/jobs?finalPatternSearch=${quote?.number}`,
      },
      {
        condition:
          !isPauseOrder &&
          isOrder &&
          quote?.isCanClose &&
          !isCanceledOrder &&
          quote?.isEditable,
        onClick: () => {
          if (quote?.productionStatus) {
            navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`);
          } else {
            onClickOpenChangeProductionStatusModal(quote);
            setIsSelectedCLoseAsDeliveryNote(true);
          }
        },
        icon: <TickIcon />,
        name: t("sales.quote.closeAsDeliveryNote"),
        isLink: quote?.productionStatus,
        href: `/deliveryNote?isNewCreation=true&orderId=${quote?.id}`,
      },
      {
        condition:
          ((!isPauseOrder &&
            isOrder &&
            quote?.isCanClose &&
            !isCanceledOrder) ||
            (isDeliveryNote && quote?.isCanClose)) &&
          quote?.isEditable,
        onClick: () => {
          if (isOrder) {
            if (quote?.productionStatus) {
              navigate(`/invoice?isNewCreation=true&orderId=${quote?.id}`);
            } else {
              onClickOpenChangeProductionStatusModal(quote);
              setIsSelectedCLoseAsDeliveryNote(false);
            }
          } else {
            navigate(`/invoice?isNewCreation=true&deliveryNoteId=${quote?.id}`);
          }
        },
        icon: <TickIcon />,
        name: t("sales.quote.closeAsInvoice"),
        isLink: isOrder ? quote?.productionStatus : true,
        href: isOrder
          ? `/invoice?isNewCreation=true&orderId=${quote?.id}`
          : `/invoice?isNewCreation=true&deliveryNoteId=${quote?.id}`,
      },
      {
        condition:
          !isPauseOrder &&
          isOrder &&
          quote?.isCanClose &&
          !isCanceledOrder &&
          isShowPurchaseOrders,
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
        isLink: true,
        href: `/deliveryNoteRefund?isNewCreation=true&documentId=${quote?.id}`,
      },
      {
        condition: !isPauseOrder && isInvoice && quote?.isCanClose,
        onClick: () =>
          navigate(`/invoiceRefund?isNewCreation=true&documentId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.createInvoiceRefund"),
        isLink: true,
        href: `/invoiceRefund?isNewCreation=true&documentId=${quote?.id}`,
      },
      {
        condition: !isPauseOrder && isPurchaseInvoice && quote?.isCanClose,
        onClick: () =>
          navigate(
            `/purchaseInvoiceRefund?isNewCreation=true&documentId=${quote?.id}`
          ),
        icon: <TickIcon />,
        name: t("sales.quote.createPurchaseInvoiceRefund"),
        isLink: true,
        href: `/purchaseInvoiceRefund?isNewCreation=true&documentId=${quote?.id}`,
      },
      {
        condition: !isPauseOrder && isPurchaseOrder && quote?.isCanClose,
        onClick: () =>
          navigate(`/purchaseInvoice?isNewCreation=true&orderId=${quote?.id}`),
        icon: <TickIcon />,
        name: t("sales.quote.closeAsPurchaseInvoice"),
        isLink: true,
        href: `/purchaseInvoice?isNewCreation=true&orderId=${quote?.id}`,
      },
      {
        condition:
          ((!isPauseOrder &&
            isOrder &&
            quote?.isCanClose &&
            !isCanceledOrder) ||
            (isDeliveryNote && quote?.isCanClose) ||
            (isInvoice && quote?.isCanClose)) &&
          quote?.isEditable &&
          canCloseDocumentManually,
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
          quote?.isEditable &&
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
          ((!isPauseOrder &&
            isOrder &&
            quote?.isCanClose &&
            !isCanceledOrder) ||
            (isReceipt && quote?.status !== "Receipt.Canceled")) &&
          quote?.isEditable,
        onClick: () =>
          isOrder
            ? onClickOpenIrrelevantModal(quote)
            : quote?.creditCardTotal > 0
            ? onOpenCancelReceiptModalRefund(quote)
            : onOpenCancelReceiptModal(quote),
        icon: <TickCancelIcon />,
        name: t("sales.quote.cancel"),
      },
      {
        condition: (isInvoice || isPurchaseInvoice) && quote?.isCanClose,
        onClick: () =>
          navigate(
            isPurchaseInvoice
              ? `/receipt?isOutgoingPayments=true&isNewCreation=true&documentNumber=${quote?.number}&ClientId=${quote?.customerId}`
              : `/receipt?isNewCreation=true&documentNumber=${quote?.accountingNumber}&ClientId=${quote?.customerId}`
          ),
        icon: <PayIcon />,
        name: t("sales.quote.pay"),
        isLink: true,
        href: isPurchaseInvoice
          ? `/receipt?isOutgoingPayments=true&isNewCreation=true&documentNumber=${quote?.number}&ClientId=${quote?.customerId}`
          : `/receipt?isNewCreation=true&documentNumber=${quote?.accountingNumber}&ClientId=${quote?.customerId}`,
      },

      {
        condition:
          ((!isPauseOrder && isOrder && !isCanceledOrder) || isInvoice) &&
          quote?.isCanClose &&
          isSendPaymentToClient,
        onClick: () => onClickSendPayment(quote, false),
        icon: <PayIcon />,
        name: t("sales.quote.sendPayment"),
      },
      {
        condition: true,
        onClick: () => onClickSendPayment(quote, true),
        icon: <PayIcon />,
        name: t("sales.quote.sendToClient"),
      },
      {
        condition:
          !isPauseOrder &&
          isOrdersTracking &&
          parseFloat(quote?.totalPrice) !== parseFloat(quote?.sumApplied),
        onClick: () => onClickMakePayment(quote),
        icon: <PayIcon />,
        name: t("sales.quote.makePayment"),
      },
      {
        condition:
          isOrder &&
          !isCanceledOrder &&
          !isPauseOrder &&
          !isClosedOrder &&
          quote?.isEditable,
        onClick: () => onClickPauseOrResume(quote?.id),
        icon: <PauseIcon />,
        name: t("sales.quote.pause"),
      },
      {
        condition: isOrder && isPauseOrder && quote?.isEditable,
        onClick: () => onClickPauseOrResume(quote?.id),
        icon: <ResumeIcon />,
        name: t("sales.quote.resume"),
      },
      {
        condition: !!companyProfile.filesApiAddress,
        onClick: () => addOrderBoardMissionsToFileUploader(quote?.id),
        icon: <PDFIcon />,
        name: t("fileUploader.uploadFile"),
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
