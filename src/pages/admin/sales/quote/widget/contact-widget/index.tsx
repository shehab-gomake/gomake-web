import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
interface IProps {
  isContactID?: boolean;
  isContactName?: boolean;
  isPortable?: boolean;
  isEmail?: boolean;
}
const ContactWidget = ({
  isContactID = true,
  isContactName = true,
  isPortable = true,
  isEmail = true,
}: IProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.mainContainer}>
      {isContactID && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Contact ID</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder="Contact ID"
          />
        </div>
      )}
      {isContactName && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Contact name</div>
          <GomakeTextInput
            placeholder="Contact name"
            style={clasess.textInputStyle}
          />
        </div>
      )}
      {isPortable && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Portable</div>
          <GomakeTextInput
            placeholder="Portable"
            style={clasess.textInputStyle}
          />
        </div>
      )}

      {isEmail && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Email</div>
          <GomakeTextInput placeholder="Email" style={clasess.textInputStyle} />
        </div>
      )}
    </div>
  );
};

export { ContactWidget };
