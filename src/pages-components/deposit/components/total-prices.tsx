import { useTranslation } from "react-i18next";
import { useStyle } from "../style";

const TotalPricesDeposits = ({
    amountForDeposit,
    totalDeposit,
    footerWith,
    footerDirection
}) => {
    const { classes } = useStyle(footerWith);
    const { t } = useTranslation();
    const dir = t('direction');

    return (
        <div dir={footerDirection}  style={classes.priceFooterContainer}>
            <div style={classes.firstRowForFooterContainer}>
                <label style={{ ...classes.evenRowContainer, width: "55.8%", borderBottom: "1px solid #EAECF0" }}>
                    {t("deposits.amountForDeposit")}
                </label>
                <div style={{ ...classes.oddRowContainer, width: "44.2%", paddingLeft: 36, borderBottom: "1px solid #EAECF0", }}>
                    {amountForDeposit}
                </div>
            </div>
            <div style={classes.firstRowForFooterContainer}>
                <label style={{ ...classes.evenRowContainer, width: "55.8%", borderBottomRightRadius: dir === "rtl" ? 6 : 0, borderBottomLeftRadius: dir === "rtl" ? 0 : 6 }}>
                    {t("deposits.totalDeposit")}
                </label>
                <div style={{ ...classes.oddRowContainer, width: "44.2%", paddingLeft: 36 }}>
                    {totalDeposit}
                </div>
            </div>
        </div>
    );
};

export { TotalPricesDeposits };