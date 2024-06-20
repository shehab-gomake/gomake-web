import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useEffect, useState } from "react";
import { GoMakeIcon } from "@/components/icons/go-make-icon";
import { QuoteNewPageWidget } from "../quote-new/quote";
import { QuoteConfirmationMobileWidget } from "@/widgets/quote-confirmation-mobile";
import { useQuoteConfirmation } from "./use-quote-confirmation";

interface IProps {
  isPrePaymentPage?: boolean;
}

const QuoteConfirmationPageWidget = ({isPrePaymentPage = false }: IProps)  => {
  const { classes } = useStyle();
  const [isMobile, setIsMobile] = useState(false);
  const { getQuoteConfirmation } = useQuoteConfirmation();

  useEffect(() => {
    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth);
    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);

  const updateScreenWidth = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // GET DOCUMENT BY ID JUST FOR QUOTE WHY ??
  useEffect(() => {
     getQuoteConfirmation();
  }, [])

  return (
    <div style={classes.firstContainer}>
      <div style={isMobile ? classes.iconMobileStyle : classes.iconStyle}>
        <GoMakeIcon />
      </div>
      {isMobile ? <QuoteConfirmationMobileWidget isMobile={isMobile} isPrePaymentPage={isPrePaymentPage} /> : <QuoteNewPageWidget documentType={ isPrePaymentPage ?  DOCUMENT_TYPE.order :  DOCUMENT_TYPE.quote} isQuoteConfirmation={true} isPrePaymentPage={isPrePaymentPage}/>}
    </div>
  );
};

export { QuoteConfirmationPageWidget };