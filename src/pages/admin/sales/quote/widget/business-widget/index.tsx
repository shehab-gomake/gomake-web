import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@/icons";
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
          <div style={clasess.labelStyle}>{t("sales.quote.businessCode")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.businessCode")}
            style={clasess.textInputStyle}
          />
        </div>
      )}
      {isBusinessName && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelContainer}>
            <div style={clasess.labelStyle}>
              {t("sales.quote.businessName")}
            </div>
            <PlusIcon />
          </div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.businessName")}
          />
        </div>
      )}
      {isPurchaseNumber && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>
            {t("sales.quote.purchaseNumber")}
          </div>
          <GomakeTextInput
            placeholder={t("sales.quote.purchaseNumber")}
            style={clasess.textInputStyle}
          />
        </div>
      )}

      {isAgent && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.agent")}</div>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.agent")}
          />
        </div>
      )}
    </div>
  );
};

export { BusinessWidget };
