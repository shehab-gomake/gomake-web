import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeDeleteModal } from "@/components";
import { useButtonsConfirmContainer } from "./use-buttons-container";
import { SecondaryButton } from "@/components/button/secondary-button";
import { AttachIcon } from "@/components/icons/attach-icon";
import { CancelBtnMenu } from "../cancel-btn-menu";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { QuoteStatuses } from "../total-price-and-vat/enums";
import { OtherReasonModal } from "../total-price-and-vat/other-reason-modal";

const ButtonsConfirmContainer = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { onClickCloseRejectModal,
    onClickOpenRejectModal,
    openRejectModal,
    handleRejectBtnClick,
    handleRejectBtnClose,
    openRejectBtn,
    anchorElRejectBtn,
    onClickOpenOtherModal,
    onClickCloseOtherModal,
    openOtherReasonModal,
    setReasonText,
    onClickPrint,
    isButtonClicked ,
    onClickReject,
    onClickApprove
  } = useButtonsConfirmContainer();

  return (
    <div style={classes.writeCommentContainer}>
      <div style={classes.btnsContainer}>
        <SecondaryButton
          onClick={handleRejectBtnClick}
          variant="outlined"
          style={ isButtonClicked ? classes.rejectBtnClicked:  classes.rejectBtn}>
          {t("sales.quote.rejectOffer")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.btnStyle}
          onClick={onClickPrint}
        >{t("sales.quote.print")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          startIcon={<AttachIcon />}
          style={classes.btnStyle}>{t("sales.quote.attachFiles")}
        </SecondaryButton>
        <SecondaryButton
          variant="contained"
          style={classes.btnStyle}
          onClick={onClickApprove}>
          {t("sales.quote.approveOffer")}
        </SecondaryButton>
      </div>
      <CancelBtnMenu
        handleClose={handleRejectBtnClose}
        open={openRejectBtn}
        anchorEl={anchorElRejectBtn}
        onClickOpenModal={()=>onClickOpenOtherModal(QuoteStatuses.CANCELED_OTHER)}
        onClickOpenDeliveryTimeModal={() => onClickOpenRejectModal(QuoteStatuses.CANCELED_DELIVERY_TIME)}
        onClickOpenPriceModal={() => onClickOpenRejectModal(QuoteStatuses.CANCELED_PRICE)}
        onClickOpenIrrelevantModal={() => onClickOpenRejectModal(QuoteStatuses.CANCELED_IRRELEVANT)}
      />
      <OtherReasonModal
        openModal={openOtherReasonModal}
        onClose={onClickCloseOtherModal}
        setReasonText={setReasonText}
        onClickCancelOffer={onClickReject}
      />
      <GoMakeDeleteModal
        icon={<WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />}
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openRejectModal}
        onClose={onClickCloseRejectModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={onClickReject}
      />
    </div>
  );
};

export { ButtonsConfirmContainer };