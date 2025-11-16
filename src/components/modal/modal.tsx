import { useTranslation } from "react-i18next";
import { IconButton, Modal, Tooltip } from "@mui/material";
import { useStyle } from "./style";
import { RoundedCloseIcon } from "./icon/close";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";

const GoMakeModal = ({
  openModal,
  onClose,
  withClose = true,
  // withRoundedCloseIcon = true,
  withRoundedCloseIcon = false,
  isMiddleTitle = false,
  insideStyle,
  modalTitle,
  modalTitleStyle,
  isBlockModal,
  modalTitleColor,
  headerPadding = 0,
  ...props
}: any) => {
  const { children }: any = props;
  const { t } = useTranslation();
  const { classes } = useStyle({
    insideStyle,
    headerPadding,
    isMiddleTitle,
    withClose,
    modalTitleColor,
  });

  return (
    <Modal disableEnforceFocus open={openModal} onClose={onClose} {...props}>
      <div style={classes.container}>
        <div style={classes.headerContainer}>
          {modalTitle && (
            <div
              style={
                isBlockModal
                  ? classes.titleBlockModalStyle
                  : { ...classes.titleModalStyle, ...modalTitleStyle }
              }
            >
              {modalTitle}
            </div>
          )}
          {withClose && (
            <div style={classes.closeIcon} onClick={onClose}>
              <Tooltip title={t("modal.close")}>
                <IconButton>
                  {withRoundedCloseIcon ? <RoundedCloseIcon /> : <CloseIcon />}
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
        <div style={classes.boxContainer}>{children}</div>
      </div>
    </Modal>
  );
};

export { GoMakeModal };
