import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { PhoneInputUpdatedValues } from "../phone-input-updated-values";

const DisabledContactMapping = ({ item }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div
      style={{
        ...classes.businessContainerStyle,
        marginBottom: 10,
      }}
    >
      <InputUpdatedValues
        value={item?.contactName}
        placeholder={
          item?.contactName ? item?.contactName : t("sales.quote.contactName")
        }
        label={t("sales.quote.contactName")}
        isUpdate={false}
        setIsUpdate={() => {}}
      />
      <PhoneInputUpdatedValues
        key={item?.id}
        value={item?.contactPhone}
        placeholder={
          item?.contactPhone
            ? item?.contactPhone
            : t("sales.quote.noMobileContact")
        }
        label={t("sales.quote.mobileContact")}
        isUpdate={false}
        setIsUpdate={() => {}}
      />
      <InputUpdatedValues
        value={item?.contactEmail}
        placeholder={
          item?.contactEmail ? item?.contactEmail : t("sales.quote.noMail")
        }
        label={t("sales.quote.contactEmail")}
        isUpdate={false}
        setIsUpdate={() => {}}
      />
    </div>
  );
};

export { DisabledContactMapping };
