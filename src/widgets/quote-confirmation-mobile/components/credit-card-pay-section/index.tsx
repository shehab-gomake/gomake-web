import CreditCardIcon from "@mui/icons-material/CreditCard";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { useCreditCardPaySection } from "./use-credit-card-pay-section";
import { useEffect } from "react";
import { loadgingState } from "@/store/loading";
import { useRecoilValue } from "recoil";
import { FONT_FAMILY } from "@/utils/font-family";

const CreditCardPaySection = ({
  isFromBigScreen = false,
  documentType,
  isDebtPayments = false,
}) => {
  const customWidth = isFromBigScreen ? "70%" : "85%";
  const { classes } = useStyle({ isFromBigScreen, customWidth });
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
  } = useCreditCardPaySection({ documentType, isDebtPayments });
  const loading = useRecoilValue(loadgingState);

  useEffect(() => {
    if (quoteConfirm && isDebtPayments) {
      const selectedTotal = quoteConfirm.debtsToPay
        ?.filter((item) => item.isChecked)
        ?.reduce((sum, item) => sum + Number(item.price || 0), 0);

      handleChangeInputs("transactionSum", selectedTotal ?? 0);
    } else if (quoteConfirm && !isDebtPayments) {
      handleChangeInputs("transactionSum", quoteConfirm.sumToPrepay ?? 0);
    }
  }, [quoteConfirm, isDebtPayments]);

  return (
    <div style={classes.mainContainer}>
      {isPaymentSuccess ? (
        <div style={classes.successMessage}>
          <h3>{t("prePayment.paymentComplete")}</h3>
        </div>
      ) : (
        <>
          <div style={{ ...FONT_FAMILY.Lexend(600, 14) }}>{t("payment.creditCardDetails")}</div>
          <div style={classes.creditCardInputsContainer}>
            <CreditCardIcon sx={{ color: "var(--theme-primary-color, #2E3092)" }} />
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
          <div style={{ ...FONT_FAMILY.Lexend(600, 14) }}>{t("payment.personalIDNumber")}</div>
          <input
            style={classes.creditSecondCardInputs}
            placeholder={t("payment.personalIDNumber")}
            value={paymentDetailsState?.holderID}
            onChange={(e) => handleChangeInputs("holderID", e.target.value)}
          />
          <div style={{ ...FONT_FAMILY.Lexend(600, 14) }}>{t("payment.paymentAmount")}</div>
          <input
            style={classes.creditSecondCardInputs}
            placeholder={t("payment.paymentAmount")}
            value={paymentDetailsState?.transactionSum}
            onChange={(e) =>
              handleChangeInputs("transactionSum", e.target.value)
            }
            readOnly
          />
          <div style={{ width: customWidth }}>
            <div style={{ ...FONT_FAMILY.Lexend(600, 14), marginBottom: 10 }}>{t("payment.paymentType")}</div>
            <GoMakeAutoComplate
              key={"transactionType"}
              value={transactionTypes.find(
                (option) =>
                  option.value === paymentDetailsState?.transactionType
              )}
              style={classes.selectInputs}
              options={transactionTypes}
              placeholder={t("payment.paymentType")}
              onChange={(e, value) =>
                handleChangeInputs("transactionType", value?.value)
              }
            />
          </div>
          {paymentDetailsState?.transactionType &&
            paymentDetailsState?.transactionType === 2 && (
              <div style={{ width: customWidth }}>
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
              opacity:
                loading || Number(paymentDetailsState?.transactionSum) === 0
                  ? 0.5
                  : 1,
            }}
            disabled={
              loading || Number(paymentDetailsState?.transactionSum) === 0
            }
          >
            {t("payment.proceedCheckout")}
          </PrimaryButton>
        </>
      )}
    </div>
  );
};
export { CreditCardPaySection };
