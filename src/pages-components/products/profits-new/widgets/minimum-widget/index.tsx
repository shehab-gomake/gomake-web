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
}: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.headerTableContainer}>
      <div style={classes.headerTitleStyle}>
        <div style={classes.titleStyle}>
          {t("products.profits.exceptions.min")}
        </div>
        <div style={classes.lineStyle} />
        <div style={classes.valueTextStyle}>
          {t("products.profits.exceptions.value")}
        </div>
        <InputUpdatedValues
          value={minimumValue != null ? minimumValue : 0}
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
