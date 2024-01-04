

import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { QuoteNumberState } from "@/pages-components/quote/store/quote";
import { selectedClientState } from "@/pages-components/quotes/states";
import { useState } from "react";


const useHome = () => {
    const { t } = useTranslation();
    const quoteNumber = useRecoilValue<any>(QuoteNumberState);
    const[isDisplay,setIsDisplay] =useState<boolean>(true);
    const selectedClient =useRecoilValue<any>(selectedClientState);
  
    const flag = selectedClient !== null && Object.keys(selectedClient).length > 0;
  
    const Title = quoteNumber ? t("remainWords.AddItemtoQuote") + " " + quoteNumber : t("remainWords.newQuote") ;

    return {
      Title,
      isDisplay,
      setIsDisplay,
      selectedClient,
      flag,
      t
    };
};

export { useHome };
