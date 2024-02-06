import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useRecoilValue } from "recoil";
import { quoteConfirmationState} from "@/store";


const TotalPriceAndVatContainer = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const { getCurrencyUnitText } = useQuoteGetData();
    const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);

    return (
        <div style={classes.mainContainer}>
            <div style={classes.secondContainer}>
                <div style={classes.firstDiv}>
                    <div style={classes.tableHeader} ><h3 style={classes.headerStyle}>{t("sales.quote.totalBeforeVAT")}</h3></div>
                    <div style={classes.tableCell}><GomakeTextInput style={classes.inputStyle} value={quoteConfirm?.totalPrice +" "+ getCurrencyUnitText(quoteConfirm?.currency)} disabled={true} /></div>
                </div>
                <div style={classes.secondDiv}>
                    <div style={classes.tableHeader} ><h3 style={classes.headerStyle}>{t("sales.quote.discount")}</h3></div>
                    <div style={classes.tableCell}><GomakeTextInput style={classes.inputStyle} value={quoteConfirm?.discount ? quoteConfirm?.discount + "%" : "0%"} disabled={true} /></div>
                </div>
                <div style={classes.thirdDiv}>
                    <div style={classes.tableHeader} ><h3 style={classes.headerStyle}>{t("sales.quote.vat") + " (17%)"}</h3></div>
                    <div style={classes.tableCell}><GomakeTextInput style={classes.inputStyle} value={Math.ceil(quoteConfirm?.totalVAT) + " " + getCurrencyUnitText(quoteConfirm?.currency)} disabled={true}/></div>
                </div>
                <div style={classes.fourthDiv}>
                    <div style={classes.tableHeader} ><h3 style={classes.headerStyle}>{t("sales.quote.totalPrice")}</h3></div>
                    <div style={classes.tableCell}><GomakeTextInput style={classes.inputPriceStyle} value={quoteConfirm?.totalPayment + " " + getCurrencyUnitText(quoteConfirm?.currency)} /></div>
                </div>
            </div>
            </div>
    );
};

export { TotalPriceAndVatContainer };
