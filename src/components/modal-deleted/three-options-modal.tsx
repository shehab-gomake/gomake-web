import * as React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@mui/material";
import { GomakePrimaryButton } from "../button";
import { useStyle } from "./style";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const ThreeOptionsModal = ({
  openModal,
  onClose,
  insideStyle,
  subTitle,
  onClickYes,
  onClickNo,
  hideIcon = false,
  title ,
  yesBtn = "modal.yes",
  noBtn = "modal.no",
  cancelBtn = "modal.cancel",
  ...props
}: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  return (
    <Modal
      disableEnforceFocus
      open={openModal}
      onClose={onClose}
      {...props}
      style={{ outline: "none", zIndex: 999999}}
    >
      <div style={{...classes.container , ...props.style}}>
        <div style={classes.content}>
          {!hideIcon && (
            <div style={classes.icon}>{props?.icon ||   <WarningAmberIcon
              style={classes.iconStyle}
            /> }</div>
          )}
          <div style={classes.title}>{title}</div>
          <div style={classes.subTitle}>{subTitle}</div>
          <div style={classes.btnsContainer}>
            <GomakePrimaryButton
              style={classes.confirmBtn}
              onClick={() => {
                onClickYes();
                onClose();
              }}
            >
              {t(yesBtn)}
            </GomakePrimaryButton>{" "}
            <GomakePrimaryButton
              style={classes.confirmBtn}
              onClick={() => {
                onClickNo();
                onClose();
              }}
            >
              {t(noBtn)}
            </GomakePrimaryButton>{" "}
            <GomakePrimaryButton
              style={classes.cancelBtn}
              onClick={onClose}
            >
              {t(cancelBtn)}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { ThreeOptionsModal };
