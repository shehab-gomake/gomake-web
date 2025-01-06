import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useEffect, useState } from "react";
import { GoMakeIcon } from "@/components/icons/go-make-icon";
import { QuoteNewPageWidget } from "../quote-new/quote";
import { QuoteConfirmationMobileWidget } from "@/widgets/quote-confirmation-mobile";
import { useQuoteConfirmation } from "./use-quote-confirmation";
import { updateTempUserTokenStorage } from "@/services/storage-data";

interface IProps {
  isPrePaymentPage?: boolean;
  documentType?: DOCUMENT_TYPE;
}

const QuoteConfirmationPageWidget = ({
  isPrePaymentPage = false,
  documentType,
}: IProps) => {
  const { classes } = useStyle();
  const [isMobile, setIsMobile] = useState(false);
  const {
    getTempUserToken,
    getPrePaymentById,
    getQuoteConfirmation,
    documentTitle,
  } = useQuoteConfirmation({ documentType });

  useEffect(() => {
    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  const updateScreenWidth = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    const handlePrePaymentPage = async () => {
      if (isPrePaymentPage) {
        const userToken = await getTempUserToken();
        if (userToken) {
          updateTempUserTokenStorage(userToken);
          await getPrePaymentById();
        }
      } else {
        getQuoteConfirmation();
      }
    };

    handlePrePaymentPage();
  }, [isPrePaymentPage, getTempUserToken]);

  return (
    <div style={classes.firstContainer}>
      <div style={isMobile ? classes.iconMobileStyle : classes.iconStyle}>
        <GoMakeIcon />
      </div>
      {isMobile ? (
        <QuoteConfirmationMobileWidget
          isMobile={isMobile}
          isPrePaymentPage={isPrePaymentPage}
          documentType={documentType}
          documentTitle={documentTitle}
        />
      ) : (
        <QuoteNewPageWidget
          documentType={isPrePaymentPage ? documentType : DOCUMENT_TYPE.quote}
          isQuoteConfirmation={true}
          isPrePaymentPage={isPrePaymentPage}
        />
      )}
    </div>
  );
};

export { QuoteConfirmationPageWidget };
