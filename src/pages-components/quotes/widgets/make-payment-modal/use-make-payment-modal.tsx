import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";
import { makePaymentForOrderApi } from "@/services/api-service/generic-doc/documents-api";

const useMakePaymentModal = ({ orderItemValue }) => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const [totalPrice, setTotalPrice] = useState<number>(orderItemValue?.totalPrice || 0);


    const handleTotalChange = (e) => {
        setTotalPrice(e.target.value)
    };


    const onClickConfirm = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        };
        await makePaymentForOrderApi(callApi, callBack, { id: orderItemValue?.id, totalPrice });
    };

    return {
        t,
        totalPrice,
        setTotalPrice,
        onClickConfirm,
        handleTotalChange
    };
};

export { useMakePaymentModal };