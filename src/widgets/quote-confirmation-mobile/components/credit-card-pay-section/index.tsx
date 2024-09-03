import CreditCardIcon from '@mui/icons-material/CreditCard';
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from './style';
import { useCreditCardPaySection } from './use-credit-card-pay-section';
import { useEffect } from 'react';

const CreditCardPaySection = ({ isFromBigScreen = false }) => {
    const { classes } = useStyle({ isFromBigScreen });
    const {
        t,
        quoteConfirm,
        numberOfPayments,
        transactionTypes,
        paymentDetailsState,
        getCardNumberProps,
        getExpiryDateProps,
        getCVCProps,
        handleChangeInputs,
        handleCardNumberChange,
        handleCVVChange,
        handleExpiryDateChange,
        handleProceedCheckout
    } = useCreditCardPaySection();

    useEffect(() => {
        if (quoteConfirm?.sumToPrepay) {
            handleChangeInputs("transactionSum", quoteConfirm.sumToPrepay);
        }
    }, [quoteConfirm]);

    return (
        <div style={classes.mainContainer}>
            <div style={classes.creditCardInputsContainer}>
                <CreditCardIcon sx={{ color: "#2e3092" }} />
                <input
                    {...getCardNumberProps({ onChange: handleCardNumberChange })}
                    style={{ ...classes.creditCardInputs, width: "55%", paddingLeft: "5px" }}
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
                onChange={(e) => handleChangeInputs("transactionSum", e.target.value)}
            />
            <div style={{ width: "70%" }}>
                <GoMakeAutoComplate
                    key={"transactionType"}
                    // value={paymentDetailsState?.transactionType}
                    value={transactionTypes.find(
                        (option) => option.value === paymentDetailsState?.transactionType
                      )}
                    style={classes.selectInputs}
                    options={transactionTypes}
                    placeholder={t("payment.transactionType")}
                    onChange={(e, value) => handleChangeInputs("transactionType", value?.value)}
                />
            </div>
            {paymentDetailsState?.transactionType && paymentDetailsState?.transactionType === 2 && (
                <div style={{ width: "70%" }}>
                    <GoMakeAutoComplate
                        key={"numberOfPayments"}
                        value={paymentDetailsState?.numberOfPayments}
                        style={classes.selectInputs}
                        options={numberOfPayments}
                        placeholder={t("payment.numberOfPayments")}
                        onChange={(e, value) => handleChangeInputs("numberOfPayments", value?.value)}
                    />
                </div>
            )}
            <PrimaryButton onClick={handleProceedCheckout} variant="contained" style={classes.btnStyle}>{t("payment.proceedCheckout")}
            </PrimaryButton>
        </div>
    );
}
export { CreditCardPaySection }