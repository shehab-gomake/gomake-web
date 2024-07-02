import Stack from "@mui/material/Stack";
import { GoMakeModal } from "@/components";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "./style";
import { PrimaryButton } from "@/components/button/primary-button";
import { IInput } from "@/components/form-inputs/interfaces";
import { FormInput } from "@/components/form-inputs/form-input";
import { PaymentInputs } from "./inputs";
import { SecondaryCheckBox } from "@/components/check-box/secondary-check-box";
import { useSendPaymentModal } from "./use-send-payment-modal";
import { initialState } from "./states";
import { Divider } from "@mui/material";

interface ISendPaymentProps {
    openPaymentModal?: any;
    onClickClosePaymentModal?: any;
    paymentModalTitle?: any;
}

const SendPaymentModal = ({
    openPaymentModal,
    onClickClosePaymentModal,
    paymentModalTitle
}: ISendPaymentProps) => {

    const { classes } = useStyle();
    const {
        t,
        newState,
        setNewState,
        handleCopyPaymentLink,
        handleCheckBoxChange,
        onChangePaymentInputs
    } = useSendPaymentModal();

    const handleClose = () => {
        setNewState(initialState)
        onClickClosePaymentModal();
    };

    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openPaymentModal}
            onClose={handleClose}
            modalTitle={paymentModalTitle}
        >
            <Stack direction={'column'} height={"100%"} justifyContent={"space-between"} width={"100%"}>
                <Divider style={classes.dividerContainer} />
                <Stack display="flex" flexWrap="wrap" direction="row" >
                    {PaymentInputs(newState).slice(0, 3).map((item) => (
                        <FormInput
                            input={item as IInput}
                            changeState={onChangePaymentInputs}
                            error={false}
                            key={item.name} />
                    ))}
                </Stack>
                {PaymentInputs(newState).slice(3).map((item) => (
                    <Stack display="flex" flexWrap="wrap" direction="column" width={"max-content"}>

                        <FormInput
                            input={item as IInput}
                            changeState={onChangePaymentInputs}
                            error={false}
                            key={item.name}
                        />
                    </Stack>

                ))}
                <Stack display="flex" flexWrap="wrap" direction="row" gap="10px">
                    <div style={classes.inputLbl}>   <SecondaryCheckBox
                        sx={{ padding: "2px" }}
                        checked={newState?.SendBySms || false}
                        onChange={(event) => handleCheckBoxChange("SendBySms ", event.target.checked)}
                    />SMS</div>
                    <div style={classes.inputLbl}>
                        <SecondaryCheckBox
                            sx={{ padding: "2px" }}
                            checked={newState?.sendByMail || false}
                            onChange={(event) => handleCheckBoxChange("sendByMail", event.target.checked)}
                        />{t("sales.quote.email")}</div>
                    <div style={classes.inputLbl}>
                        <SecondaryCheckBox
                            sx={{ padding: "2px" }}
                            checked={newState?.sendByWhatsapp || false}
                            onChange={(event) => handleCheckBoxChange("sendByWhatsapp", event.target.checked)}
                        />{t("sales.quote.whatsApp")}</div>
                </Stack>
                {/* Third section */}
                <Stack direction={'row'} gap={'10px'} alignItems={"baseline"} >
                    <SecondaryButton variant="contained" style={{ width: "50%", height: "35px", minWidth: "fit-content" }}>{t('prePayment.sendPaymentPage')}</SecondaryButton>
                    <SecondaryButton variant="outlined" onClick={handleCopyPaymentLink} style={{ width: "30%", height: "35px", minWidth: "fit-content" }}>{t('prePayment.copyPaymentLink')}</SecondaryButton>
                    <PrimaryButton variant="outlined" onClick={handleClose} style={{ width: "20%", height: "35px" }}>{t('modal.cancel')}</PrimaryButton>
                </Stack>
            </Stack>
        </GoMakeModal>
    )
}
export { SendPaymentModal }