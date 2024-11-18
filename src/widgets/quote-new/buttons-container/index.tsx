import { useStyle } from "./style";
import { ArrowDownNewIcon, PlusIcon } from "@/icons";
import { useTranslation } from "react-i18next";
import { GoMakeDeleteModal, GomakePrimaryButton } from "@/components";
import { useButtonsContainer } from "./use-buttons-container";
import {
  DELIVERY_NOTE_STATUSES,
  DOCUMENT_TYPE,
} from "@/pages-components/quotes/enums";
import { PaymentModal } from "./payment/payment-modal";
import { PaymentBtn } from "./payment/payment-button";
import { CancelReceiptModal } from "./payment/cancel-receipt-modal/cancel-receipt-modal";
import { OrderNowModal } from "../total-price-and-vat/order-now-modal";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useGomakeRouter, useSnackBar } from "@/hooks";
import { ManagerApprovalModal } from "../total-price-and-vat/manger-approval-modal";
import { useEffect } from "react";
import { CreditCardIcon } from "@/icons/credit-card-icon";
import { CloseBtnMenu } from "./close-btn-menu";
import { ArrowUpNewIcon } from "@/icons/arrow-up-new";
import { ManuallyCloseModal } from "./close-manually-modal";
import { InvoiceCreationModal } from "../invoice-creation-modal";

const ButtonsContainer = ({
  openSendBtn,
  onOpenNewItem,
  handleCancelBtnClick,
  handleSaveBtnClick,
  handleSendBtnClick,
  onOpenDeliveryModal,
  documentType,
  onOpenCopyFromOrder,
  handleSaveBtnClickForDocument,
  onClickOpenNewItemNotesModal,
  handleRejectBtnClick,
  handleAcceptBtnClick,
  onClickOpenChangeProductionStatusModal,
  onClickSendReceiptToClient,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { alertFault } = useSnackBar();
  const { navigate } = useGomakeRouter();
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
    openReceiptCreationModal,
    onClickCloseReceiptCreation,
  } = useButtonsContainer(documentType);

  const isShowSendButton =
    (quoteItemValue.isSendWhatsapp ||
      quoteItemValue.isSendWhatsappWeb ||
      quoteItemValue.isSendMails ||
      quoteItemValue.isSendSMS) &&
    !quoteItemValue?.isNeedApproval;

  const handleCopyFromDocumentClick = (documentNumber) => {
    if (!quoteItemValue?.client) {
      alertFault("home.admin.pleaseSelectCustomer");
    } else {
      onOpenCopyFromOrder(documentNumber);
    }
  };

  const handleAddItemClick = () => {
    if (!quoteItemValue?.client) {
      alertFault("home.admin.pleaseSelectCustomer");
    } else {
      onOpenNewItem();
    }
  };

  useEffect(() => {
    quoteItemValue?.isNeedApproval && getAllUsersCanApproveQuote();
  }, []);

  return (
    <div style={classes.writeCommentContainer}>
      <div style={classes.btnsContainer}>
        {isNewCreation && documentType === DOCUMENT_TYPE.receipt && (
          <PaymentBtn handleOpenModal={onClickOpenPaymentModal} />
        )}
        {isInvoice && quoteItemValue?.isCanClose && (
          <GomakePrimaryButton
            leftIcon={<CreditCardIcon color={"#344054"} />}
            onClick={() =>
              navigate(
                `/receipt?isNewCreation=true&documentNumber=${quoteItemValue?.number}&ClientId=${quoteItemValue?.customerID}`
              )
            }
            style={classes.btnContainer}
          >
            {t("payment.payment")}
          </GomakePrimaryButton>
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
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => onOpenDeliveryModal()}
          >
            {t("sales.quote.addDelivery")}
          </GomakePrimaryButton>
        )}
        {isNewCreation &&
          (documentType === DOCUMENT_TYPE.deliveryNote || isInvoice) && (
            <GomakePrimaryButton
              leftIcon={<PlusIcon stroke={"#344054"} />}
              style={classes.btnContainer}
              onClick={() => handleCopyFromDocumentClick(DOCUMENT_TYPE.order)}
            >
              {t("sales.quote.copyFromOrder")}
            </GomakePrimaryButton>
          )}
        {isNewCreation && isInvoice && (
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
            onClick={() => onClickPrint()}
          >
            {t("sales.quote.print")}
          </GomakePrimaryButton>
        )}
        {(isQuote || (isOrder && quoteItemValue?.documentStatus !== 1)) && (
          <GomakePrimaryButton
            style={classes.btnSecondContainer}
            onClick={handleCancelBtnClick}
          >
            {t("materials.buttons.cancel")}
          </GomakePrimaryButton>
        )}
        {documentType === DOCUMENT_TYPE.receipt &&
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
        {isNewCreation && (
          <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={() => {
              if (documentType === DOCUMENT_TYPE.receipt) {
                onClickCreateNewReceipt();
              } else if (isInvoice) {
                if (
                  quoteItemValue?.client?.closeOrderNotes &&
                  quoteItemValue?.client?.closeOrderNotes.trim() !== "" &&
                  quoteItemValue?.client?.closeOrderNotes.trim() !== null
                ) {
                  onClickOpenNewItemNotesModal();
                } else {
                  handleSaveBtnClickForDocument();
                }
              } else {
                handleSaveBtnClickForDocument();
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
        {isQuote &&
          (quoteItemValue?.isNeedApproval ? (
            <GomakePrimaryButton
              style={classes.btnOrderNowContainer}
              onClick={onClickOpenMangerApprovalModal}
            >
              {t("sales.quote.managerApproval")}
              {/* {t("sales.quote.sendToSalesManager")} */}
            </GomakePrimaryButton>
          ) : (
            <GomakePrimaryButton
              style={classes.btnOrderNowContainer}
              onClick={onClickOpenOrderNowModal}
            >
              {t("sales.quote.orderNowTitle")}
            </GomakePrimaryButton>
          ))}
        <OrderNowModal
          openModal={openOrderNowModal}
          onClose={onClickCloseOrderNowModal}
          confirmWithoutNotification={onClickConfirmWithoutNotification}
          confirmWithNotification={onClickConfirmWithNotification}
          loading={loading}
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
          icon={<WarningAmberIcon style={classes.iconStyle} />}
          title={t("payment.cancelReceipt")}
          yesBtn={t("sales.quote.yesBtn")}
          openModal={openDeleteModal}
          onClose={onClickCloseDeleteModal}
          onClickDelete={onClickCancelReceipt}
        />
        <CancelReceiptModal
          openModal={openCancelReceiptModal}
          handleModalClose={onClickCloseCancelReceiptModal}
          onClickCancel={onClickCancelReceipt}
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
          onClickSendDocumentToClient={onClickSendReceiptToClient}
        />
      </div>
    </div>
  );
};

export { ButtonsContainer };
