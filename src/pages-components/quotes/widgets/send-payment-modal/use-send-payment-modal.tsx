import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { StatePayment, sendPaymentState } from "./states";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { CopyPrePaymentLinkApi, sendPrePaymentToClientApi } from "@/services/api-service/pay/pay-api";
import { DOCUMENT_TYPE } from "../../enums";
import { useDateFormat } from "@/hooks/use-date-format";
import { useEffect, useState } from "react";

const useSendPaymentModal = ({openPaymentModal}) => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertSuccess, alertFault } = useSnackBar();
    const { GetDateWithoutHoursFormat } = useDateFormat();
    const [payState, setPayState] = useRecoilState<StatePayment>(sendPaymentState);
    const [originalTotalPayment, setOriginalTotalPayment] = useState(payState.totalPayment);

    useEffect(() => {
        if ( payState.totalPayment) {
            setOriginalTotalPayment(payState.totalPayment);
        }
    }, [openPaymentModal]); 

    const formatFloatValue = (value, decimals) => {
        const parsedValue = parseFloat(value);
        return isNaN(parsedValue) ? '' : parsedValue.toFixed(decimals);
      };

    const onChangePaymentInputs = (key, value) => {
        setPayState((prev) => {
            let newState = { ...prev };
            if (key === "percentageOfTotal") {
                const percentage = value || 0;
                const totalToPay = (percentage / 100) * originalTotalPayment;
                newState = {
                    ...prev,
                    percentageOfTotal: percentage,
                    totalPayment: Number(formatFloatValue(totalToPay, 3))
                };
            } else if (key === "totalPayment") {
                const totalToPay = value || 0;
                const percentage = (totalToPay / originalTotalPayment) * 100;
                newState = {
                    ...prev,
                    totalPayment: totalToPay,
                    percentageOfTotal: Number(formatFloatValue(percentage, 3))
                };
            } else if (key === "contactName" || key === "contactPhone" || key === "contactMail") {
                newState.documentContacts = prev.documentContacts.map((contact, index) =>
                    index === prev.selectedContactIndex ? { ...contact, [key]: value } : contact
                );
            } else if (key === "documentContacts") {
                const selectedIndex = prev.documentContacts.findIndex(contact => contact.id === value);
                newState.selectedContactIndex = selectedIndex;
            } else {
                newState[key] = value;
            }
            return newState;
        });
    };

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

    const handleCopyPaymentLink = async () => {
        const dataToSend = {
            documentId: payState.documentId,
            price: payState?.totalPayment,
            maxPayments: payState.numberOfInstallments,
            invoiceDateStr: GetDateWithoutHoursFormat(payState.invoiceDate),
            contactName: payState.documentContacts[payState.selectedContactIndex]?.contactName || '',
            contactPhone: payState.documentContacts[payState.selectedContactIndex]?.contactPhone || '',
            contactMail: payState.documentContacts[payState.selectedContactIndex]?.contactMail || '',
            sendByMail: payState.sendByMail,
            sendBySms: payState.sendBySms,
            sendByWhatsapp: payState.sendByWhatsapp
        };

        if (payState.totalPayment === 0) {
            alertFault(t("alerts.totalPaymentZero"));
            return;
        }
        
        const callBack = (res) => {
            if (res?.success) {
                const paymentLink = res?.data;
                copyToClipboard(paymentLink);
                alertSuccess(t("alerts.linkSuccessfullyCopied"))
            } else {
                alertFault(t("alerts.linkCopyFailed"))
            }
        }
        await CopyPrePaymentLinkApi(callApi, callBack, { documentType: DOCUMENT_TYPE.order, data: dataToSend })
    }

    const handleSendPaymentPage = async () => {
        const dataToSend = {
            documentId: payState.documentId,
            price: payState?.totalPayment,
            maxPayments: payState.numberOfInstallments,
            invoiceDateStr: GetDateWithoutHoursFormat(payState.invoiceDate),
            contactName: payState.documentContacts[payState.selectedContactIndex]?.contactName || '',
            contactPhone: payState.documentContacts[payState.selectedContactIndex]?.contactPhone || '',
            contactMail: payState.documentContacts[payState.selectedContactIndex]?.contactMail || '',
            sendByMail: payState.sendByMail,
            sendBySms: payState.sendBySms,
            sendByWhatsapp: payState.sendByWhatsapp
        };
        if (payState.totalPayment === 0) {
            alertFault(t("alerts.totalPaymentZero"));
            return;
        }
        if (payState.sendByMail && !payState.documentContacts[payState.selectedContactIndex]?.contactMail) {
            alertFault(t("alerts.noMail"));
            return;
        }
        if ((payState.sendBySms || payState.sendByWhatsapp) && !payState.documentContacts[payState.selectedContactIndex]?.contactPhone) {
            alertFault(t("alerts.noPhoneNumber"));
            return;
        }
        if (!payState.sendBySms && !payState.sendByWhatsapp && !payState.sendByMail) {
            alertFault(t("alerts.checkAtLeastOne"));
            return;
        }
        const callBack = (res) => {
            if (res?.success) {
                alertSuccess(t("alerts.sendSucceeded"))
            } else {
                alertFault(t("alerts.sendFailed"))
            }
        }
        await sendPrePaymentToClientApi(callApi, callBack, { documentType: DOCUMENT_TYPE.order, data: dataToSend })
    }

    return {
        t,
        payState,
        setPayState,
        handleCopyPaymentLink,
        handleCheckBoxChange,
        onChangePaymentInputs,
        handleSendPaymentPage
    };
};

export { useSendPaymentModal };