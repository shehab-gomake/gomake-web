import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTotalPriceAndVat } from "./use-total-price-and-vat";
import { Box, Fade } from "@mui/material";

const TotalPriceAndVatWidit = () => {
  const { clasess } = useStyle();
  const { btnTabs, quoteItems, changeItems, quoteStateValue, checked } =
    useTotalPriceAndVat();
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
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <GomakePrimaryButton
                  style={clasess.btnStyle}
                  onClick={item?.onclick()}
                >
                  {item?.name}
                </GomakePrimaryButton>
                {item?.name === "Cancel" && checked && (
                  <Fade in={checked}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <GomakePrimaryButton style={clasess.btnStyle2}>
                        Irrelevant
                      </GomakePrimaryButton>
                      <GomakePrimaryButton style={clasess.btnStyle2}>
                        price
                      </GomakePrimaryButton>
                      <GomakePrimaryButton style={clasess.btnStyle2}>
                        Delivery time
                      </GomakePrimaryButton>
                      <GomakePrimaryButton style={clasess.btnStyle2}>
                        Other
                      </GomakePrimaryButton>
                    </Box>
                  </Fade>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={clasess.rightSideContainer}>
        <div style={clasess.totalBeforeVAT}>
          <div style={clasess.totalBefore}>
            <div style={clasess.lableStyle}>Total before VAT</div>
            <div style={clasess.numbersStyle}>
              {quoteItems?.totalPrice?.toFixed(2)}
            </div>
          </div>
          <div style={clasess.discountBefore}>
            <div style={clasess.lableStyle}>Discount</div>
            <div style={clasess.numbersStyle}>
              <GomakeTextInput
                style={clasess.textInputWithoutStyle}
                value={Number(quoteItems?.discount).toFixed(2)}
                onChange={(e: any) => {
                  changeItems("discount", e.target.value);
                }}
                type="number"
                onBlur={() =>
                  quoteStateValue?.getCalculateQuote(0, quoteItems?.discount)
                }
              />
            </div>
            <div style={clasess.numbersStyle}>
              <GomakeTextInput
                style={clasess.textInputWithoutStyle}
                value={Number(quoteItems?.discountAmount).toFixed(2)}
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
              {quoteItems?.totalPriceAfterDiscount?.toFixed(2)}
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
          <GomakePrimaryButton style={clasess.orderNowBtn}>
            order now
          </GomakePrimaryButton>
          <GomakePrimaryButton style={clasess.sendMessageBtn}>
            Send to sales manager
          </GomakePrimaryButton>
        </div>
      </div>
    </div>
  );
};
export { TotalPriceAndVatWidit };
