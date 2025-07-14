import {
  useCustomer,
  useGomakeAxios,
  useGomakeRouter,
  useSnackBar,
} from "@/hooks";
import { DOCUMENT_TYPE, QUOTE_STATUSES, StatusTitleText } from "../enums";
import { LoggerIcon } from "@/pages-components/admin/home/widgets/more-circle/icons/logger";
import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { TickCancelIcon, TickIcon, TickMoveIcon } from "@/icons";
import { DuplicateIcon } from "@/components/icons/icons";
import { downloadPdf } from "@/utils/helpers";
import {
  getOrderBoardMissionPDF,
  getOrderSummaryPDF,
} from "@/services/api-service/generic-doc/documents-api";
import { JobsIcon } from "./icons/jobs";
import { LockIcon } from "./icons/lock";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useRouter } from "next/router";
import { TrackingIcon } from "./icons/tracking";
import { UnLockIcon } from "./icons/unlock";
import { useRecoilState, useSetRecoilState } from "recoil";
import { closeAsInvoiceState, isSelectedCLoseAsDeliveryNoteState } from "@/pages/customers/customer-states";
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
import { MailIcon } from "./icons/mail";
import { DeleteIcon } from "./icons/delete";
import { printReceiptChecksApi } from "@/services/api-service/generic-doc/receipts-api";
import { PrintPdfIcon } from "./icons/print-pdf";
import { TagIcon } from "@/icons/tag-icon";
import { getTaxConfirmationNumberApi } from "@/services/api-service/generic-doc/invoices";
import AlarmOnRoundedIcon from "@mui/icons-material/AlarmOnRounded";
import { PackageIcon } from "@/icons/package-icon";

