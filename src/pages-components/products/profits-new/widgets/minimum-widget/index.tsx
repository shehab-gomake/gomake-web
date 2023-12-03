import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { ChangeEvent } from "react";
import { ProfitRightSideProps } from "../../interface";

const MinimumWidget = ({
  minimumValue,
  isUpdateMinimumValue,
  onBlurMinimumValue,
  setIsUpdateMinimumValue,
  onInputChangeMinimumValue,
}: ProfitRightSideProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={clasess.headerTableContainer}>
      <div style={clasess.headerTitleStyle}>
        <div style={clasess.titleStyle}>
          {t("products.profits.exceptions.min")}
        </div>
        <div style={clasess.lineStyle} />
        <div style={clasess.valueTextStyle}>
          {t("products.profits.exceptions.value")}
        </div>
        <InputUpdatedValues
          value={minimumValue}
          onBlur={() => onBlurMinimumValue()}
          isUpdate={isUpdateMinimumValue}
          setIsUpdate={setIsUpdateMinimumValue}
          onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
            onInputChangeMinimumValue(e)
          }
        />
      </div>
    </div>
  );
};

export { MinimumWidget };
