import React from 'react';
import { useStyle } from './style';
import { TextAreasContainer } from './components/text-areas-container';
import { ButtonsConfirmContainer } from './components/buttons-container';
import { TotalPriceAndVatContainer } from './components/total-price-and-vat';
import { InfoContainer } from './components/info-container';

const QuoteConfirmationMobileWidget = () => {
  const { classes } = useStyle()

  return (
    <div style={classes.mainContainer}>
      <InfoContainer />
      <TotalPriceAndVatContainer />
      <TextAreasContainer />
      <ButtonsConfirmContainer />
    </div>
  );
};

export { QuoteConfirmationMobileWidget };