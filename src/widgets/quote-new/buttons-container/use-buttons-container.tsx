import { quoteItemState } from "@/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  createOrderApi,
  getDocumentPdfApi,
  manuallyCloseDocumentApi,
  sendQuoteApprovalToManagerApi,
} from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import {
  cancelReceiptApi,
  createReceiptApi,
  getReceiptPdfApi,
} from "@/services/api-service/generic-doc/receipts-api";
import { checkedItemsIdsState, finalTotalPaymentState } from "./states";
import { checkArrayNotEmptyOrEmailNotEmpty, checkArrayNotEmptyOrPhoneNotEmpty, isAtLeastOneSelected } from "@/utils/helpers";
import { useRouter } from "next/router";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { getAllUsersCanApproveQuoteApi } from "@/services/api-service/users/users-api";
import { newOrderIdToPrintJobsState } from "@/store/new-order-id-to-print-jobs-state";

const useButtonsContainer = (docType: DOCUMENT_TYPE) => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const { push } = useRouter();
  const { CheckDocumentPermission } = useUserPermission();
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const {
    alertFault,
    alertFaultSend,
    alertSuccessDelete,
    alertFaultDelete,
    alertSuccessUpdate,
    alertFaultUpdate,
    alertFaultAdded,
    alertSuccessAdded,
    alertFaultGetData,
  } = useSnackBar();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openOrderNowModal, setOpenOrderNowModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCancelReceiptModal, setOpenCancelReceiptModal] = useState(false);
  const [isSelectedAtLeastOne, setIsSelectedAtLeastOne] = useState(null);
  const [openMangerApprovalModal, setOpenMangerApprovalModal] = useState(false);
  const [, setShowPrintJobsModal] = useRecoilState(newOrderIdToPrintJobsState);

  useEffect(() => {
    const data = isAtLeastOneSelected(quoteItemValue?.documentItems);
    setIsSelectedAtLeastOne(data);
  }, [quoteItemValue]);

  const finalTotalPayment = useRecoilValue<number>(finalTotalPaymentState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
  const open = Boolean(anchorEl);

  const onClickOpenOrderNowModal = () => {
    if (!isSelectedAtLeastOne) {
      alertFault("reports.pleaseSelectOneItem");
    } else {
      let checkPhones = checkArrayNotEmptyOrPhoneNotEmpty(
        quoteItemValue?.documentContacts
      );
      let checkEmails = checkArrayNotEmptyOrEmailNotEmpty(
        quoteItemValue?.documentContacts
      );

      if (quoteItemValue?.client?.isCreateOrder) {

        if (!checkPhones && !checkEmails) {
          alertFault("home.admin.pleaseSelectPhoneOrEmail");
        }
        else {
          setOpenOrderNowModal(true);
        }

      } else {
        alertFault("home.admin.pleaseSelectClient");
      }
    }
  };

  const onClickCloseOrderNowModal = () => {
    setOpenOrderNowModal(false);
  };

  const onClickOpenPaymentModal = (selectedTabIndex) => {
    setSelectedTabIndex(selectedTabIndex);
    setOpenPaymentModal(true);
  };

  const onClickClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  const onClickOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const onClickCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const onClickOpenCancelReceiptModal = () => {
    setOpenCancelReceiptModal(true);
  };

  const onClickCloseCancelReceiptModal = () => {
    setOpenCancelReceiptModal(false);
  };

  const [loading, setLoading] = useState(false);
  const onClickConfirmWithoutNotification = async () => {
    setLoading(true);
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        onClickCloseOrderNowModal();
        setShowPrintJobsModal(res.data.orderID);
        navigate(`/jobs?orderNumber=${res?.data?.number}`);
      } else {
        alertFaultUpdate();
      }
      setLoading(false);
    };
    await createOrderApi(callApi, callBack, {
      quoteId: quoteItemValue?.id,
      sendMessage: false,
    });
  };

  const onClickConfirmWithNotification = async () => {
    setLoading(true);
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        onClickCloseOrderNowModal();
        setShowPrintJobsModal(res.data.orderID);
        navigate(`/jobs?orderNumber=${res?.data?.number}`);
      } else {
        alertFaultUpdate();
      }
      setLoading(false);
    };
    await createOrderApi(callApi, callBack, {
      quoteId: quoteItemValue?.id,
      sendMessage: true,
    });
  };

  const onClickPrint = async () => {
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
        // window.open(pdfLink, "_blank");
      } else {
        alertFaultGetData();
      }
    };
    if (docType === DOCUMENT_TYPE.receipt) {
      await getReceiptPdfApi(callApi, callBack, {
        receiptId: quoteItemValue?.id,
      });
    } else {
      await getDocumentPdfApi(callApi, callBack, {
        documentId: quoteItemValue?.id,
        documentType: docType,
      });
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getFormattedDocumentPath = (docType: DOCUMENT_TYPE): string => {
    const documentPath = DOCUMENT_TYPE[docType];
    return documentPath.charAt(0).toUpperCase() + documentPath.slice(1);
  };

  const checkedItemsIds = useRecoilValue(checkedItemsIdsState);
  const onClickCreateNewReceipt = async () => {
    const filteredReceiptItems = Object.values(checkedItemsIds)
      .map((id) => quoteItemValue.receiptItems.find((item) => item.id === id))
      .filter(Boolean);
    const newReceiptItem = {
      ...quoteItemValue,
      receiptItems: filteredReceiptItems,
    };
    if (finalTotalPayment === 0) {
      alertFaultAdded();
      return;
    }
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        navigate("/receipts");
      } else {
        alertFaultAdded();
      }
    };
    await createReceiptApi(callApi, callBack, { newReceiptItem });
  };

  const onClickCancelReceipt = async (refundCredit: boolean) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessDelete();
        navigate("/receipts");
      } else {
        alertFaultDelete();
      }
    };
    await cancelReceiptApi(callApi, callBack, {
      id: quoteItemValue?.id,
      refundCredit,
    });
  };

  const isNewCreation = router?.query?.isNewCreation;
  const isInvoice = docType === DOCUMENT_TYPE.invoice;
  const isQuote = docType === DOCUMENT_TYPE.quote;
  const isOrder = docType === DOCUMENT_TYPE.order;
  const canEditDocument =
    quoteItemValue?.isEditable &&
    CheckDocumentPermission(
      docType.toString(),
      DocumentPermission.EDIT_DOCUMENT
    );
  const canAddDelivery =
    docType === DOCUMENT_TYPE.quote ||
    docType === DOCUMENT_TYPE.order ||
    docType === DOCUMENT_TYPE.invoice ||
    docType === DOCUMENT_TYPE.invoiceRefund ||
    docType === DOCUMENT_TYPE.deliveryNote ||
    docType === DOCUMENT_TYPE.deliveryNoteRefund;

  const showAddNewItemBtn =
    canEditDocument && docType !== DOCUMENT_TYPE.receipt;

  const onClickCloseMangerApprovalModal = () => {
    setOpenMangerApprovalModal(false);
  };

  const onClickOpenMangerApprovalModal = () => {
    setOpenMangerApprovalModal(true);
  };

  const [managersOptions, setManagersOptions] = useState([]);
  const getAllUsersCanApproveQuote = async () => {
    const callBack = (res) => {
      if (res.success) {
        const mappedManagers = res.data.map((manager) => ({
          value: manager.id,
          text: manager.name,
        }));
        setManagersOptions(mappedManagers);
      }
    };
    await getAllUsersCanApproveQuoteApi(callApi, callBack);
  };

  const onClickSendAndChat = async (managerIds: string[]) => {
    const callBack = (res) => {
      if (res?.success) {
        push(`/messenger?dialogId=${res.data}`);
      } else alertFaultSend();
    };
    await sendQuoteApprovalToManagerApi(callApi, callBack, {
      docType,
      data: { managerIds, documentId: quoteItemValue?.id },
    });
  };

  const [anchorElCloseBtn, setAnchorElCloseBtn] = useState<null | HTMLElement>(
    null
  );
  const openCloseBtn = Boolean(anchorElCloseBtn);

  const handleCloseBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCloseBtn(event.currentTarget);
  };

  const handleCloseBtnClose = () => {
    setAnchorElCloseBtn(null);
  };

  const isShowCloseButton =
    quoteItemValue?.isCanClose &&
    ((docType === DOCUMENT_TYPE.order &&
      quoteItemValue?.statusTitleText !== "Order.Canceled") ||
      docType === DOCUMENT_TYPE.invoice ||
      docType === DOCUMENT_TYPE.deliveryNote);

  const ManuallyCloseDocument = async (selectedDocumentId) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        docType === DOCUMENT_TYPE.order
          ? navigate("/orders")
          : docType === DOCUMENT_TYPE.deliveryNote
            ? navigate("/deliveryNotes")
            : navigate("/invoices");
      } else {
        alertFaultUpdate();
      }
    };
    await manuallyCloseDocumentApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: selectedDocumentId,
        documentNumber: documentCloseNumber,
      },
    });
  };

  const [selectedDocumentId, setSelectedDocumentId] = useState<any>({});
  const [openCloseOrderModal, setOpenCloseOrderModal] = useState(false);
  const [documentCloseNumber, setDocumentCloseNumber] = useState("");

  const onClickOpenCloseOrderModal = (documentId) => {
    setSelectedDocumentId(documentId);
    setOpenCloseOrderModal(true);
  };

  const onClickCloseCloseOrderModal = () => {
    setOpenCloseOrderModal(false);
    setDocumentCloseNumber("");
  };

  const handleDocumentNumberChange = (event) => {
    setDocumentCloseNumber(event.target.value);
  };

  const handleAddExistingItem = () => {
    if (isQuote) {
      navigate(`/jobs?clientId=${quoteItemValue?.customerID}`);
    } else if (isOrder) {
      navigate(
        `/jobs?targetOrderId=${quoteItemValue?.id}&targetOrderNumber=${quoteItemValue?.number}&clientId=${quoteItemValue?.customerID}`
      );
    }
  };

  return {
    openOrderNowModal,
    onClickConfirmWithoutNotification,
    onClickConfirmWithNotification,
    onClickOpenOrderNowModal,
    onClickCloseOrderNowModal,
    onClickPrint,
    t,
    onClickClosePaymentModal,
    onClickOpenPaymentModal,
    openPaymentModal,
    selectedTabIndex,
    quoteItemValue,
    alertFault,
    anchorEl,
    setAnchorEl,
    open,
    handleClose,
    handleClick,
    getFormattedDocumentPath,
    onClickCreateNewReceipt,
    openDeleteModal,
    onClickCloseDeleteModal,
    onClickOpenDeleteModal,
    onClickCancelReceipt,
    openCancelReceiptModal,
    onClickOpenCancelReceiptModal,
    onClickCloseCancelReceiptModal,
    showAddNewItemBtn,
    canEditDocument,
    isNewCreation,
    openMangerApprovalModal,
    onClickCloseMangerApprovalModal,
    onClickOpenMangerApprovalModal,
    getAllUsersCanApproveQuote,
    managersOptions,
    onClickSendAndChat,
    loading,
    canAddDelivery,
    isInvoice,
    isShowCloseButton,
    anchorElCloseBtn,
    handleCloseBtnClose,
    handleCloseBtnClick,
    openCloseBtn,
    onClickOpenCloseOrderModal,
    onClickCloseCloseOrderModal,
    handleDocumentNumberChange,
    documentCloseNumber,
    ManuallyCloseDocument,
    openCloseOrderModal,
    selectedDocumentId,
    handleAddExistingItem,
    isOrder,
    isQuote,
  };
};

export { useButtonsContainer };
