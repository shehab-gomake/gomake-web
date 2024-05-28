import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useButtonsConfirmContainer } from "@/widgets/quote-new/buttons-cofirm-container/use-buttons-container";
import { CancelBtnMenu } from "@/widgets/quote-new/cancel-btn-menu";
import { GoMakeDeleteModal } from "@/components";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { QuoteStatuses } from "@/widgets/quote-new/total-price-and-vat/enums";
import { OtherReasonModal } from "@/widgets/quote-new/total-price-and-vat/other-reason-modal";
import { QUOTE_STATUSES } from "@/pages-components/quotes/enums";

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
    onClickReject,
    onClickPrint,
    isButtonClicked,
    onClickApprove,
    quoteConfirm
  } = useButtonsConfirmContainer(); 
  
  return (
    (!quoteConfirm?.isConfirmed && quoteConfirm?.documentStatus !== QUOTE_STATUSES.Canceled) && <div style={classes.mainContainer}>
      <SecondaryButton
        variant="contained"
        style={classes.btnStyle}
        onClick={onClickApprove}
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
        onClickDelete={onClickReject}
        style={{width:"unset"}}
      />
    </div>
  );
};

export { ButtonsConfirmContainer };
