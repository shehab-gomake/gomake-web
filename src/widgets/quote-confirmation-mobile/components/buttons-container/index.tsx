import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useButtonsConfirmContainer } from "@/widgets/quote-new/buttons-cofirm-container/use-buttons-container";
import { CancelBtnMenu } from "@/widgets/quote-new/cancel-btn-menu";
import { GoMakeDeleteModal } from "@/components";
import { QuoteStatuses } from "@/widgets/quote/total-price-and-vat/enums";
import { OtherReasonModal } from "@/widgets/quote/total-price-and-vat/other-reason-modal";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

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
    updateCancelQuote,
    onClickCancelOffer,
    onClickPrint,
    isButtonClicked
  } = useButtonsConfirmContainer();

  return (
    <div style={classes.mainContainer}>
      <SecondaryButton
        variant="contained"
        style={classes.btnStyle}
      >{t("sales.quote.approveOffer")}
      </SecondaryButton>
      <SecondaryButton
        variant="outlined"
        style={classes.btnStyle}
        onClick={onClickPrint}
      >{t("sales.quote.print")}
      </SecondaryButton>
      <SecondaryButton
        variant="outlined"
        style={classes.btnStyle}>
        {t("sales.quote.attachFiles")}
      </SecondaryButton>
      <SecondaryButton
        variant="outlined"
        style={isButtonClicked ? classes.rejectBtnClicked : classes.rejectBtn}
        onClick={handleRejectBtnClick}>
        {t("sales.quote.rejectOffer")}
      </SecondaryButton>
      <CancelBtnMenu
        handleClose={handleRejectBtnClose}
        open={openRejectBtn}
        anchorEl={anchorElRejectBtn}
        onClickOpenModal={onClickOpenOtherModal}
        onClickOpenDeliveryTimeModal={() => onClickOpenRejectModal(QuoteStatuses.CANCELED_DELIVERY_TIME)}
        onClickOpenPriceModal={() => onClickOpenRejectModal(QuoteStatuses.CANCELED_PRICE)}
        onClickOpenIrrelevantModal={() => onClickOpenRejectModal(QuoteStatuses.CANCELED_IRRELEVANT)}
      />
      <OtherReasonModal
        openModal={openOtherReasonModal}
        onClose={onClickCloseOtherModal}
        setReasonText={setReasonText}
        onClickCancelOffer={onClickCancelOffer}
        style={{width:"80%" , height:"60%"}}
      />
      <GoMakeDeleteModal
        icon={<WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />}
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openRejectModal}
        onClose={onClickCloseRejectModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() => updateCancelQuote()}
        style={{width:"unset"}}
      />
    </div>
  );
};

export { ButtonsConfirmContainer };
