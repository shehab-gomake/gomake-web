import * as React from "react";
import { Modal } from "@mui/material";
import { Wastebasket } from "@/icons";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "../button";

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
      <div style={clasess.container}>
        <div style={clasess.content}>
          {!hideIcon && (
            <div style={clasess.icon}>
              <Wastebasket />
            </div>
          )}
          <div style={clasess.title}>{title}</div>
          <div style={clasess.subTitle}>{subTitle}</div>
          <div style={clasess.btnsContainer}>
            <GomakePrimaryButton
              style={clasess.confermBtn}
              onClick={onClickDelete}
            >
              {yesBtn}
            </GomakePrimaryButton>{" "}
            <GomakePrimaryButton style={clasess.cancelBtn} onClick={onClose}>
              Cancel
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { GoMakeDeleteModal };
