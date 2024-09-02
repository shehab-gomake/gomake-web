import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";
import { makePaymentForOrderApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "../../enums";

const useMakePaymentModal = ({ orderItemValue, onClickCloseMakePaymentModal, getAllQuotes }) => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const [totalPrice, setTotalPrice] = useState<number>((orderItemValue?.totalPrice- orderItemValue?.sumApplied)|| 0);


    const handleTotalChange = (e) => {
        setTotalPrice(e.target.value)
    };

    const onClickConfirm = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
                onClickCloseMakePaymentModal();
                getAllQuotes();
            } else {
                alertFaultUpdate();
            }
        };
        await makePaymentForOrderApi(callApi, callBack,
            { documentType: DOCUMENT_TYPE.order, document: { documentId: orderItemValue?.id, amount: totalPrice } });
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