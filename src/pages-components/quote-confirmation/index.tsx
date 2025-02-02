import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useEffect, useState } from "react";
import { GoMakeIcon } from "@/components/icons/go-make-icon";
import { QuoteNewPageWidget } from "../quote-new/quote";
import { QuoteConfirmationMobileWidget } from "@/widgets/quote-confirmation-mobile";
import { useQuoteConfirmation } from "./use-quote-confirmation";
import { updateTempUserTokenStorage } from "@/services/storage-data";
import { FONT_FAMILY } from "@/utils/font-family";
import PageNotFound from "@/pages/404.page";
import { getCompanyLoginLogo } from "@/services/api-service/profiles/company-profile-api";
import { useGomakeAxios } from "@/hooks";

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
    t,
    getTempUserToken,
    getPrePaymentById,
    getQuoteConfirmation,
    quoteConfirm,
    documentTitle,
    direction,
    capitalizeFirstLetter,
    isPageNotFound,
    setIsPageNotFound,
    router,
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
        getQuoteConfirmation();
      }
    };

    handlePrePaymentPage();
  }, [isPrePaymentPage, getTempUserToken]);

  if (isPageNotFound && isPrePaymentPage) {
    return <PageNotFound hideBackToHomePageBtn={true} />;
  }
  const { callApi } = useGomakeAxios();
  const [companyLogo, setCompanyLogo] = useState<{ loginLogo: string, name: string }>({ loginLogo: '', name: '' });

  const getCompanyLogo = async () => {
    const callBack = (res) => {
      if (res.success) {
        setCompanyLogo(res.data);
      }
    };
    await getCompanyLoginLogo(callApi, callBack);
  };
  useEffect(() => {
    getCompanyLogo().then();
  }, []);
  return (
    <div style={classes.firstContainer}>
      <div style={isMobile ? classes.iconMobileStyle : classes.iconStyle}>
        {companyLogo?.loginLogo ? (
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
            <img
              src={companyLogo?.loginLogo}
              alt="Print House Logo"
              style={classes.printHouseLogo}
            />
            <span style={{ color: "#000", ...FONT_FAMILY.Inter(700, 32), textTransform: 'capitalize' }}>{companyLogo?.name}</span>
          </div>
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
