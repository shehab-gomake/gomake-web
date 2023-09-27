import {SecondSwitch} from "@/components";
import {useTranslation} from "react-i18next";
import { useStyle } from "./style";

const TableDeliveryTimeFilter = ({onChangeShowDeliveryTime}: any) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
  return(
      <div style={classes.container}>
          <SecondSwitch size='small' />
          <span style={classes.switchLabel}>{t('documentingSettings.showDeliveryTime')}</span>
      </div>
  );
}

export {TableDeliveryTimeFilter}