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
  const { clasess } = useStyle();
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
      <div style={{...clasess.container , ...props.style}}>
        <div style={clasess.content}>
          {!hideIcon && (
            <div style={clasess.icon}>{props.icon || <Wastebasket />}</div>
          )}
          <div style={clasess.title}>{title}</div>
          <div style={clasess.subTitle}>{subTitle}</div>
          <div style={clasess.btnsContainer}>
            <GomakePrimaryButton
              style={clasess.confermBtn}
              onClick={() => {
                onClickDelete();
                onClose();
              }}
            >
              {yesBtn}
            </GomakePrimaryButton>{" "}
            <GomakePrimaryButton style={clasess.cancelBtn} onClick={onClose}>
              {props?.cancelBtn || t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { GoMakeDeleteModal };
