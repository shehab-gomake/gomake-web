import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { useState } from "react";
import { PhoneInputUpdatedValues } from "@/widgets/quote-new/phone-input-updated-values";
import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";

const ContactMapping = ({item , items} : any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [isConfirmation, setIsConfirmation] = useState(null);
  return (
    <div style={classes.businessContainerStyle}>
      <InputUpdatedValues
        value={
          item?.contactName !== null ? item?.contactName : "No contact name"
        }
        label={t("sales.quote.contactName")}
        setIsUpdate={setIsConfirmation}
        inputMainContainerStyle={classes.inputMainContainer}
        speicalStyle={{padding:"0px"}}
      />
      <PhoneInputUpdatedValues
        value={
          item?.contactPhone !== null ? item?.contactPhone : "No mobile contact"
        }
        label={t("sales.quote.mobileContact")}
        setIsUpdate={setIsConfirmation}
        inputMainContainerStyle={classes.inputMainContainer}
        speicalStyle={{padding:"0px"}}
        />
      <InputUpdatedValues
        value={
          item?.contactMail !== null ? item?.contactMail : "No contact mail"
        }
        label={t("sales.quote.contactEmail")}
        setIsUpdate={ setIsConfirmation }
        inputMainContainerStyle={classes.inputMainContainer}
        speicalStyle={{padding:"0px"}}
      />
    </div>
  );
};

export { ContactMapping };
