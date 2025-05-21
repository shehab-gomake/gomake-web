import { useTranslation } from "react-i18next";
import { Modal } from "@mui/material";
import { WarningModalIcon } from "@/icons";
import { useStyle } from "./style";
import { PrimaryButton } from "../button/primary-button";

const GoMakeAlertModal = ({
  openModal,
  onClose,
  insideStyle,
  subTitle,
  onClickConfirm,
  title,
  yesBtn = "sales.quote.Confirm",
  withIcon = true,
  withCancelBtn = true,
  ...props
}: any) => {
  const { classes } = useStyle({ insideStyle });
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
        <div style={{ ...classes.content, width: "100%" }}>
          {withIcon && <WarningModalIcon />}
          <div style={classes.title}>{title}</div>
          <div style={classes.subTitle}> {t(subTitle)}</div>
          <div style={classes.btnsContainer}>
            <PrimaryButton
              variant="contained"
              style={classes.cancelBtn}
              onClick={onClickConfirm}
            >
              {t(yesBtn)}
            </PrimaryButton>
            {withCancelBtn && (
              <PrimaryButton
                style={classes.cancelBtn}
                onClick={onClose}
                variant="outlined"
              >
                {props?.cancelBtn || t("materials.buttons.cancel")}
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { GoMakeAlertModal };
