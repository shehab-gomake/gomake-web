import React from 'react';
import { useStyle } from './style';
import { TextAreasContainer } from './components/text-areas-container';
import { ButtonsConfirmContainer } from './components/buttons-container';
import { TotalPriceAndVatContainer } from './components/total-price-and-vat';
import { InfoContainer } from './components/info-container';
import { QuoteItems } from './components/quote-items';

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
      {isPrePaymentPage && <div style={classes.titleStyle}>{"Payment"}</div>}
    </div>
  );
};

export { QuoteConfirmationMobileWidget };