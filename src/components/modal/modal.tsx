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
  ...props
}: any) => {
  const { children }: any = props;
  const { t } = useTranslation();
  const { clasess } = useStyle({ insideStyle });
  return (
    <Modal disableEnforceFocus open={openModal} onClose={onClose} {...props}>
      <div style={clasess.container}>
        {withClose && (
          <div style={clasess.closeIcon} onClick={onClose}>
            <Tooltip title={t("modal.close")}>
              <IconButton>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {modalTitle && <div style={clasess.titleModalStyle}>{modalTitle}</div>}
        <div style={clasess.boxContainer}>{children}</div>
      </div>
    </Modal>
  );
};

export { GoMakeModal };