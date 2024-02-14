import { quoteItemState } from "@/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { createOrderApi, getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { getERPAccountsApi } from "@/services/api-service/generic-doc/receipts-api";

const useButtonsContainer = (docType : DOCUMENT_TYPE) => {
    const { navigate } = useGomakeRouter();
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const quoteItemValue: any = useRecoilValue(quoteItemState);
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0); 
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [openOrderNowModal, setOpenOrderNowModal] = useState(false);
    const [ERPAccounts, setERPAccounts] = useState();

    const onClickOpenOrderNowModal = () => {
        setOpenOrderNowModal(true);
    };
    const onClickCloseOrderNowModal = () => {
        setOpenOrderNowModal(false);
    };

    const onClickOpenPaymentModal = (selectedTabIndex) => {
        setSelectedTabIndex(selectedTabIndex);
        setOpenPaymentModal(true);
    };
    const onClickClosePaymentModal = () => {
        setOpenPaymentModal(false);
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
          await getDocumentPdfApi(callApi, callBack, { documentId: quoteItemValue?.id , documentType : docType  });
        };


        const  getERPAccounts = async () => {
            const callBack = (res) => {
                if (res?.success) {
                    setERPAccounts(res?.data)
                } else {
                    alertFaultUpdate();
                }
            }
            await getERPAccountsApi(callApi, callBack)
        }

    return {
        openOrderNowModal,
        onClickConfirmWithoutNotification,
        onClickConfirmWithNotification,
        onClickOpenOrderNowModal,
        onClickCloseOrderNowModal,
        onClickPrint,
        t,
        onClickClosePaymentModal,
        onClickOpenPaymentModal,
        openPaymentModal,
        selectedTabIndex,
        getERPAccounts
    };

};

export { useButtonsContainer };