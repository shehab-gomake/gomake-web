import { useTranslation } from "react-i18next";
import { IconButton, Modal, Tooltip } from "@mui/material";
import { GomakePrimaryButton } from "../button";
import { useStyle } from "./style";
import { ModalType } from "@/enums";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";
import { RoundedCloseIcon } from "../modal/icon/close";
import { WarningModalIcon } from "@/icons";

const ThreeOptionsModal = ({
  openModal,
  onClose,
  insideStyle,
  subTitle,
  onClickYes,
  onClickNo,
  hideIcon = false,
  title,
  yesBtn = "modal.yes",
  noBtn = "modal.no",
  cancelBtn = "modal.cancel",
  modalType = ModalType.DELETE,
  withClose = true,
  withRoundedCloseIcon = false,
  children,
  ...props
}: any) => {
  const { classes } = useStyle({ modalType: modalType });
  const { t } = useTranslation();
  return (
    <Modal
      disableEnforceFocus
      open={openModal}
      onClose={onClose}
      {...props}
      style={{ outline: "none", zIndex: 999999 }}
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
              {props?.icon || <WarningModalIcon />}
            </div>
          )}
          <div style={classes.title}>{title}</div>
          <div style={classes.subTitle}>{subTitle}</div>
          {children && <div style={classes.children}>{children}</div>}
          <div style={classes.btnsContainer}>
            <GomakePrimaryButton
              style={classes.yesBtn}
              onClick={() => {
                onClickYes();
                onClose();
              }}
            >
              {t(yesBtn)}
            </GomakePrimaryButton>
            {!!noBtn && (
              <>
                <GomakePrimaryButton
                  style={classes.noBtn}
                  onClick={() => {
                    onClickNo();
                    onClose();
                  }}
                >
                  {t(noBtn)}
                </GomakePrimaryButton>
              </>
            )}
            <GomakePrimaryButton style={classes.cancelBtn} onClick={onClose}>
              {t(cancelBtn)}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { ThreeOptionsModal };
