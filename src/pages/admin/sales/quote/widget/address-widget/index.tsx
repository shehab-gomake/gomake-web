import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
interface IProps {
  isAddressID?: boolean;
  isCity?: boolean;
  isStreet?: boolean;
  isEntrance?: boolean;
  isApartment?: boolean;
}
const AddressWidget = ({
  isAddressID = true,
  isCity = true,
  isStreet = true,
  isEntrance = true,
  isApartment = true,
}: IProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.mainContainer}>
      {isAddressID && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Address ID</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder="Address ID"
          />
        </div>
      )}

      {isCity && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>City</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder="City"
          />
        </div>
      )}

      {isStreet && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Street</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder="Street"
          />
        </div>
      )}

      {isEntrance && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Entrance</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder="Entrance"
          />
        </div>
      )}

      {isApartment && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Apartment</div>
          <GomakeTextInput
            placeholder="Apartment"
            style={clasess.textInputStyle}
          />
        </div>
      )}
    </div>
  );
};

export { AddressWidget };
