import {
  GoMakeDeleteModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useTotalPriceAndVat } from "./use-total-price-and-vat";
import { Box, Fade } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OtherReasonModal } from "./other-reason-modal";
import { QuoteStatuses } from "./enums";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const TotalPriceAndVatWidit = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    btnTabs,
    quoteItems,
    quoteStateValue,
    checked,
    openOtherReasonModal,
    openIrreleventCancelModal,
    openPriceCancelModal,
    openDeliveryTimeCancelModal,
    onClcikOpenIrreleventModal,
    onClcikCloseIrreleventModal,
    onClcikOpenPriceModal,
    onClcikClosePriceModal,
    onClcikOpenDeliveryTimeModal,
    onClcikCloseDeliveryTimeModal,
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
                  width: "23%",
                  minWidth: 120,
                }}
              >
                <div>
                  <GomakePrimaryButton
                    style={clasess.btnStyle}
                    onClick={item?.onclick()}
                  >
                    {item?.name}
                  </GomakePrimaryButton>
                </div>
                {item?.name === "Cancel" && checked && (
                  <Fade in={checked}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <GomakePrimaryButton
                        style={clasess.btnStyle2}
                        onClick={onClcikOpenIrreleventModal}
                      >
                        {t("sales.quote.irrelevant")}
                      </GomakePrimaryButton>
                      <GomakePrimaryButton
                        style={clasess.btnStyle2}
                        onClick={onClcikOpenPriceModal}
                      >
                        {t("sales.quote.price")}
                      </GomakePrimaryButton>
                      <GomakePrimaryButton
                        style={clasess.btnStyle2}
                        onClick={onClcikOpenDeliveryTimeModal}
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
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openIrreleventCancelModal}
        onClose={onClcikCloseIrreleventModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() =>
          updateCancelQuote(QuoteStatuses.CANCELED_IRRELEVANT)
        }
      />
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openPriceCancelModal}
        onClose={onClcikClosePriceModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() => updateCancelQuote(QuoteStatuses.CANCELED_PRICE)}
      />
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openDeliveryTimeCancelModal}
        onClose={onClcikCloseDeliveryTimeModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() =>
          updateCancelQuote(QuoteStatuses.CANCELED_DELIVERY_TIME)
        }
      />
    </div>
  );
};
export { TotalPriceAndVatWidit };
