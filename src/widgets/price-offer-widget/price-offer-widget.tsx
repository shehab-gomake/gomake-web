import React from 'react';
import { InputUpdatedValues } from '../quote-new/input-updated-values';

type PriceWidgetProps = {
  oldPrice: number;
  newPrice: number;
  currency?: string;
  item?: any;
  onBlurFinalPrice?: any;
  canUpdatePricesBasedOnType?: any;
  isUpdateFinalPrice?: any;
  isQuoteConfirmation?: any;
  setIsConfirmation?: any;
  setIsUpdateFinalPrice?: any;
  onInputChangeFinalPrice?: any;
};

const PriceOfferWidget: React.FC<PriceWidgetProps> = ({ oldPrice, newPrice, currency, item, onBlurFinalPrice, canUpdatePricesBasedOnType, isUpdateFinalPrice, isQuoteConfirmation, setIsConfirmation, setIsUpdateFinalPrice, onInputChangeFinalPrice }) => {
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div
        style={{
          textDecoration: 'line-through',
          color: 'gray',
          fontSize: '12px',
          fontWeight: "400"
        }}
      >
        {oldPrice} {currency}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>
        {/* {newPrice} {currency} */}
        <InputUpdatedValues
          value={item?.finalPrice}
          onBlur={onBlurFinalPrice}
          sign={currency}
          isUpdate={canUpdatePricesBasedOnType && isUpdateFinalPrice}
          setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateFinalPrice}
          onInputChange={(e) => onInputChangeFinalPrice(e)}
          speicalStyle={{
            fontSize: '14px', fontWeight: 'bold', marginTop: '5px', color: "rgb(46,48,146)"
          }}
        />
      </div>
    </div>
  );
};

export default PriceOfferWidget;
