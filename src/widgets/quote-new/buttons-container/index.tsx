import React from "react";
import { useStyle } from "./style";
import {
  ArrowDownNewIcon,
  PlusIcon,
  UploadNewIcon,
} from "@/icons";
import { useTranslation } from "react-i18next";
import { GomakePrimaryButton } from "@/components";
import { OrderNowModal } from "@/widgets/quote/total-price-and-vat/order-now-modal";
import { useButtonsContainer } from "./use-buttons-container";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
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
  const { openOrderNowModal, onClickCloseOrderNowModal, onClickOpenOrderNowModal, onClickConfirmWithoutNotification, onClickConfirmWithNotification, onClickPrint, onClickClosePaymentModal, onClickOpenPaymentModal, openPaymentModal, selectedTabIndex, getERPAccounts } = useButtonsContainer(documentType);
  const router = useRouter()
  return (
    <div style={classes.writeCommentcontainer}>
      <div style={classes.btnsContainer}>
        <GomakePrimaryButton
          leftIcon={<PlusIcon stroke={"#344054"} />}
          style={classes.btnContainer}
          onClick={() => onOpenNewItem()}
        >
          {t("sales.quote.addNewItems")}
        </GomakePrimaryButton>
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
          router.query.isNewCreation && <GomakePrimaryButton
            leftIcon={<PlusIcon stroke={"#344054"} />}
            style={classes.btnContainer}
            onClick={onOpenCopyFromOrder}
          >
            Copy from order
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
          onClick={documentType != DOCUMENT_TYPE.quote ? handleSaveBtnClickForDocument : handleSaveBtnClick}
        >
          {t("materials.buttons.save")}
        </GomakePrimaryButton>
        {documentType === DOCUMENT_TYPE.quote && <GomakePrimaryButton style={classes.btnOrderNowContainer} onClick={onClickOpenOrderNowModal}>
          {t("sales.quote.orderNowTitle")}
        </GomakePrimaryButton>}
        <OrderNowModal
          openModal={openOrderNowModal}
          onClose={onClickCloseOrderNowModal}
          confirmWithoutNotification={onClickConfirmWithoutNotification}
          confirmWithNotification={onClickConfirmWithNotification}
        />
        <PaymentModal onClose={onClickClosePaymentModal} openModal={openPaymentModal} selectedTab={selectedTabIndex} getERPAccounts={getERPAccounts} />
      </div>
    </div>
  );
};

export { ButtonsContainer };
