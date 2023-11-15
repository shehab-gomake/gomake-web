import { useTranslation } from "react-i18next";

import { QuoteWidget } from "./widgets/quote-widget/quote-widget";

import { useStyle } from "./style";
import { useRecoilState } from "recoil";
import { QuoteNumberState } from "@/pages-components/quote/store/quote";

const HomePageComponentForAdmin = ({ isAdmin }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [quoteNumber, setquoteNumber] = useRecoilState<any>(QuoteNumberState);
  

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.titleStyle}>{ quoteNumber ? t("remainWords.AddItemtoQuote") + " " + quoteNumber :  t("remainWords.newQuote")}</div>
      <div style={clasess.firstRowContainer}>
        <QuoteWidget isAdmin={isAdmin} />
        <div style={{ width: "100%" }} />
      </div>
    </div>
  );
};

export { HomePageComponentForAdmin };
