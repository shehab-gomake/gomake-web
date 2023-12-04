import { MoreCircleIcon, SortIcon } from "@/icons";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { ETypeException } from "../../enums/profites-enum";

const PricingTableMapping = ({
  item,
  index,
  handleClickPricingTablesMapping,
  setSelectedPricingTableItems,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={clasess.mainContainer}>
      {item.exceptionType != ETypeException.DEFAULT ? (
        <div style={clasess.sortStyle}>
          <SortIcon />
        </div>
      ) : (
        <div style={clasess.emptyStyle} />
      )}

      <div style={clasess.cardItemWithMore}>
        <div>{item.name}</div>
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

export { PricingTableMapping };
