import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "../style";
import { usePaymentsTable } from "@/widgets/quote-new/receipts-table/use-payments-table";

const FooterSection = ({ onCloseModal }: any) => {
    const { classes } = useStyle();
    const { t, totalSum, totalPayment, handleSave,handleTaxDeductionChange, taxDeduction } = usePaymentsTable();

    const onClickSave = () => {
        handleSave();
        onCloseModal();
    };

    return (
        <div style={classes.divStyle}>
            <Stack style={{ ...classes.saveBtn, flexDirection: "row", width: "50%", gap: "10px" }}>
                <span style={classes.taxLBLStyle} >{t("payment.taxDeduction")} :</span>
                <input
                    style={classes.taxInputStyle}
                    value={taxDeduction}
                    onChange={handleTaxDeductionChange}
                    />
            </Stack>
            <Stack sx={classes.containerStyle}>
                <Stack style={{ ...classes.rowStyle, borderBottom: "2px solid rgba(0, 0, 0, 0.04)" }}>
                    <span style={classes.textStyle}>{t("payment.totalDocuments")}</span>
                    <input readOnly style={classes.inputStyle} value={totalSum} />
                </Stack>
                {((totalSum - totalPayment) > 0 && totalPayment !== 0) && <Stack style={{ ...classes.rowStyle, borderBottom: "2px solid rgba(0, 0, 0, 0.04)" }}>
                    <span style={classes.textStyle} >{t("payment.balance")}</span>
                    <input style={classes.inputStyle} value={totalSum - totalPayment} />
                </Stack>}
                <Stack style={{ ...classes.rowStyle, borderBottom: "2px solid rgba(0, 0, 0, 0.04)" }}>
                    <span style={classes.textStyle}>{t("payment.totalPayment")}</span>
                    <input style={classes.inputStyle} value={totalPayment} />
                </Stack>

                {(totalSum - totalPayment) < 0 && <Stack style={{ ...classes.rowStyle, borderBottom: "2px solid rgba(0, 0, 0, 0.04)" }}>
                    <span style={classes.textStyle} >{t("payment.excessPayment")}</span>
                    <input style={classes.inputStyle} value={Math.abs(totalSum - totalPayment)} />
                </Stack>}

            </Stack>
            <SecondaryButton variant={'contained'} style={classes.saveBtn} onClick={onClickSave}>
                {t('payment.save')}
            </SecondaryButton>
        </div>
    );
};

export { FooterSection };