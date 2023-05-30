import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
interface IProps {
  isContactID?: boolean;
  isContactName?: boolean;
  isPortable?: boolean;
  isEmail?: boolean;
  isAddNewContact?: boolean;
}
const ContactWidget = ({
  isContactID = true,
  isContactName = true,
  isPortable = true,
  isEmail = true,
  isAddNewContact = true,
}: IProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.mainContainer}>
      {isContactID && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.contactID")}</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.contactID")}
          />
        </div>
      )}
      {isContactName && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.contactName")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.contactName")}
            style={clasess.textInputStyle}
          />
        </div>
      )}
      {isPortable && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.portable")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.portable")}
            style={clasess.textInputStyle}
          />
        </div>
      )}

      {isEmail && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.email")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.email")}
            style={clasess.textInputStyle}
          />
        </div>
      )}
      {isAddNewContact && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}></div>
          <div style={clasess.addBtnStyle}>
            {t("sales.quote.addNewContact")}
          </div>
        </div>
      )}
    </div>
  );
};

export { ContactWidget };
