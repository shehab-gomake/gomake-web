import { GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTotalPriceAndVat } from "./use-total-price-and-vat";

const TotalPriceAndVatWidit = () => {
  const { clasess } = useStyle();
  const { btnTabs, quoteItems, changeItems, quoteStateValue } =
    useTotalPriceAndVat();
  console.log("quoteItems", quoteItems);
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
            <div style={clasess.numbersStyle}>{quoteItems?.totalPrice}</div>
          </div>
          <div style={clasess.discountBefore}>
            <div style={clasess.lableStyle}>Discount</div>
            <div style={clasess.numbersStyle}>
              <GomakeTextInput
                style={clasess.textInputWithoutStyle}
                value={quoteItems?.discount}
                onChange={(e: any) => {
                  changeItems("discount", e.target.value);
                }}
                onBlur={() =>
                  quoteStateValue?.getCalculateQuote(0, quoteItems?.discount)
                }
              />
            </div>
            <div style={clasess.numbersStyle}>
              <GomakeTextInput
                style={clasess.textInputWithoutStyle}
                value={quoteItems?.discountAmount}
                onChange={(e: any) => {
                  changeItems("discountAmount", e.target.value);
                }}
                onBlur={() =>
                  quoteStateValue?.getCalculateQuote(
                    1,
                    quoteItems?.discountAmount
                  )
                }
              />
            </div>
          </div>
        </div>
        <div style={clasess.totalBeforeVAT}>
          <div style={clasess.totalBefore}>
            <div style={clasess.lableStyle}>Total after discount</div>
            <div style={clasess.numbersStyle}>
              {quoteItems?.totalPriceAfterDiscount}
            </div>
          </div>
          <div style={clasess.discountBefore}>
            <div style={clasess.lableStyle}>VAT</div>
            <div style={clasess.priceContainer}>
              <div style={clasess.numbersStyle}>{quoteItems?.vat}%</div>
            </div>
            <div style={clasess.priceContainer}>
              <div style={clasess.numbersStyle}>
                {Math.ceil(quoteItems?.totalVAT)}
              </div>
            </div>
          </div>
        </div>
        <div style={clasess.totlaPriceContainer}>
          <div>Total</div>

          <div style={clasess.totalContainer}>
            <GomakeTextInput
              style={clasess.textInputTotalWithoutStyle}
              //@ts-ignore
              value={Math.ceil(quoteItems?.totalPayment)}
              onChange={(e: any) => {
                changeItems("totalPayment", e.target.value);
              }}
              onBlur={() =>
                quoteStateValue?.getCalculateQuote(2, quoteItems?.totalPayment)
              }
            />
            <div style={clasess.lableTotal}>USD</div>
          </div>
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
