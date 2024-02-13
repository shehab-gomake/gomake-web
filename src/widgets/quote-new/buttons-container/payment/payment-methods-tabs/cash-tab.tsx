import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";



const CashTab = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const options = [{ label: t("Cash"), value: "true" }];

    return (
            <Stack direction={"column"} gap={"20px"} padding={"0 5px"} >
                <Stack direction={"column"} gap={"7px"} padding={"0 5px"} >
                    <span style={classes.inputLbl} >{t("payment.accountCode")}</span>
                    <GoMakeAutoComplate
                        style={{ height: "40px", maxWidth: 180, border: 0 }}
                        onChange={() => alert("hey")}
                        value={options[0]}
                        options={options}
                    />
                </Stack>
                <Stack direction={"column"} gap={"7px"} padding={"0 5px"} >
                    <span style={classes.inputLbl} >{t("payment.totalCash")}</span>
                    <GomakeTextInput
                        style={{ height: "40px", maxWidth: 180 }}
                        type={"number"}
                        placeholder={t("payment.sum")}
                        value={null}
                    />
                </Stack>
            </Stack>


    );
}
export { CashTab }