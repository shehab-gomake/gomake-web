import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { useRecoilValue } from "recoil";
import { businessListsState, quoteConfirmationState } from "@/store";
import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";
import {DOCUMENT_TYPE} from "@/pages-components/quotes/enums";

const BusinessWidget = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
    const [selectBusiness, setSelectBusiness] = useState<any>({});
    const customersListValue = useRecoilValue<any>(businessListsState);
    const [isConfirmation, setIsConfirmation] = useState();
    const { renderOptions } = useQuoteWidget(DOCUMENT_TYPE.quote);

    const mappedCustomers = renderOptions().map(customer => ({
        text: customer?.name,
        id: customer?.id
    }));

    useEffect(() => {
        const foundItem = customersListValue.find(
            (item: any) => item.id === quoteConfirm?.customerID
        );
        setSelectBusiness(foundItem);
    }, [quoteConfirm, customersListValue]);


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
                    value={`${selectBusiness?.code}`}
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