import {ITableFilterProps} from "@/widgets/settings-users/users/interface/components-props";
import {SecondSwitch} from "@/components";
import {useStyle} from "@/widgets/settings-users/users/components/table-filter/style";
import {useTranslation} from "react-i18next";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";

const TableFilter = ({onChangeShowInActive, onChangeFilter}: ITableFilterProps) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
  return(
      <div style={classes.container}>
          <SearchInputComponent onChange={onChangeFilter}/>
          <SecondSwitch onChange={(e) => {onChangeShowInActive(e.target.checked)}}/>
          <span style={classes.switchLabel}>{t('usersSettings.showInActiveUsers')}</span>
      </div>
  );
}

export {TableFilter}