import { Divider } from "@mui/material";
import { GoMakeMenu } from "@/components";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { useStyle } from "./style";
import { useSttingsVatListMenu } from "./use-setting-vat-menu";
import { useRecoilValue } from "recoil";
import { currenciesState } from "@/widgets/materials-widget/state";

const SettingVatListMenu = ({
  handleClose,
  open,
  anchorEl,
  onBlurVatStatus,
  setIsUpdateVatStatus,
  isUpdateVatStatus,
  updateVatStatus,
  updateCurrency,
  isUpdateCurrency,
  setIsUpdateCurrency,
  onBlurCurrency,
  quoteStateValue,
}) => {
  const { classes } = useStyle();
  const { vatStatus, vatStatusList, t } = useSttingsVatListMenu();

  const currencies =
    useRecoilValue<{ label: string; value: string }[]>(currenciesState);

  const matchingCurrency = currencies.find(
    (currency) => currency.value === quoteStateValue?.currency
  )?.label;

  return (
    <>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        style={classes.mainContainer}
      >
        <div style={classes.bodyContainer}>
          <div style={classes.menuRowStyle}>
            <div style={classes.menuTabStyle}>{t("accounting.defaultVat")}</div>
            <AutoCompleteUpdatedValue
              value={vatStatus || t("accounting.defaultVat")}
              options={vatStatusList}
              onBlur={onBlurVatStatus}
              isUpdate={isUpdateVatStatus}
              setIsUpdate={setIsUpdateVatStatus}
              getOptionLabel={(item) => item.text}
              onChange={(e, value) => updateVatStatus(value?.value)}
            />
          </div>
          <Divider />

          <div style={classes.menuRowStyle}>
            <div style={classes.menuTabStyle}>{t("sales.quote.currency")}</div>
            <AutoCompleteUpdatedValue
              value={matchingCurrency}
              options={currencies.map((currency) => ({
                value: currency.value,
                text: currency.label,
              }))}
              onBlur={onBlurCurrency}
              isUpdate={isUpdateCurrency}
              setIsUpdate={setIsUpdateCurrency}
              getOptionLabel={(item) => item.text}
              onChange={(e, value) => updateCurrency(value?.value)}
            />
          </div>
        </div>
      </GoMakeMenu>
    </>
  );
};

export { SettingVatListMenu };
