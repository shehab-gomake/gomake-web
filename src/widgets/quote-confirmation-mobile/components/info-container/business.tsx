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
          value={
            quoteConfirm?.purchaseNumber || t("sales.quote.noPurchaseNumber")
          }
          label={t("sales.quote.purchaseNumber")}
          setIsUpdate={setIsConfirmation}
          inputMainContainerStyle={classes.inputMainContainer}
          specialStyle={{ padding: "0px", cursor: "none" }}
        />
        <InputUpdatedValues
          value={quoteConfirm?.client?.name}
          label={t("sales.quote.businessName")}
          setIsUpdate={setIsConfirmation}
          inputMainContainerStyle={classes.inputMainContainer}
          specialStyle={{ padding: "0px" }}
        />
        <InputUpdatedValues
          value={`${quoteConfirm?.client?.code}`}
          label={t("sales.quote.businessCode")}
          setIsUpdate={setIsConfirmation}
          inputMainContainerStyle={classes.inputMainContainer}
          specialStyle={{ padding: "0px" }}
        />
        <InputUpdatedValues
          value={
            quoteConfirm?.documentDeliveryAddresses?.length > 0
              ? [
                  quoteConfirm?.documentDeliveryAddresses[0]?.street,
                  quoteConfirm?.documentDeliveryAddresses[0]?.apartment,
                  quoteConfirm?.documentDeliveryAddresses[0]?.city,
                ]
                  .filter((part) => part && part.trim())
                  .join(", ") || t("sales.cart.noAddressFound")
              : t("sales.cart.noAddressFound")
          }
          label={t("sales.cart.deliveryAddress")}
          setIsUpdate={setIsConfirmation}
          inputMainContainerStyle={classes.inputMainContainer}
          specialStyle={{ padding: "0px" }}
        />
        <InputUpdatedValues
          value={
            quoteConfirm?.documentBillingAddresses?.length > 0
              ? [
                  quoteConfirm?.documentBillingAddresses[0]?.street,
                  quoteConfirm?.documentBillingAddresses[0]?.apartment,
                  quoteConfirm?.documentBillingAddresses[0]?.city,
                ]
                  .filter((part) => part && part.trim())
                  .join(", ") || t("sales.cart.noAddressFound")
              : t("sales.cart.noAddressFound")
          }
          label={t("sales.cart.billingAddress")}
          setIsUpdate={setIsConfirmation}
          inputMainContainerStyle={classes.inputMainContainer}
          specialStyle={{ padding: "0px" }}
        />
      </div>
    </>
  );
};

export { BusinessWidget };
