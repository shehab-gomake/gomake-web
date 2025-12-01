import {
  useCustomer,
  useGomakeAxios,
  useGomakeRouter,
  useSnackBar,
} from "@/hooks";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  DOCUMENT_TYPE,
  PROFORMA_INVOICE_STATUSES,
  QUOTE_STATUSES,
  StatusTitleText,
} from "../enums";
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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  closeOrderAsInvoiceOrDeliveryNoteState,
  isSelectedCLoseAsDeliveryNoteState,
  isSelectedCLoseAsProformaInvoiceState,
} from "@/pages/customers/customer-states";
import { PauseIcon } from "@/icons/pause-icon";
import { ResumeIcon } from "@/icons/resume-icon";
import { PayIcon } from "./icons/pay";
import { StartProductionIcon } from "./icons/start-productions";
import {
  printHouseHasFrontDeskFeature,
  printHouseProfile,
} from "@/store/print-house-profile";
import { addOrderBoardMissionsToFileUploaderApi } from "@/services/api-service/board-missions/board-missions-table";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
} from "@/store/file-uploader-state";
import { DeleteIcon } from "./icons/delete";
import { printReceiptChecksApi } from "@/services/api-service/generic-doc/receipts-api";
import { PrintPdfIcon } from "./icons/print-pdf";
import { TagIcon } from "@/icons/tag-icon";
import AlarmOnRoundedIcon from "@mui/icons-material/AlarmOnRounded";
import { PackageIcon } from "@/icons/package-icon";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { SendToCustomerSubmenu } from "./send-to-customer-submenu";
import { CloseDocumentSubmenu } from "./close-document-submenu";
import { CancelDocumentSubmenu } from "./cancel-document-submenu";
import { MailIcon } from "./icons/mail";

