import { GoMakeModal, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useMakePaymentModal } from "./use-make-payment-modal";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect } from "react";

interface IMakePaymentProps {
    openMakePaymentModal?: boolean;
    onClickCloseMakePaymentModal?: () => void;
    orderItemValue: any;
    getAllQuotes?:any;
}

const MakePaymentModal = ({
    openMakePaymentModal,
    onClickCloseMakePaymentModal,
    orderItemValue,
    getAllQuotes
}: IMakePaymentProps) => {
    const { classes } = useStyle();
    const {
        t,
        totalPrice,
        setTotalPrice,
        onClickConfirm,
        handleTotalChange
    } = useMakePaymentModal({ orderItemValue , onClickCloseMakePaymentModal , getAllQuotes});

    useEffect(() => {
        setTotalPrice(orderItemValue?.totalPrice- orderItemValue?.sumApplied);
    }, [orderItemValue])

    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openMakePaymentModal}
            onClose={onClickCloseMakePaymentModal}
            modalTitle={t("sales.quote.makePayment")}
        >
            <Stack direction={"column"} justifyContent={"space-between"} height={"100%"}>
                <Stack direction={'column'} gap={'13px'}>
                    <span style={classes.inputLbl}>{t('payment.totalPayment')}</span>
                    <GomakeTextInput value={totalPrice} onChange={handleTotalChange} type={'number'} style={{ width: "180px", height: "40px" }} />
                </Stack>

                <Stack direction={"row"} gap={2}>
                    <SecondaryButton variant={"contained"} onClick={onClickConfirm} >
                        {t("modal.confirm")}
                    </SecondaryButton>
                    <SecondaryButton variant={"outlined"} onClick={onClickCloseMakePaymentModal}  >
                        {t("modal.cancel")}
                    </SecondaryButton>
                </Stack>
            </Stack>
        </GoMakeModal>
    )
}
export { MakePaymentModal }