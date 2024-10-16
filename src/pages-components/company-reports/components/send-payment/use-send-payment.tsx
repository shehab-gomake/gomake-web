import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";
import { initSendPaymentState, SendPaymentState } from "../types/interfaces";
import { sendPaymentPageApi } from "@/services/api-service/company-report/get-print-houses-report";

const useSendPaymentModal = ({ onClose, selectedPrintHouseId }) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

  const [paymentState, setPaymentState] =
    useState<SendPaymentState>(initSendPaymentState);

  const onChangeInputs = (key, value) => {
    setPaymentState({ ...paymentState, [key]: value });
  };

  const handleCloseModal = () => {
    onClose();
    setPaymentState(initSendPaymentState);
  };

  const sendPaymentPage = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        handleCloseModal();
      } else {
        alertFaultUpdate();
      }
    };
    await sendPaymentPageApi(callApi, callBack, {
      ...paymentState,
      printHouseId: selectedPrintHouseId,
    });
  };

  return {
    t,
    handleCloseModal,
    paymentState,
    onChangeInputs,
    sendPaymentPage,
  };
};

export { useSendPaymentModal };
