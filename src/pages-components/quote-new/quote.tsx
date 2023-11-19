import { HeaderTitle } from "@/widgets";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const QuoteNewPageWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerContainer}>
        <div style={clasess.titleQuateContainer}>
          <HeaderTitle
            title={t("sales.quote.title")}
            marginBottom={1}
            marginTop={1}
            color="rgba(241, 53, 163, 1)"
          />
          {/* <div style={clasess.quoteNumberStyle}>{quoteItemValue?.number}</div> */}
        </div>
      </div>
    </div>
  );
};

export { QuoteNewPageWidget };
