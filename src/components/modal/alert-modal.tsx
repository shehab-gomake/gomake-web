import * as React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@mui/material";
import { Wastebasket } from "@/icons";
import { GomakePrimaryButton } from "../button";
import { useStyle } from "./style";
import { PrimaryButton } from "../button/primary-button";

const GoMakeAlertModal = ({
  openModal,
  onClose,
  insideStyle,
  subTitle,
  onClickConfirm,
  title,
  yesBtn = "Confirm",
  ...props
}: any) => {
  const { classes } = useStyle({insideStyle});
  const { t } = useTranslation();

  return (
    <Modal
      disableEnforceFocus
      open={openModal}
      onClose={onClose}
      {...props}
      style={{
        outline: "none",
      }}
    >
      <div style={classes.modalContainer}>
        <div style={classes.content}>
          <div style={classes.title}>{title}</div>
          <div style={classes.subTitle}>{subTitle}</div>
          <div style={classes.btnsContainer}>
            <GomakePrimaryButton
              style={classes.confermBtn}
              onClick={onClickConfirm}
            >
              {yesBtn}
            </GomakePrimaryButton>{" "}
            <PrimaryButton style={classes.cancelBtn} onClick={onClose} variant="outlined">
              {props?.cancelBtn || t("materials.buttons.cancel")}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { GoMakeAlertModal };