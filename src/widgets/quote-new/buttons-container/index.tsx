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

const ButtonsContainer = ({
  onOpenNewItem,
  onOpenDeliveryModal,
  handleCancelBtnClick,
  handleSendBtnClick,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { openOrderNowModal, onClickCloseOrderNowModal, onClickOpenOrderNowModal, onClickConfirmWithoutNotification, onClickConfirmWithNotification , onClickPrint } = useButtonsContainer();

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
        <GomakePrimaryButton
          leftIcon={<PlusIcon stroke={"#344054"} />}
          style={classes.btnContainer}
        >
          {t("sales.quote.addExistItem")}
        </GomakePrimaryButton>
        <GomakePrimaryButton
          leftIcon={<PlusIcon stroke={"#344054"} />}
          style={classes.btnContainer}
          onClick={() =>onOpenDeliveryModal()}
        >
          {t("sales.quote.addDelivery")}
        </GomakePrimaryButton>
      </div>
      <div style={classes.btnsContainer}>
        <GomakePrimaryButton
          leftIcon={<UploadNewIcon />}
          style={classes.btnSecondContainer}
        >
          {t("sales.quote.attachFiles")}
        </GomakePrimaryButton>
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
         onClick={onClickPrint}
         >
          {t("sales.quote.print")}
        </GomakePrimaryButton>

        <GomakePrimaryButton
          style={classes.btnSecondContainer}
          onClick={handleCancelBtnClick}
        >
          {t("materials.buttons.cancel")}
        </GomakePrimaryButton>
        <GomakePrimaryButton style={classes.btnThirdContainer}>
          {t("materials.buttons.save")}
        </GomakePrimaryButton>
        <GomakePrimaryButton style={classes.btnThirdContainer}>
          {t("sales.quote.managerApproval")}
        </GomakePrimaryButton>
        <GomakePrimaryButton style={classes.btnOrderNowContainer} onClick={onClickOpenOrderNowModal}>
          {t("sales.quote.orderNowTitle")}
        </GomakePrimaryButton>
        <OrderNowModal
          openModal={openOrderNowModal}
          onClose={onClickCloseOrderNowModal}
          confirmWithoutNotification={onClickConfirmWithoutNotification}
          confirmWithNotification={onClickConfirmWithNotification}
        />
      </div>
    </div>
  );
};

export { ButtonsContainer };
