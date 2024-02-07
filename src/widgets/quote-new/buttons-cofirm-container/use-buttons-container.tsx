import { quoteConfirmationState, quoteItemState } from "@/store";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { cancelDocumentApi, getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { QuoteStatuses } from "@/widgets/quote/total-price-and-vat/enums";

const useButtonsConfirmContainer = () => {
    const { callApi } = useGomakeAxios();
    const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
    const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
    const [reasonText, setReasonText] = useState("");
    const [anchorElRejectBtn, setAnchorElRejectBtn] = useState<null | HTMLElement>(null);
    const openRejectBtn = Boolean(anchorElRejectBtn);
    const [openOtherReasonModal, setOpenOtherReasonModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [rejectStatus, setRejectStatus] = useState<QuoteStatuses>();
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleRejectBtnClick = (event: React.MouseEvent<HTMLElement>) => {
        setIsButtonClicked(true);
        setAnchorElRejectBtn(event.currentTarget);

    };
    const handleRejectBtnClose = () => {
        setIsButtonClicked(false);
        setAnchorElRejectBtn(null);
    };

    const onClickOpenRejectModal = (rejectStatus: QuoteStatuses) => {
        setRejectStatus(rejectStatus);
        setOpenRejectModal(true);
    };
    const onClickCloseRejectModal = () => {
        setOpenRejectModal(false);
    };

    const onClickOpenOtherModal = () => {
        setOpenOtherReasonModal(true);
    };
    const onClickCloseOtherModal = () => {
        setOpenOtherReasonModal(false);
    };


    const onClickCancelOffer = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await cancelDocumentApi(callApi, callBack, {
            DocumentType: 0,
            Document: {
                documentId: quoteConfirm?.id,
                quoteStatus: QuoteStatuses.CANCELED_OTHER,
                cancelText: reasonText,
            }
        })
    }

    const updateCancelQuote = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await cancelDocumentApi(callApi, callBack, {
            DocumentType: 0,
            Document: {
                documentId: quoteConfirm?.id,
                quoteStatus: rejectStatus,
            }
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
        await getDocumentPdfApi(callApi, callBack, { documentId: quoteConfirm?.id, documentType: 0 });
    };

    return {
        onClickPrint,
        anchorElRejectBtn, setAnchorElRejectBtn,
        openOtherReasonModal,
        onClickOpenOtherModal,
        onClickCloseOtherModal,
        setOpenOtherReasonModal,
        openRejectBtn,
        handleRejectBtnClose,
        handleRejectBtnClick,
        setReasonText,
        openRejectModal,
        onClickCloseRejectModal,
        onClickOpenRejectModal,
        updateCancelQuote,
        onClickCancelOffer,
        isButtonClicked 
    };

};

export { useButtonsConfirmContainer };