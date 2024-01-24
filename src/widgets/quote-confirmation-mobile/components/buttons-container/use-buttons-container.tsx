import { quoteItemState } from "@/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { createOrderApi, getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";

const useButtonsConfirmContainer = () => {
    const { navigate } = useGomakeRouter();
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const quoteItemValue: any = useRecoilValue(quoteItemState);
    const [openOrderNowModal, setOpenOrderNowModal] = useState(false);
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

    const onClickOpenOrderNowModal = () => {
        setOpenOrderNowModal(true);
    };
    const onClickCloseOrderNowModal = () => {
        setOpenOrderNowModal(false);
    };

    const onClickConfirmWithoutNotification = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
                onClickCloseOrderNowModal();
                navigate("/orders");
            } else {
                alertFaultUpdate();
            }
        }
        await createOrderApi(callApi, callBack,
            {
                quoteId: quoteItemValue?.id,
                sendMessage: false
            })
    }

    const onClickConfirmWithNotification = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
                onClickCloseOrderNowModal();
                navigate("/orders");
            } else {
                alertFaultUpdate();
            }
        }
        await createOrderApi(callApi, callBack,
            {
                quoteId: quoteItemValue?.id,
                sendMessage: true
            })
    }
    
    const onClickPrint = async () => {
        const callBack = (res) => {
            if (res?.success) {
              const pdfLink = res.data;
              window.open(pdfLink, "_blank");
            } else {
              alertFaultUpdate();
            }
          };
          await getDocumentPdfApi(callApi, callBack, { documentId: quoteItemValue?.id , documentType : 0  });
        };

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

export { useButtonsConfirmContainer };