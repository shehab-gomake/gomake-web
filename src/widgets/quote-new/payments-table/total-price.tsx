import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useStyle } from "./style";

const TotalPriceReceipts = ({
sum
}) => {
  const headerHeight = "44px";
  const { classes } = useStyle({headerHeight});
  const { t } = useTranslation();
  const { getCurrencyUnitText } = useQuoteGetData();

  return (
    <div style={classes.priceFooterContainer}>

      <div style={classes.firstRowForFooterContainer}>
        <div style={{ ...classes.evenRowContainer, width: "13%" ,  borderBottom: "1px solid #EAECF0"}}>
          {t("payment.totalDocuments")}
        </div>
        <div style={{ ...classes.oddRowContainer,width: "19%",paddingLeft: 36 ,  borderBottom: "1px solid #EAECF0",}}>
          {sum +  " " + getCurrencyUnitText("ILS")}
        </div>
      </div>
      



      
      <div style={classes.firstRowForFooterContainer}>
        <div
          style={{
            ...classes.evenRowContainer,
            width: "13%",
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
          }}
        >
          {t("payment.totalPayment")}
        </div>
        <div style={{ ...classes.oddRowContainer, width: "87%",}}>
          <div style={classes.cellTextInputStyle}>{ "200" + getCurrencyUnitText("ILS")}
          </div>
        </div>
      </div>


    </div>
  );
};

export { TotalPriceReceipts };