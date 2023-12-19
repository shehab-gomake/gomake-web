import { quoteItemState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";

const useButtonsContainer = () => {
    const { navigate } = useGomakeRouter();
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const quoteItemValue: any = useRecoilValue(quoteItemState);
    const [openOrderNowModal, setOpenOrderNowModal] = useState(false);
    const { alertSuccessUpdate, alertFaultUpdate , alertRequiredFields } = useSnackBar();

    const onClickOpenOrderNowModal = () => {
        setOpenOrderNowModal(true);
    };
    const onClickCloseOrderNowModal = () => {
        setOpenOrderNowModal(false);
    };

    const onClickConfirmWithoutNotification = useCallback(async () => {
        const res = await callApi(
            EHttpMethod.POST,
            `/v1/erp-service/order/create-new-order`,
            {
                quoteId: quoteItemValue?.id,
                sendMessage:false,
            }
        );
        if (res?.success) {
            alertSuccessUpdate();
            onClickCloseOrderNowModal();
            navigate("/orders");
        } else {
            alertFaultUpdate();
        }
    }, [quoteItemValue]);

    const onClickConfirmWithNotification = useCallback(async () => {
        const res = await callApi(
            EHttpMethod.POST,
            `/v1/erp-service/order/create-new-order`,
            {
                quoteId: quoteItemValue?.id,
                sendMessage:true,
            }
        );
        if (res?.success) {
            alertSuccessUpdate();
            onClickCloseOrderNowModal();
            navigate("/orders");
        } else {
            alertFaultUpdate();
        }
    }, [quoteItemValue]);

    const onClickPrint = useCallback(async () => {
        const res = await callApi(
            EHttpMethod.GET,
            `/v1/erp-service/quote/get-quote-pdf`,
            {
                quoteId: quoteItemValue?.id,
            }
        );
        if (res?.success) {
            const pdfLink = res.data.data.data;
            //  window.open(pdfLink, "_blank");
            const anchor = document.createElement('a');
            anchor.href = pdfLink;
            anchor.target = '_blank';
            anchor.click();
        } else {
            alertRequiredFields();
        }
    }, [quoteItemValue]);

    return {
        openOrderNowModal,
        onClickConfirmWithoutNotification,
        onClickConfirmWithNotification,
        onClickOpenOrderNowModal,
        onClickCloseOrderNowModal,
        onClickPrint,
        t,
    };
};

export { useButtonsContainer };