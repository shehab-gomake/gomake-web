import { useState } from "react";
import { useTranslation } from "react-i18next";

const useSendPaymentModal = () => {
    const { t } = useTranslation();
    const [newState, setNewState] = useState({
        bySMS: true, 
        byMail: true, 
        percentageOfTotal:100,
        numberOfInstallments:1
    });
    const onChangePaymentInputs = (key, value) => {
        setNewState((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const handleCheckBoxChange = (key, checked) => {
        onChangePaymentInputs(key, checked);
    };

    const copyToClipboard = (text) => {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
    };

    const handleCopyPaymentLink = () => {
        const paymentLink = "https://web.dev.gomake.net/quote-confirmation?Id=test";
        copyToClipboard(paymentLink);
    };

    return {
        t,
        newState,
        setNewState,
        handleCopyPaymentLink,
        handleCheckBoxChange,
        onChangePaymentInputs
    };
};

export { useSendPaymentModal };
