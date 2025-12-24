import { openReceiptCreationModalState, quoteItemState } from "@/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";
import {
  createOrderApi,
  getDocumentPdfApi,
  manuallyCloseDocumentApi,
  sendQuoteApprovalToManagerApi,
} from "@/services/api-service/generic-doc/documents-api";
import {
  DOCUMENT_TYPE,
  StatusTitleText,
} from "@/pages-components/quotes/enums";
import {
  cancelReceiptApi,
  createReceiptApi,
  getReceiptInvoicesPdfApi,
  getReceiptPdfApi,
  printReceiptChecksApi,
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
  validateUsAddressFields,
} from "@/utils/helpers";
import { useRouter } from "next/router";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";
import {
  getAllUsersCanApproveQuoteApi,
  getEmployeeApi,
  getAllUsersApi,
} from "@/services/api-service/users/users-api";
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
import { validateAddressApi } from "@/services/api-service/customers/customers-api";
import { createInvoiceFromOrderIdApi } from "@/services/api-service/generic-doc/invoices";
import {
  openOrderModalState,
  shouldReopenOrderModalState,
} from "@/store/order-modal-states";
import {
  checkIfCanMakeGroupedBoardMissionsUsingOrderIdApi,
  getGroupJobsUsingOrderIdApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { directMessagesService } from "@/services/frontdesk/api/direct-messages.service";
import {
  StatePayment,
  sendPaymentState,
} from "@/pages-components/quotes/widgets/send-payment-modal/states";
import {
  getDocumentContactApi,
  sendDocumentToClientForPaymentApi,
} from "@/services/api-service/pay/pay-api";

const useButtonsContainer = (docType: DOCUMENT_TYPE) => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const { push } = useRouter();
  const { CheckDocumentPermission, CheckPermission } = useUserPermission();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
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
  const ReceiptSummeryModal = useModal();

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openOrderNowModal, setOpenOrderNowModal] =
    useRecoilState<boolean>(openOrderModalState);

  const CheckoutOptionModal = useModal();
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

  const validateAddress = async (addressWithMetadata) => {
    return await validateAddressApi(callApi, () => { }, addressWithMetadata);
  };

  const setShouldReopen = useSetRecoilState(shouldReopenOrderModalState);

  const onClickOpenOrderNowModal = async (addressChecked: boolean = false) => {
    if (!quoteItemValue?.isHaveCustomers && !quoteItemValue?.client) {
      AlertAddCustomerModal.open();
      return;
    }

    // Check if client is present and can create orders
    if (!quoteItemValue?.client?.isCreateOrder) {
      alertFault("home.admin.pleaseSelectClient");
      return;
    }

    const isAddressRequired = CheckPreferenceValue(
      EPreferences.ADDRESSES_REQUIRED_FOR_ORDER
    );
    const noBillingAddress =
      (quoteItemValue?.documentBillingAddresses?.length ?? 0) === 0;

    if (isAddressRequired && noBillingAddress && !addressChecked) {
      setSelectedAddressType(EAddressType.BILLING);
      setShouldReopen(true);
      setTimeout(() => {
        setOpenAddressModal(true);
      }, 0);
      return;
    }

    // Validate required fields (for US addresses) and validate address
    if (
      CheckPreferenceValue(EPreferences.ADDRESSES_REQUIRED_FOR_ORDER) &&
      quoteItemValue?.isUsedStripe
    ) {
      const billingAddress = quoteItemValue.documentBillingAddresses?.[0];

      if (billingAddress) {
        const { isValid, missingFields } =
          validateUsAddressFields(billingAddress);
        if (!isValid) {
          const translatedFields = missingFields
            .map((fieldKey) => t(fieldKey))
            .join(", ");
          alertFault(`${t("modal.RequiredFields")}: ${translatedFields}`);
          setSelectedAddressType(EAddressType.BILLING);
          setTimeout(() => {
            setOpenAddressModal(true);
          }, 0);
          return;
        }

        const validateRes = await validateAddress(billingAddress);
        if (!validateRes?.success || validateRes?.data?.ErrorMessage) {
          alertFault(
            validateRes?.data?.ErrorMessage || "Address validation failed."
          );
          setSelectedAddressType(EAddressType.BILLING);
          setTimeout(() => {
            setOpenAddressModal(true);
          }, 0);
          return;
        }
      }
    }

    if (!isSelectedAtLeastOne) {
      alertFault("reports.pleaseSelectOneItem");
      return;
    }

    const itemsRequiringEditing = [];
    quoteItemValue?.documentItems?.forEach((item, index) => {
      if (item?.isRequiredEditing) {
        itemsRequiringEditing.push(index + 1);
      }
    });

    if (itemsRequiringEditing.length > 0) {
      const itemNumbers = itemsRequiringEditing.join(", ");
      alertFault(
        t("alerts.itemsMustBeEdited", {
          itemNumbers: itemNumbers,
        })
      );
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

  const CheckoutModalOpen = useModal();
  const [checkoutModalData, setCheckoutModalData] = useState<{
    orderId: string;
    orderNumber: string;
  } | null>(null);
  const [pendingOrderData, setPendingOrderData] = useState(null);

  const sendBodyCommingFromOrder = (
    res,
    sendMessage,
    isPrepaymentClient,
    isStripeCash,
    shouldOpenComposer = false
  ) => {
    if (quoteItemValue?.isUsedStripe) {
      if (!sendMessage) {
        navigate(`/orders?finalPatternSearch=${res?.data?.number}`);
      } else {
        if (isStripeCash) {
          navigate(`/orders?finalPatternSearch=${res?.data?.number}`);
        } else if (res?.data?.paymentLink) {
          window.open(res.data.paymentLink, "_self");
        } else {
          alertFaultGetData();
        }
      }
    } else if (isPrepaymentClient) {
      navigate(`/orders?finalPatternSearch=${res?.data?.number}`);
    } else {
      if (res.data.isShowCheckoutModal) {
        setCheckoutModalData({
          orderId: res.data.orderID,
          orderNumber: res.data.number,
        });

        CheckoutModalOpen.open();
      } else {
        setShowPrintJobsModal(res.data.orderID);
        const queryParams = shouldOpenComposer
          ? `orderNumber=${res?.data?.number}&openComposer=true&orderId=${res?.data?.orderID}`
          : `orderNumber=${res?.data?.number}`;
        navigate(`/jobs?${queryParams}`);
      }
    }
  };

  const handleCheckIfCanMakeGroupedBoardMissionsUsingOrderId = async (
    orderId,
    res,
    sendMessage,
    isPrepaymentClient,
    isStripeCash,
    shouldOpenComposer = false
  ) => {
    const callBack = (result) => {
      if (
        result?.success &&
        CheckPreferenceValue(EPreferences.ASK_TO_GROUP_SIMILAR_JOBS)
      ) {
        if (result?.data?.item1) {
          setPendingOrderData({
            orderId: orderId,
            res: res,
            sendMessage: sendMessage,
            isPrepaymentClient: isPrepaymentClient,
            isStripeCash: isStripeCash,
            shouldOpenComposer: shouldOpenComposer,
          });
          isOpenGroupJobsModal.open();
        } else {
          sendBodyCommingFromOrder(
            res,
            sendMessage,
            isPrepaymentClient,
            isStripeCash,
            shouldOpenComposer
          );
        }
      } else {
        sendBodyCommingFromOrder(
          res,
          sendMessage,
          isPrepaymentClient,
          isStripeCash,
          shouldOpenComposer
        );
      }
    };

    await checkIfCanMakeGroupedBoardMissionsUsingOrderIdApi(
      callApi,
      callBack,
      orderId
    );
  };

  const handleGetGroupJobsUsingOrderId = async (pendingOrderData) => {
    const callBack = (result) => {
      if (result?.success) {
        isOpenGroupJobsModal.close();
        sendBodyCommingFromOrder(
          pendingOrderData?.res,
          pendingOrderData?.sendMessage,
          pendingOrderData?.isPrepaymentClient,
          pendingOrderData?.isStripeCash,
          pendingOrderData?.shouldOpenComposer
        );
      } else {
        isOpenGroupJobsModal.close();
        setPendingOrderData(null);
        alertFaultUpdate();
      }
    };

    await getGroupJobsUsingOrderIdApi(
      callApi,
      callBack,
      pendingOrderData?.orderId
    );
  };
  const isOpenGroupJobsModal = useModal();

  const handleOrderConfirmation = async (
    sendMessage: boolean,
    isPrepaymentClient: boolean = false,
    totalPrePaymentAmount: number = 0,
    percentageOfTotal: number = 0,
    isStripeCash: boolean = false,
    shouldOpenComposer: boolean = false
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        onClickCloseOrderNowModal();
        handleCheckIfCanMakeGroupedBoardMissionsUsingOrderId(
          res?.data?.orderID,
          res,
          sendMessage,
          isPrepaymentClient,
          isStripeCash,
          shouldOpenComposer
        );
      } else {
        alertFaultUpdate();
      }
    };

    const requestBody = {
      quoteId: quoteItemValue?.id,
      sendMessage,
      ...(sendMessage && quoteItemValue?.isUsedStripe && { isStripeCash }),
      ...(isPrepaymentClient && { totalPrePaymentAmount }),
      ...(isPrepaymentClient && { percentageOfTotal }),
    };

    await createOrderApi(callApi, callBack, requestBody);
  };

  const handleProcessCheckout = async (orderId: string) => {
    const callBack = (res) => {
      if (res?.success) {
        const DocumentNumber = res.data.docEntry;
        const ClientId = res.data.client.id;
        navigate(
          `/receipt?isNewCreation=true&documentNumber=${DocumentNumber}&ClientId=${ClientId}`
        );
        CheckoutModalOpen.close();
      }
    };

    await createInvoiceFromOrderIdApi(callApi, callBack, orderId);
  };

  const onClickConfirmWithoutNotification = () =>
    handleOrderConfirmation(false);
  const onClickConfirmWithNotification = (isStripeCash: boolean) =>
    handleOrderConfirmation(true, false, 0,0, !!isStripeCash);
  const onClickConfirm = () => {
    // When frontdesk is enabled, always open composer after order creation
    handleOrderConfirmation(false, false, 0,0, false, hasFrontDeskFeature);
  };

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
        //navigate(pdfLink);
        window.open(pdfLink, "_blank");
        // downloadPdf(pdfLink);
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

  const filteredReceiptItems = Object.keys(checkedItemsIds)
    .map((key) => {
      const item = quoteItemValue?.receiptItems?.find(
        (item) => item.id === checkedItemsIds[key]
      );
      const sumApplied = allocatedSums[key] || 0;
      return item ? { ...item, sumApplied } : null;
    })
    .filter(Boolean);

  const onClickCreateNewReceipt = async () => {
    const newReceiptItem = {
      ...quoteItemValue,
      receiptItems: filteredReceiptItems,
    };
    if (finalTotalPayment === 0) {
      alertFault(t("alerts.totalPaymentZero"));
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

  const handleOpenReceiptSummary = () => {
    if (!quoteItemValue?.client?.id) {
      alertFault(t("home.admin.pleaseSelectClient"));
      return;
    }

    if (finalTotalPayment === 0) {
      alertFault(t("alerts.totalPaymentZero"));
      return;
    }

    ReceiptSummeryModal.open();
  };

  const onClickCancelReceipt = async (refundCredit: boolean) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessDelete();
        isOutgoingPayments
          ? navigate("/supplier-payments")
          : navigate("/receipts");
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
  const isProformaInvoice = docType === DOCUMENT_TYPE.proformaInvoice;
  const isQuote = docType === DOCUMENT_TYPE.quote;
  const isOrder = docType === DOCUMENT_TYPE.order;
  const isOutgoingPayments = router.query.isOutgoingPayments === "true";
  const isReceipt = docType === DOCUMENT_TYPE.receipt;
  const isPurchaseInvoice = docType === DOCUMENT_TYPE.purchaseInvoice;
  const isPurchaseOrder = docType === DOCUMENT_TYPE.purchaseOrder;

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
        console.log("Mapped managers:", mappedManagers);
        setManagersOptions(mappedManagers);
      }
    };
    await getAllUsersCanApproveQuoteApi(callApi, callBack);
  };

  const onClickSendAndChat = async (managerIds: string[]) => {
    // Send FrontDesk messages to managers before external API
    for (const managerId of managerIds) {
      try {
        // Get employee details by employeeId (manager.id)
        const employeeCallBack = async (employeeRes: any) => {
          if (employeeRes.success) {
            // console.log(`Employee details for employeeId ${managerId}:`, employeeRes.data);
            // Use employeeRes.data.id as participant for this specific manager
            const participantId = employeeRes.data.id;
            // console.log(`Creating separate conversation for participant ID: ${participantId}`);
            try {
              // Create separate conversation for each manager
              const { conversation } =
                await directMessagesService.createConversation({
                  participantIds: [participantId],
                  name: `Quote Approval - ${quoteItemValue?.number || quoteItemValue?.id
                    }`,
                  contextId: quoteItemValue?.id,
                  contextType: "QUOTE",
                });

              // Send the approval request message
              const messageContent = `📋 Quote Approval Request
              Quote ID: ${quoteItemValue?.id}
              Quote Number: ${quoteItemValue?.number || "N/A"}
              Client: ${quoteItemValue?.client?.name || "N/A"}
              Total Amount: ${quoteItemValue?.totalAmount || "N/A"}
              Please review and approve this quote.`;

              await directMessagesService.sendMessage(conversation.id, {
                content: messageContent,
                metadata: { type: "text" },
              });

              console.log(
                `Separate message sent successfully to participant ${participantId}`
              );
            } catch (messageError) {
              console.error(
                `Failed to send message to participant ${participantId}:`,
                messageError
              );
            }
          } else {
            console.warn(
              `Could not get employee details for employeeId: ${managerId}`
            );
          }
        };
        await getEmployeeApi(callApi, employeeCallBack, managerId);
      } catch (error) {
        console.error(
          `Failed to send FrontDesk message to manager ${managerId}:`,
          error
        );
        // Continue anyway - don't block the main approval flow
      }
    }

    // Continue with existing external API call
    const callBack = (res) => {
      if (res?.success) {
        if (res?.data) {
          push(`/messenger?dialogId=${res.data}`);
        } else {
          push(`/quotes`);
        }
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
    ((isOrder &&
      quoteItemValue?.statusTitleText !== StatusTitleText.OrderCanceled) ||
      isInvoice ||
      isDeliveryNote ||
      isPurchaseOrder ||
      isPurchaseInvoice);

  const ManuallyCloseDocument = async (selectedDocumentId) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        isOrder
          ? navigate("/orders")
          : isDeliveryNote
            ? navigate("/deliveryNotes")
            : isInvoice
              ? navigate("/invoices")
              : navigate("/purchaseOrders");
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

  const handleClickPrintChecks = async () => {
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
      receiptId: quoteItemValue?.id,
    });
  };

  const [openCloseOrderNotesModal, setOpenCloseOrderNotesModal] =
    useState(false);
  const [onClickCloseOrderCallback, setOnClickCloseOrderCallback] = useState<
    (() => void) | null
  >(null);

  const onClickOpenCloseOrderNotesModal = (onClickCloseOrder: () => void) => {
    setOnClickCloseOrderCallback(() => onClickCloseOrder);
    setOpenCloseOrderNotesModal(true);
  };

  const onClickCloseCloseOrderNotesModal = () => {
    setOpenCloseOrderNotesModal(false);
  };

  // Send Payment Modal State
  const [openSendPaymentModal, setOpenSendPaymentModal] = useState(false);
  const [isSendToClient, setIsSendToClient] = useState(false);
  const [isSendOrderReadyToClient, setIsSendOrderReadyToClient] =
    useState(false);
  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [sendPayment, setSendPayment] =
    useRecoilState<StatePayment>(sendPaymentState);
  const [openAddProductWithAIModal, setOpenAddProductWithAIModal] =
    useState(false);

  const onClickCloseSendPaymentModal = () => {
    setOpenSendPaymentModal(false);
  };

  const onClickSendPaymentOld = (
    document: any,
    isSendToClientParam: boolean
  ): Promise<void> => {
    if (isSendToClientParam) {
      return new Promise<void>((resolve, reject) => {
        const callBack = (res) => {
          if (res?.success) {
            const newSendPaymentState = { ...sendPayment };
            newSendPaymentState.documentId = document?.id;
            newSendPaymentState.documentContacts = res.data;
            setSendPayment(newSendPaymentState);
            resolve();
          } else {
            reject(new Error("Failed to update payment state"));
          }
        };
        getDocumentContactApi(callApi, callBack, {
          documentId: document?.id,
          documentType: docType,
        });
      });
    } else {
      return new Promise<void>((resolve, reject) => {
        const callBack = (res) => {
          if (res?.success) {
            const newSendPaymentState = { ...sendPayment, ...res.data };
            setSendPayment(newSendPaymentState);
            resolve();
          } else {
            reject(new Error("Failed to update payment state"));
          }
        };
        sendDocumentToClientForPaymentApi(callApi, callBack, {
          id: document?.id,
          documentType: docType,
        });
      });
    }
  };

  const onClickSendPayment = async (
    document: any,
    isSendToClientParam: boolean,
    isSendOrderReadyToClientParam: boolean = false
  ) => {
    setIsSendToClient(isSendToClientParam);
    setIsSendOrderReadyToClient(isSendOrderReadyToClientParam);
    try {
      await onClickSendPaymentOld(document, isSendToClientParam);
      setPaymentModalTitle(
        `${t("prePayment.paymentPageFor")} ${t(
          `sales.quote.${DOCUMENT_TYPE[docType]}`
        ).toLowerCase()} ${t("sales.quote.number")} - ${document?.number}`
      );
      setOpenSendPaymentModal(true);
    } catch (error) {
      alertFaultGetData();
    }
  };

  return {
    openOrderNowModal,
    onClickConfirmWithoutNotification,
    onClickConfirmWithNotification,
    onClickConfirm,
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
    isProformaInvoice,
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
    CheckoutOptionModal,
    onClickCloseCloseOrderNotesModal,
    onClickOpenCloseOrderNotesModal,
    openCloseOrderNotesModal,
    setOpenCloseOrderNotesModal,
    onClickCloseOrderCallback,
    isPurchaseOrder,
    handleClickPrintChecks,
    checkoutModalData,
    CheckoutModalOpen,
    setShowPrintJobsModal,
    handleProcessCheckout,
    router,
    handleGetGroupJobsUsingOrderId,
    isOpenGroupJobsModal,
    pendingOrderData,
    setPendingOrderData,
    ReceiptSummeryModal,
    filteredReceiptItems,
    finalTotalPayment,
    handleOpenReceiptSummary,
    sendBodyCommingFromOrder,
    openSendPaymentModal,
    onClickCloseSendPaymentModal,
    onClickSendPayment,
    paymentModalTitle,
    isSendToClient,
    isSendOrderReadyToClient,
    openAddProductWithAIModal,
    onClickOpenAddProductWithAIModal: () => setOpenAddProductWithAIModal(true),
    onClickCloseAddProductWithAIModal: () =>
      setOpenAddProductWithAIModal(false),
  };
};

export { useButtonsContainer };
