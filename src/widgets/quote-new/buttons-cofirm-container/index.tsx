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
import { useButtonsConfirmContainer } from "./use-buttons-container";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { SecondaryButton } from "@/components/button/secondary-button";
import { AttachIcon } from "@/components/icons/attach-icon";
import { InputUpdatedValues } from "../input-updated-values";

interface IProps {
  onOpenNewItem?: any,
  handleCancelBtnClick?: any,
  handleSaveBtnClick?: any,
  handleSendBtnClick?: any,
  onOpenDeliveryModal?: any,
  onClickApprove?:()=>void;

}
const ButtonsConfirmContainer = ({
  onOpenNewItem,
  handleCancelBtnClick,
  handleSaveBtnClick,
  handleSendBtnClick,
  onOpenDeliveryModal,
  onClickApprove
}: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { openOrderNowModal, onClickCloseOrderNowModal, onClickOpenOrderNowModal, onClickConfirmWithoutNotification, onClickConfirmWithNotification, onClickPrint } = useButtonsConfirmContainer();

  return (
    <div style={classes.writeCommentContainer}>
      {/* <div style={classes.firstContainer}>
        <InputUpdatedValues
          value={"lama"}
          label={t("Your Name")}
          isUpdate={false}
          flag={true}
          onClickFlag={() => null}
        />
        <InputUpdatedValues
          value={"10,Oct 2023"}
          label={t("Date of signature:")}
          isUpdate={false}
          flag={true}
          onClickFlag={() => null}
        />
      </div> */}
      <div style={classes.btnsContainer}>
        <SecondaryButton
          variant="outlined"
          style={classes.rejectBtn}>
          {t("sales.quote.rejectOffer")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.btnStyle}>{t("sales.quote.print")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          startIcon={<AttachIcon />}
          style={classes.btnStyle}>{t("sales.quote.attachFiles")}
        </SecondaryButton>
        <SecondaryButton
          variant="contained"
          style={classes.btnStyle}
          onClick={onClickApprove}
          >
          {t("sales.quote.approveOffer")}
        </SecondaryButton>
      </div>
    </div>
  );
};

export { ButtonsConfirmContainer };
