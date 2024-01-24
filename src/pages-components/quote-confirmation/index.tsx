import { useStyle } from "./style";
import { _renderQuoteStatus } from "@/utils/constants";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useEffect, useState } from "react";
import { GoMakeIcon } from "@/components/icons/go-make-icon";
import { QuoteNewPageWidget } from "../quote-new/quote";

const QuoteConfirmationPageWidget = () => {
  const { classes } = useStyle();
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div style={classes.firstContainer}>
      <div style={classes.secondContainer}>
        <GoMakeIcon />
      </div>
      {isMobile ? <div>This is for mobile </div> : <QuoteNewPageWidget documentType={DOCUMENT_TYPE.quote} isQuoteConfirmation={true}/> }
    </div>
  );
};

export { QuoteConfirmationPageWidget };