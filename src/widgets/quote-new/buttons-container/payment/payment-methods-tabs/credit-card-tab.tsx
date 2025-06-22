import { useStyle } from "../style";
import { usePaymentInputs } from "react-payment-inputs";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeAutoComplate } from "@/components";
import { useEffect } from "react";
import { adaptPaddingRight } from "@/utils/adapter";
import { getItem, setItem } from "@/services/storage-data";
import { error } from "console";
import { Stack } from "@mui/material";

const CreditCardTab = ({
  firstWidget,
  secondWidget,
  thirdWidget,
  setActiveWidget,
  handleFirstButtonClick,
  handleSecondButtonClick,
  handleThirdButtonClick,
  handleSaveAndClose,
  documentItemValue,
}) => {
  const { classes } = useStyle();
  const { getCardNumberProps, getCVCProps } = usePaymentInputs();
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
    handleChooseExistingCard,
    pinPadsOptions,
    dir,
    setCreditCard,
    errors,
    validateCreditCardForm,
    alertFault,
  } = usePaymentMethodsTabs();

  useEffect(() => {
    if (!documentItemValue?.creditCardTotal && !totalCreditCard) {
      if (documentItemValue?.isUsePinPad) {
        /*  Open processing via PinPad method */
        setActiveWidget(false, false, true);
      } else {
        /*  Open manual credit card method */
        setActiveWidget(true, false, false);
      }
    }
  }, [documentItemValue?.isUsePinPad]);

  useEffect(() => {
    handleChangeInputs(
      "customerName",
      documentItemValue?.creditCardContactFirstName
    );
    handleChangeInputs(
      "lastName",
      documentItemValue?.creditCardContactLastName
    );
    handleChangeInputs(
      "phoneNumber",
      documentItemValue?.creditCardContactPhone
    );
    handleChangeInputs(
      "customerEmail",
      documentItemValue?.creditCardContactEmail
    );
    handleChangeInputs("transactionSum", documentItemValue?.creditCardTotal);
  }, [firstWidget, secondWidget, thirdWidget]);

  useEffect(() => {
    const storedPinPadId = getItem("lastUsedPinPadId");
    if (pinPadsOptions && storedPinPadId && !creditCard?.pinPadId) {
      setCreditCard((prev) => ({
        ...prev,
        pinPadId: storedPinPadId,
      }));
    }
  }, [pinPadsOptions]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as "column",
        gap: "10px",
        paddingTop: cardTransactionsOptions.length > 0 ? "0px" : "10px",
      }}
    >
      {cardTransactionsOptions.length > 0 && !isTransacted && (
        <div style={{ width: "75%", alignSelf: "center" }}>
          <GoMakeAutoComplate
            key={"chooseExistingCard-select"}
            value={transactionSelected}
            style={classes.selectInputs}
            options={cardTransactionsOptions}
            placeholder={t("payment.chooseExistingCard")}
            onChange={(e, value) => handleChooseExistingCard(value)}
          />
        </div>
      )}
      {!transactionSelected && (
        <div style={classes.mainContainer}>
          {/* !here first */}
          {firstWidget && (
            <div style={classes.firstWidgetStyle}>
              <div
                style={{
                  ...classes.creditCardInputsContainer,
                  border:
                    errors.cardNumber || errors.cvv || errors.expDate_MMYY
                      ? "1.5px solid red"
                      : classes.creditCardInputsContainer.border,
                }}
              >
                <CreditCardIcon sx={{ color: "#2e3092" }} />
                <input
                  {...getCardNumberProps({ onChange: handleCardNumberChange })}
                  style={{
                    ...classes.creditCardInputs,
                    width: "55%",
                    ...adaptPaddingRight(dir, 5),
                    direction: dir,
                  }}
                  placeholder="Card number"
                  value={creditCard?.cardNumber}
                />
                <input
                  onChange={handleExpiryDateChange}
                  style={{
                    ...classes.creditCardInputs,
                    width: "20%",
                    direction: dir,
                  }}
                  placeholder="MM/YY"
                  value={creditCard?.expDate_MMYY}
                />
                <input
                  {...getCVCProps({ onChange: handleCVVChange })}
                  style={{
                    ...classes.creditCardInputs,
                    width: "20%",
                    direction: dir,
                  }}
                  placeholder="CVV"
                  value={creditCard?.cvv}
                />
              </div>
              <div style={classes.creditCardSecondInputsContainer}>
                <input
                  style={classes.creditSecondCardInputs}
                  placeholder="Id"
                  maxLength={9}
                  value={creditCard?.holderID}
                  onChange={(e) =>
                    handleChangeInputs("holderID", e.target.value)
                  }
                />
                {/* <Stack style={{ width: "45%" }}> */}
                <input
                  key={"Total-1"}
                  style={{
                    ...classes.creditSecondCardInputs,
                    border: errors.transactionSum
                      ? "1.5px solid red"
                      : classes.creditCardInputsContainer.border,
                  }}
                  placeholder="Total"
                  value={totalCreditCard}
                  onChange={(e) => {
                    handleTotalCreditCardChange(e.target.value);
                    handleChangeInputs("transactionSum", e.target.value);
                  }}
                  readOnly={isTransacted}
                  type="number"
                />
                {/* !here new idea */}
                {/* {errors.transactionSum && (
                    <h6 style={{ color: "red" }}>{errors.transactionSum}</h6>
                  )}
                </Stack> */}
              </div>
              <div style={classes.creditCardSecondInputsContainer}>
                <input
                  style={classes.creditSecondCardInputs}
                  placeholder="First name"
                  value={creditCard?.customerName}
                  onChange={(e) =>
                    handleChangeInputs("customerName", e.target.value)
                  }
                />
                <input
                  style={classes.creditSecondCardInputs}
                  placeholder="Last name"
                  value={creditCard?.lastName}
                  onChange={(e) =>
                    handleChangeInputs("lastName", e.target.value)
                  }
                />
              </div>
              <div style={classes.creditCardSecondInputsContainer}>
                <input
                  style={classes.creditSecondCardInputs}
                  placeholder="Phone"
                  value={creditCard?.phoneNumber}
                  onChange={(e) =>
                    handleChangeInputs("phoneNumber", e.target.value)
                  }
                />
                <input
                  style={{
                    ...classes.creditSecondCardInputs,
                    border: errors.customerEmail
                      ? "1.5px solid red"
                      : classes.creditCardInputsContainer.border,
                  }}
                  placeholder="Email"
                  value={creditCard?.customerEmail}
                  onChange={(e) =>
                    handleChangeInputs("customerEmail", e.target.value)
                  }
                />
              </div>
              <div style={classes.creditCardSecondInputsContainer}>
                <div style={{ width: "45%" }}>
                  <GoMakeAutoComplate
                    key={"transactionType"}
                    value={transactionTypes.find(
                      (option) => option.value === creditCard?.transactionType
                    )}
                    style={classes.selectInputs}
                    options={transactionTypes}
                    placeholder={t("payment.transactionType")}
                    onChange={(e, value) =>
                      handleChangeInputs("transactionType", value?.value)
                    }
                  />
                </div>
                {creditCard?.transactionType &&
                  (creditCard?.transactionType === 2 ||
                    creditCard?.transactionType === 6) && (
                    <div style={{ width: "45%" }}>
                      <GoMakeAutoComplate
                        key={"numberOfPayments"}
                        value={creditCard?.numberOfPayments}
                        style={classes.selectInputs}
                        options={numberOfPayments}
                        placeholder={t("payment.numberOfPayments")}
                        onChange={(e, value) =>
                          handleChangeInputs("numberOfPayments", value?.value)
                        }
                      />
                    </div>
                  )}
              </div>
            </div>
          )}
          {secondWidget && (
            <div style={classes.firstWidgetStyle}>
              <div style={classes.creditCardSecondInputsContainer}>
                <input
                  style={classes.creditSecondCardInputs}
                  placeholder="Card number"
                  value={secondCreditCard?.creditCardNum}
                  onChange={(e) =>
                    handleChangeCreditCardInputs(
                      "creditCardNum",
                      e.target.value
                    )
                  }
                />
                <input
                  style={classes.creditSecondCardInputs}
                  placeholder="MM/YY"
                  value={secondCreditCard?.creditCardExpDate}
                  onChange={(e) =>
                    handleChangeCreditCardInputs(
                      "creditCardExpDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div style={classes.creditCardSecondInputsContainer}>
                <input
                  key={"Total-2"}
                  style={classes.creditSecondCardInputs}
                  placeholder="Total"
                  value={totalCreditCard}
                  onChange={(e) => {
                    handleTotalCreditCardChange(e.target.value);
                    handleChangeCreditCardInputs(
                      "creditCardSum",
                      e.target.value
                    );
                  }}
                  readOnly={isTransacted}
                />
                <input
                  style={classes.creditSecondCardInputs}
                  placeholder="Voucher number"
                  value={secondCreditCard?.creditCardVoucherNumber}
                  onChange={(e) =>
                    handleChangeCreditCardInputs(
                      "creditCardVoucherNumber",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          )}
          {/* !here second */}
          {thirdWidget && (
            <div style={classes.firstWidgetStyle}>
              <div style={classes.creditCardSecondInputsContainer}>
                <GoMakeAutoComplate
                  key={creditCard?.pinPadId || "Select a PIN pad"}
                  style={classes.selectInputs}
                  placeholder={t("payment.selectPinPad")}
                  options={pinPadsOptions}
                  value={pinPadsOptions?.find(
                    (option) => option.value === creditCard?.pinPadId
                  )}
                  onChange={(e, value) => {
                    const selectedValue = value?.value;
                    if (selectedValue) {
                      setItem("lastUsedPinPadId", selectedValue);
                    }
                    handleChangeInputs("pinPadId", selectedValue);
                  }}
                />
                <input
                  key={"Total-3"}
                  style={{
                    ...classes.creditSecondCardInputs,
                    width: "100%",
                    border: errors.transactionSumSec
                      ? "1.5px solid red"
                      : classes.creditSecondCardInputs.border,
                  }}
                  placeholder="Total"
                  value={totalCreditCard}
                  onChange={(e) => {
                    handleTotalCreditCardChange(e.target.value);
                    handleChangeInputs("transactionSum", e.target.value);
                  }}
                  readOnly={isTransacted}
                />
              </div>
              <div style={classes.creditCardSecondInputsContainer}>
                <div style={{ width: "45%" }}>
                  <GoMakeAutoComplate
                    key={"transactionType-2"}
                    value={transactionTypes.find(
                      (option) => option.value === creditCard?.transactionType
                    )}
                    style={classes.selectInputs}
                    options={transactionTypes}
                    placeholder={t("payment.transactionType")}
                    onChange={(e, value) =>
                      handleChangeInputs("transactionType", value?.value)
                    }
                  />
                </div>
                {creditCard?.transactionType &&
                  (creditCard?.transactionType === 2 ||
                    creditCard?.transactionType === 6) && (
                    <div style={{ width: "45%" }}>
                      <GoMakeAutoComplate
                        key={"numberOfPayments-2"}
                        value={creditCard?.numberOfPayments}
                        style={classes.selectInputs}
                        options={numberOfPayments}
                        placeholder={t("payment.numberOfPayments")}
                        onChange={(e, value) =>
                          handleChangeInputs("numberOfPayments", value?.value)
                        }
                      />
                    </div>
                  )}
              </div>
            </div>
          )}
          {!secondWidget && (
            <PrimaryButton
              variant="contained"
              style={{ width: "75%", padding: "4px" }}
              onClick={() => {
                onClickMakePayment(handleSaveAndClose, thirdWidget);
              }}
            >
              {t("payment.makePayment")}
            </PrimaryButton>
          )}
          <div
            style={{ display: "flex", flexDirection: "column", width: "75%" }}
          >
            {!firstWidget && (
              <SecondaryButton
                style={classes.creditButtons}
                onClick={handleFirstButtonClick}
              >
                {t("payment.manualCreditCard")}
              </SecondaryButton>
            )}
            {!secondWidget && (
              <SecondaryButton
                style={classes.creditButtons}
                onClick={handleSecondButtonClick}
              >
                {t("payment.creditDetailsWithoutSwipe")}
              </SecondaryButton>
            )}
            {!thirdWidget && documentItemValue?.isUsePinPad && (
              <SecondaryButton
                style={classes.creditButtons}
                onClick={handleThirdButtonClick}
              >
                {t("payment.processingViaPinPad")}
              </SecondaryButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export { CreditCardTab };
