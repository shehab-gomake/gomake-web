import { quoteConfirmationState } from "@/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { usePaymentInputs } from "react-payment-inputs";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  createDebitsPaymentTransactionApi,
  createPaymentTransactionApi,
} from "@/services/api-service/pay/pay-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface PaymentDetails {
  documentID: string;
  clientID: string;
  paymentRequestId: string;
  cardNumber: string;
  cvv: string;
  expDate_MMYY: string;
  transactionSum: number;
  numberOfPayments: number;
  transactionType?: number;
  holderID: string;
  customerName?: string;
  customerEmail?: string;
  phoneNumber?: string;
  itemDescription?: string;
  documentType?: DOCUMENT_TYPE;
  terminalNumber?: string;
  password?: string;
  creditType?: number;
  firstPaymentSum?: number;
  otherPaymentsSum?: number;
  currencyType?: number;
  j?: number;
  isCustomerPresent?: boolean;
}

interface IProps {
  documentType?: DOCUMENT_TYPE;
  isDebtPayments?: boolean;
}

const useCreditCardPaySection = ({
  documentType,
  isDebtPayments = false,
}: IProps = {}) => {
  const { t } = useTranslation();
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const { alertSuccess, alertFault, alertRequiredFields } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const initialPaymentDetails: PaymentDetails = {
    documentID: "",
    clientID: "",
    paymentRequestId: "",
    cardNumber: "",
    cvv: "",
    expDate_MMYY: "",
    holderID: "",
    transactionSum: 0,
    transactionType: 1,
    numberOfPayments: quoteConfirm?.maxPayments || 0,
  };

  const { getCardNumberProps, getExpiryDateProps, getCVCProps } =
    usePaymentInputs();
  const [paymentDetailsState, setPaymentDetails] = useState<PaymentDetails>(
    initialPaymentDetails
  );
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const transactionTypes = [
    { label: t("payment.regular"), value: 1 },
    { label: t("payment.installments"), value: 2 },
  ];

  const numberOfPayments = Array.from(
    {
      length:
        (isDebtPayments
          ? quoteConfirm?.maxInstallments
          : quoteConfirm?.maxPayments) ?? 13,
    },
    (_, index) => ({
      label: index + 1,
      value: index + 1,
    })
  );

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
    setPaymentDetails((prev) => {
      if (key === "transactionType" && value === 1) {
        return {
          ...prev,
          [key]: value,
          numberOfPayments: 1,
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleProceedCheckout = async () => {
    const { expDate_MMYY, cvv, cardNumber, holderID } = paymentDetailsState;
    if (!expDate_MMYY || !cvv || !cardNumber) {
      alertRequiredFields();
      return;
    }

    // Validate holderID has more than 9 digits
    if (holderID && holderID !== "") {
      const digitCount = (holderID.match(/\d/g) || []).length;
      if (digitCount !== 9) {
        alertFault("Holder ID must contain equal to 9 numbers");
        return;
      }
    }

    const selectedDebtsToPay =
      quoteConfirm?.debtsToPay?.filter((item) => item.isChecked) || [];

    const finalPaymentDetailsState = {
      ...paymentDetailsState,
      ...(!isDebtPayments && { documentID: quoteConfirm?.id }),
      documentType: documentType,
      paymentRequestId: quoteConfirm?.paymentRequestId,
      clientID: quoteConfirm?.customerID,
      ...(isDebtPayments && { debtsItems: selectedDebtsToPay }),
    };

    const callBack = (res) => {
      if (res?.success) {
        alertSuccess(t("prePayment.paymentComplete"));
        setIsPaymentSuccess(true);
      } else {
        alertFault(t("prePayment.paymentFailed"));
      }
    };

    if (isDebtPayments) {
      await createDebitsPaymentTransactionApi(
        callApi,
        callBack,
        finalPaymentDetailsState
      );
    } else {
      await createPaymentTransactionApi(
        callApi,
        callBack,
        finalPaymentDetailsState
      );
    }
  };

  return {
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
    handleProceedCheckout,
    isPaymentSuccess,
  };
};

export { useCreditCardPaySection };
