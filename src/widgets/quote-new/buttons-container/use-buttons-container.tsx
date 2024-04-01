import { quoteItemState } from "@/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { createOrderApi, getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { cancelReceiptApi, createReceiptApi, getReceiptPdfApi } from "@/services/api-service/generic-doc/receipts-api";
import { checkedItemsIdsState, finalTotalPaymentState } from "./states";

const useButtonsContainer = (docType: DOCUMENT_TYPE) => {
    const { navigate } = useGomakeRouter();
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const quoteItemValue: any = useRecoilValue(quoteItemState);
    const { alertFault, alertSuccessDelete, alertFaultDelete, alertSuccessUpdate, alertFaultUpdate, alertFaultAdded, alertSuccessAdded , alertFaultGetData } = useSnackBar();
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [openOrderNowModal, setOpenOrderNowModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openCancelReceiptModal, setOpenCancelReceiptModal] = useState(false);

    const finalTotalPayment = useRecoilValue<number>(finalTotalPaymentState);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const open = Boolean(anchorEl);

    const onClickOpenOrderNowModal = () => {
        if (quoteItemValue?.client?.isCreateOrder) {
            setOpenOrderNowModal(true);

        }
        else {
            alertFault("home.admin.pleaseSelectClient")
        }
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

    const onClickOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };
    const onClickCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const onClickOpenCancelReceiptModal = () => {
        setOpenCancelReceiptModal(true);
    };
    const onClickCloseCancelReceiptModal = () => {
        setOpenCancelReceiptModal(false);
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
                alertFaultGetData();
            }
        };
        if (docType === DOCUMENT_TYPE.receipt) {
            await getReceiptPdfApi(callApi, callBack, { receiptId: quoteItemValue?.id });
        }
        else {
            await getDocumentPdfApi(callApi, callBack, { documentId: quoteItemValue?.id, documentType: docType });
        }
    };

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
        const filteredReceiptItems = Object.values(checkedItemsIds).map(id =>
            quoteItemValue.receiptItems.find(item => item.id === id)
        ).filter(Boolean);
        const newReceiptItem = { ...quoteItemValue, receiptItems: filteredReceiptItems }
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
        await createReceiptApi(callApi, callBack, { newReceiptItem });
    };

    const onClickCancelReceipt = async (refundCredit: boolean) => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessDelete();
                navigate("/receipts");

            } else {
                alertFaultDelete();
            }
        };
        await cancelReceiptApi(callApi, callBack, { id: quoteItemValue?.id, refundCredit });
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
        quoteItemValue,
        alertFault,
        anchorEl,
        setAnchorEl,
        open,
        handleClose,
        handleClick,
        getFormattedDocumentPath,
        onClickCreateNewReceipt,
        openDeleteModal,
        onClickCloseDeleteModal,
        onClickOpenDeleteModal,
        onClickCancelReceipt,
        openCancelReceiptModal,
        onClickOpenCancelReceiptModal,
        onClickCloseCancelReceiptModal
    };

};

export { useButtonsContainer };