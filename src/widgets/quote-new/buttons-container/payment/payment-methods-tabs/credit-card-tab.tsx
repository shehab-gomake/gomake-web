import { useStyle } from "../style";
import { usePaymentInputs } from 'react-payment-inputs';
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { SecondaryButton } from "@/components/button/secondary-button";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeAutoComplate } from "@/components";

const CreditCardTab = ({
    firstWidget,
    secondWidget,
    thirdWidget,
    handleFirstButtonClick,
    handleSecondButtonClick,
    handleThirdButtonClick
}) => {
    const { classes } = useStyle();
    const { getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();

    const {
        t,
        handleCardNumberChange,
        handleExpiryDateChange,
        handleCVVChange,
        onClickMakePayment,
        numberOfPayments,
        transactionTypes,
        totalCreditCard,
        handleTotalCreditCardChange,
        creditCard,
        handleChangeInputs,
        isTransacted
    } = usePaymentMethodsTabs();


    return (
        <div dir="ltr" style={classes.mainContainer}>
            {
                firstWidget &&
                <div style={classes.firstWidgetStyle}>
                    <div style={classes.creditCardInputsContainer}>
                        <CreditCardIcon sx={{ color: "#2e3092" }} />
                        <input
                            {...getCardNumberProps({ onChange: handleCardNumberChange })}
                            style={{ ...classes.creditCardInputs, width: "55%", paddingLeft: "5px" }}
                            placeholder="Card number"
                            value={creditCard?.cardNumber}
                        />
                        <input
                            {...getExpiryDateProps({ onChange: handleExpiryDateChange })}
                            style={{ ...classes.creditCardInputs, width: "20%" }}
                            placeholder="MM/YY"
                            value={creditCard?.expDate_MMYY} />
                        <input
                            {...getCVCProps({ onChange: handleCVVChange })}
                            style={{ ...classes.creditCardInputs, width: "20%" }}
                            placeholder="CVV"
                            value={creditCard?.cvv} />
                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Id"
                            maxLength={9}
                            value={creditCard?.holderID}
                            onChange={(e) => handleChangeInputs("holderID", e.target.value)}
                        />
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Total"
                            value={totalCreditCard}
                            onChange={(e) => handleTotalCreditCardChange(e.target.value)}
                        />
                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="First name"
                            value={creditCard?.customerName}
                            onChange={(e) => handleChangeInputs("customerName", e.target.value)}
                        />
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Last name"
                            value={creditCard?.lastName}
                            onChange={(e) => handleChangeInputs("lastName", e.target.value)}
                        />
                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Phone"
                            value={creditCard?.phoneNumber}
                            onChange={(e) => handleChangeInputs("phoneNumber", e.target.value)}
                        />
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Email"
                            value={creditCard?.customerEmail}
                            onChange={(e) => handleChangeInputs("customerEmail", e.target.value)}
                        />
                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <div style={{ width: "45%" }}>
                            <GoMakeAutoComplate
                                value={creditCard?.transactionType}
                                style={classes.selectInputs}
                                options={transactionTypes}
                                placeholder={t("payment.transactionType")}
                                onChange={(e, value) => handleChangeInputs("transactionType", value?.value)}
                            />
                        </div>
                        {creditCard?.transactionType && creditCard?.transactionType === 2 && (
                            <div style={{ width: "45%" }}>
                                <GoMakeAutoComplate
                                    value={creditCard?.numberOfPayments}

                                    style={classes.selectInputs}
                                    options={numberOfPayments}
                                    placeholder={t("payment.numberOfPayments")}
                                    onChange={(e, value) => handleChangeInputs("numberOfPayments", value?.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            }
            {
                secondWidget &&
                <div style={classes.firstWidgetStyle}>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <input
                            {...getCardNumberProps({ onChange: handleCardNumberChange })}
                            style={classes.creditSecondCardInputs}
                            placeholder="Card number" />

                        <input
                            {...getExpiryDateProps({ onChange: handleExpiryDateChange })}
                            style={classes.creditSecondCardInputs}
                            placeholder="MM/YY" />
                    </div>

                    <div style={classes.creditCardSecondInputsContainer}>
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Total"
                            value={totalCreditCard}
                            onChange={(e) => handleTotalCreditCardChange(e.target.value)}
                        />
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Voucher number"
                        />
                    </div>
                </div>
            }
            {
                thirdWidget &&
                <div style={classes.firstWidgetStyle}>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Total"
                            value={totalCreditCard}
                            onChange={(e) => handleTotalCreditCardChange(e.target.value)}
                        />

                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <div style={{ width: "45%" }}>
                            <GoMakeAutoComplate
                                value={creditCard?.transactionType}
                                style={classes.selectInputs}
                                options={transactionTypes}
                                placeholder={t("payment.transactionType")}
                                onChange={(e, value) => handleChangeInputs("transactionType", value?.value)}
                            />
                        </div>
                        {creditCard?.transactionType && creditCard?.transactionType === 2 && (
                            <div style={{ width: "45%" }}>
                                <GoMakeAutoComplate
                                    value={creditCard?.numberOfPayments}
                                    style={classes.selectInputs}
                                    options={numberOfPayments}
                                    placeholder={t("payment.numberOfPayments")}
                                    onChange={(e, value) => handleChangeInputs("numberOfPayments", value?.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            }
            {(!secondWidget && !isTransacted) && <PrimaryButton variant="contained" style={{ width: "75%", padding: "4px" }} onClick={onClickMakePayment} >{t('payment.makePayment')}</PrimaryButton>}
            {!isTransacted && <div style={{ display: "flex", flexDirection: "column", width: "75%" }}>
                {!firstWidget && <SecondaryButton style={classes.creditButtons} onClick={handleFirstButtonClick}>{t('payment.manualCreditCard')}</SecondaryButton>}
                {!secondWidget && <SecondaryButton style={classes.creditButtons} onClick={handleSecondButtonClick}>{t('payment.creditDetailsWithoutSwipe')}</SecondaryButton>}
                {!thirdWidget && <SecondaryButton style={classes.creditButtons} onClick={handleThirdButtonClick}>{t('payment.processingViaPinPad')}</SecondaryButton>}
            </div>}
        </div>
    );
}
export { CreditCardTab }