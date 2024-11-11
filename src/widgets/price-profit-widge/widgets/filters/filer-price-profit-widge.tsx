
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const FilterPriceProfitWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();


  return (
    <div style={classes.mainContainer}>
      <div>
        prameters list
      </div>
    </div>
  );
};
export { FilterPriceProfitWidget };
