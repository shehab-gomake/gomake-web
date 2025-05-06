import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useRecoilValue } from "recoil";
import { quoteConfirmationState } from "@/store";

const TotalPriceAndVatContainer = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { getCurrencyUnitText } = useQuoteGetData();
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const CurrencyUnit = getCurrencyUnitText(quoteConfirm?.currency);

  const isVatHidden = quoteConfirm?.hideVatInSystem;

  const headerLabel = isVatHidden
    ? t("sales.quote.totalAfterDiscount")
    : `${t("sales.quote.vat")} (${Number(quoteConfirm?.vat) * 100}%)`;

  const value = isVatHidden
    ? quoteConfirm?.totalPriceAfterDiscount
    : quoteConfirm?.totalVAT;

  return (
    <div style={classes.mainContainer}>
      <div style={classes.secondContainer}>
        <div style={classes.firstDiv}>
          <div style={classes.tableHeader}>
            <h3 style={classes.headerStyle}>
              {t("sales.quote.totalBeforeVAT")}
            </h3>
          </div>
          <div style={classes.tableCell}>
            <GomakeTextInput
              style={classes.inputStyle}
              value={quoteConfirm?.totalPrice + " " + CurrencyUnit}
              disabled={true}
            />
          </div>
        </div>
        <div style={classes.secondDiv}>
          <div style={classes.tableHeader}>
            <h3 style={classes.headerStyle}>{t("sales.quote.discount")}</h3>
          </div>
          <div style={classes.tableCell}>
            <GomakeTextInput
              style={classes.inputStyle}
              value={
                (quoteConfirm?.discount ? quoteConfirm.discount + "%" : "0%") +
                (quoteConfirm?.discountAmount != 0
                  ? ` (-${quoteConfirm.discountAmount} ${CurrencyUnit})`
                  : "")
              }
              disabled={true}
            />
          </div>
        </div>
        <div style={classes.thirdDiv}>
          <div style={classes.tableHeader}>
            <h3 style={classes.headerStyle}>{headerLabel}</h3>
          </div>
          <div style={classes.tableCell}>
            <GomakeTextInput
              style={classes.inputStyle}
              value={`${value} ${CurrencyUnit}`}
              disabled={true}
            />
          </div>
        </div>
        {!isVatHidden && (
          <div style={classes.fourthDiv}>
            <div style={classes.tableHeader}>
              <h3 style={classes.headerStyle}>{t("sales.quote.totalPrice")}</h3>
            </div>
            <div style={classes.tableCell}>
              <GomakeTextInput
                style={classes.inputPriceStyle}
                value={quoteConfirm?.totalPayment + " " + CurrencyUnit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { TotalPriceAndVatContainer };
