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
    handleThirdButtonClick,
    handleSaveAndClose
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
        isTransacted,
        secondCreditCard,
        handleChangeCreditCardInputs,
        transactionSelected,
        cardTransactionsOptions,
        handleChooseExistingCard
    } = usePaymentMethodsTabs();

    return (
        <div style={{ display: "flex", flexDirection: "column" as "column", gap: "10px" }} >
            {
                cardTransactionsOptions && <div style={{ width: "75%", alignSelf: "center" }}>
                    <GoMakeAutoComplate
                        key={"chooseExistingCard-select"}
                        value={transactionSelected}
                        style={classes.selectInputs}
                        options={cardTransactionsOptions}
                        placeholder={t("payment.chooseExistingCard")}
                        onChange={(e, value) => handleChooseExistingCard(value)}
                    />
                </div>
            }
            {!transactionSelected && <div dir="ltr" style={classes.mainContainer}>
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
                                key={"Total-1"}
                                style={classes.creditSecondCardInputs}
                                placeholder="Total"
                                value={totalCreditCard}
                                onChange={(e) => { handleTotalCreditCardChange(e.target.value); handleChangeInputs("transactionSum", e.target.value) }}
                                readOnly={isTransacted}
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
                                    key={"transactionType"}
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
                                        key={"numberOfPayments"}
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
                                style={classes.creditSecondCardInputs}
                                placeholder="Card number"
                                value={secondCreditCard?.creditCardNum}
                                onChange={(e) => handleChangeCreditCardInputs("creditCardNum", e.target.value)}
                            />
                            <input
                                style={classes.creditSecondCardInputs}
                                placeholder="MM/YY"
                                value={secondCreditCard?.creditCardExpDate}
                                onChange={(e) => handleChangeCreditCardInputs("creditCardExpDate", e.target.value)}
                            />
                        </div>
                        <div style={classes.creditCardSecondInputsContainer}>
                            <input
                                key={"Total-2"}

                                style={classes.creditSecondCardInputs}
                                placeholder="Total"
                                value={totalCreditCard}
                                onChange={(e) => { handleTotalCreditCardChange(e.target.value); handleChangeCreditCardInputs("creditCardSum", e.target.value); }}
                                readOnly={isTransacted}
                            />
                            <input
                                style={classes.creditSecondCardInputs}
                                placeholder="Voucher number"
                                value={secondCreditCard?.creditCardVoucherNumber}
                                onChange={(e) => handleChangeCreditCardInputs("creditCardVoucherNumber", e.target.value)}
                            />
                        </div>
                    </div>
                }
                {
                    thirdWidget &&
                    <div style={classes.firstWidgetStyle}>
                        <div style={classes.creditCardSecondInputsContainer}>
                            <input
                                key={"Total-3"}

                                style={classes.creditSecondCardInputs}
                                placeholder="Total"
                                value={totalCreditCard}
                                onChange={(e) => { handleTotalCreditCardChange(e.target.value); handleChangeInputs("transactionSum", e.target.value) }}
                                readOnly={isTransacted}
                            />
                        </div>
                        <div style={classes.creditCardSecondInputsContainer}>
                            <div style={{ width: "45%" }}>
                                <GoMakeAutoComplate
                                    key={"transactionType-2"}
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
                                        key={"numberOfPayments-2"}
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
                {(!secondWidget && !isTransacted) && <PrimaryButton variant="contained" style={{ width: "75%", padding: "4px" }} onClick={() => onClickMakePayment(handleSaveAndClose)} >{t('payment.makePayment')}</PrimaryButton>}
                {!isTransacted && <div style={{ display: "flex", flexDirection: "column", width: "75%" }}>
                    {!firstWidget && <SecondaryButton style={classes.creditButtons} onClick={handleFirstButtonClick}>{t('payment.manualCreditCard')}</SecondaryButton>}
                    {!secondWidget && <SecondaryButton style={classes.creditButtons} onClick={handleSecondButtonClick}>{t('payment.creditDetailsWithoutSwipe')}</SecondaryButton>}
                    {!thirdWidget && <SecondaryButton style={classes.creditButtons} onClick={handleThirdButtonClick}>{t('payment.processingViaPinPad')}</SecondaryButton>}
                </div>}
            </div>
            }
        </div>
    );
}
export { CreditCardTab }