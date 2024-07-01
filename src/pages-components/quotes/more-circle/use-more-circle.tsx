import { useCustomer, useGomakeAxios, useGomakeRouter } from "@/hooks";
import { DOCUMENT_TYPE, QUOTE_STATUSES } from "../enums";
import { LoggerIcon } from "@/pages-components/admin/home/widgets/more-circle/icons/logger";
import { EditingIcon } from "./icons/editing";
import { PDFIcon } from "./icons/pdf";
import { TickCloseIcon, TickIcon, TickMoveIcon } from "@/icons";
import { DuplicateIcon } from "@/components/icons/icons";
import { downloadPdf } from "@/utils/helpers";
import { getOrderBoardMissionPDF } from "@/services/api-service/generic-doc/documents-api";
import { JobsIcon } from "./icons/jobs";
import { LockIcon } from "./icons/lock";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";

const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();
  const { CheckPermission } = useUserPermission();

  const getMenuList = ({
    quote,
    documentType,
    onClickOpenModal,
    onClickPdf,
    onClickDuplicate,
    onClickLoggers,
    t,
    onClickOpenIrrelevantModal,
    CloseDocument,
    onClickOpenCloseOrderModal,
    onClickOpenCloseOrderNotesModal
  }) => {
    const documentPath = DOCUMENT_TYPE[documentType];
    const { callApi } = useGomakeAxios();
    const showNewDuplicate = documentType === DOCUMENT_TYPE.deliveryNote || documentType === DOCUMENT_TYPE.deliveryNoteRefund || documentType === DOCUMENT_TYPE.invoice || documentType === DOCUMENT_TYPE.invoiceRefund;
    const onClickGetOrderBoardMissionPDF = async (quoteItem) => {
      const callBack = (res) => {
        if (res?.success) {
          const pdfLink = res.data;
          downloadPdf(pdfLink)
        } else {
        }
      };
      await getOrderBoardMissionPDF(callApi, callBack, { documentId: quoteItem?.id });
    };

    return [
      {
        condition: documentType === DOCUMENT_TYPE.quote && quote?.isEditable,
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
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled",
        onClick: () => onClickGetOrderBoardMissionPDF(quote),
        icon: <PDFIcon />,
        name: t("sales.quote.boardMissionsPdf")
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
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && CheckPermission(Permissions.SHOW_BOARD_MISSIONS),
        onClick: () => navigate(`/board-missions?orderNumber=${quote?.number}`),
        icon: <JobsIcon />,
        name: t("sales.quote.jobs")
      },
      // {
      //   condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled",
      //   onClick: () => navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`),
      //   icon: <TickIcon />,
      //   name: t("sales.quote.closeAsDeliveryNote")
      // },
      // {
      //   condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled",
      //   onClick: () => navigate(`/invoice?isNewCreation=true&orderId=${quote?.id}`),
      //   icon: <TickIcon />,
      //   name: t("sales.quote.closeAsInvoice")
      // },
      {
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled",
        onClick: () => navigate(`/purchaseOrders?orderNumber=${quote?.number}`),
        icon: <TickMoveIcon />,
        name: t("sales.quote.purchaseOrders")
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
        onClick: () => quote?.closeOrderNotes && quote?.closeOrderNotes.tirm !== "" ? onClickOpenCloseOrderNotesModal(quote) : onClickOpenCloseOrderModal(quote),
        icon: <LockIcon />,
        name: t("sales.quote.close")
      },
      {
        condition: documentType === DOCUMENT_TYPE.order && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled",
        onClick: () => onClickOpenIrrelevantModal(quote),
        icon: <TickCloseIcon />,
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
    navigate,
    getMenuList
  };
};

export { useMoreCircle };
