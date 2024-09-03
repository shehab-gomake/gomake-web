import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { quoteConfirmationState } from "@/store";
import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";

const BusinessWidget = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
    const [isConfirmation, setIsConfirmation] = useState();

    return (
        <>
            <div style={classes.businessContainerStyle}>
                <InputUpdatedValues
                    value={quoteConfirm?.purchaseNumber || t("sales.quote.noPurchaseNumber")}
                    label={t("sales.quote.purchaseNumber")}
                    setIsUpdate={setIsConfirmation}
                    inputMainContainerStyle={classes.inputMainContainer}
                    speicalStyle={{ padding: "0px", cursor: "none" }}
                />
                <InputUpdatedValues
                    value={quoteConfirm?.client?.name}
                    label={t("sales.quote.businessName")}
                    setIsUpdate={setIsConfirmation}
                    inputMainContainerStyle={classes.inputMainContainer}
                    speicalStyle={{ padding: "0px" }}
                />
                <InputUpdatedValues
                    value={`${quoteConfirm?.client?.code}`}
                    label={t("sales.quote.businessCode")}
                    setIsUpdate={setIsConfirmation}
                    inputMainContainerStyle={classes.inputMainContainer}
                    speicalStyle={{ padding: "0px" }}
                />
                <InputUpdatedValues
                    value={quoteConfirm?.documentAddresses?.length > 0 ? `${quoteConfirm?.documentAddresses[0]?.street} ${quoteConfirm?.documentAddresses[0]?.apartment}, ${quoteConfirm?.documentAddresses[0]?.city}` : "no address found"}
                    label={t("customers.modal.address")}
                    setIsUpdate={setIsConfirmation}
                    inputMainContainerStyle={classes.inputMainContainer}
                    speicalStyle={{ padding: "0px" }}
                />
            </div>
        </>
    );
};

export { BusinessWidget };