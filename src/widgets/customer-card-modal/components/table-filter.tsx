import {ITableFilterProps} from "@/widgets/settings-users/users/interface/components-props";
import {SecondSwitch} from "@/components";
import {useStyle} from "@/widgets/settings-users/users/components/table-filter/style";
import {useTranslation} from "react-i18next";

const TableFilter = ({onChangeShowInActive}: any) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
  return(
      <div style={classes.container}>
          <SecondSwitch onChange={(e) => {onChangeShowInActive(e.target.checked)}}/>
          <span style={classes.switchLabel}>{t('customers.modal.showInActiveCustomers')}</span>
      </div>
  );
}

export {TableFilter}