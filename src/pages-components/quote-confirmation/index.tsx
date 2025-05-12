import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useEffect, useState } from "react";
import { GoMakeIcon } from "@/components/icons/go-make-icon";
import { QuoteNewPageWidget } from "../quote-new/quote";
import { QuoteConfirmationMobileWidget } from "@/widgets/quote-confirmation-mobile";
import { useQuoteConfirmation } from "./use-quote-confirmation";
import { clearStorage, removeTempUserTokenStorage, updateTempUserTokenStorage } from "@/services/storage-data";
import { FONT_FAMILY } from "@/utils/font-family";
import PageNotFound from "@/pages/404.page";
import { QuoteConfirmationMobileSkeltonWidget } from "@/widgets/quote-confirmation-mobile/components/quote-confirmation-mobile-skelton";
import { useTranslation } from "react-i18next";

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
    documentTitle,
    direction,
    isPageNotFound,
    setIsPageNotFound,
    companyLogo,
    getCompanyLogo,
    quoteConfirm,
  } = useQuoteConfirmation({ documentType, isPrePaymentPage });
  const { classes } = useStyle({ direction });
  const { t } = useTranslation();
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
        removeTempUserTokenStorage();
        try {
          const userToken = await getTempUserToken();
          if (!userToken) {
            setIsPageNotFound(true);
          } else {
            updateTempUserTokenStorage(userToken);
            await getPrePaymentById();
          }
        } catch (error) {
          setIsPageNotFound(true);
        }
      } else {
        const userToken = await getTempUserToken();
        if (!userToken) {
          setIsPageNotFound(true);
        } else {
          updateTempUserTokenStorage(userToken);
          await getQuoteConfirmation();
        }
      }
    };

    handlePrePaymentPage();
  }, [isPrePaymentPage, getTempUserToken]);

  // if (isPageNotFound && isPrePaymentPage) {
  //   return <PageNotFound hideBackToHomePageBtn={true} message={"this payment is closed"} />;
  // }

  useEffect(() => {
    getCompanyLogo().then();
  }, []);

  return (
    <>
      {isPageNotFound ?
        <PageNotFound hideBackToHomePageBtn={true} message={"this payment is closed"} />
        :
        <div style={classes.firstContainer}>
          <div style={isMobile ? classes.iconMobileStyle : classes.iconStyle}>
            {companyLogo?.loginLogo && !isPrePaymentPage ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  src={companyLogo?.loginLogo}
                  alt="Print House Logo"
                  style={classes.printHouseLogo}
                />
                <span
                  style={{
                    color: "#000",
                    ...(isMobile
                      ? FONT_FAMILY.Inter(600, 24)
                      : FONT_FAMILY.Inter(700, 32)),
                    textTransform: "capitalize",
                  }}
                >
                  {companyLogo?.name}
                </span>
              </div>
            ) : quoteConfirm?.printHouseLogo && isPrePaymentPage ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  src={quoteConfirm?.printHouseLogo}
                  alt="Print House Logo"
                  style={classes.printHouseLogo}
                />
                <span
                  style={{
                    color: "#000",
                    ...(isMobile
                      ? FONT_FAMILY.Inter(600, 24)
                      : FONT_FAMILY.Inter(700, 32)),
                    textTransform: "capitalize",
                  }}
                >
                  {quoteConfirm?.printHouseName}
                </span>
              </div>
            ) : (
              <GoMakeIcon />
            )}
          </div>
          {isMobile ? (
            quoteConfirm?.id ? (
              <QuoteConfirmationMobileWidget
                isMobile={isMobile}
                isPrePaymentPage={isPrePaymentPage}
                documentType={documentType}
                documentTitle={documentTitle}
              />
            ) : (
              <QuoteConfirmationMobileSkeltonWidget />
            )
          ) : (
            <QuoteNewPageWidget
              documentType={isPrePaymentPage ? documentType : DOCUMENT_TYPE.quote}
              isQuoteConfirmation={true}
              isPrePaymentPage={isPrePaymentPage}
            />
          )}
        </div>
      }
    </>
  );
};

export { QuoteConfirmationPageWidget };
