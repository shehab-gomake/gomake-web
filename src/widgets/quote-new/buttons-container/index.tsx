import { useStyle } from "./style";
import { ArrowDownNewIcon, PlusIcon } from "@/icons";
import { useTranslation } from "react-i18next";
import { GoMakeDeleteModal, GomakePrimaryButton } from "@/components";
import { useButtonsContainer } from "./use-buttons-container";
import { DELIVERY_NOTE_STATUSES, DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useRouter } from "next/router";
import { PaymentModal } from "./payment/payment-modal";
import { PaymentBtn } from "./payment/payment-button";
import { CancelReceiptModal } from "./payment/cancel-receipt-modal/cancel-receipt-modal";
import { OrderNowModal } from "../total-price-and-vat/order-now-modal";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useSnackBar } from "@/hooks";


const ButtonsContainer = ({
  onOpenNewItem,
  handleCancelBtnClick,
  handleSaveBtnClick,
  handleSendBtnClick,
  onOpenDeliveryModal,
  documentType,
  onOpenCopyFromOrder,
  handleSaveBtnClickForDocument,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { alertFault } = useSnackBar();


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
    isNewCreation
  } = useButtonsContainer(documentType);
  
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
  
 
  return (
    <div style={classes.writeCommentContainer}>
      <div style={classes.btnsContainer}>
        {
          (isNewCreation && documentType === DOCUMENT_TYPE.receipt) &&
          <PaymentBtn handleOpenModal={onClickOpenPaymentModal} />
        }
        {
          showAddNewItemBtn && <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => handleAddItemClick()}
          >
            {t("sales.quote.addNewItems")}
          </GomakePrimaryButton>
        }
        {
          (documentType === DOCUMENT_TYPE.quote || documentType === DOCUMENT_TYPE.order) && canEditDocument && <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => onOpenDeliveryModal()}
          >
            {t("sales.quote.addDelivery")}
          </GomakePrimaryButton>
        }
        {
          isNewCreation && (documentType === DOCUMENT_TYPE.deliveryNote || documentType === DOCUMENT_TYPE.invoice) && <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => handleCopyFromDocumentClick(DOCUMENT_TYPE.order)}
          >
            {t("sales.quote.copyFromOrder")}
          </GomakePrimaryButton>
        }
        {
          isNewCreation && documentType === DOCUMENT_TYPE.invoice && <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => handleCopyFromDocumentClick(DOCUMENT_TYPE.deliveryNote)}
          >
            {t("sales.quote.copyFromDeliveryNote")}
          </GomakePrimaryButton>
        }
        {
          isNewCreation && documentType === DOCUMENT_TYPE.purchaseInvoice && <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => handleCopyFromDocumentClick(DOCUMENT_TYPE.purchaseOrder)}
          >
            {t("sales.quote.copyFromPurchaseOrder")}
          </GomakePrimaryButton>
        }
      </div>
      <div style={classes.btnsContainer}>
        {
          !isNewCreation &&
          <GomakePrimaryButton
            rightIcon={<ArrowDownNewIcon />}
            style={classes.btnSecondContainer}
            onClick={handleSendBtnClick}
          >
            {t("login.send")}
          </GomakePrimaryButton>
        }
        {
          !isNewCreation &&
          <GomakePrimaryButton
            style={classes.btnSecondContainer}
            onClick={() => onClickPrint()}
          >
            {t("sales.quote.print")}
          </GomakePrimaryButton>}
        {
          (documentType === DOCUMENT_TYPE.quote || (documentType === DOCUMENT_TYPE.order && quoteItemValue?.documentStatus !== 1)) && <GomakePrimaryButton
            style={classes.btnSecondContainer}
            onClick={handleCancelBtnClick}
          >
            {t("materials.buttons.cancel")}
          </GomakePrimaryButton>
        }
        {
          (documentType === DOCUMENT_TYPE.receipt && !isNewCreation && quoteItemValue.status !== DELIVERY_NOTE_STATUSES.Canceled) && <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={quoteItemValue?.creditCardTotal > 0 ? onClickOpenCancelReceiptModal : onClickOpenDeleteModal}
          >
            {t("materials.buttons.cancel")}
          </GomakePrimaryButton>
        }
        {
          isNewCreation &&
          <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={documentType === DOCUMENT_TYPE.receipt ? onClickCreateNewReceipt : handleSaveBtnClickForDocument}
          >
            {t(`sales.quote.create${getFormattedDocumentPath(documentType)}`)}
          </GomakePrimaryButton>
        }
        {
          (documentType === DOCUMENT_TYPE.quote || documentType === DOCUMENT_TYPE.order) &&
          <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={handleSaveBtnClick}
          >
            {t("materials.buttons.save")}
          </GomakePrimaryButton>
        }
        {
          documentType === DOCUMENT_TYPE.quote &&
          <GomakePrimaryButton
            style={classes.btnOrderNowContainer}
            onClick={onClickOpenOrderNowModal}
          >
            {t("sales.quote.orderNowTitle")}
          </GomakePrimaryButton>
        }
        <OrderNowModal
          openModal={openOrderNowModal}
          onClose={onClickCloseOrderNowModal}
          confirmWithoutNotification={onClickConfirmWithoutNotification}
          confirmWithNotification={onClickConfirmWithNotification}
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
      </div>
    </div>
  );
};

export { ButtonsContainer };

