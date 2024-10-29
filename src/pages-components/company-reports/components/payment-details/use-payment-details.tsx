import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePaymentInputs } from "react-payment-inputs";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { PaymentDetails } from "../types/interfaces";
import { savePrintHousePaymentDetailsApi } from "@/services/api-service/profiles/company-profile-api";

const usePaymentDetailsModal = ({ selectedPrintHouse, getReport }) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const { getCardNumberProps, getExpiryDateProps, getCVCProps } =
    usePaymentInputs();

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const initialPaymentDetails: PaymentDetails = {
    printHouseId: selectedPrintHouse?.id || "",
    cardNumber:
      selectedPrintHouse?.printHouseCreditCardDetails?.cardNumber || "",
    cvv: selectedPrintHouse?.printHouseCreditCardDetails?.cvv || "",
    expDate_MMYY:
      selectedPrintHouse?.printHouseCreditCardDetails?.expDate_MMYY || "",
    transactionSum:
      selectedPrintHouse?.printHouseCreditCardDetails?.transactionSum || "",
    customerEmail:
      selectedPrintHouse?.printHouseCreditCardDetails?.customerEmail || "",
    phoneNumber:
      selectedPrintHouse?.printHouseCreditCardDetails?.phoneNumber || "",
    holderID: selectedPrintHouse?.printHouseCreditCardDetails?.holderID || "",
    customerName:
      selectedPrintHouse?.printHouseCreditCardDetails?.customerName || "",
    dayOfPayment:
      selectedPrintHouse?.printHouseCreditCardDetails?.dayOfPayment || 1,
    isMonthlyPayment:
      selectedPrintHouse?.printHouseCreditCardDetails?.isMonthlyPayment ||
      false,
  };

  const [paymentDetailsState, setPaymentDetails] = useState<PaymentDetails>(
    initialPaymentDetails
  );

  useEffect(() => {
    setPaymentDetails(initialPaymentDetails);
  }, [selectedPrintHouse]);

  const handleCardNumberChange = (e) => {
    const formattedInput = e.target.value.replace(/\D/g, "");
    if (formattedInput.length <= 16) {
      setPaymentDetails({
        ...paymentDetailsState,
        cardNumber: formattedInput,
      });
    }
  };

  const handleExpiryDateChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");

    if (input.length > 4) {
      input = input.slice(0, 4);
    }

    if (input.length > 2) {
      input = `${input.slice(0, 2)}/${input.slice(2)}`;
    }

    setPaymentDetails({
      ...paymentDetailsState,
      expDate_MMYY: input,
    });
  };

  const handleCVVChange = (e) => {
    const formattedInput = e.target.value.replace(/\D/g, "");
    if (formattedInput.length <= 3) {
      setPaymentDetails({
        ...paymentDetailsState,
        cvv: formattedInput,
      });
    }
  };

  const handleChangeInputs = (key, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProceedCheckout = async () => {
    const finalPaymentDetailsState = {
      ...paymentDetailsState,
      printHouseId: selectedPrintHouse?.id,
    };
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getReport();
      } else {
        alertFaultUpdate();
      }
    };
    await savePrintHousePaymentDetailsApi(
      callApi,
      callBack,
      finalPaymentDetailsState
    );
  };

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeInputs("isMonthlyPayment", event.target.checked);
  };

  return {
    t,
    selectedPrintHouse,
    paymentDetailsState,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    handleChangeInputs,
    handleCardNumberChange,
    handleCVVChange,
    handleExpiryDateChange,
    handleProceedCheckout,
    daysInMonth,
    handleChecked,
  };
};

export { usePaymentDetailsModal };
