
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { FilterIcon } from "@/icons";

const FilterPriceProfitWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();


  return (
    <div style={classes.mainContainer}>
      <div>
        <GoMakeAutoComplate
          options={[]}
          style={classes.autoCompleteStyle}
          placeholder={t("Select Product")}
          withArrow={true}
        />
      </div>
      <div style={classes.searchContainer}>
        <SearchInputComponent onChange={() => { }}
          searchInputStyle={classes.searchInputStyle}
        />
        <GomakePrimaryButton
          style={classes.filtersBtn}
          leftIcon={<FilterIcon />}
        >{t("Filters")} </GomakePrimaryButton>
      </div>
    </div>
  );
};
export { FilterPriceProfitWidget };
