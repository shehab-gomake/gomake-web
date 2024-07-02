import { useTranslation } from "react-i18next";
import { useRecoilState, useResetRecoilState } from "recoil";
import { StatePayment, sendPaymentState } from "./states";

const useSendPaymentModal = () => {
    const { t } = useTranslation();
    const [newState, setNewState] = useRecoilState<StatePayment>(sendPaymentState);
    const resetSendPaymentState = useResetRecoilState(sendPaymentState);

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
        const paymentLink = "http://localhost:3002/pre-payment?RecordId=test";
        copyToClipboard(paymentLink);
    };

    return {
        t,
        newState,
        setNewState,
        handleCopyPaymentLink,
        handleCheckBoxChange,
        onChangePaymentInputs,
        resetSendPaymentState
    };
};

export { useSendPaymentModal };