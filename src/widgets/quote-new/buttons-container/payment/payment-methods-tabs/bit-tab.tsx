import { GomakeTextInput } from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "../style";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";

const BitTab = () => {
    const { classes } = useStyle();
    const { t, totalBit, handleTotalBitChange } = usePaymentMethodsTabs();

    return (
        <Stack direction={"column"} gap={"7px"} padding={"0 5px"} >
            <span style={classes.inputLbl} >{t("payment.totalBit")}</span>
            <GomakeTextInput
                style={{ height: "40px", maxWidth: 180 }}
                type={"number"}
                placeholder={t("payment.sum")}
                onChange={(e) => handleTotalBitChange(e.target.value)}
                value={totalBit}
            />
        </Stack>
    );
}
export { BitTab }