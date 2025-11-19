import { useStyle } from "./style";
import { ArrowDownNewIcon, EditIcon, PlusIcon, WastebasketNew2 } from "@/icons";
import { DownloadExcelSheet } from "@/icons/material-tabs/download-excel-sheet";
import { useTranslation } from "react-i18next";
import {
  GoMakeDeleteModal,
  GomakePrimaryButton,
  ThreeOptionsModal,
} from "@/components";
import { useButtonsContainer } from "./use-buttons-container";
import {
  DELIVERY_NOTE_STATUSES,
  DOCUMENT_TYPE,
  PURCHASE_ORDER_STATUSES,
} from "@/pages-components/quotes/enums";
import { PaymentModal } from "./payment/payment-modal";
import { PaymentBtn } from "./payment/payment-button";
import { OrderNowModal } from "../total-price-and-vat/order-now-modal";
import { useGomakeRouter, useSnackBar } from "@/hooks";
import { ManagerApprovalModal } from "../total-price-and-vat/manger-approval-modal";
import { useEffect, useMemo } from "react";
import { CreditCardIcon } from "@/icons/credit-card-icon";
import { CloseBtnMenu } from "./close-btn-menu";
import { ArrowUpNewIcon } from "@/icons/arrow-up-new";
import { ManuallyCloseModal } from "./close-manually-modal";
import { InvoiceCreationModal } from "../invoice-creation-modal";
import { ModalType } from "@/enums";
import { OrderNowPrePaymentModal } from "../total-price-and-vat/order-now-modal/order-now-pre-payment";
import { validateDocument } from "@/utils/validators";
import { CloseOrderNotesModal } from "@/pages-components/products/profits-new/widgets/close-order-notes-modal";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { ReceiptSummaryContent } from "../receipt-summary-content/receipt-summary-content";
import { AttachIcon } from "@/components/icons/attach-icon";
import { SecondaryButton } from "@/components/button/secondary-button";
import { SendPaymentModal } from "@/pages-components/quotes/widgets/send-payment-modal/send-payment-modal";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PayIcon } from "@/pages-components/quotes/more-circle/icons/pay";

