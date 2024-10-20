import { useTranslation } from "react-i18next";
import { IconButton, Modal, Tooltip } from "@mui/material";
import { Wastebasket } from "@/icons";
import { GomakePrimaryButton } from "../button";
import { useStyle } from "./style";
import { RoundedCloseIcon } from "../modal/icon/close";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";

const GoMakeDeleteModal = ({
  openModal,
  onClose,
  insideStyle,
  subTitle,
  onClickDelete,
  hideIcon = false,
  title = "modal.confirmDelete",
  yesBtn = "modal.delete",
  onClickCancel,
  children,
  withClose,
  withRoundedCloseIcon = true,
  ...props
}: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

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
        zIndex: 999999
      }}
    >
      <div style={{ ...classes.container, ...props.style }}>
        <div style={classes.content}>
          {!hideIcon && (
            <div style={classes.icon}>{props.icon || <Wastebasket />}</div>
          )}
          <div style={classes.title}>{title}</div>
          <div style={classes.subTitle}>{subTitle}</div>
          {withClose && (
            <div style={classes.closeIcon} onClick={onClose}>
              <Tooltip title={t("modal.close")}>
                <IconButton>
                  {withRoundedCloseIcon ? <RoundedCloseIcon /> : <CloseIcon />}
                </IconButton>
              </Tooltip>
            </div>
          )}
          {children && <div style={classes.children}>{children}</div>}
          <div style={classes.btnsContainer}>
            <GomakePrimaryButton
              style={classes.confirmBtn}
              onClick={() => {
                onClickDelete();
                onClose();
              }}
            >
              {t(yesBtn)}
            </GomakePrimaryButton>{" "}
            <GomakePrimaryButton style={classes.cancelBtn} onClick={handleCancelClick}>
              {props?.cancelBtn || t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { GoMakeDeleteModal };