import React from 'react';
import { useStyle } from './style';
import { TextAreasContainer } from './components/text-areas-container';
import { ButtonsConfirmContainer } from './components/buttons-container';
import { TotalPriceAndVatContainer } from './components/total-price-and-vat';
import { InfoContainer } from './components/info-container';
import { QuoteItems } from './components/quote-items';

const QuoteConfirmationMobileWidget = ({ isMobile }) => {
  const { classes } = useStyle()

  return (
    <div style={classes.mainContainer}>
      <InfoContainer />
      <QuoteItems />
      <TotalPriceAndVatContainer />
      <TextAreasContainer />
      <ButtonsConfirmContainer isMobile={isMobile} />
    </div>
  );
};

export { QuoteConfirmationMobileWidget };