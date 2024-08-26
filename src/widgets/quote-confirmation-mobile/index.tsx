import React from 'react';
import { useStyle } from './style';
import { TextAreasContainer } from './components/text-areas-container';
import { ButtonsConfirmContainer } from './components/buttons-container';
import { TotalPriceAndVatContainer } from './components/total-price-and-vat';
import { InfoContainer } from './components/info-container';
import { QuoteItems } from './components/quote-items';
import { CreditCardPaySection } from './components/credit-card-pay-section';
import { useTranslation } from 'react-i18next';

const QuoteConfirmationMobileWidget = ({ isMobile, isPrePaymentPage }) => {
  const { classes } = useStyle()
  const { t } = useTranslation();

  return (
    <div style={classes.mainContainer}>
      <InfoContainer isPrePaymentPage={isPrePaymentPage} />
      <QuoteItems isPrePaymentPage={isPrePaymentPage} />
      <TotalPriceAndVatContainer />
      {!isPrePaymentPage && <>
        <TextAreasContainer />
        <ButtonsConfirmContainer isMobile={isMobile} />
      </>
      }
      {isPrePaymentPage &&
        <>
          <div style={classes.borderContainer} />
          <div style={classes.titleStyle}>{t("payment.paymentDetails")}</div>
          <CreditCardPaySection />
        </>}
    </div>
  );
};

export { QuoteConfirmationMobileWidget };