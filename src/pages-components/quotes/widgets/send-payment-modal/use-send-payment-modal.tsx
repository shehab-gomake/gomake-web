import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { StatePayment, sendPaymentState } from "./states";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  CopyPrePaymentLinkApi,
  sendPrePaymentToClientApi,
} from "@/services/api-service/pay/pay-api";
import { DOCUMENT_TYPE } from "../../enums";
import { useDateFormat } from "@/hooks/use-date-format";
import { useEffect, useState } from "react";
import { emailRegex } from "@/utils/regex";

const useSendPaymentModal = ({ openPaymentModal, documentType }) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccess, alertFault } = useSnackBar();
  const { formatISODateTime } = useDateFormat();
  const [payState, setPayState] =
    useRecoilState<StatePayment>(sendPaymentState);
  const [originalTotalPayment, setOriginalTotalPayment] = useState(
    payState.totalPayment
  );

  useEffect(() => {
    if (payState.totalPayment) {
      setOriginalTotalPayment(payState.totalPayment);
    }
  }, [openPaymentModal]);

  // CRITICAL: Sync contact fields when modal opens and contacts are available
  useEffect(() => {
    if (openPaymentModal && payState.documentContacts && payState.documentContacts.length > 0) {
      const contactIndex =
        payState.selectedContactIndex !== undefined &&
          payState.selectedContactIndex >= 0 &&
          payState.selectedContactIndex < payState.documentContacts.length
          ? payState.selectedContactIndex
          : 0;

      if (contactIndex >= 0 && contactIndex < payState.documentContacts.length) {
        const selectedContact = payState.documentContacts[contactIndex];
        if (selectedContact) {
          setPayState((prev) => {
            // Always update to ensure fields are populated from contact data
            const needsUpdate =
              prev.selectedContactIndex !== contactIndex ||
              !prev.contactPhone ||
              prev.contactPhone !== selectedContact.contactPhone ||
              !prev.contactMail ||
              prev.contactMail !== selectedContact.contactMail ||
              !prev.contactName ||
              prev.contactName !== selectedContact.contactName;

            if (needsUpdate) {
              return {
                ...prev,
                selectedContactIndex: contactIndex,
                contactName: (selectedContact.contactName || "").trim(),
                contactPhone: (selectedContact.contactPhone || "").trim(),
                contactMail: (selectedContact.contactMail || "").trim(),
              };
            }
            return prev;
          });
        }
      }
    }
  }, [openPaymentModal, payState.documentContacts, payState.selectedContactIndex]);

  const formatFloatValue = (value, decimals) => {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? "" : parsedValue.toFixed(decimals);
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
          totalPayment: Number(formatFloatValue(totalToPay, 3)),
        };
      } else if (key === "totalPayment") {
        const totalToPay = value || 0;
        const percentage = (totalToPay / originalTotalPayment) * 100;
        newState = {
          ...prev,
          totalPayment: totalToPay,
          percentageOfTotal: Number(formatFloatValue(percentage, 3)),
        };
      } else if (key === "documentContacts") {
        if (!value) {
          // If no value is selected, reset the contact fields
          newState.selectedContactIndex = -1;
          newState.contactName = "";
          newState.contactPhone = "";
          newState.contactMail = "";
        } else {
          // Update selectedContactIndex based on the selected value
          const selectedIndex = prev.documentContacts.findIndex(
            (contact) => contact.id === value
          );
          newState.selectedContactIndex = selectedIndex;
          // Populate the contact fields based on the selected contact
          if (selectedIndex >= 0) {
            const selectedContact = prev.documentContacts[selectedIndex];
            newState.contactName = selectedContact.contactName || "";
            newState.contactPhone = selectedContact.contactPhone || "";
            newState.contactMail = selectedContact.contactMail || "";
          }
        }
      } else if (
        key === "contactName" ||
        key === "contactPhone" ||
        key === "contactMail"
      ) {
        if (
          prev.documentContacts?.length > 0 &&
          prev.selectedContactIndex >= 0 &&
          prev.selectedContactIndex < prev.documentContacts.length
        ) {
          newState.documentContacts = prev.documentContacts.map(
            (contact, index) =>
              index === prev.selectedContactIndex
                ? { ...contact, [key]: value }
                : contact
          );
        } else {
          // If no valid contact is selected, update the individual field
          newState[key] = value;
        }
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
    const selectedContact =
      payState.documentContacts?.[payState.selectedContactIndex] || null;
    const contactPhone =
      selectedContact?.contactPhone || payState.contactPhone || "";
    const contactMail =
      selectedContact?.contactMail || payState.contactMail || "";

    const dataToSend = {
      documentId: payState.documentId,
      price: payState?.totalPayment,
      maxPayments: payState.numberOfInstallments,
      invoiceDateStr: formatISODateTime(payState.invoiceDate).split(" ")[0],
      contactName: selectedContact?.contactName || "",
      contactPhone,
      contactMail,

      sendByMail: payState.sendByMail,
      sendBySms: payState.sendBySms,
      sendByWhatsapp: payState.sendByWhatsapp,
    };

    if (payState.totalPayment === 0) {
      alertFault(t("alerts.totalPaymentZero"));
      return;
    }

    const callBack = (res) => {
      if (res?.success) {
        const paymentLink = res?.data;
        copyToClipboard(paymentLink);
        alertSuccess(t("alerts.linkSuccessfullyCopied"));
      } else {
        alertFault(t("alerts.linkCopyFailed"));
      }
    };
    await CopyPrePaymentLinkApi(callApi, callBack, {
      documentType,
      data: dataToSend,
    });
  };

  const validateEmail = (state: any, fieldName: string) =>
    !!state?.[fieldName] ? emailRegex.test(state?.[fieldName]) : true;

  const handleSendPaymentPage = async () => {
    const selectedContact =
      payState.documentContacts?.[payState.selectedContactIndex] || null;

    const contactPhone =
      selectedContact?.contactPhone || payState.contactPhone || "";

    const contactMail =
      selectedContact?.contactMail || payState.contactMail || "";
   
    const dataToSend = {
      documentId: payState.documentId,
      price: payState?.totalPayment,
      maxPayments: payState.numberOfInstallments,
      invoiceDateStr: formatISODateTime(payState.invoiceDate).split(" ")[0],
      contactName: selectedContact?.contactName || "",
      contactPhone,
      contactMail,
      sendByMail: payState.sendByMail,
      sendBySms: payState.sendBySms,
      sendByWhatsapp: payState.sendByWhatsapp,
      percentageOfTotal: payState.percentageOfTotal
    };

    if (payState.totalPayment === 0) {
      alertFault(t("alerts.totalPaymentZero"));
      return;
    }
    if (payState.sendByMail && !contactMail) {
      alertFault(t("alerts.noMail"));
      return;
    }
    if (!emailRegex.test(contactMail) && payState.sendByMail) {
      alertFault("customers.invalidEmail");
      return;
    }
    if ((payState.sendBySms || payState.sendByWhatsapp) && !contactPhone) {
      alertFault(t("alerts.noPhoneNumber"));
      return;
    }
    if (
      !payState.sendBySms &&
      !payState.sendByWhatsapp &&
      !payState.sendByMail
    ) {
      alertFault(t("alerts.checkAtLeastOne"));
      return;
    }

    // If only WhatsApp is selected, don't call the API
    if (
      payState.sendByWhatsapp &&
      !payState.sendBySms &&
      !payState.sendByMail
    ) {
      return true; // Return true to indicate WhatsApp should be sent
    }

    const callBack = (res) => {
      if (res?.success) {
        alertSuccess(t("alerts.sendSucceeded"));
      } else {
        alertFault(t("alerts.sendFailed"));
      }
    };

    await sendPrePaymentToClientApi(callApi, callBack, {
      documentType,
      data: dataToSend,
    });

    // Return whether WhatsApp should be sent
    return payState?.sendByWhatsapp;
  };

  return {
    t,
    payState,
    setPayState,
    handleCopyPaymentLink,
    handleCheckBoxChange,
    onChangePaymentInputs,
    handleSendPaymentPage,
  };
};

export { useSendPaymentModal };
