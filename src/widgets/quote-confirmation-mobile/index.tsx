import React from 'react';
import { useStyle } from './style';
import { TextAreasContainer } from './components/text-areas-container';
import { ButtonsConfirmContainer } from './components/buttons-container';
import { TotalPriceAndVatContainer } from './components/total-price-and-vat';
import { InfoContainer } from './components/info-container';
import { QuoteItems } from './components/quote-items';
import { CreditCardPaySection } from './components/credit-card-pay-section';

const QuoteConfirmationMobileWidget = ({ isMobile, isPrePaymentPage }) => {
  const { classes } = useStyle()

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
          <div style={classes.titleStyle}>{"Payment Details"}</div>
          <CreditCardPaySection />
        </>}
    </div>
  );
};

export { QuoteConfirmationMobileWidget };