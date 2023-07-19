import { useTranslation } from "react-i18next";

import { QuoteWidget } from "./widgets/quote-widget/quote-widget";

import { useStyle } from "./style";

const HomePageComponentForAdmin = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.firstRowContainer}>
        <QuoteWidget />
      </div>
    </div>
  );
};

export { HomePageComponentForAdmin };
