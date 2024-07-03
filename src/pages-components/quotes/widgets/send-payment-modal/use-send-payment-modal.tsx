import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { StatePayment, sendPaymentState } from "./states";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { CopyPrePaymentLinkApi, sendPrePaymentToClientApi } from "@/services/api-service/pay/pay-api";
import { DOCUMENT_TYPE } from "../../enums";
import { useDateFormat } from "@/hooks/use-date-format";

const useSendPaymentModal = () => {
    const { t } = useTranslation();
    const [payState, setPayState] = useRecoilState<StatePayment>(sendPaymentState);
    const { callApi } = useGomakeAxios();
    const { alertSuccess, alertFault, alertFaultGetData } = useSnackBar();
    const { GetDateWithoutHoursFormat } = useDateFormat();

    const onChangePaymentInputs = (key, value) => {
        if (key === "contactName" || key === "contactPhone" || key === "contactMail") {
            setPayState((prev) => ({
                ...prev,
                documentContacts: prev.documentContacts.map((contact, index) =>
                    index === prev.selectedContactIndex ? { ...contact, [key]: value } : contact
                ),
            }));
        }
        else if (key === "documentContacts") {
            const selectedIndex = payState?.documentContacts.findIndex(contact => contact.id === value);
            setPayState((prev) => ({
                ...prev,
                selectedContactIndex: selectedIndex,
            }));
        } else {
            setPayState((prev) => ({
                ...prev,
                [key]: value,
            }));
        }
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
            price: payState?.percentageOfTotal / 100 * payState?.totalPayment,
            maxPayments: payState.numberOfInstallments,
            invoiceDateStr: GetDateWithoutHoursFormat(payState.invoiceDate),
            contactName: payState.documentContacts[payState.selectedContactIndex]?.contactName || '',
            contactPhone: payState.documentContacts[payState.selectedContactIndex]?.contactPhone || '',
            contactMail: payState.documentContacts[payState.selectedContactIndex]?.contactMail || '',
            sendByMail: payState.sendByMail,
            sendBySms: payState.sendBySms,
            sendByWhatsapp: payState.sendByWhatsapp
        };
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
            price: payState?.percentageOfTotal / 100 * payState?.totalPayment,
            maxPayments: payState.numberOfInstallments,
            invoiceDateStr: GetDateWithoutHoursFormat(payState.invoiceDate),
            contactName: payState.documentContacts[payState.selectedContactIndex]?.contactName || '',
            contactPhone: payState.documentContacts[payState.selectedContactIndex]?.contactPhone || '',
            contactMail: payState.documentContacts[payState.selectedContactIndex]?.contactMail || '',
            sendByMail: payState.sendByMail,
            sendBySms: payState.sendBySms,
            sendByWhatsapp: payState.sendByWhatsapp
        };
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