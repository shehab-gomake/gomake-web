import { openReceiptCreationModalState, quoteItemState } from "@/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
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
  getReceiptInvoicesPdfApi,
  getReceiptPdfApi,
} from "@/services/api-service/generic-doc/receipts-api";
import {
  allocatedSumsState,
  checkedItemsIdsState,
  finalTotalPaymentState,
} from "./states";
import {
  checkArrayNotEmptyOrEmailNotEmpty,
  checkArrayNotEmptyOrPhoneNotEmpty,
  isAtLeastOneSelected,
} from "@/utils/helpers";
import { useRouter } from "next/router";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { getAllUsersCanApproveQuoteApi } from "@/services/api-service/users/users-api";
import { newOrderIdToPrintJobsState } from "@/store/new-order-id-to-print-jobs-state";
import { Permissions } from "@/components/CheckPermission/enum";
import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { useModal } from "@/hooks/use-modal";
import {
  addressModalState,
  addressTypeState,
  EAddressType,
} from "../business-widget/address-widget/state";

const useButtonsContainer = (docType: DOCUMENT_TYPE) => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const { push } = useRouter();
  const { CheckDocumentPermission, CheckPermission } = useUserPermission();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const setOpenAddressModal = useSetRecoilState<boolean>(addressModalState);
  const setSelectedAddressType =
    useSetRecoilState<EAddressType>(addressTypeState);

  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
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
  const AlertAddCustomerModal = useModal();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openOrderNowModal, setOpenOrderNowModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCancelReceiptModal, setOpenCancelReceiptModal] = useState(false);
  const [isSelectedAtLeastOne, setIsSelectedAtLeastOne] = useState(null);
  const [openMangerApprovalModal, setOpenMangerApprovalModal] = useState(false);
  const [, setShowPrintJobsModal] = useRecoilState(newOrderIdToPrintJobsState);
  const [openReceiptCreationModal, setOpenReceiptCreationModal] =
    useRecoilState(openReceiptCreationModalState);

  const [openOrderNowPrePaymentModal, setOpenOrderNowPrePaymentModal] =
    useState(false);

  const onClickCloseOrderNowPreModal = () => {
    setOpenOrderNowPrePaymentModal(false);
  };

  const onClickOpenReceiptCreation = () => {
    setOpenReceiptCreationModal(true);
  };
  const onClickCloseReceiptCreation = () => {
    setOpenReceiptCreationModal(false);
  };

  useEffect(() => {
    const data = isAtLeastOneSelected(quoteItemValue?.documentItems);
    setIsSelectedAtLeastOne(data);
  }, [quoteItemValue]);

  const finalTotalPayment = useRecoilValue<number>(finalTotalPaymentState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
  const open = Boolean(anchorEl);

  const onClickOpenOrderNowModal = () => {
    // if (quoteItemValue?.isUsedStripe && !quoteItemValue?.isConnectedToStripe) {
    //   alertFault("alerts.stripNotConnected");
    //   return;
    // }

    if (!quoteItemValue?.isHaveCustomers && !quoteItemValue?.client) {
      AlertAddCustomerModal.open();
      return;
    }

    // Check if client is present and can create orders
    if (!quoteItemValue?.client?.isCreateOrder) {
      alertFault("home.admin.pleaseSelectClient");
      return;
    }

    if (
      CheckPreferenceValue(EPreferences.ADDRESSES_REQUIRED_FOR_ORDER) &&
      quoteItemValue?.documentBillingAddresses?.length === 0
    ) {
      // alertFault("alerts.missingBillingAddress");
      setSelectedAddressType(EAddressType.BILLING);
      setTimeout(() => {
        setOpenAddressModal(true);
      }, 0);
      return;
    }

    if (!isSelectedAtLeastOne) {
      alertFault("reports.pleaseSelectOneItem");
      return;
    }

    const hasItemsRequiringEditing = quoteItemValue?.documentItems?.some(
      (item) => item?.isRequiredEditing
    );
    if (hasItemsRequiringEditing) {
      alertFault("alerts.itemsMustBeEdited");
      return;
    }

    const hasValidPhone = checkArrayNotEmptyOrPhoneNotEmpty(
      quoteItemValue?.documentContacts || []
    );
    const hasValidEmail = checkArrayNotEmptyOrEmailNotEmpty(
      quoteItemValue?.documentContacts || []
    );

    // Ensure phone or email is provided
    if (!hasValidPhone && !hasValidEmail) {
      alertFault("home.admin.pleaseSelectPhoneOrEmail");
      return;
    }

    // Open appropriate modal
    if (quoteItemValue?.isPrepaymentClient) {
      setOpenOrderNowPrePaymentModal(true);
    } else {
      setOpenOrderNowModal(true);
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

  const handleOrderConfirmation = async (
    sendMessage: boolean,
    isPrepaymentClient: boolean = false,
    totalPrePaymentAmount: number = 0
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        onClickCloseOrderNowModal();
        if (quoteItemValue?.isUsedStripe) {
          if (!sendMessage) {
            navigate(`/orders?finalPatternSearch=${res?.data?.number}`);
          } else {
            if (res?.data?.paymentLink) {
              window.open(res.data.paymentLink, "_self");
            } else {
              alertFaultGetData();
            }
          }
        } else if (isPrepaymentClient) {
          navigate(`/orders?finalPatternSearch=${res?.data?.number}`);
        } else {
          setShowPrintJobsModal(res.data.orderID);
          navigate(`/jobs?orderNumber=${res?.data?.number}`);
        }
      } else {
        alertFaultUpdate();
      }
    };

    const requestBody = {
      quoteId: quoteItemValue?.id,
      sendMessage,
      ...(isPrepaymentClient && { totalPrePaymentAmount }),
    };

    await createOrderApi(callApi, callBack, requestBody);
  };

  const onClickConfirmWithoutNotification = () =>
    handleOrderConfirmation(false);
  const onClickConfirmWithNotification = () => handleOrderConfirmation(true);

  const onClickPrint = async (withInvoices?: boolean) => {
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

    if (isReceipt) {
      if (withInvoices)
        await getReceiptInvoicesPdfApi(callApi, callBack, {
          receiptId: quoteItemValue?.id,
        });
      else
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
    const documentPath = isOutgoingPayments
      ? "supplierPayment"
      : DOCUMENT_TYPE[docType];
    return documentPath.charAt(0).toUpperCase() + documentPath.slice(1);
  };

  const checkedItemsIds = useRecoilValue(checkedItemsIdsState);

  const allocatedSums = useRecoilValue(allocatedSumsState);

  const onClickCreateNewReceipt = async () => {
    // const filteredReceiptItems = Object.values(checkedItemsIds)
    //   .map((id) => quoteItemValue.receiptItems.find((item) => item.id === id))
    //   .filter(Boolean);
    const filteredReceiptItems = Object.keys(checkedItemsIds)
      .map((key) => {
        const item = quoteItemValue.receiptItems.find(
          (item) => item.id === checkedItemsIds[key]
        );

        const sumApplied = allocatedSums[key] || 0;

        return item ? { ...item, sumApplied } : null;
      })
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
        const receiptId = res?.data;
        alertSuccessAdded();
        isOutgoingPayments
          ? router.replace(`/receipt?isOutgoingPayments=true&Id=${receiptId}`)
          : router.replace(`/receipt?Id=${receiptId}`);
        onClickOpenReceiptCreation();
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
  const isDeliveryNote = docType === DOCUMENT_TYPE.deliveryNote;
  const isQuote = docType === DOCUMENT_TYPE.quote;
  const isOrder = docType === DOCUMENT_TYPE.order;
  const isOutgoingPayments = router.query.isOutgoingPayments === "true";
  const isReceipt = docType === DOCUMENT_TYPE.receipt;
  const isPurchaseInvoice = docType === DOCUMENT_TYPE.purchaseInvoice;

  const canCancelReceipt = CheckPermission(Permissions.CANCEL_RECEIPT);

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

  const [openExportReceiptPdfModal, setOpenExportReceiptPdfModal] =
    useState<boolean>(false);

  const onOpenExportReceiptPdfModal = () => {
    setOpenExportReceiptPdfModal(true);
  };

  const onCloseExportReceiptPdfModal = () => {
    setOpenExportReceiptPdfModal(false);
  };

  const handleClickPrint = () => {
    if (isReceipt) {
      onOpenExportReceiptPdfModal();
    } else onClickPrint();
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
    openReceiptCreationModal,
    onClickCloseReceiptCreation,
    openExportReceiptPdfModal,
    onOpenExportReceiptPdfModal,
    onCloseExportReceiptPdfModal,
    handleClickPrint,
    openOrderNowPrePaymentModal,
    onClickCloseOrderNowPreModal,
    handleOrderConfirmation,
    setOpenReceiptCreationModal,
    isReceipt,
    canCancelReceipt,
    isDeliveryNote,
    AlertAddCustomerModal,
    isPurchaseInvoice,
  };
};

export { useButtonsContainer };
