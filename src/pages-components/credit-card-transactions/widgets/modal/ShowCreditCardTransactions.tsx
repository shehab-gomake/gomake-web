import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useCustomerDropDownList } from "@/hooks/use-customer-drop-down-list";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Stack } from "@mui/material";

const ShowCreditCardTransactions = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList();

  return (
    <Stack display={'flex'} justifyContent={'space-between'} height={"100%"} direction={'column'} padding={'20px'}>
      <div style={classes.date2FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
        <GoMakeAutoComplate
          options={renderOptions()}
          onChangeTextField={checkWhatRenderArray}
          getOptionLabel={(option: any) => `${option.name}`}
          style={classes.textInputStyle}
          placeholder={t("sales.quote.chooseCustomer")}
          onChange={handleCustomerChange}
          value={customer}
        />
      </div>
      <Stack direction={'row'} gap={'20px'}>
        <SecondaryButton variant={'contained'} onClick={() => null} >{t('sales.quote.confirmed')}
        </SecondaryButton>
        <SecondaryButton variant={'contained'} onClick={() => null} >{t('sales.quote.cancel')}
        </SecondaryButton>
      </Stack>
    </Stack>
  )
};
export { ShowCreditCardTransactions };