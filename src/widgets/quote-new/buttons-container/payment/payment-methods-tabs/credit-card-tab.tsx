import { useStyle } from "../style";
import { usePaymentInputs } from "react-payment-inputs";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import { CSSProperties, useEffect } from "react";
import { adaptPaddingRight } from "@/utils/adapter";
import { getItem, setItem } from "@/services/storage-data";
import { error } from "console";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ModalType } from "@/enums";

interface FormErrorMessageProps {
  error?: string;
  style?: CSSProperties;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  error,
  style,
}) => {
  const { t } = useTranslation();
  if (!error) return null;

  return (
    <div
      style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", ...style }}
    >
      {t(error)}
    </div>
  );
};

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

    alertExistTransactionModal,
    existingTransactionId,
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
          {firstWidget && (
            <div style={classes.firstWidgetStyle}>
              <div style={{ width: "75%" }}>
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
                    {...getCardNumberProps({
                      onChange: handleCardNumberChange,
                    })}
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

                {(errors.cardNumber || errors.expDate_MMYY || errors.cvv) && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                      paddingLeft: "30px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <FormErrorMessage
                      error={errors.cardNumber}
                      style={{ width: "55%" }}
                    />
                    <FormErrorMessage
                      error={errors.expDate_MMYY}
                      style={{ width: "30%" }}
                    />
                    <FormErrorMessage
                      error={errors.cvv}
                      style={{ width: "20%" }}
                    />
                  </div>
                )}
              </div>
              <div style={classes.creditCardSecondInputsContainer}>
                <Stack style={{ width: "45%" }}>
                  <input
                    style={classes.creditSecondCardInputs}
                    placeholder="Id"
                    maxLength={9}
                    value={creditCard?.holderID}
                    onChange={(e) =>
                      handleChangeInputs("holderID", e.target.value)
                    }
                  />
                  <FormErrorMessage error={errors.holderID} />
                </Stack>
                <Stack style={{ width: "45%" }}>
                  <input
                    key={"Total-1"}
                    style={{
                      ...classes.creditSecondCardInputs,
                      border: errors.transactionSum
                        ? "1.5px solid red"
                        : classes.creditCardInputsContainer.border,
                      width: "100%",
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
                  <FormErrorMessage error={errors.transactionSum} />
                </Stack>
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
          {thirdWidget && (
            <div style={classes.firstWidgetStyle}>
              <div style={classes.creditCardSecondInputsContainer}>
                <GoMakeAutoComplate
                  key={creditCard?.pinPadId || "Select a PIN pad"}
                  style={{ ...classes.selectInputs, width: "45%" }}
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
                <Stack style={{ width: "45%" }}>
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
                  <FormErrorMessage error={errors.transactionSumSec} />
                </Stack>
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
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("payment.existingTransactionMessageError")}
        subTitle={" "}
        yesBtn={t("payment.makeNewPayment")}
        openModal={alertExistTransactionModal.isOpen}
        onClose={() => {
          handleSaveAndClose({
            creditCardTransactionID: existingTransactionId,
            creditCardSum: totalCreditCard,
          });
          alertExistTransactionModal.close();
        }}
        onClickDelete={() => {
          onClickMakePayment(handleSaveAndClose, thirdWidget, true);
        }}
      />
    </div>
  );
};
export { CreditCardTab };
