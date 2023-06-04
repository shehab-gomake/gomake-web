import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
interface IProps {
  isAddressID?: boolean;
  isCity?: boolean;
  isStreet?: boolean;
  isEntrance?: boolean;
  isApartment?: boolean;
  isAddNewAddress?: boolean;
}
const AddressWidget = ({
  isAddressID = true,
  isCity = true,
  isStreet = true,
  isEntrance = true,
  isApartment = true,
  isAddNewAddress = true,
}: IProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.mainContainer}>
      {isAddressID && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.addressID")}</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.addressID")}
          />
        </div>
      )}

      {isCity && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.city")}</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.city")}
          />
        </div>
      )}

      {isStreet && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.street")}</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.street")}
          />
        </div>
      )}

      {isEntrance && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.entrance")}</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.entrance")}
          />
        </div>
      )}

      {isApartment && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.apartment")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.apartment")}
            style={clasess.textInputStyle}
          />
        </div>
      )}
      {isAddNewAddress && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle} />
          <div style={clasess.addBtnStyle}>
            {t("sales.quote.addNewAddress")}
          </div>
        </div>
      )}
    </div>
  );
};

export { AddressWidget };
