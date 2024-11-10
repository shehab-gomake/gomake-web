import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import { ArrowDownNewIcon, PrintIcon, SettingNewIcon } from "@/icons";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";

const PriceProfitHeaderWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();


  return (
    <div style={classes.mainContainer}>
      <div style={classes.title}>{t("settings.priceProfit")}</div>
      <div style={classes.buttonContainer}>
        <GomakePrimaryButton
          style={classes.settingBtn}
          leftIcon={<SettingNewIcon color="#182230" />}
          rightIcon={<ArrowDownNewIcon />}
        />
        <GomakePrimaryButton
          style={classes.printBtn}
          leftIcon={<PrintIcon />}
        >{t("Print")}</GomakePrimaryButton>

      </div>
    </div>
  );
};
export { PriceProfitHeaderWidget };
