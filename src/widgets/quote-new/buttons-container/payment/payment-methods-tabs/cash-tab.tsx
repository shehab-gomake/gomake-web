import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { useRecoilState } from "recoil";
import { cashAccountCodeState } from "../../states";

const CashTab = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { totalCash, handleTotalCashChange, mapERPAccountsOptions } = usePaymentMethodsTabs();
    const [cashAccountCode, setCashAccountCode] = useRecoilState<any>(cashAccountCodeState);

    const handleAccountCodeChange = (selectedOption) => {
        setCashAccountCode(selectedOption?.value);
    };

    return (
        <Stack direction={"column"} gap={"20px"} padding={"0 5px"} >
            <Stack direction={"column"} gap={"7px"} padding={"0 5px"} >
                <span style={classes.inputLbl} >{t("payment.accountCode")}</span>
                <GoMakeAutoComplate
                    style={{ height: "40px", maxWidth: 180, border: 0 }}
                    value={mapERPAccountsOptions.find((option) => option.value === cashAccountCode)}
                    defaultValue={mapERPAccountsOptions[0]}
                    options={mapERPAccountsOptions}
                    onChange={(e: any, value: any) => handleAccountCodeChange(value)}
                />
            </Stack>
            <Stack direction={"column"} gap={"7px"} padding={"0 5px"} >
                <span style={classes.inputLbl} >{t("payment.totalCash")}</span>
                <GomakeTextInput
                    style={{ height: "40px", maxWidth: 180 }}
                    type={"number"}
                    placeholder={t("payment.sum")}
                    value={totalCash}
                    onChange={(e) => handleTotalCashChange(e.target.value)}
                />
            </Stack>
        </Stack>


    );
}
export { CashTab }