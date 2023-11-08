import * as React from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Modal, Tooltip } from "@mui/material";
import { CloseIcon } from "./icon/close";
import { useStyle } from "./style";

const GoMakeModal = ({
  openModal,
  onClose,
  withClose = true,
  insideStyle,
  modalTitle,
  headerPadding = 0,
  ...props
}: any) => {
  const { children }: any = props;
  const { t } = useTranslation();
  const { clasess } = useStyle({ insideStyle, headerPadding });
  return (
    <Modal disableEnforceFocus open={openModal} onClose={onClose} {...props}>
      <div style={clasess.container}>
        <div style={clasess.headerContainer}>
          {modalTitle && (
            <div style={clasess.titleModalStyle}>{modalTitle}</div>
          )}
          {withClose && (
            <div style={clasess.closeIcon} onClick={onClose}>
              <Tooltip title={t("modal.close")}>
                <IconButton>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
        <div style={clasess.boxContainer}>{children}</div>
      </div>
    </Modal>
  );
};

export { GoMakeModal };
