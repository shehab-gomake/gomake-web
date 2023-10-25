import { GomakePrimaryButton } from "@/components";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { useQuoteWidget } from "../use-quote-widget";
import { SecondaryButton } from "@/components/button/secondary-button";

const SaveOrAddQuote =  ({ QuoteId , isAdmin = true  , updateQuoteExist }) =>{
    const { clasess } = useStyle();
    const { t } = useTranslation();
    const {   onClickSaveQuote}  = useQuoteWidget();

    return(
        <>
            <SecondaryButton
                variant="contained"
                style={{width:"100%",height:40}}
                onClick={() => {
                    onClickSaveQuote(QuoteId)
                        .then(() => updateQuoteExist())
                        .catch((error) => console.error("Error:", error));
                    }}
                >
                {t("home.admin.SaveQuote")}
                </SecondaryButton>
        </>
      
              
     
    )
}
export {SaveOrAddQuote}