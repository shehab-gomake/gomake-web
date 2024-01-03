

import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { QuoteNumberState } from "@/pages-components/quote/store/quote";


const useHome = () => {
    const { t } = useTranslation();
    const quoteNumber = useRecoilValue<any>(QuoteNumberState);
    const Title = quoteNumber ? t("remainWords.AddItemtoQuote") + " " + quoteNumber : t("remainWords.newQuote") ;

    return {
      Title,
      t
    };
};

export { useHome };
