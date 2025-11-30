import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeDeleteModal } from "@/components";
import { useButtonsConfirmContainer } from "./use-buttons-container";
import { SecondaryButton } from "@/components/button/secondary-button";
import { AttachIcon } from "@/components/icons/attach-icon";
import { CancelBtnMenu } from "../cancel-btn-menu";
import { QuoteStatuses } from "../total-price-and-vat/enums";
import { OtherReasonModal } from "../total-price-and-vat/other-reason-modal";
import { ApproveSignatureModal } from "../total-price-and-vat/approve-signature-modal";
import { ModalType } from "@/enums";
import { quoteItemState } from "@/store/quote-item";
import { useRecoilState, useRecoilValue } from "recoil";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { areAllItemsChecked } from "@/utils/helpers";
import { AddAttachmentsModal } from "@/widgets/quote-new/modals-widgets/add-attachments-modal/add-attachments-modal";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const ButtonsConfirmContainer = ({
  onClickOpenAddAttachmentsModal,
  isQuoteConfirmation,
  quoteConfirm,
}) => {
  const { alertFault } = useSnackBar();
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    onClickCloseRejectModal,
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
    isButtonClicked,
    onClickReject,
    onClickApprove,
    approveModal,
    onClickOpenApproveModal,
    onClickCloseApproveModal,
    approveSignatureModal,
    onClickOpenApproveSignatureModal,
    onClickCloseApproveSignatureModal,
    onContinueApprovalFromAttachmentsModal,
    onFileUploadStart,
    onFileUploadComplete,
    openAttachmentsModal,
    onClickCloseAddAttachmentsModal,
  } = useButtonsConfirmContainer();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  return (
    <div style={classes.writeCommentContainer}>
      <div style={classes.btnsContainer}>
        <SecondaryButton
          onClick={handleRejectBtnClick}
          variant="outlined"
          style={isButtonClicked ? classes.rejectBtnClicked : classes.rejectBtn}
        >
          {t("sales.quote.rejectOffer")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.btnStyle}
          onClick={onClickPrint}
        >
          {t("sales.quote.print")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          startIcon={<AttachIcon />}
          style={classes.btnStyle}
          onClick={() => {
            if (isQuoteConfirmation) {
              // Add the check here
              if (areAllItemsChecked(quoteConfirm)) {
                alertFault("reports.pleaseSelectOneItem");
              } else {
                onClickOpenAddAttachmentsModal();
              }
            } else {
              onClickOpenAddAttachmentsModal();
            }
          }}
        >
          {t("sales.quote.attachFiles")}
        </SecondaryButton>
        <SecondaryButton
          variant="contained"
          style={classes.btnStyle}
          onClick={() => {
            if (isQuoteConfirmation) {
              // Add the check here
              if (areAllItemsChecked(quoteConfirm)) {
                alertFault("reports.pleaseSelectOneItem");
              } else {
                onClickOpenApproveModal();
              }
            } else {
              onClickOpenApproveModal();
            }
          }}
        >
          {t("sales.quote.approveOffer")}
        </SecondaryButton>
      </div>
      <CancelBtnMenu
        handleClose={handleRejectBtnClose}
        open={openRejectBtn}
        anchorEl={anchorElRejectBtn}
        onClickOpenModal={() =>
          onClickOpenOtherModal(QuoteStatuses.CANCELED_OTHER)
        }
        onClickOpenDeliveryTimeModal={() =>
          onClickOpenRejectModal(QuoteStatuses.CANCELED_DELIVERY_TIME)
        }
        onClickOpenPriceModal={() =>
          onClickOpenRejectModal(QuoteStatuses.CANCELED_PRICE)
        }
        onClickOpenIrrelevantModal={() =>
          onClickOpenRejectModal(QuoteStatuses.CANCELED_IRRELEVANT)
        }
      />
      <OtherReasonModal
        openModal={openOtherReasonModal}
        onClose={onClickCloseOtherModal}
        setReasonText={setReasonText}
        onClickCancelOffer={onClickReject}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openRejectModal}
        onClose={onClickCloseRejectModal}
        subTitle={`${t("sales.quote.subTitleCancelModal", {
          documentName: t(
            `sales.quote.${DOCUMENT_TYPE[DOCUMENT_TYPE.quote]}`
          ).toLowerCase(),
        })}?`}
        cancelBtn={t("sales.quote.noBtn")}
        onClickDelete={onClickReject}
      />

      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("sales.quote.approveOffer")}
        yesBtn={t("sales.quote.approveAndSign")}
        openModal={approveModal}
        onClose={onClickCloseApproveModal}
        subTitle={t("sales.cart.approveOfferQuestion")}
        onClickDelete={onClickOpenApproveSignatureModal}
        hideIcon={true}
      />
      <ApproveSignatureModal
        openModal={approveSignatureModal}
        onClose={onClickCloseApproveSignatureModal}
        onClickApprove={onClickApprove}
      />
      <AddAttachmentsModal
        openModal={openAttachmentsModal}
        onClose={onClickCloseAddAttachmentsModal}
        documentType={1}
        getQuote={() => {}}
        isQuoteConfirmation={true}
        quoteConfirm={quoteConfirm}
        onFileUploadStart={onFileUploadStart}
        onFileUploadComplete={onFileUploadComplete}
        onContinueApproval={onContinueApprovalFromAttachmentsModal}
      />
    </div>
  );
};

export { ButtonsConfirmContainer };
