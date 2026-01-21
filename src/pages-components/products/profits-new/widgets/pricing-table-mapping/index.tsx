import { MoreCircleIcon, SortIcon } from "@/icons";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { ETypeException } from "../../enums/profites-enum";

const PricingTableMapping = ({
  item,
  handleClickPricingTablesMapping,
  setSelectedPricingTableItems,
  selectedPricingTableItems,
}) => {
  const { classes , primaryColor } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.mainContainer}>
      {item.exceptionType != ETypeException.DEFAULT ? (
        <div style={classes.sortStyle}>
          <SortIcon />
        </div>
      ) : (
        <div style={classes.emptyStyle} />
      )}

      <div
        style={
          selectedPricingTableItems?.id === item?.id
            ? classes.WithBordermainContainer
            : classes.cardItemWithMore
        }
      >
        <div
          onClick={() => {
            setSelectedPricingTableItems(item);
          }}
          style={{ width: "100%" }}
        >
          {item.exceptionType != ETypeException.DEFAULT ? item.name : t("customers.modal.default")}
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleClickPricingTablesMapping(e);
            setSelectedPricingTableItems(item);
          }}
          style={classes.moreIconStyle}
        >
          <MoreCircleIcon color={primaryColor(500)}/>
        </div>
      </div>
    </div>
  );
};

export { PricingTableMapping };
