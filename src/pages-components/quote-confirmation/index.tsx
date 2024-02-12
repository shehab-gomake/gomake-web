import { useStyle } from "./style";
import { _renderQuoteStatus } from "@/utils/constants";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useEffect, useState } from "react";
import { GoMakeIcon } from "@/components/icons/go-make-icon";
import { QuoteNewPageWidget } from "../quote-new/quote";
import { QuoteConfirmationMobileWidget } from "@/widgets/quote-confirmation-mobile";
import { useQuoteConfirmation } from "./use-quote-confirmation";

const QuoteConfirmationPageWidget = () => {
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

  useEffect(() => {
    getQuoteConfirmation();
}, [])
 
  return (
    <div style={classes.firstContainer}>
      <div style={isMobile ? classes.iconMobileStyle : classes.iconStyle}>
        <GoMakeIcon />
      </div>
      {isMobile ? <QuoteConfirmationMobileWidget /> : <QuoteNewPageWidget documentType={DOCUMENT_TYPE.quote} isQuoteConfirmation={true} />}
    </div>
  );
};

export { QuoteConfirmationPageWidget };