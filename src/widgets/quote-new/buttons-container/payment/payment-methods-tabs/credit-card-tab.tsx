import { useStyle } from "../style";
import { usePaymentInputs } from 'react-payment-inputs';
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { SecondaryButton } from "@/components/button/secondary-button";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeAutoComplate } from "@/components";
import { useState } from "react";

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
        handleCardIdChange,
    } = usePaymentMethodsTabs();

    const values = [{ label: t("payment.regular"), value: 1 }, { label: t("payment.installments"), value: 2 }];
    const numberOfPayments = Array.from({ length: 13 }, (_, index) => ({
        label: index + 1,
        value: index + 1,
    }));


    const [selectedTransactionType, setSelectedTransactionType] = useState(null);

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
                            placeholder="Card number" />
                        <input
                            {...getExpiryDateProps({ onChange: handleExpiryDateChange })}
                            style={{ ...classes.creditCardInputs, width: "20%" }}
                            placeholder="MM/YY" />
                        <input
                            {...getCVCProps({ onChange: handleCVVChange })}
                            style={{ ...classes.creditCardInputs, width: "20%" }}
                            placeholder="CVV" />
                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <input
                            onChange={handleCardIdChange}
                            style={classes.creditSecondCardInputs}
                            placeholder="Id"
                            maxLength={9} />
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Total"
                        />
                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <input
                            onChange={handleCardIdChange}
                            style={classes.creditSecondCardInputs}
                            placeholder="First name"
                        />
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Last name"
                        />
                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <input
                            onChange={handleCardIdChange}
                            style={classes.creditSecondCardInputs}
                            placeholder="Phone"
                        />
                        <input
                            style={classes.creditSecondCardInputs}
                            placeholder="Email"
                        />
                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <div style={{ width: "45%" }}>
                            <GoMakeAutoComplate
                                value={selectedTransactionType}
                                style={classes.selectInputs}
                                options={values}
                                placeholder={t("payment.transactionType")}
                                onChange={(e, value) => {
                                    setSelectedTransactionType(value);
                                }}
                            />
                        </div>
                        {selectedTransactionType && selectedTransactionType.value === 2 && (
                            <div style={{ width: "45%" }}>
                                <GoMakeAutoComplate
                                    style={classes.selectInputs}
                                    options={numberOfPayments}
                                    placeholder={t("payment.numberOfPayments")}
                                    onChange={() => alert("ge")}
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
                        />

                    </div>
                    <div style={classes.creditCardSecondInputsContainer}>
                        <div style={{ width: "45%" }}>
                            <GoMakeAutoComplate
                                value={selectedTransactionType}
                                style={classes.selectInputs}
                                options={values}
                                placeholder={t("payment.transactionType")}
                                onChange={(e, value) => {
                                    setSelectedTransactionType(value);
                                }}
                            />
                        </div>
                        {selectedTransactionType && selectedTransactionType.value === 2 && (
                            <div style={{ width: "45%" }}>
                                <GoMakeAutoComplate
                                    style={classes.selectInputs}
                                    options={numberOfPayments}
                                    placeholder={t("payment.numberOfPayments")}
                                    onChange={() => alert("ge")}
                                />
                            </div>
                        )}
                    </div>
                </div>
            }

            <PrimaryButton variant="contained" style={{ width: "75%", padding: "4px" }} >{t('payment.makePayment')}</PrimaryButton>
            <div style={{ display: "flex", flexDirection: "column", width: "75%" }}>
                {!firstWidget && <SecondaryButton style={classes.creditButtons} onClick={handleFirstButtonClick}>{t('payment.manualCreditCard')}</SecondaryButton>}
                {!secondWidget && <SecondaryButton style={classes.creditButtons} onClick={handleSecondButtonClick}>{t('payment.creditDetailsWithoutSwipe')}</SecondaryButton>}
                {!thirdWidget && <SecondaryButton style={classes.creditButtons} onClick={handleThirdButtonClick}>{t('payment.processingViaPinPad')}</SecondaryButton>}
            </div>
        </div>
    );
}
export { CreditCardTab }