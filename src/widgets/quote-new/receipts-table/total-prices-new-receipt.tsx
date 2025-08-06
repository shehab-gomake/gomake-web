import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useStyle } from "./style";
import { fmt2 } from "@/utils/helpers";

const TotalPricesNewReceipts = ({ sum, taxDeduction, totalPayment }) => {
  const headerHeight = "44px";
  const { classes } = useStyle({ headerHeight });
  const { t } = useTranslation();
  const dir = t("direction");
  const { getCurrencyUnitText, quoteItemValue } = useQuoteGetData();
  const currency = getCurrencyUnitText(quoteItemValue?.currency);

  return (
    <div style={classes.priceFooterContainer}>
      <div style={classes.firstRowForFooterContainer}>
        <div
          style={{
            ...classes.evenRowContainer,
            width: "55.8%",
            borderBottom: "1px solid #EAECF0",
          }}
        >
          {t("payment.totalDocuments")}
        </div>
        <div
          style={{
            ...classes.oddRowContainer,
            width: "44.2%",
            paddingLeft: 36,
            borderBottom: "1px solid #EAECF0",
          }}
        >
          {fmt2(sum) + " " + currency}
        </div>
      </div>
      {taxDeduction !== 0 && (
        <div style={classes.firstRowForFooterContainer}>
          <div
            style={{
              ...classes.evenRowContainer,
              width: "55.8%",
              borderBottom: "1px solid #EAECF0",
            }}
          >
            {t("payment.taxDeduction")}
          </div>
          <div
            style={{
              ...classes.oddRowContainer,
              width: "44.2%",
              paddingLeft: 36,
              borderBottom: "1px solid #EAECF0",
            }}
          >
            {taxDeduction + " " + currency}
          </div>
        </div>
      )}
      {sum - totalPayment > 0 && totalPayment !== 0 && (
        <div style={classes.firstRowForFooterContainer}>
          <div
            style={{
              ...classes.evenRowContainer,
              width: "55.8%",
              borderBottom: "1px solid #EAECF0",
            }}
          >
            {t("payment.balance")}
          </div>
          <div
            style={{
              ...classes.oddRowContainer,
              width: "44.2%",
              paddingLeft: 36,
              borderBottom: "1px solid #EAECF0",
            }}
          >
            {fmt2(Number(sum) - Number(totalPayment)) + " " + currency}
          </div>
        </div>
      )}
      {sum - totalPayment < 0 && totalPayment !== 0 && (
        <div style={classes.firstRowForFooterContainer}>
          <div
            style={{
              ...classes.evenRowContainer,
              width: "55.8%",
              borderBottom: "1px solid #EAECF0",
            }}
          >
            {t("payment.excessPayment")}
          </div>
          <div
            style={{
              ...classes.oddRowContainer,
              width: "44.2%",
              paddingLeft: 36,
              borderBottom: "1px solid #EAECF0",
            }}
          >
            {fmt2(Math.abs(Number(sum) - Number(totalPayment))) +
              " " +
              currency}
          </div>
        </div>
      )}

      <div style={classes.firstRowForFooterContainer}>
        <div
          style={{
            ...classes.evenRowContainer,
            width: "55.8%",
            borderBottomRightRadius: dir === "rtl" ? 6 : 0,
            borderBottomLeftRadius: dir === "rtl" ? 0 : 6,
          }}
        >
          {t("payment.totalPayment")}
        </div>
        <div
          style={{
            ...classes.oddRowContainer,
            width: "44.2%",
            paddingLeft: 36,
          }}
        >
          {fmt2(totalPayment) + " " + currency}
        </div>
      </div>
    </div>
  );
};

export { TotalPricesNewReceipts };
