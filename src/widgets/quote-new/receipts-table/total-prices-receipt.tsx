import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useStyle } from "./style";
import { DetailsIcon } from "./Payment-methods-details/icons/details-icon";
import { IconButton } from "@mui/material";

const PaymentRow = ({ label, value }) => {
    const { classes } = useStyle({ headerHeight: "44px" });
    return (
        <div style={classes.firstRowForFooterContainer}>
            <div style={{ ...classes.evenRowContainer, width:"50%", borderBottom: "1px solid #EAECF0" }}>
                {label}
            </div>
            <div style={{ ...classes.oddRowContainer, width: "50%", paddingLeft: 36, borderBottom: "1px solid #EAECF0" }}>
                {value}
            </div>
        </div>
    );
};

const TotalPricesReceipts = ({ receiptItemValue  , handleOpenModal}) => {
    const { t } = useTranslation();
    const dir: 'rtl' | 'ltr' = t('direction');
    const RTL = dir === 'rtl';
    const { getCurrencyUnitText, quoteItemValue } = useQuoteGetData();
    const { classes } = useStyle({ headerHeight: "44px" });

    const renderPaymentRow = (label, value , index) => {
        if (value !== 0) {
            return <PaymentRow key={index} label={label} value={`${value} ${getCurrencyUnitText(quoteItemValue?.currency)}`} />;
        }
        return null;
    };

    return (
        <div style={classes.priceReceiptFooterContainer}>
            {[
                { label: t("payment.totalDocuments"), value: receiptItemValue?.totalDocuments },
                { label: t("payment.paymentByCash"), value: receiptItemValue?.cashSum },
                { label: t("payment.paymentByTransfer"), value: receiptItemValue?.transferSum },
                { label: t("payment.paymentByBit"), value: receiptItemValue?.bitSum },
                { label: t("payment.paymentByCheck"), value: receiptItemValue?.checksTotal },
                { label: t("payment.paymentByCredit"), value: receiptItemValue?.creditCardTotal },
                { label: t("payment.balance"), value: receiptItemValue?.balance },
            ].map((payment, index) => (
                renderPaymentRow(payment.label, payment.value , index)
            ))}
            <div style={classes.firstRowForFooterContainer}>
                <div style={classes.lastRowContainer}>
                    {t("payment.paid")}
                </div>
                <div style={{ ...classes.oddRowContainer, width: "50%", paddingLeft: RTL ? 4 : 36 , justifyContent:"space-between" ,alignItems:"center"}}>
                    <div>{receiptItemValue?.totalPrice + " " + getCurrencyUnitText(quoteItemValue?.currency)}</div>
                    <IconButton onClick={handleOpenModal}><DetailsIcon/></IconButton>
                </div>
            </div>
        </div>
    );
};

export { TotalPricesReceipts };
