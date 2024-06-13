import { MoreCircleIcon } from "@/icons";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const AdditionsAndExceptionsMapping = ({
  item,
  handleClickPricingTablesMapping,
  selectedAdditionalProfitRow,
  setSelectedActionProfitRow,
  ProfitCurrency,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.mainContainer}>
      <div
        style={
          selectedAdditionalProfitRow?.id === item?.id
            ? clasess.WithBordermainContainer
            : clasess.cardItemWithMore
        }
        onClick={() => {
          selectedAdditionalProfitRow?.id === item?.id
            ? setSelectedActionProfitRow(null)
            : setSelectedActionProfitRow(item);
        }}
      >
        <div style={clasess.firstRowStyle}>
          <div style={clasess.ruleTextStyle}>{t("properties.rule")}</div>
          <div style={{ width: "80%" }}>{item.name}</div>
          <div style={clasess.lineStyle} />
          <div style={clasess.ruleTextStyle}>
            {t("products.profits.exceptions.value")}
          </div>
          <div style={clasess.valueStyle}>
            {item?.profitValue} %
          </div>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleClickPricingTablesMapping(e);
            setSelectedActionProfitRow(item);
          }}
          style={clasess.moreIconStyle}
        >
          <MoreCircleIcon />
        </div>
      </div>
    </div>
  );
};

export { AdditionsAndExceptionsMapping };
