import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useEffect, useState } from "react";
import { GoMakeIcon } from "@/components/icons/go-make-icon";
import { QuoteNewPageWidget } from "../quote-new/quote";
import { QuoteConfirmationMobileWidget } from "@/widgets/quote-confirmation-mobile";
import { useQuoteConfirmation } from "./use-quote-confirmation";
import {
  updateTempUserTokenStorage,
  updateTokenStorage,
} from "@/services/storage-data";
import { FONT_FAMILY } from "@/utils/font-family";
import { adaptPaddingRight } from "@/utils/adapter";

interface IProps {
  isPrePaymentPage?: boolean;
  documentType?: DOCUMENT_TYPE;
}

const QuoteConfirmationPageWidget = ({
  isPrePaymentPage = false,
  documentType,
}: IProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const {
    getTempUserToken,
    getPrePaymentById,
    getQuoteConfirmation,
    quoteConfirm,
    documentTitle,
    direction,
    capitalizeFirstLetter,
  } = useQuoteConfirmation({ documentType });
  const { classes } = useStyle({ direction });

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
        {quoteConfirm?.printHouseLogo ? (
          <img
            src={quoteConfirm.printHouseLogo}
            alt="Print House Logo"
            style={classes.printHouseLogo}
          />
        ) : (
          <GoMakeIcon />
        )}
        {isPrePaymentPage && (
          <span
            style={{
              ...classes.printHouseName,
              ...(isMobile
                ? FONT_FAMILY.Inter(600, 16)
                : FONT_FAMILY.Inter(600, 18)),
            }}
          >
            {capitalizeFirstLetter(quoteConfirm?.printHouseName)}
          </span>
        )}
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
