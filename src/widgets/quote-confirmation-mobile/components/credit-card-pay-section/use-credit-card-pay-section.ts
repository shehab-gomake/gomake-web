import { quoteConfirmationState } from "@/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { usePaymentInputs } from 'react-payment-inputs';


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
    documentType: number;
    terminalNumber?: string;
    password?: string;
    creditType: number;
    firstPaymentSum?: number;
    otherPaymentsSum?: number;
    currencyType?: number;
    j?: number;
    isCustomerPresent?: boolean;
}

const useCreditCardPaySection = () => {
    const { t } = useTranslation();
    const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
    const initialPaymentDetails: PaymentDetails = {
        documentID: '',
        clientID: '',
        paymentRequestId: '',
        cardNumber: '',
        cvv: '',
        expDate_MMYY: '',
        transactionSum: 0,
        numberOfPayments: 0,
        holderID: '',
        customerName: '',
        customerEmail: '',
        phoneNumber: '',
        itemDescription: '',
        documentType: 1,
        terminalNumber: '',
        password: '',
        creditType: 1,
    };

    const { getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();
    const [paymentDetailsState, setPaymentDetails] = useState<PaymentDetails>(initialPaymentDetails);

    const transactionTypes = [
        { label: t("payment.regular"), value: 1 },
        { label: t("payment.installments"), value: 2 }
    ];

    const numberOfPayments = Array.from({ length: 13 }, (_, index) => ({
        label: index + 1,
        value: index + 1,
    }));

    // the length is depend on what i get from the modal "maxPayments"
    const numberOfPaymentsNEW = Array.from({ length: 13 }, (_, index) => ({
        label: index + 1,
        value: index + 1,
    }));

    const handleCardNumberChange = (e) => {
        const formattedInput = e.target.value.replace(/\D/g, '');
        if (formattedInput.length <= 16) {
            setPaymentDetails({
                ...paymentDetailsState,
                cardNumber: formattedInput
            });
        }
    };

    const handleExpiryDateChange = (e) => {
        const formattedInput = e.target.value.replace(/\D/g, '');
        if (formattedInput.length <= 4) {
            setPaymentDetails({
                ...paymentDetailsState,
                expDate_MMYY: formattedInput
            });
        }
    };

    const handleCVVChange = (e) => {
        const formattedInput = e.target.value.replace(/\D/g, '');
        if (formattedInput.length <= 3) {
            setPaymentDetails({
                ...paymentDetailsState,
                cvv: formattedInput
            });
        }
    };

    const handleChangeInputs = (key, value) => {
        setPaymentDetails((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

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
        handleExpiryDateChange
    };

};

export { useCreditCardPaySection };