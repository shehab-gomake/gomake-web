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
        payState,
        handleCopyPaymentLink,
        handleCheckBoxChange,
        onChangePaymentInputs,
        handleSendPaymentPage
    } = useSendPaymentModal();

  
    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openPaymentModal}
            onClose={onClickClosePaymentModal}
            modalTitle={paymentModalTitle} 
        >
            <Stack direction={'column'} height={"100%"} justifyContent={"space-between"} width={"100%"}>
                <Divider style={classes.dividerContainer} />
                <Stack display="flex" flexWrap="wrap" direction="row" >
                    {PaymentInputs(payState).slice(0, 3).map((item) => (
                        <FormInput
                            input={item as IInput}
                            changeState={onChangePaymentInputs}
                            error={false}
                            key={item.name}
                            readonly={!!item.readOnly}
                            />
                    ))}
                </Stack>
                {PaymentInputs(payState).slice(3).map((item) => (
                    <Stack display="flex" flexWrap="wrap" direction="row" width={"max-content"}>
                        <FormInput
                            input={item as IInput}
                            changeState={onChangePaymentInputs}
                            error={false}
                            key={item.name}
                            readonly={!!item.readOnly}
                        />
                        {item.name === "percentageOfTotal" && <div style={{ display: "flex", alignItems: "flex-end", marginLeft: "5px" }}>%</div>}
                        {item.name === "totalToPay" && <div style={{ display: "flex", alignItems: "flex-end", marginLeft: "5px" }}>{payState?.currency}</div>}

                    </Stack>
                ))}
                <Stack display="flex" flexWrap="wrap" direction="row" gap="10px">
                    <div style={classes.inputLbl}>   <SecondaryCheckBox
                        sx={{ padding: "2px" }}
                        checked={payState?.sendBySms || false}
                        onChange={(event) => handleCheckBoxChange("sendBySms", event.target.checked)}
                    />SMS</div>
                    <div style={classes.inputLbl}>
                        <SecondaryCheckBox
                            sx={{ padding: "2px" }}
                            checked={payState?.sendByMail || false}
                            onChange={(event) => handleCheckBoxChange("sendByMail", event.target.checked)}
                        />{t("sales.quote.email")}</div>
                    <div style={classes.inputLbl}>
                        <SecondaryCheckBox
                            sx={{ padding: "2px" }}
                            checked={payState?.sendByWhatsapp || false}
                            onChange={(event) => handleCheckBoxChange("sendByWhatsapp", event.target.checked)}
                        />{t("sales.quote.whatsApp")}</div>
                </Stack>
                {/* Third section */}
                <Stack direction={'row'} gap={'10px'} alignItems={"baseline"} >
                    <SecondaryButton variant="contained" onClick={handleSendPaymentPage} style={{ width: "50%", height: "35px", minWidth: "fit-content" }}>{t('prePayment.sendPaymentPage')}</SecondaryButton>
                    <SecondaryButton variant="outlined" onClick={handleCopyPaymentLink} style={{ width: "30%", height: "35px", minWidth: "fit-content" }}>{t('prePayment.copyPaymentLink')}</SecondaryButton>
                    <PrimaryButton variant="outlined" onClick={onClickClosePaymentModal} style={{ width: "20%", height: "35px" }}>{t('modal.cancel')}</PrimaryButton>
                </Stack>
            </Stack>
        </GoMakeModal>
    )
}
export { SendPaymentModal }