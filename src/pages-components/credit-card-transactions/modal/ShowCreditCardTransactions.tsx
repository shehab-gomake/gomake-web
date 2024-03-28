import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const ShowCreditCardTransactions =  ({customerId , renderOptions , checkWhatRenderArray, handleCustomerChange , customer}) =>{
    const { classes }= useStyle();
    const { t } = useTranslation();
    return(
        <div>
            <Stack gap={10}>
            <div style={classes.date2FilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
                <GoMakeAutoComplate
                  key={customerId}
                  options={renderOptions()}
                  onChangeTextField={checkWhatRenderArray}
                  getOptionLabel={(option: any) => `${option.name}`}
                  style={classes.textInputStyle}
                  placeholder={t("sales.quote.chooseCustomer")}
                  onChange={handleCustomerChange}
                  value={customer}
                />
              </div>
            </Stack>
        </div>
    )
};
export {ShowCreditCardTransactions};