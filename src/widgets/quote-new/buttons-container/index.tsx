import React from "react";
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
import { CreditCardIcon } from "@/icons/credit-card-icon";
import { PaymentBtn } from "./payment/payment-button";
import { PaymentModal } from "./payment/payment-modal";

const ButtonsContainer = ({
  onOpenNewItem,
  handleCancelBtnClick,
  handleSaveBtnClick,
  handleSendBtnClick,
  onOpenDeliveryModal,
  documentType,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { openOrderNowModal, onClickCloseOrderNowModal, onClickOpenOrderNowModal, onClickConfirmWithoutNotification, onClickConfirmWithNotification, onClickPrint, onClickClosePaymentModal, onClickOpenPaymentModal, openPaymentModal, selectedTabIndex } = useButtonsContainer(documentType);

  return (
    <div style={classes.writeCommentcontainer}>
      <div style={classes.btnsContainer}>
        {documentType === DOCUMENT_TYPE.receipt && <PaymentBtn handleOpenModal={onClickOpenPaymentModal} />}
        {(documentType === DOCUMENT_TYPE.quote || documentType === DOCUMENT_TYPE.order) &&
          <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => onOpenNewItem()}
          >
            {t("sales.quote.addNewItems")}
          </GomakePrimaryButton>}
        {(documentType === DOCUMENT_TYPE.quote || documentType === DOCUMENT_TYPE.order) &&
          <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={() => onOpenDeliveryModal()}
          >
            {t("sales.quote.addDelivery")}
          </GomakePrimaryButton>}

      </div>
      <div style={classes.btnsContainer}>
        {/* <GomakePrimaryButton
          leftIcon={<UploadNewIcon />}
          style={classes.btnSecondContainer}
        >
          {t("sales.quote.attachFiles")}
        </GomakePrimaryButton> */}
        {/* <GomakePrimaryButton
          rightIcon={<ArrowDownNewIcon />}
          style={classes.btnSecondContainer}
        >
          {t("sales.quote.copyTo")}
        </GomakePrimaryButton> */}
        <GomakePrimaryButton
          rightIcon={<ArrowDownNewIcon />}
          style={classes.btnSecondContainer}
          onClick={handleSendBtnClick}
        >
          {t("login.send")}
        </GomakePrimaryButton>
        <GomakePrimaryButton
          style={classes.btnSecondContainer}
          onClick={() => onClickPrint()}
        >
          {t("sales.quote.print")}
        </GomakePrimaryButton>

        {documentType === DOCUMENT_TYPE.quote && <GomakePrimaryButton
          style={classes.btnSecondContainer}
          onClick={handleCancelBtnClick}
        >
          {t("materials.buttons.cancel")}
        </GomakePrimaryButton>}
        <GomakePrimaryButton
          style={classes.btnThirdContainer}
          onClick={handleSaveBtnClick}
        >
          {t("materials.buttons.save")}
        </GomakePrimaryButton>
        {/* <GomakePrimaryButton style={classes.btnThirdContainer}>
          {t("sales.quote.managerApproval")}
        </GomakePrimaryButton> */}
        {documentType === DOCUMENT_TYPE.quote && <GomakePrimaryButton style={classes.btnOrderNowContainer} onClick={onClickOpenOrderNowModal}>
          {t("sales.quote.orderNowTitle")}
        </GomakePrimaryButton>}
        <OrderNowModal
          openModal={openOrderNowModal}
          onClose={onClickCloseOrderNowModal}
          confirmWithoutNotification={onClickConfirmWithoutNotification}
          confirmWithNotification={onClickConfirmWithNotification}
        />
        <PaymentModal onClose={onClickClosePaymentModal} openModal={openPaymentModal} selectedTab={selectedTabIndex} />
      </div>
    </div>
  );
};

export { ButtonsContainer };
