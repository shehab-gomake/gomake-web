import { useTranslation } from "react-i18next";
import { IconButton, Modal, Tooltip, Box } from "@mui/material";
import { GomakePrimaryButton } from "../button";
import { useStyle } from "./style";
import { ModalType } from "@/enums";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";
import { RoundedCloseIcon } from "../modal/icon/close";
import { _renderIcon, _renderSubTitle, _renderTitle } from "@/utils/constants";
import { FONT_FAMILY } from "@/utils/font-family";

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
  bottomActionLabel,
  onBottomAction,
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
          <div style={classes.btnsContainer}>
            <GomakePrimaryButton
              style={{
                ...classes.yesBtn,
                ...(t(yesBtn).length > 16
                  ? FONT_FAMILY.Lexend(600, 14)
                  : FONT_FAMILY.Lexend(600, 16)),
              }}
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
                  style={{
                    ...classes.noBtn,
                    ...(t(noBtn).length > 16
                      ? FONT_FAMILY.Lexend(600, 14)
                      : FONT_FAMILY.Lexend(600, 16)),
                  }}
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
          {bottomActionLabel && onBottomAction && (
            <Box style={classes.bottomActionContainer}>
              <Box
                component="button"
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    onBottomAction();
                  }, 100);
                }}
                style={classes.bottomActionButton}
              >
                {typeof bottomActionLabel === "string"
                  ? t(bottomActionLabel)
                  : bottomActionLabel}
              </Box>
            </Box>
          )}
        </div>
      </div>
    </Modal>
  );
};

export { ThreeOptionsModal };
