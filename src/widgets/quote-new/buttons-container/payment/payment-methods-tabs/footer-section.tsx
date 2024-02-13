import { Stack } from "@mui/material";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "../style";

const FooterSection = () => {
    const { t } = usePaymentMethodsTabs();
    const { classes } = useStyle();

    return (
        <div style={classes.divStyle}>
            <Stack style={{ ...classes.saveBtn, flexDirection: "row", width: "50%" , gap:"10px"}}>
                <span style={classes.taxLBLStyle} >{t("payment.taxDeduction")} :</span>
                <input style={classes.taxInputStyle}/>
            </Stack>
            <Stack sx={classes.containerStyle}>
                <Stack style={{ ...classes.rowStyle, borderBottom: "2px solid rgba(0, 0, 0, 0.04)" }}>
                    <span style={classes.textStyle}>{t("payment.totalDocuments")}</span>
                    <input readOnly style={classes.inputStyle} value={"5$"} />
                </Stack>
                <Stack style={{ ...classes.rowStyle, borderBottom: "2px solid rgba(0, 0, 0, 0.04)" }}>
                    <span style={classes.textStyle} >{t("payment.excessPayment")}</span>
                    <input style={classes.inputStyle} value={"17$"} />
                </Stack>
                <Stack style={classes.rowStyle}>
                    <span style={classes.textStyle}>{t("payment.totalPayment")}</span>
                    <input style={classes.inputStyle} value={"17$"} />
                </Stack>
            </Stack>
            <SecondaryButton variant={'contained'} style={classes.saveBtn}>
                {t('payment.save')}
            </SecondaryButton>
        </div>
    );
};

export { FooterSection };
