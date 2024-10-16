import { GoMakeModal } from "@/components";
import { useStyle } from "./style";
import { useSendPaymentModal } from "./use-send-payment";
import { Stack } from "@mui/material";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { SendPaymentInputs } from "./send-payment-inputs";
import { PrimaryButton } from "@/components/button/primary-button";

interface SendPaymentModalProps {
  openModal: boolean;
  onClose: () => void;
  selectedPrintHouseId: string;
}

const SendPaymentModal = ({
  openModal,
  onClose,
  selectedPrintHouseId,
}: SendPaymentModalProps) => {
  const { classes } = useStyle();
  const {
    t,
    handleCloseModal,
    paymentState,
    onChangeInputs,
    sendPaymentPage,
    loading,
  } = useSendPaymentModal({ onClose, selectedPrintHouseId });

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={handleCloseModal}
      modalTitle={t("Send Payment Page")}
      insideStyle={classes.modalStyle}
    >
      <div
        style={{
          pointerEvents: loading ? "none" : "auto",
          opacity: loading ? 0.5 : 1,
        }}
      >
        <Stack
          direction="column"
          gap={"15px"}
          width={"fit-content"}
          alignItems={"flex-start"}
        >
          {SendPaymentInputs(paymentState).map((item) => (
            <FormInput
              input={item as IInput}
              changeState={onChangeInputs}
              error={false}
              key={item.name}
            />
          ))}
        </Stack>
        <Stack direction="row" justifyContent="center" width="100%" mt={2}>
          <PrimaryButton
            variant={"contained"}
            onClick={sendPaymentPage}
            style={{ width: "fit-content" }}
            disabled={loading}
          >
            {t("sales.quote.sendPayment")}
          </PrimaryButton>
        </Stack>
      </div>
    </GoMakeModal>
  );
};
export { SendPaymentModal };
