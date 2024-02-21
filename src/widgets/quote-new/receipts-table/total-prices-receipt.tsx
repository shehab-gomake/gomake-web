import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useStyle } from "./style";

const PaymentRow = ({ label, value, width }) => {
    const { classes } = useStyle({ headerHeight: "44px" });

    return (
        <div style={classes.firstRowForFooterContainer}>
            <div style={{ ...classes.evenRowContainer, width, borderBottom: "1px solid #EAECF0" }}>
                {label}
            </div>
            <div style={{ ...classes.oddRowContainer, width: "44.2%", paddingLeft: 36, borderBottom: "1px solid #EAECF0" }}>
                {value}
            </div>
        </div>
    );
};

const TotalPricesReceipts = ({ receiptItemValue }) => {
    const { t } = useTranslation();
    const { getCurrencyUnitText, quoteItemValue } = useQuoteGetData();
    const { classes } = useStyle({ headerHeight: "44px" });

    const renderPaymentRow = (label, value) => {
        if (value !== 0) {
            return <PaymentRow label={label} value={`${value} ${getCurrencyUnitText(quoteItemValue?.currency)}`} width="55.8%" />;
        }
        return null;
    };

    return (
        <div style={classes.priceFooterContainer}>
            {[
                { label: t("payment.totalDocuments"), value: receiptItemValue?.sum },
                { label: t("payment.paymentByCash"), value: receiptItemValue?.cashSum },
                { label: t("payment.paymentByTransfer"), value: receiptItemValue?.transferSum },
                { label: t("payment.paymentByCheck"), value: receiptItemValue?.checksTotal },
                { label: t("payment.paymentByCredit"), value: receiptItemValue?.creditCardTotal },
                { label: t("payment.balance"), value: receiptItemValue?.balance },
            ].map((payment, index) => (
                renderPaymentRow(payment.label, payment.value)
            ))}


            <div style={classes.firstRowForFooterContainer}>
                <div style={classes.lastRowContainer}>
                    {t("payment.paid")}
                </div>
                <div style={{ ...classes.oddRowContainer, width: "44.2%", paddingLeft: 36 }}>
                    <div>{receiptItemValue?.totalPrice + " " + getCurrencyUnitText(quoteItemValue?.currency)}</div>
                </div>
            </div>
        </div>
    );
};

export { TotalPricesReceipts };
