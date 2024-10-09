import CreditCardIcon from "@mui/icons-material/CreditCard";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { useStyle } from "./style";
import { usePaymentDetailsModal } from "./use-payment-details";
import { Stack } from "@mui/material";
import { PhoneInputComponent } from "@/components/form-inputs/phone-input";
import { SecondaryCheckBox } from "@/components/check-box/secondary-check-box";
import { useState } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const PaymentDetailsModal = ({
  openModal,
  onClose,
  selectedPrintHouse,
  getReport,
}: any) => {
  const { classes } = useStyle();
  const {
    t,
    daysInMonth,
    paymentDetailsState,
    getCardNumberProps,
    getCVCProps,
    handleChangeInputs,
    handleCardNumberChange,
    handleCVVChange,
    handleExpiryDateChange,
    handleProceedCheckout,
    handleChecked,
  } = usePaymentDetailsModal({ selectedPrintHouse, getReport });

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={t("payment.paymentDetails")}
      insideStyle={classes.modalStyle}
    >
      <div style={classes.mainContainer}>
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
        <Stack direction={"row"} width={"80%"} gap={"10px"}>
          <input
            style={classes.creditSecondCardInputs}
            placeholder={t("Name")}
            value={paymentDetailsState?.customerName}
            onChange={(e) => handleChangeInputs("customerName", e.target.value)}
          />
          <input
            style={classes.creditSecondCardInputs}
            placeholder={t("partners.headers.id")}
            value={paymentDetailsState?.holderID}
            onChange={(e) => handleChangeInputs("holderID", e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} width={"80%"} gap={"10px"}>
          <input
            style={classes.creditSecondCardInputs}
            placeholder={t("Email")}
            value={paymentDetailsState?.customerEmail}
            onChange={(e) =>
              handleChangeInputs("customerEmail", e.target.value)
            }
          />
          <div style={classes.creditSecondCardInputs}>
            <PhoneInputComponent
              onChange={(value) => handleChangeInputs("phoneNumber", value)}
              value={paymentDetailsState?.phoneNumber}
              customStyle={{
                height: "30px",
                padding: "0px",
              }}
            />
          </div>
        </Stack>
        <Stack direction={"row"} width={"80%"} gap={"10px"}>
          <GoMakeAutoComplate
            value={paymentDetailsState?.dayOfPayment}
            style={classes.selectInputs}
            options={daysInMonth}
            placeholder={t("Day of month")}
            onChange={(e, value) => handleChangeInputs("dayOfPayment", value)}
          />
          <input
            style={classes.creditSecondCardInputs}
            placeholder={t("sales.quote.total")}
            value={paymentDetailsState?.transactionSum}
            onChange={(e) =>
              handleChangeInputs("transactionSum", e.target.value)
            }
          />
        </Stack>
        <div style={{ ...FONT_FAMILY.Lexend(500, 14) }}>
          <SecondaryCheckBox
            sx={{ padding: "2px" }}
            checked={paymentDetailsState?.isMonthlyPayment}
            onChange={handleChecked}
          />
          {t("Monthly Payment")}
        </div>
        <PrimaryButton
          onClick={() => {
            handleProceedCheckout();
            onClose();
          }}
          variant="contained"
          style={classes.btnStyle}
        >
          {selectedPrintHouse?.printHouseCreditCardDetails
            ? t("Save")
            : t("Add")}
        </PrimaryButton>
      </div>
    </GoMakeModal>
  );
};
export { PaymentDetailsModal };
