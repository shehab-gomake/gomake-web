import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderTitle } from "@/widgets/header-title";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { BusinessWidget } from "./bussniess";
import { ContactsWidget } from "./contacts";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";


const InfoContainer = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const quoteItemValue = useRecoilValue<any>(quoteItemState);

    return (
        <div style={{ ...classes.mainContainer, marginTop: "16px" }}>
            <div style={classes.titleQuoteContainer}>
                <HeaderTitle
                    title={"Quote"}
                    marginBottom={1}
                    marginTop={1}
                    color="rgba(241, 53, 163, 1)"
                />
                <div style={classes.quoteNumberStyle}>
                    {" - "} {quoteItemValue?.number}
                </div>
            </div>
            <div style={classes.referenceDate} >
                {t("sales.quote.dateOfReference") + " : " + DateFormatterDDMMYYYY(quoteItemValue?.dueDate)}
            </div>
            <div style={classes.referenceDate} >
                G. supply: 11 working days
            </div>
            <div style={classes.borderContainer} />
            <BusinessWidget />
            <div style={classes.borderContainer} />
            <ContactsWidget />
            <div style={classes.borderContainer} />
        </div>
    );
};

export { InfoContainer };
