import CreditCardIcon from "@mui/icons-material/CreditCard";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { useCreditCardPaySection } from "./use-credit-card-pay-section";
import { useEffect } from "react";
import { loadgingState } from "@/store/loading";
import { useRecoilValue } from "recoil";

const CreditCardPaySection = ({ isFromBigScreen = false }) => {
  const { classes } = useStyle({ isFromBigScreen });
  const {
    t,
    quoteConfirm,
    numberOfPayments,
    transactionTypes,
    paymentDetailsState,
    getCardNumberProps,
    getCVCProps,
    handleChangeInputs,
    handleCardNumberChange,
    handleCVVChange,
    handleExpiryDateChange,
    handleProceedCheckout,
    isPaymentSuccess,
  } = useCreditCardPaySection();
  const loading = useRecoilValue(loadgingState);

  useEffect(() => {
    if (quoteConfirm?.sumToPrepay) {
      handleChangeInputs("transactionSum", quoteConfirm.sumToPrepay);
    }
  }, [quoteConfirm]);

  return (
    <div style={classes.mainContainer}>
      {isPaymentSuccess ? (
        <div style={classes.successMessage}>
          <h3>{t("prePayment.paymentComplete")}</h3>
        </div>
      ) : (
        <>
          <div style={classes.creditCardInputsContainer}>
            <CreditCardIcon sx={{ color: "#2e3092" }} />
            <input
              {...getCardNumberProps({ onChange: handleCardNumberChange })}
              style={{
                ...classes.creditCardInputs,
                width: "55%",
                paddingLeft: "5px",
              }}
              placeholder="Card number"
              value={paymentDetailsState?.cardNumber}
            />
            <input
              onChange={handleExpiryDateChange}
              style={{ ...classes.creditCardInputs, width: "20%" }}
              placeholder="MM/YY"
              value={paymentDetailsState?.expDate_MMYY}
            />
            <input
              {...getCVCProps({ onChange: handleCVVChange })}
              style={{ ...classes.creditCardInputs, width: "20%" }}
              placeholder="CVV"
              value={paymentDetailsState?.cvv}
            />
          </div>
          <input
            style={classes.creditSecondCardInputs}
            placeholder={t("partners.headers.id")}
            value={paymentDetailsState?.holderID}
            onChange={(e) => handleChangeInputs("holderID", e.target.value)}
          />
          <input
            style={classes.creditSecondCardInputs}
            placeholder={t("sales.quote.total")}
            value={paymentDetailsState?.transactionSum}
            onChange={(e) =>
              handleChangeInputs("transactionSum", e.target.value)
            }
          />
          <div style={{ width: "70%" }}>
            <GoMakeAutoComplate
              key={"transactionType"}
              value={transactionTypes.find(
                (option) =>
                  option.value === paymentDetailsState?.transactionType
              )}
              style={classes.selectInputs}
              options={transactionTypes}
              placeholder={t("payment.transactionType")}
              onChange={(e, value) =>
                handleChangeInputs("transactionType", value?.value)
              }
            />
          </div>
          {paymentDetailsState?.transactionType &&
            paymentDetailsState?.transactionType === 2 && (
              <div style={{ width: "70%" }}>
                <GoMakeAutoComplate
                  key={"numberOfPayments"}
                  value={paymentDetailsState?.numberOfPayments}
                  style={classes.selectInputs}
                  options={numberOfPayments}
                  placeholder={t("payment.numberOfPayments")}
                  onChange={(e, value) =>
                    handleChangeInputs("numberOfPayments", value?.value)
                  }
                />
              </div>
            )}
          <PrimaryButton
            onClick={handleProceedCheckout}
            variant="contained"
            style={{
              ...classes.btnStyle,
              opacity: loading ? 0.5 : 1,
            }}
            disabled={loading}
          >
            {t("payment.proceedCheckout")}
          </PrimaryButton>
        </>
      )}
    </div>
  );
};
export { CreditCardPaySection };