const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();
  const { CheckPermission } = useUserPermission();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const { primaryLavender } = useGomakeTheme();
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
  const canCloseDocumentManually = CheckPermission(
    Permissions.CAN_CLOSE_MANUALLY
  );
  const canCancelReceipt = CheckPermission(Permissions.CANCEL_RECEIPT);
  const hasProformaInvoicePermission = CheckPermission(
    Permissions.SHOW_PROFORMA_INVOICES
  );
  const [companyProfile] = useRecoilState(printHouseProfile);
  const [, setOpenFileUploader] = useRecoilState(openFileUploaderList);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const setIsSelectedCLoseAsDeliveryNote = useSetRecoilState(
    isSelectedCLoseAsDeliveryNoteState
  );
  const setIsSelectedCLoseAsProformaInvoice = useSetRecoilState(
    isSelectedCLoseAsProformaInvoiceState
  );

  const setCloseAsInvoiceOrDeliveryNote = useSetRecoilState(
    closeOrderAsInvoiceOrDeliveryNoteState
  );

  const getMenuList = ({
    t,
    quote,
    documentType,
    onClickPdf,
    onClickDuplicate,
    onClickLoggers,
    onClickOpenIrrelevantModal,
    onClickOpenPriceModal,
    onClickOpenDeliveryTimeModal,
    onClickOpenModal,
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
    onClickOpenInventoryIntakeModal,
    onClickSendToCustomerEmail,
    onClickSendToCustomerSMS,
    onClickSendToCustomerWhatsApp,
    classes,
  }) => {
    const isEditableDocument = quote?.isEditable;
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

    const askToPrintWithPricesInDeliveryNotes = CheckPreferenceValue(
      EPreferences.ASK_TO_PRINT_WITH_PRICES_IN_DELIVERY_NOTES
    );

    // Close Document Handlers - extracted for better organization
    const handleCloseAsDeliveryNote = () => {
      setCloseAsInvoiceOrDeliveryNote(true);
      if (quote?.productionStatus) {
        if (quote?.closeOrderNotes?.trim()) {
          onClickOpenCloseOrderNotesModal(quote, "closeAsDeliveryNote", () =>
            navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`)
          );
        } else
          navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`);
      } else {
        onClickOpenChangeProductionStatusModal(quote);
        setIsSelectedCLoseAsDeliveryNote(true);
        setIsSelectedCLoseAsProformaInvoice(false);
      }
    };

    const handleCloseAsProformaInvoice = () => {
      if (isOrder) {
        setCloseAsInvoiceOrDeliveryNote(true);
        if (quote?.productionStatus) {
          if (quote?.closeOrderNotes?.trim()) {
            onClickOpenCloseOrderNotesModal(
              quote,
              "closeAsProformaInvoice",
              () =>
                navigate(
                  `/proformaInvoice?isNewCreation=true&orderId=${quote?.id}`
                )
            );
          } else
            navigate(
              `/proformaInvoice?isNewCreation=true&orderId=${quote?.id}`
            );
        } else {
          onClickOpenChangeProductionStatusModal(quote);
          setIsSelectedCLoseAsDeliveryNote(false);
          setIsSelectedCLoseAsProformaInvoice(true);
        }
      } else {
        navigate(
          `/proformaInvoice?isNewCreation=true&deliveryNoteId=${quote?.id}`
        );
      }
    };

    const handleCloseAsInvoice = () => {
      if (isOrder) {
        setCloseAsInvoiceOrDeliveryNote(true);
        if (quote?.productionStatus) {
          if (quote?.closeOrderNotes?.trim()) {
            onClickOpenCloseOrderNotesModal(quote, "closeAsInvoice", () =>
              navigate(`/invoice?isNewCreation=true&orderId=${quote?.id}`)
            );
          } else navigate(`/invoice?isNewCreation=true&orderId=${quote?.id}`);
        } else {
          onClickOpenChangeProductionStatusModal(quote);
          setIsSelectedCLoseAsDeliveryNote(false);
          setIsSelectedCLoseAsProformaInvoice(false);
        }
      } else if (isDeliveryNote) {
        navigate(`/invoice?isNewCreation=true&deliveryNoteId=${quote?.id}`);
      } else {
        navigate(`/invoice?isNewCreation=true&proformaInvoiceId=${quote?.id}`);
      }
    };

    const handleCreateDeliveryNoteRefund = () => {
      navigate(
        `/deliveryNoteRefund?isNewCreation=true&documentId=${quote?.id}`
      );
    };

    const handleCreateInvoiceRefund = () => {
      navigate(`/invoiceRefund?isNewCreation=true&documentId=${quote?.id}`);
    };

    const handleCreatePurchaseInvoiceRefund = () => {
      navigate(
        `/purchaseInvoiceRefund?isNewCreation=true&documentId=${quote?.id}`
      );
    };

    const handleCloseAsPurchaseInvoice = () => {
      navigate(`/purchaseInvoice?isNewCreation=true&orderId=${quote?.id}`);
    };

    const isQuote = documentType === DOCUMENT_TYPE.quote;
    const isOrder = documentType === DOCUMENT_TYPE.order;
    const isDeliveryNote = documentType === DOCUMENT_TYPE.deliveryNote;
    const isDeliveryNoteRefund =
      documentType === DOCUMENT_TYPE.deliveryNoteRefund;
    const isProformaInvoice = documentType === DOCUMENT_TYPE.proformaInvoice;
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
    const isClosedProformaInvoice =
      quote?.statusTitleText === StatusTitleText.ProformaInvoiceClosed;
    const isClosedInvoice =
      quote?.statusTitleText === StatusTitleText.InvoiceClosed;
    const showNewDuplicate =
      isDeliveryNote ||
      isDeliveryNoteRefund ||
      isProformaInvoice ||
      isInvoice ||
      isInvoiceRefund;
    const isOrdersTracking = pathname === "/ordersTracking";
    const isCanceledPurchaseOrder =
      quote?.statusTitleText === StatusTitleText.PurchaseOrderCanceled;
    const isCanceledProformaInvoice =
      isProformaInvoice &&
      quote?.documentStatus === PROFORMA_INVOICE_STATUSES.Canceled;
    const isClosedPurchaseOrder =
      quote?.statusTitleText === StatusTitleText.PurchaseOrderClosed;
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

    const isCanReOpenCancledPurchaseOrder =
      isPurchaseOrder && isClosedPurchaseOrder;
    const isCanReOpenCanceledPurchaseInvoice =
      isPurchaseInvoice && isClosedPurchaseOrder;
    const isCanReOpenClosedDocument =
      CheckPermission(Permissions.CAN_OPEN_CLOSED_DOCUMENTS) &&
      ((isOrder && isClosedOrder) ||
        (isDeliveryNote && isClosedDeliveryNote) ||
        (isProformaInvoice && isClosedProformaInvoice) ||
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
          icon: <EditingIcon color={primaryLavender(500)} />,
          name: t("sales.quote.edit"),
          isLink: true,
          href,
        },
        {
          condition: true,
          onClick: () => onClickOpenRemoveDraftModal(quote),
          icon: <DeleteIcon color={primaryLavender(500)} />,
          name: t("navigationButtons.delete"),
        },
        {
          condition: true,
          onClick: () => onClickPdf(quote?.id),
          icon: <PDFIcon color={primaryLavender(500)} />,
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
        icon: <EditingIcon color={primaryLavender(500)} />,
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
        icon: <EditingIcon color={primaryLavender(500)} />,
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
        icon: <StartProductionIcon color={primaryLavender(500)} />,
        name: t("sales.tables.startProduction"),
      },
      {
        condition: !isPauseOrder && isShowLogs,
        onClick: () => onClickLoggers(quote),
        icon: <LoggerIcon color={primaryLavender(500)} />,
        name: t("sales.quote.loggers"),
      },
      {
        condition: !isPauseOrder && (isDeliveryNote || isProformaInvoice),
        onClick: () =>
          askToPrintWithPricesInDeliveryNotes
            ? onClickOpenPrintPDFModal(quote)
            : onClickPdf(quote?.id, null),
        icon: <PDFIcon color={primaryLavender(500)} />,
        name: t("sales.quote.pdf"),
      },

      {
        condition: !isPauseOrder && !isDeliveryNote && !isProformaInvoice,
        onClick: () =>
          onClickPdf(isReceipt || isSupplierPayments ? quote : quote?.id),
        icon: <PDFIcon color={primaryLavender(500)} />,
        name: t("sales.quote.pdf"),
      },

      {
        condition: isReceipt && quote.isShowPrintReceiptChecksButton,
        onClick: () => handleClickPrintChecks(quote?.id),
        icon: <PrintPdfIcon color={primaryLavender(500)} />,
        name: t("sales.cart.printChecks"),
      },
      {
        condition: !isPauseOrder && isOrder && !isCanceledOrder && quote?.jobs,
        onClick: () => onClickGetOrderBoardMissionPDF(quote),
        icon: <PDFIcon color={primaryLavender(500)} />,
        name: t("sales.quote.boardMissionsPdf"),
      },
      {
        condition: !isPauseOrder && isOrder && !isCanceledOrder && quote?.jobs,
        onClick: () => onClickGetOrderSummaryPDF(quote),
        icon: <PDFIcon color={primaryLavender(500)} />,
        name: t("sales.quote.orderSummaryPdf"),
      },
      {
        condition: (!isPauseOrder && isOrder) || isQuote,
        onClick: () => {
          isOrder ? onOpenDuplicateModal(quote) : onClickDuplicate(quote?.id);
        },
        icon: <DuplicateIcon color={primaryLavender(700)} />,
        name: t("sales.quote.duplicate"),
      },
      {
        condition: !isPauseOrder && showNewDuplicate,
        onClick: () =>
          navigate(
            getDocumentPath(
              null,
              "?isNewCreation=true&documentToDuplicateId=" + quote?.id
            )
          ),
        icon: <DuplicateIcon color={primaryLavender(700)} />,
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
        icon: <JobsIcon color={primaryLavender(500)} />,
        name: t("sales.quote.jobs"),
        isLink: true,
        href: `/jobs?finalPatternSearch=${quote?.number}`,
      },
      {
        condition:
          (!isPauseOrder &&
            isOrder &&
            quote?.isCanClose &&
            !isCanceledOrder &&
            isEditableDocument) ||
          (isDeliveryNote && quote?.isCanClose && isEditableDocument) ||
          (isProformaInvoice && quote?.isCanClose && isEditableDocument) ||
          (isInvoice && quote?.isCanClose && isEditableDocument) ||
          (isPurchaseInvoice && quote?.isCanClose) ||
          (isPurchaseOrder &&
            quote?.isCanClose &&
            !isCanceledPurchaseOrder &&
            isEditableDocument),
        component: (closeMenu: () => void) => (
          <CloseDocumentSubmenu
            documentType={documentType}
            document={quote}
            onCloseDocument={
              canCloseDocumentManually ? onClickOpenCloseOrderModal : undefined
            }
            onCloseAsDeliveryNote={
              isOrder &&
              quote?.isCanClose &&
              !isCanceledOrder &&
              isEditableDocument
                ? handleCloseAsDeliveryNote
                : undefined
            }
            onCloseAsProformaInvoice={
              hasProformaInvoicePermission &&
              ((isOrder &&
                quote?.isCanClose &&
                !isCanceledOrder &&
                isEditableDocument) ||
                (isDeliveryNote && quote?.isCanClose && isEditableDocument))
                ? handleCloseAsProformaInvoice
                : undefined
            }
            onCloseAsInvoice={
              ((isOrder && quote?.isCanClose && !isCanceledOrder) ||
                (isDeliveryNote && quote?.isCanClose) ||
                (isProformaInvoice && quote?.isCanClose)) &&
              isEditableDocument
                ? handleCloseAsInvoice
                : undefined
            }
            onCreateDeliveryNoteRefund={
              isDeliveryNote && quote?.isCanClose
                ? handleCreateDeliveryNoteRefund
                : undefined
            }
            onCreateInvoiceRefund={
              isInvoice && quote?.isCanClose
                ? handleCreateInvoiceRefund
                : undefined
            }
            onCreatePurchaseInvoiceRefund={
              isPurchaseInvoice && quote?.isCanClose
                ? handleCreatePurchaseInvoiceRefund
                : undefined
            }
            onCloseAsPurchaseInvoice={
              isPurchaseOrder &&
              quote?.isCanClose &&
              !isCanceledPurchaseOrder &&
              isEditableDocument
                ? handleCloseAsPurchaseInvoice
                : undefined
            }
            onClickOpenCloseOrderNotesModal={onClickOpenCloseOrderNotesModal}
            menuItemStyle={classes.menuRowStyle}
            rowTextStyle={classes.rowTextStyle}
            onCloseParentMenu={closeMenu}
          />
        ),
      },
      {
        condition: !isPauseOrder && isOrder && !quote?.productionStatus,
        onClick: () => {
          setCloseAsInvoiceOrDeliveryNote(false);
          onClickOpenMoveOrderToReadyModal(quote);
        },
        icon: (
          <AlarmOnRoundedIcon
            style={{ color: primaryLavender(500), fontSize: "20px" }}
          />
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
        icon: <TickMoveIcon color={primaryLavender(500)} />,
        name: t("sales.quote.purchaseOrders"),
      },

      {
        condition: isInvoice && quote?.isCanGetTaxConfirmationNumber,
        onClick: () => handleGetTaxConfirmNo(quote?.id),
        icon: <TagIcon color={primaryLavender(500)} />,
        name: t("sales.quote.getTaxConfirmationNumber"),
      },

      {
        condition: isPurchaseOrder && quote?.isCanIntake,
        onClick: () => onClickOpenInventoryIntakeModal(quote),
        icon: <PackageIcon />,
        name: t("sales.purchaseOrder.addInventoryIntake"),
      },

      {
        condition:
          isCanReopenCanceledOrder ||
          isCanReOpenManuallyClosedDocument ||
          isCanReOpenClosedDocument ||
          isCanReOpenCancledPurchaseOrder ||
          isCanReOpenCanceledPurchaseInvoice,
        onClick: () => onClickReopenDocument(quote),
        icon: <UnLockIcon color={primaryLavender(500)} />,
        name: t("sales.quote.open"),
      },
      {
        condition:
          !isPauseOrder &&
          isOrder &&
          quote?.isCanCloseForTracking &&
          !isCanceledOrder,
        onClick: () => onClickCloseAndTrack(quote),
        icon: <TrackingIcon color={primaryLavender(500)} />,
        name: t("sales.quote.closeAndTrack"),
      },
      {
        condition:
          ((!isPauseOrder &&
            isOrder &&
            quote?.isCanClose &&
            !isCanceledOrder) ||
            (isProformaInvoice &&
              quote?.isCanClose &&
              !isCanceledProformaInvoice)) &&
          isEditableDocument,
        component: (closeMenu: () => void) => (
          <CancelDocumentSubmenu
            quote={quote}
            onClickOpenIrrelevantModal={onClickOpenIrrelevantModal}
            onClickOpenPriceModal={onClickOpenPriceModal}
            onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
            onClickOpenModal={onClickOpenModal}
            menuItemStyle={classes.menuRowStyle}
            rowTextStyle={classes.rowTextStyle}
            onCloseParentMenu={closeMenu}
          />
        ),
      },
      {
        condition:
          isReceipt &&
          !!canCancelReceipt &&
          quote?.status !== "Receipt.Canceled" &&
          isEditableDocument,
        onClick: () =>
          quote?.creditCardTotal > 0
            ? onOpenCancelReceiptModalRefund(quote)
            : onOpenCancelReceiptModal(quote),
        icon: <TickCancelIcon color={primaryLavender(500)} />,
        name: t("sales.quote.cancel"),
      },
      {
        condition:
          isPurchaseOrder && !isCanceledPurchaseOrder && isEditableDocument,
        onClick: () => onClickOpenIrrelevantModal(quote),
        icon: <TickCancelIcon color={primaryLavender(500)} />,
        name: t("sales.quote.cancel"),
      },
      {
        condition:
          (isInvoice || isProformaInvoice || isPurchaseInvoice) &&
          quote?.isCanClose,
        onClick: () =>
          navigate(
            isPurchaseInvoice
              ? `/receipt?isOutgoingPayments=true&isNewCreation=true&documentNumber=${quote?.number}&ClientId=${quote?.customerId}`
              : `/receipt?isNewCreation=true&documentNumber=${quote?.accountingNumber}&ClientId=${quote?.customerId}`
          ),
        icon: <PayIcon color={primaryLavender(500)} />,
        name: t("sales.quote.pay"),
        isLink: true,
        href: isPurchaseInvoice
          ? `/receipt?isOutgoingPayments=true&isNewCreation=true&documentNumber=${quote?.number}&ClientId=${quote?.customerId}`
          : `/receipt?isNewCreation=true&documentNumber=${quote?.accountingNumber}&ClientId=${quote?.customerId}`,
      },
      {
        condition:
          ((!isPauseOrder && isOrder && !isCanceledOrder) ||
            isInvoice ||
            isProformaInvoice) &&
          quote?.isCanClose &&
          isSendPaymentToClient,
        onClick: () => onClickSendPayment(quote, false),
        icon: <PayIcon color={primaryLavender(500)} />,
        name: t("sales.quote.sendPayment"),
      },
      hasFrontDeskFeature
        ? {
            condition: true,
            component: (closeMenu: () => void) => (
              <SendToCustomerSubmenu
                onClickEmail={() => onClickSendToCustomerEmail(quote)}
                onClickSMS={() => onClickSendToCustomerSMS(quote)}
                onClickWhatsApp={() => onClickSendToCustomerWhatsApp(quote)}
                menuItemStyle={classes.menuRowStyle}
                rowTextStyle={classes.rowTextStyle}
                onCloseParentMenu={closeMenu}
              />
            ),
          }
        : {
            condition: true,
            onClick: () =>
              onClickSendPayment(quote, true, !!isSendOrderReadyToClient),
            icon: <MailIcon color={primaryLavender(500)} />,
            name: t(
              `sales.quote.${
                isSendOrderReadyToClient
                  ? "sendOrderReadyToClient"
                  : "sendToClient"
              }`
            ),
          },
      {
        condition:
          !isPauseOrder &&
          isOrdersTracking &&
          parseFloat(quote?.totalPrice) !== parseFloat(quote?.sumApplied),
        onClick: () => onClickMakePayment(quote),
        icon: <PayIcon color={primaryLavender(500)} />,
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
        icon: <PauseIcon color={primaryLavender(500)} />,
        name: t("sales.quote.pause"),
      },
      {
        condition: isOrder && isPauseOrder,
        onClick: () => onClickPauseOrResume(quote?.id),
        icon: <ResumeIcon color={primaryLavender(500)} />,
        name: t("sales.quote.resume"),
      },
      {
        condition: !!companyProfile.filesApiAddress,
        onClick: () => addOrderBoardMissionsToFileUploader(quote?.id),
        icon: <PDFIcon color={primaryLavender(500)} />,
        name: t("fileUploader.uploadFile"),
      },
      {
        condition: isOrder && quote?.jobs,
        name: t("boardMissions.printPackagingSlip"),
        icon: <PackageIcon color={primaryLavender(500)} />,
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