const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();
  const { CheckPermission } = useUserPermission();
  const canCloseDocumentManually = CheckPermission(
    Permissions.CAN_CLOSE_MANUALLY
  );
  const canCancelReceipt = CheckPermission(Permissions.CANCEL_RECEIPT);
  const [companyProfile] = useRecoilState(printHouseProfile);
  const [, setOpenFileUploader] = useRecoilState(openFileUploaderList);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const setIsSelectedCLoseAsDeliveryNote = useSetRecoilState(
    isSelectedCLoseAsDeliveryNoteState
  );

  const setCloseAsInvoice = useSetRecoilState(closeAsInvoiceState);

  const getMenuList = ({
    t,
    quote,
    documentType,
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
    onClickOpenChangeProductionStatusModal,
    onClickPauseOrResume,
    onOpenDuplicateModal,
    onClickStartProduction,
    onClickReopenDocument,
    onClickEditQuote,
    onClickOpenRemoveDraftModal,
    handleGetTaxConfirmNo,
    onClickOpenMoveOrderToReadyModal,
    onOpenPackagesModal,
  }) => {
    const isEditableDocument = quote?.isEditable;
    const documentPath = DOCUMENT_TYPE[documentType];
    const isSupplierPayments = documentType === DOCUMENT_TYPE.supplierPayments;

    const getDocumentPath = (id?: string, extraParams: string = "") => {
      if (isSupplierPayments) {
        return `/${DOCUMENT_TYPE[DOCUMENT_TYPE.receipt]
          }?isOutgoingPayments=true${id ? `&Id=${id}` : ""}${extraParams}`;
      }
      return `/${documentPath}${id ? `?Id=${id}` : ""}${extraParams}`;
    };

    const { callApi } = useGomakeAxios();
    const { pathname } = useRouter();
    const { alertFaultAdded, alertFaultGetData, alertSuccessGetData } =
      useSnackBar();

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

    const onClickGetOrderSummaryPDF = async (quoteItem) => {
      const callBack = (res) => {
        if (res?.success) {
          const pdfLink = res.data;
          downloadPdf(pdfLink);
        } else {
        }
      };
      await getOrderSummaryPDF(callApi, callBack, {
        orderId: quoteItem?.id,
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

    const handleClickPrintChecks = async (receiptId) => {
      const downloadPdf = (url) => {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank";
        anchor.addEventListener("click", () => {
          setTimeout(() => {
            anchor.remove();
          }, 100);
        });
        anchor.click();
      };
      const callBack = (res) => {
        if (res?.success) {
          const pdfLink = res.data;
          downloadPdf(pdfLink);
        } else {
          alertFaultGetData();
        }
      };

      await printReceiptChecksApi(callApi, callBack, {
        receiptId,
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

    const isClosedOrder =
      isOrder && quote?.statusTitleText === StatusTitleText.OrderClosed;
    const isPauseOrder = quote?.statusTitleText === StatusTitleText.OrderPaused;
    const isCanceledOrder =
      quote?.statusTitleText === StatusTitleText.OrderCanceled;
    const isClosedDeliveryNote =
      quote?.statusTitleText === StatusTitleText.DeliveryNoteClosed;
    const isClosedInvoice =
      quote?.statusTitleText === StatusTitleText.InvoiceClosed;
    const showNewDuplicate =
      isDeliveryNote || isDeliveryNoteRefund || isInvoice || isInvoiceRefund;
    const isOrdersTracking = pathname === "/ordersTracking";
    const isCanceledPurchaseOrder =
      quote?.statusTitleText === StatusTitleText.PurchaseOrderCanceled;

    const isShowLogs = CheckPermission(Permissions.SHOW_LOGS);
    const isSendPaymentToClient = CheckPermission(
      Permissions.SEND_PAYMENT_TO_CLIENT
    );
    const isShowPurchaseOrders = CheckPermission(
      Permissions.SHOW_PURCHASE_ORDERS
    );
    const isCreateStatus =
      isQuote && quote?.documentStatus === QUOTE_STATUSES.Create;

    const isCanReOpenManuallyClosedDocument = quote?.isCanCancelManualClose;
    const isCanReopenCanceledOrder = isOrder && isCanceledOrder;
    const isCanReOpenClosedDocument =
      CheckPermission(Permissions.CAN_OPEN_CLOSED_DOCUMENTS) &&
      ((isOrder && isClosedOrder) ||
        (isDeliveryNote && isClosedDeliveryNote) ||
        (isInvoice && isClosedInvoice));

    const isSendOrderReadyToClient = isOrder && quote?.productionStatus;

    if ((isInvoice || isPurchaseInvoice) && quote?.isDraft) {
      const documentId = quote?.id;
      const href = isInvoice
        ? `/invoice?isNewCreation=true&draftInvoiceId=${documentId}`
        : `/purchaseInvoice?isNewCreation=true&draftPurchaseInvoiceId=${documentId}`;

      return [
        {
          condition: true,
          onClick: () => navigate(href),
          icon: <EditingIcon />,
          name: t("sales.quote.edit"),
          isLink: true,
          href,
        },
        {
          condition: true,
          onClick: () => onClickOpenRemoveDraftModal(quote),
          icon: <DeleteIcon />,
          name: t("navigationButtons.delete"),
        },
        {
          condition: true,
          onClick: () => onClickPdf(quote?.id),
          icon: <PDFIcon />,
          name: t("sales.quote.pdf"),
        },
      ];
    }

    return [
      {
        condition: !isPauseOrder && isQuote && isEditableDocument,
        onClick: () => {
          isCreateStatus ? navigate(`/quote`) : onClickEditQuote(quote);
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
          isEditableDocument,
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
        condition: isReceipt && quote.isShowPrintReceiptChecksButton,
        onClick: () => handleClickPrintChecks(quote?.id),
        icon: <PrintPdfIcon />,
        name: t("sales.cart.printChecks"),
      },
      {
        condition: !isPauseOrder && isOrder && !isCanceledOrder && quote?.jobs,
        onClick: () => onClickGetOrderBoardMissionPDF(quote),
        icon: <PDFIcon />,
        name: t("sales.quote.boardMissionsPdf"),
      },
      {
        condition: !isPauseOrder && isOrder && !isCanceledOrder && quote?.jobs,
        onClick: () => onClickGetOrderSummaryPDF(quote),
        icon: <PDFIcon />,
        name: t("sales.quote.orderSummaryPdf"),
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
          isOrder &&
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
          isEditableDocument,
        onClick: () => {
          if (quote?.productionStatus) {
            if (quote?.closeOrderNotes?.trim()) {
              onClickOpenCloseOrderNotesModal(
                quote,
                "closeAsDeliveryNote",
                () =>
                  navigate(
                    `/deliveryNote?isNewCreation=true&orderId=${quote?.id}`
                  )
              );
            } else
              navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`);
          } else {
            onClickOpenChangeProductionStatusModal(quote);
            setIsSelectedCLoseAsDeliveryNote(true);
          }
        },
        icon: <TickIcon />,
        name: t("sales.quote.closeAsDeliveryNote"),
        isLink: quote?.productionStatus && !quote?.closeOrderNotes?.trim(),
        href: `/deliveryNote?isNewCreation=true&orderId=${quote?.id}`,
      },
      {
        condition:
          ((!isPauseOrder &&
            isOrder &&
            quote?.isCanClose &&
            !isCanceledOrder) ||
            (isDeliveryNote && quote?.isCanClose)) &&
          isEditableDocument,
        onClick: () => {
          if (isOrder) {
            setCloseAsInvoice(true);
            if (quote?.productionStatus) {
              if (quote?.closeOrderNotes?.trim()) {
                onClickOpenCloseOrderNotesModal(quote, "closeAsInvoice", () =>
                  navigate(`/invoice?isNewCreation=true&orderId=${quote?.id}`)
                );
              } else
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
        isLink: isOrder
          ? quote?.productionStatus && !quote?.closeOrderNotes?.trim()
          : true,
        href: isOrder
          ? `/invoice?isNewCreation=true&orderId=${quote?.id}`
          : `/invoice?isNewCreation=true&deliveryNoteId=${quote?.id}`,
      },
      {
        condition: !isPauseOrder && isOrder && !quote?.productionStatus,
        onClick: () => {
          setCloseAsInvoice(false);
          onClickOpenMoveOrderToReadyModal(quote)
        },
        icon: (
          <AlarmOnRoundedIcon style={{ color: "#8283BE", fontSize: "20px" }} />
        ),
        name: t("sales.moveToReadyAndCloseOrder"),
      },
      {
        condition:
          !isPauseOrder &&
          isOrder &&
          quote?.isCanClose &&
          !isCanceledOrder &&
          isShowPurchaseOrders,
        onClick: () =>
          navigate(
            `/purchaseOrders?finalPatternSearch=${quote?.number}&pageNumber=1`
          ),
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
        condition: isInvoice && quote?.isCanGetTaxConfirmationNumber,
        onClick: () => handleGetTaxConfirmNo(quote?.id),
        icon: <TagIcon />,
        name: t("sales.quote.getTaxConfirmationNumber"),
      },

      {
        condition: isPurchaseOrder && quote?.isCanClose,
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
          isEditableDocument &&
          canCloseDocumentManually,
        onClick: () =>
          quote?.closeOrderNotes && quote?.closeOrderNotes.trim() !== ""
            ? onClickOpenCloseOrderNotesModal(quote, "closeManually", () =>
              onClickOpenCloseOrderModal(quote)
            )
            : onClickOpenCloseOrderModal(quote),
        icon: <LockIcon />,
        name: t("sales.quote.close"),
      },

      {
        condition:
          isPurchaseOrder &&
          quote?.isCanClose &&
          !isCanceledPurchaseOrder &&
          isEditableDocument &&
          canCloseDocumentManually,
        onClick: () => onClickOpenCloseOrderModal(quote),
        icon: <LockIcon />,
        name: t("sales.quote.close"),
      },

      {
        condition:
          isCanReopenCanceledOrder ||
          isCanReOpenManuallyClosedDocument ||
          isCanReOpenClosedDocument,
        onClick: () => onClickReopenDocument(quote),
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
            (isReceipt &&
              !!canCancelReceipt &&
              quote?.status !== "Receipt.Canceled")) &&
          isEditableDocument,
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
        condition:
          isPurchaseOrder && !isCanceledPurchaseOrder && isEditableDocument,
        onClick: () => onClickOpenIrrelevantModal(quote),
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
        onClick: () =>
          onClickSendPayment(quote, true, !!isSendOrderReadyToClient),
        icon: <MailIcon />,
        name: t(
          `sales.quote.${isSendOrderReadyToClient ? "sendOrderReadyToClient" : "sendToClient"
          }`
        ),
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
          isEditableDocument,
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
      {
        condition: !!companyProfile.filesApiAddress,
        onClick: () => addOrderBoardMissionsToFileUploader(quote?.id),
        icon: <PDFIcon />,
        name: t("fileUploader.uploadFile"),
      },
      {
        condition: isOrder && quote?.jobs,
        name: t("boardMissions.printPackagingSlip"),
        icon: <PackageIcon />,
        onClick: () => onOpenPackagesModal(quote),
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
