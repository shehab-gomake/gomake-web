import {ITableFilterProps} from "@/widgets/settings-users/interface/components-props";
import {GoMakeTextInputIcon, SecondSwitch} from "@/components";
import {useStyle} from "@/widgets/settings-users/components/table-filter/style";
import {useTranslation} from "react-i18next";
import {InputAdornment} from "@mui/material";
import {SearchIcon} from "@/icons";

const TableFilter = ({onChangeShowInActive, onChangeFilter}: ITableFilterProps) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
  return(
      <div style={classes.container}>
          <GoMakeTextInputIcon
              onChange={(e) => {onChangeFilter(e.target.value)}}
              style={classes.searchInput}
              placeholder={t("header.search")}
              startAdornment={
                  <InputAdornment position="start">
                      <div style={classes.iconStyle}>
                          <SearchIcon width={20} height={20} />
                      </div>
                  </InputAdornment>
              }
          />
          <SecondSwitch onChange={(e) => {onChangeShowInActive(e.target.checked)}}/>
          <span style={classes.switchLabel}>{t('Show inactive employees')}</span>
      </div>
  );
}

export {TableFilter}