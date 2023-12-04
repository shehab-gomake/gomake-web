import { MoreCircleIcon, SortIcon } from "@/icons";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { ETypeException } from "../../enums/profites-enum";

const AdditionsAndExceptionsMapping = ({
  item,
  handleClickPricingTablesMapping,
  setSelectedPricingTableItems,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  console.log("item", item);
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.cardItemWithMore}>
        <div style={clasess.firstRowStyle}>
          <div style={clasess.ruleTextStyle}>{t("properties.rule")}</div>
          <div>{item.name}</div>
          <div style={clasess.lineStyle} />
          <div style={clasess.ruleTextStyle}>
            {t("products.profits.exceptions.value")}
          </div>
          <div style={clasess.valueStyle}>{item?.profitValue}$</div>
        </div>
        <div
          onClick={(e) => {
            handleClickPricingTablesMapping(e);
            setSelectedPricingTableItems(item);
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
