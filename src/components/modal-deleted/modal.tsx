import { useTranslation } from "react-i18next";
import { IconButton, Modal, Tooltip } from "@mui/material";
import {
  Wastebasket,
  AddModalIcon,
  EditModalIcon,
  DuplicateModalIcon,
  WarningModalIcon,
  DeleteModalIcon,
} from "@/icons";
import { GomakePrimaryButton } from "../button";
import { useStyle } from "./style";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";
import { ModalType } from "@/enums/tabs-icon-enums";
import { RoundedCloseIcon } from "../modal/icon/close";
import { _renderSubTitle } from "@/utils/constants";
import { _renderTitle } from "@/utils/constants";
import { _renderIcon } from "@/utils/constants";

const GoMakeDeleteModal = ({
  openModal,
  onClose,
  insideStyle,
  subTitle,
  onClickDelete,
  hideIcon = false,
  title,
  yesBtn,
  onClickCancel,
  children,
  withClose = true,
  withRoundedCloseIcon = false,
  modalType = ModalType.DELETE,
  ...props
}: any) => {
  const { classes } = useStyle({ modalType });
  const { t } = useTranslation();

  const _renderConfirmBtn = (modalType: ModalType) => {
    if (modalType === ModalType.DELETE) {
      return t("modal.delete");
    }
    if (modalType === ModalType.DUPLICATE) {
      return t("modal.duplicateConfirmBtn");
    }
    if (modalType === ModalType.EDIT) {
      return t("modal.editConfirmBtn");
    }
    if (modalType === ModalType.ADD) {
      return t("modal.addConfirmBtn");
    }
    if (modalType === ModalType.WARNING) {
      return t("modal.warningConfirmBtn");
    }
  };
  const _renderCancelBtn = (modalType: ModalType) => {
    if (modalType === ModalType.DELETE) {
      return t("modal.cancel");
    } else {
      return t("modal.discard");
    }
  };

  const handleCancelClick = () => {
    if (onClickCancel) {
      onClickCancel();
    }
    onClose();
  };

  return (
    <Modal
      disableEnforceFocus
      open={openModal}
      onClose={onClose}
      {...props}
      style={{
        outline: "none",
        zIndex: 999999,
      }}
    >
      <div style={{ ...classes.container, ...props.style }}>
        <div style={classes.content}>
          {withClose && (
            <div style={classes.closeIcon} onClick={onClose}>
              <Tooltip title={t("modal.close")}>
                <IconButton>
                  {withRoundedCloseIcon ? <RoundedCloseIcon /> : <CloseIcon />}
                </IconButton>
              </Tooltip>
            </div>
          )}
          {!hideIcon && (
            <div style={classes.icon}>
              {props.icon || _renderIcon(modalType)}
            </div>
          )}
          <div style={classes.title}>
            {title ? t(title) : _renderTitle(modalType)}
          </div>
          <div style={classes.subTitle}>
            {subTitle ? t(subTitle) : _renderSubTitle(modalType)}
          </div>

          {children && <div style={classes.children}>{children}</div>}
          <div style={{ ...classes.btnsContainer, ...props.btnsContainerStyle }}>
            <GomakePrimaryButton
              style={{ ...classes.confirmBtn, ...props.confirmBtnStyle }}
              onClick={() => {
                onClickDelete();
                onClose();
              }}
            >
              {yesBtn ? t(yesBtn) : _renderConfirmBtn(modalType)}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={{ ...classes.cancelBtn, ...props.cancelBtnStyle }}
              onClick={handleCancelClick}
            >
              {props?.cancelBtn || _renderCancelBtn(modalType)}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { GoMakeDeleteModal };
