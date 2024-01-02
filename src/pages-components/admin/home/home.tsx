import { useTranslation } from "react-i18next";
import { QuoteWidget } from "./widgets/quote-widget/quote-widget";
import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { QuoteNumberState } from "@/pages-components/quote/store/quote";
import { QuoteTableWidget } from "./widgets/quote-table-widget/quote-table-widget";

const HomePageComponentForAdmin = ({ isAdmin }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const quoteNumber = useRecoilValue<any>(QuoteNumberState);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.titleStyle}>
        {quoteNumber
          ? t("remainWords.AddItemtoQuote") + " " + quoteNumber
          : t("remainWords.newQuote")}
      </div>
      <div style={classes.firstRowContainer}>
        <QuoteWidget isAdmin={isAdmin} />
        {/* <ChartWidget /> */}
      </div>
      <div style={classes.secondRowContainer}>
        {/* <div style={classes.titleStyle}>{t("home.quoteOutput")}</div> */}
        <QuoteTableWidget isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export { HomePageComponentForAdmin };
