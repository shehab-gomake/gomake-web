import { GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTotalPriceAndVat } from "./use-total-price-and-vat";

const TotalPriceAndVatWidit = () => {
  const { clasess } = useStyle();
  const { btnTabs } = useTotalPriceAndVat();
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.leftSideContainer}>
        <GomakeTextInput
          multiline={6}
          style={clasess.textInputStyle}
          placeholder={"order comments"}
        />
        <div style={clasess.btnsContainer}>
          {btnTabs?.map((item) => {
            return <div style={clasess.btnStyle}>{item?.name}</div>;
          })}
        </div>
      </div>
      <div style={clasess.rightSideContainer}>
        <div style={clasess.totalBeforeVAT}>
          <div style={clasess.totalBefore}>
            <div style={clasess.lableStyle}>Total before VAT</div>
            <div style={clasess.numbersStyle}>146.00 </div>
          </div>
          <div style={clasess.discountBefore}>
            <div style={clasess.lableStyle}>Discount</div>
            <div style={clasess.priceContainer}>
              <div style={clasess.numbersStyle}>10%</div>
              <div style={clasess.numbersStyle}>146 $</div>
            </div>
          </div>
        </div>
        <div style={clasess.totalBeforeVAT}>
          <div style={clasess.totalBefore}>
            <div style={clasess.lableStyle}>Total after discount</div>
            <div style={clasess.numbersStyle}>146.00 </div>
          </div>
          <div style={clasess.discountBefore}>
            <div style={clasess.lableStyle}>VAT</div>
            <div style={clasess.priceContainer}>
              <div style={clasess.numbersStyle}>17%</div>
              <div style={clasess.numbersStyle}>146.00</div>
            </div>
          </div>
        </div>
        <div style={clasess.totlaPriceContainer}>
          <div>Total</div>
          <div>350.00 USD</div>
        </div>
        <div style={clasess.rightSideBtnsContainer}>
          <div style={clasess.orderNowBtn}>order now</div>
          <div style={clasess.sendMessageBtn}>Send to sales manager</div>
        </div>
      </div>
    </div>
  );
};
export { TotalPriceAndVatWidit };
