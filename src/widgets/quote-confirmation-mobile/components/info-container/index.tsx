import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderTitle } from "@/widgets/header-title";
import { useRecoilValue } from "recoil";
import { quoteConfirmationState} from "@/store";
import { BusinessWidget } from "./business";
import { ContactsWidget } from "./contacts";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";

const InfoContainer = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);

    return (
        <div style={{ ...classes.mainContainer, marginTop: "16px" }}>
            <div style={classes.titleQuoteContainer}>
                <HeaderTitle
                    title={t("sales.quote.quote")}
                    marginBottom={1}
                    marginTop={1}
                    color="rgba(241, 53, 163, 1)"
                />
                <div style={classes.quoteNumberStyle}>
                    {" - "} {quoteConfirm?.number}
                </div>
            </div>
            <div style={classes.referenceDate} >
                {t("sales.quote.dateOfReference") + " " + DateFormatterDDMMYYYY(quoteConfirm?.dueDate)}
            </div>
            {/* <div style={classes.referenceDate} >
                G. supply: 11 working days 
            </div> */}
            <div style={classes.borderContainer} />
            <BusinessWidget />
            <div style={classes.borderContainer} />
            <ContactsWidget />
            <div style={classes.borderContainer} />
        </div>
    );
};

export { InfoContainer };
