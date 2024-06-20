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

    const handleClose= () => {
        setNewState({
            bySMS: true, 
            byMail: true, 
            percentageOfTotal:100,
            numberOfInstallments:1
        })
        onClickClosePaymentModal();
    };


    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openPaymentModal}
            onClose={handleClose}
            modalTitle={paymentModalTitle}
        >
            <Stack direction={'column'} height={"100%"} justifyContent={"space-between"} >
                {/* First section */}
                {/* Contacts */}
                {/* Second section */}
                {PaymentInputs(newState).map((item) => (
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
                        checked={newState?.bySMS || false}
                        onChange={(event) => handleCheckBoxChange("bySMS", event.target.checked)}
                    />SMS</div>
                    <div style={classes.inputLbl}>
                        <SecondaryCheckBox
                            sx={{ padding: "2px" }}
                            checked={newState?.byMail || false}
                            onChange={(event) => handleCheckBoxChange("byMail", event.target.checked)}
                        />{t("sales.quote.email")}</div>
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