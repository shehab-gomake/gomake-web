import * as React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@mui/material";
import { Wastebasket } from "@/icons";
import { GomakePrimaryButton } from "../button";
import { useStyle } from "./style";

const GoMakeDeleteModal = ({
  openModal,
  onClose,
  insideStyle,
  subTitle,
  onClickDelete,
  hideIcon = false,
  title = "Confirm Delete",
  yesBtn = "Delete",
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
      style={{
        outline: "none",
      }}
    >
      <div style={{...classes.container , ...props.style}}>
        <div style={classes.content}>
          {!hideIcon && (
            <div style={classes.icon}>{props.icon || <Wastebasket />}</div>
          )}
          <div style={classes.title}>{title}</div>
          <div style={classes.subTitle}>{subTitle}</div>
          <div style={classes.btnsContainer}>
            <GomakePrimaryButton
              style={classes.confirmBtn}
              onClick={() => {
                onClickDelete();
                onClose();
              }}
            >
              {yesBtn}
            </GomakePrimaryButton>{" "}
            <GomakePrimaryButton style={classes.cancelBtn} onClick={onClose}>
              {props?.cancelBtn || t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { GoMakeDeleteModal };
