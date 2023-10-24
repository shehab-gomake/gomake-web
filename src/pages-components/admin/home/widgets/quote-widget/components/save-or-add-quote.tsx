import { GomakePrimaryButton } from "@/components";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { useQuoteWidget } from "../use-quote-widget";
import { SecondaryButton } from "@/components/button/secondary-button";

const SaveOrAddQuote =  ({ QuoteId , isAdmin = true }) =>{
    const { clasess } = useStyle();
    const { t } = useTranslation();
    const { isDisabled ,  handleClick , onClcikCreateQuote , onClcikCreateQuoteForCustomer , onClickSaveQuote}  = useQuoteWidget();
    return(
        <>
        <div style={{display:"flex",justifyContent:"space-between",width:"53%"}}>
        <div style={clasess.btnContainer}>
                <GomakePrimaryButton
                onClick={
                    isDisabled
                    ? handleClick
                    : isAdmin
                    ? onClcikCreateQuote
                    : onClcikCreateQuoteForCustomer
                }
                style={clasess.btnStyle}
                >
                {t("home.admin.createQoute")}
                </GomakePrimaryButton>


                </div>
                <div style={{width:"48%"}}>
                      <SecondaryButton
                            variant="contained"
                            style={{width:"100%",height:40}}
                            onClick={()=> onClickSaveQuote(QuoteId)}
                            >
                            {t("home.admin.SaveQuote")}
                            </SecondaryButton>
                </div>
        
        </div>
       
        </>
      
              
     
    )
}
export {SaveOrAddQuote}