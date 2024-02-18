import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useStyle } from "./style";

const TotalPriceReceipts = ({
sum,
totalPayment
}) => {
  const headerHeight = "44px";
  const { classes } = useStyle({headerHeight});
  const { t } = useTranslation();
  const { getCurrencyUnitText , quoteItemValue } = useQuoteGetData();

  return (
    <div style={classes.priceFooterContainer}>
      <div style={classes.firstRowForFooterContainer}>
        <div style={{ ...classes.evenRowContainer, width: "55.8%" ,  borderBottom: "1px solid #EAECF0"}}>
          {t("payment.totalDocuments")}
        </div>
        <div style={{ ...classes.oddRowContainer,width: "44.2%", paddingLeft: 36 ,  borderBottom: "1px solid #EAECF0",}}>
          {sum +  " " + getCurrencyUnitText(quoteItemValue?.currency)}
        </div>
      </div>

      
      {((sum - totalPayment) > 0 && totalPayment!==0 )&& <div style={classes.firstRowForFooterContainer}>
        <div style={{ ...classes.evenRowContainer, width: "55.8%" ,  borderBottom: "1px solid #EAECF0"}}>
          {t("payment.balance")}
        </div>
        <div style={{ ...classes.oddRowContainer,width: "44.2%",paddingLeft: 36 ,  borderBottom: "1px solid #EAECF0",}}>
          {sum - totalPayment +  " " + getCurrencyUnitText(quoteItemValue?.currency)}
        </div>
      </div>}


      {((sum - totalPayment) < 0 && totalPayment!==0 )&& <div style={classes.firstRowForFooterContainer}>
        <div style={{ ...classes.evenRowContainer, width: "55.8%" ,  borderBottom: "1px solid #EAECF0"}}>
        {t("payment.excessPayment")}
        </div>
        <div style={{ ...classes.oddRowContainer,width: "44.2%",paddingLeft: 36 ,  borderBottom: "1px solid #EAECF0",}}>
          {Math.abs(sum - totalPayment) +  " " + getCurrencyUnitText(quoteItemValue?.currency)}
        </div>
      </div>}
      
      <div style={classes.firstRowForFooterContainer}>
        <div
          style={{
            ...classes.evenRowContainer,
            width:  "55.8%",
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
          }}
        >
          {t("payment.totalPayment")}
        </div>
        <div style={{ ...classes.oddRowContainer, width: "44.2%",paddingLeft: 36 }}>
          <div>{ totalPayment +  " " + getCurrencyUnitText(quoteItemValue?.currency)}
          </div>
        </div>
      </div>
    </div>
  );
};

export { TotalPriceReceipts };