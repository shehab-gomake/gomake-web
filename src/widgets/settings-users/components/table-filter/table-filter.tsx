import {ITableFilterProps} from "@/widgets/settings-users/interface/components-props";
import {GomakeTextInput, SecondSwitch} from "@/components";
import {useStyle} from "@/widgets/settings-users/components/table-filter/style";
import {useTranslation} from "react-i18next";

const TableFilter = ({onChangeShowInActive, onChangeFilter}: ITableFilterProps) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
  return(
      <div style={classes.container}>
          <GomakeTextInput placeholder={t('search')} onChange={(e) => {onChangeFilter(e.target.value)}} style={classes.searchInput}/>
          <SecondSwitch onChange={(e) => {onChangeShowInActive(e.target.checked)}}/>
          <span style={classes.switchLabel}>{t('Show inactive employees')}</span>
      </div>
  );
}

export {TableFilter}