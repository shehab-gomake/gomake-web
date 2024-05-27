import { quoteConfirmationState } from "@/store";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { approveDocumentItemsApi, rejectDocumentApi, updateDocumentCommentsConfirmationApi } from "@/services/api-service/generic-doc/quote-confirmation-api";
import { QuoteStatuses } from "../total-price-and-vat/enums";
import { useQuoteConfirmation } from "@/pages-components/quote-confirmation/use-quote-confirmation";

const useButtonsConfirmContainer = () => {
    const { callApi } = useGomakeAxios();
    const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
    const { alertFaultUpdate, alertSuccessUpdate, alertFault } = useSnackBar();
    const [reasonText, setReasonText] = useState("");
    const [anchorElRejectBtn, setAnchorElRejectBtn] = useState<null | HTMLElement>(null);
    const openRejectBtn = Boolean(anchorElRejectBtn);
    const [openOtherReasonModal, setOpenOtherReasonModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [rejectStatus, setRejectStatus] = useState<QuoteStatuses>();
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const { getQuoteConfirmation } = useQuoteConfirmation();

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

    const onClickOpenOtherModal = (rejectStatus: QuoteStatuses) => {
        setRejectStatus(rejectStatus);
        setOpenOtherReasonModal(true);
    };
    const onClickCloseOtherModal = () => {
        setOpenOtherReasonModal(false);
    };

    // do you want to be init whit quoteConfirm?.notes ?? 
    const [quoteComments, setQuoteComments] = useState("");
    const onUpdateComments = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await updateDocumentCommentsConfirmationApi(callApi, callBack, { documentId: quoteConfirm?.id, comments: quoteComments })
    }


    const onClickApprove = async () => {
        const selectedItemIds = quoteConfirm?.documentItems?.filter(x => x.isChecked)?.map(x => x.id);

        if (!selectedItemIds || selectedItemIds.length === 0) {
            alertFault("sales.quote.alertApprove");
            return;
        }

        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
                getQuoteConfirmation();
            } else {
                alertFaultUpdate();
            }
        }
        await approveDocumentItemsApi(callApi, callBack, { docuementItemsIds: selectedItemIds })
    }

    const onClickPrint = async () => {
        const downloadPdf = (url) => {
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.target = "_blank";
            anchor.addEventListener("click", () => {
                setTimeout(() => {
                    anchor.remove();
                }, 100);
            });
            anchor.click();
        };
        const callBack = (res) => {
            if (res?.success) {
                const pdfLink = res.data;
                downloadPdf(pdfLink);
                // window.open(pdfLink, "_blank");

            } else {
                alertFaultUpdate();
            }
        };
        await getDocumentPdfApi(callApi, callBack, { documentId: quoteConfirm?.id, documentType: 0 });
    };


    const onClickReject = async () => {
        const callBack = (res) => {
            if (res?.success) {
                onClickCloseOtherModal();
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await rejectDocumentApi(callApi, callBack, { documentId: quoteConfirm?.id, quoteStatus: rejectStatus, cancelText: reasonText })
    }

    return {
        onClickPrint,
        anchorElRejectBtn,
        setAnchorElRejectBtn,
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
        isButtonClicked,
        onClickApprove,
        onClickReject,
        quoteConfirm,
        onUpdateComments,
        quoteComments,
        setQuoteComments
    };

};

export { useButtonsConfirmContainer };