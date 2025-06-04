import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { PhoneInputUpdatedValues } from "@/widgets/quote-new/phone-input-updated-values";
import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";

const ContactMapping = ({ item }: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.businessContainerStyle}>
      <InputUpdatedValues
        value={
          item?.contactName !== null ? item?.contactName : "No contact name"
        }
        label={t("sales.quote.contactName")}
        inputMainContainerStyle={classes.inputMainContainer}
        specialStyle={{ padding: "0px" }}
        isUpdate={false}
        setIsUpdate={() => {}}
      />
      <PhoneInputUpdatedValues
        value={
          item?.contactPhone !== null ? item?.contactPhone : "No mobile contact"
        }
        label={t("sales.quote.mobileContact")}
        isUpdate={false}
        setIsUpdate={() => {}}
        inputMainContainerStyle={classes.inputMainContainer}
        specialStyle={{ padding: "0px" }}
      />
      <InputUpdatedValues
        value={
          item?.contactEmail !== null ? item?.contactEmail : "No contact mail"
        }
        label={t("sales.quote.contactEmail")}
        isUpdate={false}
        setIsUpdate={() => {}}
        inputMainContainerStyle={classes.inputMainContainer}
        specialStyle={{ padding: "0px" }}
      />
    </div>
  );
};

export { ContactMapping };