const ButtonsContainer = ({
  openSendBtn,
  onOpenNewItem,
  handleCancelBtnClick,
  handleSaveBtnClick,
  handleSendBtnClick,
  onOpenDeliveryModal,
  onOpenUpdateDeliveryModal,
  documentType,
  onOpenCopyFromOrder,
  onClickOpenNewItemNotesModal,
  handleRejectBtnClick,
  handleAcceptBtnClick,
  onClickOpenChangeProductionStatusModal,
  onClickSendReceiptToClient,
  handleSendUsingWhatsAppWeb,
  onClickConfirmCreateDocument,
  onClickOpenAddAttachmentsModal,
  onClickOpenAddAttachmentsPurchaseModal,
  onClickOpenDeleteDeliveryModal,
  AddCustomerModal,
  handleSaveDraftBtnClick,
  modalCallback,
  receiptSendModal,
  openReceiptModal,
  clientType,
  deliveryDate,
  handleExportToExcel,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { alertFault } = useSnackBar();
  const { navigate } = useGomakeRouter();

  const showAlertModal = ({
    message,
    onConfirm,
  }: {
    message: string;
    onConfirm?: () => void;
  }) => {
    alertFault(message);
    if (onConfirm) {
      onConfirm();
    }
  };

  const {
    quoteItemValue,
    openOrderNowModal,
    onClickCloseOrderNowModal,
    onClickOpenOrderNowModal,
    onClickConfirmWithoutNotification,
    onClickConfirmWithNotification,
    onClickPrint,
    onClickClosePaymentModal,
    onClickOpenPaymentModal,
    openPaymentModal,
    selectedTabIndex,
    getFormattedDocumentPath,
    onClickCreateNewReceipt,
    onClickCancelReceipt,
    openDeleteModal,
    onClickCloseDeleteModal,
    onClickOpenDeleteModal,
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
    handleClickPrint,
    openExportReceiptPdfModal,
    onCloseExportReceiptPdfModal,
    openOrderNowPrePaymentModal,
    onClickCloseOrderNowPreModal,
    handleOrderConfirmation,
    setOpenReceiptCreationModal,
    isReceipt,
    canCancelReceipt,
    isDeliveryNote,
    AlertAddCustomerModal,
    // AddCustomerModal,
    // customer,
    // setCustomer,
    isPurchaseInvoice,
    onClickCloseCloseOrderNotesModal,
    onClickOpenCloseOrderNotesModal,
    openCloseOrderNotesModal,
    onClickCloseOrderCallback,
    isPurchaseOrder,
    CheckoutOptionModal,
    handleClickPrintChecks,
    checkoutModalData,
    setShowPrintJobsModal,
    CheckoutModalOpen,
    handleProcessCheckout,
    router,
    handleGetGroupJobsUsingOrderId,
    isOpenGroupJobsModal,
    pendingOrderData,
    setPendingOrderData,
    sendBodyCommingFromOrder,
    ReceiptSummeryModal,
    filteredReceiptItems,
    finalTotalPayment,
    handleOpenReceiptSummary,
    openSendPaymentModal,
    onClickCloseSendPaymentModal,
    onClickSendPayment,
    paymentModalTitle,
    isSendToClient,
    isSendOrderReadyToClient,
  } = useButtonsContainer(documentType);

  const isShowSendButton =
    (quoteItemValue.isSendWhatsapp ||
      quoteItemValue.isSendWhatsappWeb ||
      quoteItemValue.isSendMails ||
      quoteItemValue.isSendSMS) &&
    !quoteItemValue?.isNeedApproval;

  const hasFilesInEachDocument = useMemo(() => {
    return (
      quoteItemValue?.documentItems?.some(
        (item) =>
          item.files && Array.isArray(item.files) && item.files.length > 0
      ) || false
    );
  }, [quoteItemValue?.documentItems]);

  const handleCopyFromDocumentClick = (documentNumber) => {
    if (!quoteItemValue?.client) {
      alertFault("home.admin.pleaseSelectCustomer");
    } else {
      onOpenCopyFromOrder(documentNumber);
    }
  };

  const handleAddItemClick = () => {
    // if (!quoteItemValue?.client) {
    //   alertFault("home.admin.pleaseSelectCustomer");
    // }
    //  else {
    //   onOpenNewItem();
    // }
    onOpenNewItem();
  };

  useEffect(() => {
    isQuote && getAllUsersCanApproveQuote();
  }, []);

  useEffect(() => {
    setOpenReceiptCreationModal(false);
  }, [setOpenReceiptCreationModal]);

  const { CheckPreferenceValue } = usePrintHousePreferences();

  const isNeedDeliveryDate = CheckPreferenceValue(
    EPreferences.DELIVERY_DATE_REQUIRED_IN_DOC
  );

  const isNeedDeliveryDateInQuote = CheckPreferenceValue(
    EPreferences.DELIVERY_DATE_REQUIRED_IN_QUOTE
  );

  const checkIsAgentRequired = CheckPreferenceValue(
    EPreferences.AGENT_REQUIRED_IN_DOC
  );
  const checkIsAgentRequiredInQuote = CheckPreferenceValue(
    EPreferences.AGENT_REQUIRED_IN_QUOTE
  );
  const isAgentEmpty =
    !quoteItemValue?.agentId ||
    quoteItemValue?.agentId === "00000000-0000-0000-0000-000000000000";

  const handleOrderNowClick = () => {
    if (checkIsAgentRequired && isAgentEmpty) {
      alertFault("sales.cart.agentIsRequired");
    } else if (isQuote && isNeedDeliveryDateInQuote && !deliveryDate) {
      alertFault("sales.cart.deliveryDateIsRequired");
    } else if (isNeedDeliveryDate && !quoteItemValue?.dueDate) {
      alertFault("sales.cart.deliveryDateIsRequired");
    } else if (
      isQuote &&
      checkIsAgentRequiredInQuote &&
      isAgentEmpty &&
      isQuote
    ) {
      alertFault("sales.cart.agentIsRequired");
    } else {
      onClickOpenOrderNowModal(false);
    }
  };

  return (
    <div style={classes.writeCommentContainer}>
      <div style={classes.btnsContainer}>
        {isNewCreation && isReceipt && (
          <PaymentBtn handleOpenModal={onClickOpenPaymentModal} />
        )}
        {(isInvoice || isPurchaseInvoice) && quoteItemValue?.isCanClose && (
          <GomakePrimaryButton
            leftIcon={<CreditCardIcon color={"#344054"} />}
            onClick={() =>
              navigate(
                isPurchaseInvoice
                  ? `/receipt?isOutgoingPayments=true&isNewCreation=true&documentNumber=${quoteItemValue?.number}&ClientId=${quoteItemValue?.customerID}`
                  : `/receipt?isNewCreation=true&documentNumber=${quoteItemValue?.accountingNumber}&ClientId=${quoteItemValue?.customerID}`
              )
            }
            style={classes.btnContainer}
          >
            {t("payment.payment")}
          </GomakePrimaryButton>
        )}
        {!isNewCreation && isInvoice && quoteItemValue?.isCanClose && (
          <PermissionCheck userPermission={Permissions.SEND_PAYMENT_TO_CLIENT}>
            <GomakePrimaryButton
              leftIcon={<PayIcon />}
              onClick={() => onClickSendPayment(quoteItemValue, false)}
              style={classes.btnContainer}
            >
              {t("sales.quote.sendPayment")}
            </GomakePrimaryButton>
          </PermissionCheck>
        )}
        {showAddNewItemBtn && (
          <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => handleAddItemClick()}
          >
            {t("sales.quote.addNewItems")}
          </GomakePrimaryButton>
        )}
        {(isQuote || isOrder) && (
          <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={handleAddExistingItem}
          >
            {t("sales.cart.addExitingItems")}
          </GomakePrimaryButton>
        )}
        {canAddDelivery && canEditDocument && (
          <GomakePrimaryButton
            leftIcon={
              quoteItemValue?.isHaveDeliveryItem ? (
                <EditIcon stroke={"#344054"} />
              ) : (
                <PlusIcon stroke={"#344054"} />
              )
            }
            style={classes.btnContainer}
            onClick={() => {
              if (quoteItemValue?.isHaveDeliveryItem) {
                onOpenUpdateDeliveryModal();
              } else {
                if (quoteItemValue?.isShowDeliveryItems) {
                  onOpenDeliveryModal();
                } else {
                  onOpenUpdateDeliveryModal();
                }
              }
            }}
          >
            {quoteItemValue?.isHaveDeliveryItem
              ? t("sales.quote.updateDelivery")
              : t("sales.quote.addDelivery")}
          </GomakePrimaryButton>
        )}

        {canAddDelivery &&
          canEditDocument &&
          quoteItemValue?.isHaveDeliveryItem && (
            <GomakePrimaryButton
              leftIcon={<WastebasketNew2 stroke={"#344054"} />}
              style={classes.btnContainer}
              onClick={onClickOpenDeleteDeliveryModal}
            >
              {t("sales.quote.deleteDelivery")}
            </GomakePrimaryButton>
          )}
        {(isPurchaseInvoice || isPurchaseOrder) && !isNewCreation && (
          <GomakePrimaryButton
            leftIcon={
              quoteItemValue?.attachments?.length > 0 ? (
                <EditIcon stroke={"#344054"} />
              ) : (
                <PlusIcon stroke={"#344054"} />
              )
            }
            style={classes.btnContainer}
            onClick={onClickOpenAddAttachmentsPurchaseModal}
          >
            {quoteItemValue?.attachments?.length > 0
              ? t("sales.quote.editAttachments")
              : t("sales.quote.addAttachments")}
          </GomakePrimaryButton>
        )}
        {isNewCreation &&
          (isDeliveryNote || isInvoice || isProformaInvoice) && (
            <GomakePrimaryButton
              leftIcon={<PlusIcon stroke={"#344054"} />}
              style={classes.btnContainer}
              onClick={() => handleCopyFromDocumentClick(DOCUMENT_TYPE.order)}
            >
              {t("sales.quote.copyFromOrder")}
            </GomakePrimaryButton>
          )}
        {isNewCreation && (isInvoice || isProformaInvoice) && (
          <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() =>
              handleCopyFromDocumentClick(DOCUMENT_TYPE.deliveryNote)
            }
          >
            {t("sales.quote.copyFromDeliveryNote")}
          </GomakePrimaryButton>
        )}
        {isNewCreation && isInvoice && (
          <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() =>
              handleCopyFromDocumentClick(DOCUMENT_TYPE.proformaInvoice)
            }
          >
            {t("sales.quote.copyFromProformaInvoice")}
          </GomakePrimaryButton>
        )}
        {isNewCreation && documentType === DOCUMENT_TYPE.purchaseInvoice && (
          <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() =>
              handleCopyFromDocumentClick(DOCUMENT_TYPE.purchaseOrder)
            }
          >
            {t("sales.quote.copyFromPurchaseOrder")}
          </GomakePrimaryButton>
        )}
      </div>
      <div style={classes.btnsContainer}>
        {!isNewCreation && isShowCloseButton && (
          <GomakePrimaryButton
            rightIcon={openCloseBtn ? <ArrowUpNewIcon /> : <ArrowDownNewIcon />}
            style={classes.btnSecondContainer}
            onClick={handleCloseBtnClick}
          >
            {t("sales.quote.close")}
          </GomakePrimaryButton>
        )}
        {!isNewCreation && isShowSendButton && (
          <GomakePrimaryButton
            rightIcon={openSendBtn ? <ArrowUpNewIcon /> : <ArrowDownNewIcon />}
            style={classes.btnSecondContainer}
            onClick={handleSendBtnClick}
          >
            {t("login.send")}
          </GomakePrimaryButton>
        )}
        {!isNewCreation && (
          <GomakePrimaryButton
            style={classes.btnSecondContainer}
            onClick={handleClickPrint}
          >
            {t("sales.quote.print")}
          </GomakePrimaryButton>
        )}
        {!isReceipt && handleExportToExcel && (
          <GomakePrimaryButton
            leftIcon={<DownloadExcelSheet />}
            style={classes.btnSecondContainer}
            onClick={handleExportToExcel}
          >
            {t("sales.quote.exportToExcel")}
          </GomakePrimaryButton>
        )}
        {isReceipt && quoteItemValue.isShowPrintReceiptChecksButton && (
          <GomakePrimaryButton
            style={classes.btnSecondContainer}
            onClick={handleClickPrintChecks}
          >
            {t("sales.cart.printChecks")}
          </GomakePrimaryButton>
        )}
        {(isQuote ||
          (isOrder && quoteItemValue?.documentStatus !== 1) ||
          (isPurchaseOrder &&
            !isNewCreation &&
            quoteItemValue?.documentStatus !==
              PURCHASE_ORDER_STATUSES.Canceled)) && (
          <GomakePrimaryButton
            style={classes.btnSecondContainer}
            onClick={handleCancelBtnClick}
          >
            {t("materials.buttons.cancel")}
          </GomakePrimaryButton>
        )}
        {isReceipt &&
          !!canCancelReceipt &&
          !isNewCreation &&
          quoteItemValue.status !== DELIVERY_NOTE_STATUSES.Canceled && (
            <GomakePrimaryButton
              style={classes.btnThirdContainer}
              onClick={
                quoteItemValue?.creditCardTotal > 0
                  ? onClickOpenCancelReceiptModal
                  : onClickOpenDeleteModal
              }
            >
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          )}
        {isNewCreation && (isPurchaseInvoice || isInvoice) && (
          <GomakePrimaryButton
            style={classes.btnSaveDraft}
            onClick={handleSaveDraftBtnClick}
          >
            {t("sales.cart.saveDraft")}
          </GomakePrimaryButton>
        )}

        {isNewCreation && (
          <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={() => {
              if (!isReceipt) {
                const validationError = validateDocument(
                  quoteItemValue,
                  clientType === CLIENT_TYPE.CUSTOMER
                );
                if (validationError) {
                  alertFault(validationError);
                  return;
                }
              }
              if (isReceipt) {
                handleOpenReceiptSummary();
              } else if (isInvoice) {
                if (
                  quoteItemValue?.client?.closeOrderNotes &&
                  quoteItemValue?.client?.closeOrderNotes.trim() !== "" &&
                  quoteItemValue?.client?.closeOrderNotes.trim() !== null
                ) {
                  onClickOpenNewItemNotesModal();
                } else {
                  onClickConfirmCreateDocument();
                }
              } else {
                onClickConfirmCreateDocument();
              }
            }}
          >
            {t(`sales.quote.create${getFormattedDocumentPath(documentType)}`)}
          </GomakePrimaryButton>
        )}
        {(isQuote || isOrder) && (
          <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={handleSaveBtnClick}
          >
            {t("materials.buttons.save")}
          </GomakePrimaryButton>
        )}
        {isQuote && !isNewCreation && (
          <SecondaryButton
            variant="outlined"
            startIcon={<AttachIcon />}
            style={classes.btnStyle}
            onClick={() => {
              onClickOpenAddAttachmentsModal();
            }}
          >
            {t("sales.quote.attachFiles")}
          </SecondaryButton>
        )}
        {isQuote && quoteItemValue?.isManager && (
          <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={handleAcceptBtnClick}
          >
            {t("materials.buttons.accept")}
          </GomakePrimaryButton>
        )}
        {isQuote && quoteItemValue?.isManager && (
          <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={handleRejectBtnClick}
          >
            {t("materials.buttons.reject")}
          </GomakePrimaryButton>
        )}
        {isQuote && (
          <>
            {!quoteItemValue?.isNeedApproval && (
              <GomakePrimaryButton
                style={classes.btnOrderNowContainer}
                onClick={onClickOpenMangerApprovalModal}
              >
                {t("sales.quote.managerApproval")}
              </GomakePrimaryButton>
            )}
            <GomakePrimaryButton
              style={classes.btnOrderNowContainer}
              onClick={() =>
                quoteItemValue?.isNeedApproval
                  ? onClickOpenMangerApprovalModal()
                  : handleOrderNowClick()
              }
            >
              {t(
                quoteItemValue?.isNeedApproval
                  ? "sales.quote.managerApproval"
                  : `sales.quote.${
                      quoteItemValue?.isUsedStripe
                        ? "placeOrder"
                        : "orderNowTitle"
                    }`
              )}
            </GomakePrimaryButton>
          </>
        )}

        <OrderNowModal
          openModal={openOrderNowModal}
          onClose={onClickCloseOrderNowModal}
          confirmWithoutNotification={onClickConfirmWithoutNotification}
          confirmWithNotification={onClickConfirmWithNotification}
          isUsedStripe={quoteItemValue?.isUsedStripe}
          isConnectedToStripe={quoteItemValue?.isConnectedToStripe}
          CheckoutOptionModal={CheckoutOptionModal}
        />
        <ManagerApprovalModal
          openModal={openMangerApprovalModal}
          onClose={onClickCloseMangerApprovalModal}
          onSend={onClickSendAndChat}
          managersOptions={managersOptions}
        />
        <PaymentModal
          onClose={onClickClosePaymentModal}
          openModal={openPaymentModal}
          selectedTab={selectedTabIndex}
        />
        <GoMakeDeleteModal
          modalType={ModalType.WARNING}
          title={t("payment.cancelReceipt")}
          yesBtn={t("sales.quote.yesBtn")}
          openModal={openDeleteModal}
          onClose={onClickCloseDeleteModal}
          onClickDelete={onClickCancelReceipt}
        />
        <ThreeOptionsModal
          title={t("payment.cancelReceipt")}
          yesBtn={t("payment.CancelWithRefund")}
          noBtn={t("payment.CancelWithoutRefund")}
          openModal={openCancelReceiptModal}
          onClose={onClickCloseCancelReceiptModal}
          onClickYes={() => {
            onClickCancelReceipt(true);
            onClickCloseCancelReceiptModal();
          }}
          onClickNo={() => {
            onClickCancelReceipt(false);
            onClickCloseCancelReceiptModal();
          }}
        />
        <CloseBtnMenu
          handleClose={handleCloseBtnClose}
          open={openCloseBtn}
          anchorEl={anchorElCloseBtn}
          documentState={quoteItemValue}
          documentType={documentType}
          onClickClose={onClickOpenCloseOrderModal}
          onClickOpenChangeProductionStatusModal={
            onClickOpenChangeProductionStatusModal
          }
          onClickOpenCloseOrderNotesModal={onClickOpenCloseOrderNotesModal}
        />
        <ManuallyCloseModal
          documentType={documentType}
          openModal={openCloseOrderModal}
          selectedDocumentId={selectedDocumentId}
          onClose={onClickCloseCloseOrderModal}
          onClickYes={ManuallyCloseDocument}
          documentCloseNumber={documentCloseNumber}
          onChange={handleDocumentNumberChange}
        />
        <InvoiceCreationModal
          onClose={onClickCloseReceiptCreation}
          openModal={openReceiptCreationModal}
          docType={documentType}
          handleSendUsingWhatsAppWeb={handleSendUsingWhatsAppWeb}
          onClickSendDocumentToClient={onClickSendReceiptToClient}
          openReceiptModal={openReceiptModal}
        />
        <ThreeOptionsModal
          hideIcon
          title={t("sales.modals.printReceipt")}
          subTitle={t("sales.modals.includeInvoicesPdfPrompt")}
          yesBtn={"sales.modals.withInvoices"}
          noBtn={"sales.modals.withoutInvoices"}
          openModal={openExportReceiptPdfModal}
          onClose={onCloseExportReceiptPdfModal}
          onClickYes={() => onClickPrint(true)}
          onClickNo={() => onClickPrint(false)}
        />
        <ThreeOptionsModal
          hideIcon
          title={t("sales.quote.sendToClient")}
          subTitle={t("sales.modals.includeInvoicesMessagePrompt")}
          yesBtn={"sales.modals.withInvoices"}
          noBtn={"sales.modals.withoutInvoices"}
          openModal={receiptSendModal.isOpen}
          onClose={() => receiptSendModal.close()}
          onClickYes={() => {
            modalCallback(true);
            receiptSendModal.close();
          }}
          onClickNo={() => {
            modalCallback(false);
            receiptSendModal.close();
          }}
        />
        <OrderNowPrePaymentModal
          quoteItemValue={quoteItemValue}
          openModal={openOrderNowPrePaymentModal}
          onClose={onClickCloseOrderNowPreModal}
          handleOrderConfirmation={handleOrderConfirmation}
        />
        <GoMakeDeleteModal
          modalType={ModalType.WARNING}
          title={t("sales.modals.noCustomersTitle")}
          subTitle={t("sales.modals.noCustomersSubTitle")}
          yesBtn={t("customers.buttons.addCustomer")}
          openModal={AlertAddCustomerModal.isOpen}
          onClose={AlertAddCustomerModal.close}
          onClickDelete={AddCustomerModal.open}
        />
        <CloseOrderNotesModal
          onClose={onClickCloseCloseOrderNotesModal}
          openModal={openCloseOrderNotesModal}
          quoteItemValue={quoteItemValue}
          onClickCloseOrder={onClickCloseOrderCallback}
        />
        <GoMakeDeleteModal
          modalType={ModalType.SUCCESS}
          style={{ width: "fit-content" }}
          title={t("sales.modals.orderCheckoutTitle")}
          subTitle={t("sales.modals.orderCheckoutSubTitle")}
          yesBtn={t("sales.modals.proceedToPayment")}
          cancelBtn={t("sales.modals.proceedWithoutPayment")}
          openModal={CheckoutModalOpen.isOpen}
          withClose={false}
          onClose={() => {}}
          onClickDelete={() => handleProcessCheckout(checkoutModalData.orderId)}
          onClickCancel={() => {
            if (checkoutModalData) {
              setShowPrintJobsModal(checkoutModalData.orderId);
              router.push(
                `/jobs?orderNumber=${checkoutModalData.orderNumber}`,
                undefined,
                {
                  shallow: true,
                }
              );
              CheckoutModalOpen.close();
            }
          }}
        />
        <GoMakeDeleteModal
          modalType={ModalType.WARNING}
          style={{ width: "fit-content" }}
          subTitle={t("sales.modals.groupJobsModalSubTitle")}
          title={t("sales.modals.groupJobsModalTitle")}
          yesBtn={t("sales.quote.yesBtn")}
          cancelBtn={t("modal.no")}
          openModal={isOpenGroupJobsModal.isOpen}
          onClose={() => {}}
          withClose={false}
          onClickDelete={() => handleGetGroupJobsUsingOrderId(pendingOrderData)}
          onClickCancel={() => {
            sendBodyCommingFromOrder(
              pendingOrderData?.res,
              pendingOrderData?.sendMessage,
              pendingOrderData?.isPrepaymentClient,
              pendingOrderData?.isStripeCash
            );
            isOpenGroupJobsModal.close();
          }}
        />
        <GoMakeDeleteModal
          insideStyle={{ width: "100%" }}
          modalType={ModalType.WARNING}
          hideIcon={true}
          title={t("payment.receiptSummery")}
          subTitle={" "}
          yesBtn={t("modal.confirm")}
          openModal={ReceiptSummeryModal.isOpen}
          onClose={ReceiptSummeryModal.close}
          onClickDelete={onClickCreateNewReceipt}
        >
          <ReceiptSummaryContent
            items={filteredReceiptItems}
            totalPayment={finalTotalPayment}
          />
        </GoMakeDeleteModal>
        <SendPaymentModal
          openPaymentModal={openSendPaymentModal}
          onClickClosePaymentModal={onClickCloseSendPaymentModal}
          paymentModalTitle={paymentModalTitle}
          documentType={documentType}
          isSendToClient={isSendToClient}
          isSendOrderReadyToClient={isSendOrderReadyToClient}
          showAlertModal={showAlertModal}
        />
      </div>
    </div>
  );
};

export { ButtonsContainer };
