import { useStyle } from "./style";
import {
  ArrowDownNewIcon,
  PlusIcon,
} from "@/icons";
import { useTranslation } from "react-i18next";
import { GomakePrimaryButton } from "@/components";
import { OrderNowModal } from "@/widgets/quote/total-price-and-vat/order-now-modal";
import { useButtonsContainer } from "./use-buttons-container";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useRouter } from "next/router";
import { PaymentModal } from "./payment/payment-modal";
import { PaymentBtn } from "./payment/payment-button";

const ButtonsContainer = ({
  onOpenNewItem,
  handleCancelBtnClick,
  handleSaveBtnClick,
  handleSendBtnClick,
  onOpenDeliveryModal,
  documentType,
  onOpenCopyFromOrder,
  handleSaveBtnClickForDocument
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { openOrderNowModal, onClickCloseOrderNowModal, onClickOpenOrderNowModal, onClickConfirmWithoutNotification, onClickConfirmWithNotification, onClickPrint, onClickClosePaymentModal, onClickOpenPaymentModal, openPaymentModal, selectedTabIndex, getERPAccounts, getFormattedDocumentPath ,onClickCreateNewReceipt } = useButtonsContainer(documentType);
  const router = useRouter()


  return (
    <div style={classes.writeCommentContainer}>
      <div style={classes.btnsContainer}>
        {(router.query.isNewCreation && documentType === DOCUMENT_TYPE.receipt) &&
          <PaymentBtn handleOpenModal={onClickOpenPaymentModal} getERPAccounts={getERPAccounts} />
        }
        {documentType !== DOCUMENT_TYPE.receipt && <GomakePrimaryButton
          leftIcon={<PlusIcon stroke={"#344054"} />}
          style={classes.btnContainer}
          onClick={() => onOpenNewItem()}
        >
          {t("sales.quote.addNewItems")}
        </GomakePrimaryButton>}
        {
          (documentType === DOCUMENT_TYPE.quote || documentType === DOCUMENT_TYPE.order) && <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => onOpenDeliveryModal()}
          >
            {t("sales.quote.addDelivery")}
          </GomakePrimaryButton>
        }
        {
          (router.query.isNewCreation && documentType !== DOCUMENT_TYPE.receipt) &&
          <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={onOpenCopyFromOrder}
          >{t("sales.quote.copyFromOrder")}
          </GomakePrimaryButton>
        }
      </div>
      <div style={classes.btnsContainer}>
        {
          !router.query.isNewCreation &&
          <GomakePrimaryButton
            rightIcon={<ArrowDownNewIcon />}
            style={classes.btnSecondContainer}
            onClick={handleSendBtnClick}
          >
            {t("login.send")}
          </GomakePrimaryButton>
        }
        {
          !router.query.isNewCreation &&
          <GomakePrimaryButton
            style={classes.btnSecondContainer}
            onClick={() => onClickPrint()}
          >
            {t("sales.quote.print")}
          </GomakePrimaryButton>}
        {
          documentType === DOCUMENT_TYPE.quote && <GomakePrimaryButton
            style={classes.btnSecondContainer}
            onClick={handleCancelBtnClick}
          >
            {t("materials.buttons.cancel")}
          </GomakePrimaryButton>
        }
        {
          (router.query.isNewCreation) &&
          <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={documentType === DOCUMENT_TYPE.receipt ? onClickCreateNewReceipt: handleSaveBtnClickForDocument}
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
            onClick={onClickOpenOrderNowModal}>
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
          getERPAccounts={getERPAccounts} />
      </div>
    </div>
  );
};

export { ButtonsContainer };
