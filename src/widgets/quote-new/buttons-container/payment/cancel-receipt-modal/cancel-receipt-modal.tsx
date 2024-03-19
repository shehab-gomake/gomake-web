import { GomakePrimaryButton } from "@/components";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Modal } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface IPaymentModalProps {
  openModal: boolean;
  handleModalClose: () => void;
  onClickCancel: (value: boolean) => void;
}

const CancelReceiptModal = ({ openModal, handleModalClose, onClickCancel }: IPaymentModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  return (
    <Modal
      disableEnforceFocus
      open={openModal}
      onClose={handleModalClose}
      style={{ outline: "none", }}
    >
      <div style={classes.container}>
        <div style={classes.content}>
          <div style={classes.icon}>{<WarningAmberIcon style={classes.iconStyle} />}</div>
          <div style={classes.title}>{t("payment.cancelReceipt")}</div>
          <div style={classes.subTitle} />
          <div style={classes.btnsContainer}>
            <GomakePrimaryButton
              style={classes.confirmBtn}
              onClick={() => {
                onClickCancel(true);
                handleModalClose();
              }}
            >
              {t("payment.CancelWithRefund")}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={classes.confirmBtn}
              onClick={() => {
                onClickCancel(false);
                handleModalClose();
              }}
            >
              {t("payment.CancelWithoutRefund")}
            </GomakePrimaryButton>
            <GomakePrimaryButton style={classes.cancelBtn} onClick={handleModalClose}>
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </Modal>

  );
}
export { CancelReceiptModal }