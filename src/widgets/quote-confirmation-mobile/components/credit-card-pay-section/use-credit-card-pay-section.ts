import { quoteConfirmationState } from "@/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { usePaymentInputs } from 'react-payment-inputs';
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { createPaymentTransactionApi } from "@/services/api-service/pay/pay-api";
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

const useCreditCardPaySection = () => {
    const { t } = useTranslation();
    const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
    const { alertSuccess, alertFault } = useSnackBar();
    const { callApi } = useGomakeAxios();
    const initialPaymentDetails: PaymentDetails = {
        documentID: '',
        clientID: '',
        paymentRequestId: '',
        cardNumber: '',
        cvv: '',
        expDate_MMYY: '',
        holderID: '',
        transactionSum: 0,
        transactionType:1,
        numberOfPayments:quoteConfirm?.maxPayments || 0 
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

    // const numberOfPayments = Array.from({ length: quoteConfirm?.maxPayments }, (_, index) => ({
    //     label: index + 1,
    //     value: index + 1,
    // }));

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
        let input = e.target.value.replace(/\D/g, ''); 
    
        if (input.length > 4) {
            input = input.slice(0, 4);
        }
    
        if (input.length > 2) {
            input = `${input.slice(0, 2)}/${input.slice(2)}`; 
        }
    
        setPaymentDetails({
            ...paymentDetailsState,
            expDate_MMYY: input
        });
    };
    
    const handleExpiryDateCshange = (e) => {
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

    const handleProceedCheckout = async () => {
        const finalPaymentDetailsState = {
            ...paymentDetailsState,
            documentID: quoteConfirm?.id,
            documentType : DOCUMENT_TYPE.order,
            paymentRequestId:quoteConfirm?.paymentRequestId,
            clientID: quoteConfirm?.customerID
        };

        const callBack = (res) => {
            if (res?.success) {
                alertSuccess(t("prePayment.paymentComplete"))
            } else {
                alertFault(t("prePayment.paymentFailed"))
            }
        }
        await createPaymentTransactionApi(callApi, callBack, finalPaymentDetailsState)
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
        handleExpiryDateChange,
        handleProceedCheckout,
        
    };

};

export { useCreditCardPaySection };