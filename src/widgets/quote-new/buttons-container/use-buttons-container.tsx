import { quoteItemState } from "@/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { createOrderApi, getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { createReceiptApi, getERPAccountsApi } from "@/services/api-service/generic-doc/receipts-api";
import { ERPAccountsData, ERPAccountsState, ErpAccountType, checkedItemsIdsState, finalTotalPaymentState, isSavedPaymentState } from "./states";

const useButtonsContainer = (docType: DOCUMENT_TYPE) => {
    const { navigate } = useGomakeRouter();
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const quoteItemValue: any = useRecoilValue(quoteItemState);
    const { alertFault, alertSuccessUpdate, alertFaultUpdate , alertFaultAdded , alertSuccessAdded} = useSnackBar();
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [openOrderNowModal, setOpenOrderNowModal] = useState(false);
    const setERPAccounts = useSetRecoilState<ERPAccountsData[]>(ERPAccountsState);
    const setIsSavePayment = useSetRecoilState<boolean>(isSavedPaymentState);
    const finalTotalPayment = useRecoilValue<number>(finalTotalPaymentState);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const open = Boolean(anchorEl);


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
        setIsSavePayment(true);
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
        await getDocumentPdfApi(callApi, callBack, { documentId: quoteItemValue?.id, documentType: docType });
    };

    const getERPAccounts = async (accountType: ErpAccountType) => {
        const callBack = (res) => {
            if (res?.success) {
                setERPAccounts(res?.data)
            } else {
                alertFaultUpdate();
            }
        }
        await getERPAccountsApi(callApi, callBack, { accountType: accountType })
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getFormattedDocumentPath = (docType: DOCUMENT_TYPE): string => {
        const documentPath = DOCUMENT_TYPE[docType];
        return documentPath.charAt(0).toUpperCase() + documentPath.slice(1);
    };
    


    const checkedItemsIds = useRecoilValue(checkedItemsIdsState);

    const onClickCreateNewReceipt = async () => {
        const newReceiptItem = { ... quoteItemValue , checkedItemsIds:checkedItemsIds }
        if (finalTotalPayment === 0) {
            alertFaultAdded();    
            return; 
        }
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessAdded();
                navigate("/receipts");
            } else {
                alertFaultAdded();
            }
        };
        await createReceiptApi(callApi, callBack, { receiptItem: newReceiptItem });
    };


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
        getERPAccounts,
        quoteItemValue,
        alertFault,
        anchorEl,
        setAnchorEl,
        open,
        handleClose,
        handleClick,
        getFormattedDocumentPath,
        onClickCreateNewReceipt
    };

};

export { useButtonsContainer };