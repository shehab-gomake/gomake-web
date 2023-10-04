import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTotalPriceAndVat } from "./use-total-price-and-vat";
import { Box, Fade } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OtherReasonModal } from "./other-reason-modal";
import { QuoteStatuses } from "./enums";

const TotalPriceAndVatWidit = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    btnTabs,
    quoteItems,
    quoteStateValue,
    checked,
    openOtherReasonModal,
    reasonText,
    changeItems,
    onClcikOpenModal,
    onClcikCloseModal,
    updateCancelQuote,
    setReasonText,
    onClickCancelOffer,
  } = useTotalPriceAndVat();
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.leftSideContainer}>
        <GomakeTextInput
          multiline={6}
          style={clasess.textInputStyle}
          placeholder={t("sales.quote.orderComments")}
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
                      <GomakePrimaryButton
                        style={clasess.btnStyle2}
                        onClick={() =>
                          updateCancelQuote(QuoteStatuses.CANCELED_IRRELEVANT)
                        }
                      >
                        {t("sales.quote.irrelevant")}
                      </GomakePrimaryButton>
                      <GomakePrimaryButton
                        style={clasess.btnStyle2}
                        onClick={() =>
                          updateCancelQuote(QuoteStatuses.CANCELED_PRICE)
                        }
                      >
                        {t("sales.quote.price")}
                      </GomakePrimaryButton>
                      <GomakePrimaryButton
                        style={clasess.btnStyle2}
                        onClick={() =>
                          updateCancelQuote(
                            QuoteStatuses.CANCELED_DELIVERY_TIME
                          )
                        }
                      >
                        {t("sales.quote.deliveryTime")}
                      </GomakePrimaryButton>
                      <GomakePrimaryButton
                        style={clasess.btnStyle2}
                        onClick={onClcikOpenModal}
                      >
                        {t("sales.quote.other")}
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
            <div style={clasess.lableStyle}>
              {t("sales.quote.totalBeforeVAT")}
            </div>
            <div style={clasess.numbersStyle}>
              {quoteItems?.totalPrice?.toFixed(2)}
            </div>
          </div>
          <div style={clasess.discountBefore}>
            <div style={clasess.lableStyle}>{t("sales.quote.discount")}</div>
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
            <div style={clasess.lableStyle}>
              {t("sales.quote.totalAfterDiscount")}
            </div>
            <div style={clasess.numbersStyle}>
              {quoteItems?.totalPriceAfterDiscount?.toFixed(2)}
            </div>
          </div>
          <div style={clasess.discountBefore}>
            <div style={clasess.lableStyle}>{t("sales.quote.vat")}</div>
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
          <div>{t("sales.quote.total")}</div>

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
            <div style={clasess.lableTotal}>{t("sales.quote.usd")}</div>
          </div>
        </div>
        <div style={clasess.rightSideBtnsContainer}>
          <GomakePrimaryButton style={clasess.orderNowBtn}>
            {t("sales.quote.orderNow")}
          </GomakePrimaryButton>
          <GomakePrimaryButton style={clasess.sendMessageBtn}>
            {t("sales.quote.sendToSalesManager")}
          </GomakePrimaryButton>
        </div>
      </div>
      <OtherReasonModal
        openModal={openOtherReasonModal}
        onClose={onClcikCloseModal}
        setReasonText={setReasonText}
        onClickCancelOffer={onClickCancelOffer}
      />
    </div>
  );
};
export { TotalPriceAndVatWidit };
