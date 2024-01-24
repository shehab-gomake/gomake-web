import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";


const TotalPriceAndVatContainer = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const { getCurrencyUnitText } = useQuoteGetData();
    const quoteItemValue = useRecoilValue<any>(quoteItemState);

    return (
        <div style={classes.mainContainer}>
            <div style={classes.secondContainer}>
                <div style={classes.firstDiv}>
                    <div style={classes.tableHeader} ><h3 style={classes.headerStyle}>{t("Total Before VAT")}</h3></div>
                    <div style={classes.tableCell}><GomakeTextInput style={classes.inputStyle} value={quoteItemValue?.totalPrice +" "+ getCurrencyUnitText(quoteItemValue?.currency)} disabled={true} /></div>
                </div>
                <div style={classes.secondDiv}>
                    <div style={classes.tableHeader} ><h3 style={classes.headerStyle}>{t("Discount")}</h3></div>
                    <div style={classes.tableCell}><GomakeTextInput style={classes.inputStyle} value={quoteItemValue?.discount + " " + quoteItemValue?.discount && getCurrencyUnitText(quoteItemValue?.currency)} disabled={true} /></div>
                </div>
                <div style={classes.thirdDiv}>
                    <div style={classes.tableHeader} ><h3 style={classes.headerStyle}>{t("VAT (17%)")}</h3></div>
                    <div style={classes.tableCell}><GomakeTextInput style={classes.inputStyle} value={Math.ceil(quoteItemValue?.totalVAT) + " " + getCurrencyUnitText(quoteItemValue?.currency)} disabled={true}/></div>
                </div>
                <div style={classes.fourthDiv}>
                    <div style={classes.tableHeader} ><h3 style={classes.headerStyle}>{t("Total Price")}</h3></div>
                    <div style={classes.tableCell}><GomakeTextInput style={classes.inputPriceStyle} value={quoteItemValue?.totalPayment + " " + getCurrencyUnitText(quoteItemValue?.currency)} /></div>
                </div>
            </div>
            </div>
    );
};

export { TotalPriceAndVatContainer };
