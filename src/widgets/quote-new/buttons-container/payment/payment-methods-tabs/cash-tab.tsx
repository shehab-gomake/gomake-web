import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { useRecoilState } from "recoil";
import { cashAccountCodeState } from "../../states";
import { useEffect } from "react";

const CashTab = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { totalCash, handleTotalCashChange, cashAccountsOptions } = usePaymentMethodsTabs();
    const [cashAccountCode, setCashAccountCode] = useRecoilState<string>(cashAccountCodeState);

    const handleAccountCodeChange = (selectedOption) => {
        setCashAccountCode(selectedOption?.value);
    };


    useEffect(() => {
        if (cashAccountsOptions.length > 0 && !cashAccountCode) {
            const defaultOption = cashAccountsOptions.find(option => option.isSelected).value;
            if (defaultOption) {
                setCashAccountCode(defaultOption);
            }
            else {
                setCashAccountCode(cashAccountsOptions[0].value)
            }
        }
    }, [cashAccountsOptions, cashAccountCode]);


    return (
        <Stack direction={"column"} gap={"20px"} padding={"0 5px"} >
            <Stack direction={"column"} gap={"7px"} padding={"0 5px"} >
                <span style={classes.inputLbl} >{t("payment.accountCode")}</span>
                {cashAccountCode && (<GoMakeAutoComplate
                    style={{ height: "40px", maxWidth: 180, border: 0 }}
                    value={cashAccountsOptions.find((option) => option.value === cashAccountCode)}
                    options={cashAccountsOptions}
                    onChange={(e: any, value: any) => handleAccountCodeChange(value)}
                />)}
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