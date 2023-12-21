import * as React from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Modal, Tooltip } from "@mui/material";
import { CloseIcon } from "./icon/close";
import { useStyle } from "./style";

const GoMakeModal = ({
  openModal,
  onClose,
  withClose = true,
  isMiddleTitle = false,
  insideStyle,
  modalTitle,
  isBlockModal,
  headerPadding = 0,
  ...props
}: any) => {
  const { children }: any = props;
  const { t } = useTranslation();
  const { classes } = useStyle({ insideStyle, headerPadding , isMiddleTitle, withClose});
  return (
    <Modal  disableEnforceFocus open={openModal} onClose={onClose} {...props}>
      <div style={classes.container}>
        <div style={classes.headerContainer}>
          {modalTitle && (
            <div style={isBlockModal ? classes.titleBlockModalStyle : classes.titleModalStyle}>{modalTitle}</div>
          )}
          {withClose && (
            <div style={classes.closeIcon} onClick={onClose}>
              <Tooltip title={t("modal.close")}>
                <IconButton>
                  <CloseIcon />
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
