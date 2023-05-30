import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
interface IProps {
  isBusinessCode?: boolean;
  isBusinessName?: boolean;
  isPurchaseNumber?: boolean;
  isAgent?: boolean;
}
const BusinessWidget = ({
  isBusinessCode = true,
  isBusinessName = true,
  isPurchaseNumber = true,
  isAgent = true,
}: IProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.mainContainer}>
      {isBusinessCode && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Business code</div>
          <GomakeTextInput
            placeholder="Business code"
            style={clasess.textInputStyle}
          />
        </div>
      )}
      {isBusinessName && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Business name</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder="Business name"
          />
        </div>
      )}
      {isPurchaseNumber && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Purchase number</div>
          <GomakeTextInput
            placeholder="Purchase number"
            style={clasess.textInputStyle}
          />
        </div>
      )}

      {isAgent && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>Agent</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder="Agent"
          />
        </div>
      )}
    </div>
  );
};

export { BusinessWidget };
