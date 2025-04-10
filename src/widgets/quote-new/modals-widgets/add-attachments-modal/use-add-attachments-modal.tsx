import { deleteDocumentAttachmentApi } from "@/services/api-service/generic-doc/documents-api";
import { useCallback, useState } from "react";
import { quoteItemState } from "@/store/quote-item";
import { useRecoilState } from "recoil";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { uploadDocumentAttachmentApi } from "@/services/api-service/materials/materials-endpoints";
import { WastebasketNew } from "@/icons/wastebasket-new";
import { IconButton } from "@mui/material";
import FileOpenIcon from '@mui/icons-material/FileOpen';

interface AttachmentPayload {
    documentId: string;
    documentType: number;
    fileName: string;
    base64Content: string;
    fileUrl?: string;
}
const useAddAttachmentsModal = ({ getQuote, documentType }) => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const onClickCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    }
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const data = new Uint8Array(arrayBuffer as ArrayBuffer);
                // Convert data to a Base64 string
                const base64Content = btoa(
                    new Uint8Array(data).reduce(function (data, byte) {
                        return data + String.fromCharCode(byte);
                    }, "")
                );

                uploadDocumentAttachmentApi(callApi, () => {
                    getQuote();
                }, {
                    documentId: quoteItemValue?.id,
                    documentType: documentType,
                    fileName: file.name,
                    base64Content: base64Content
                });
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const getAttachmentsRows = useCallback(() => {

        return quoteItemValue?.attachments?.map((attachment: AttachmentPayload) => [
            <h4 style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                {attachment.fileName.length > 50
                    ? `${attachment.fileName.substring(0, 35)}...`
                    : attachment.fileName}
            </h4>,
            <IconButton onClick={() => {
                window.open(attachment.fileUrl, '_blank');
            }}>
                <FileOpenIcon />
            </IconButton>,
            <IconButton onClick={() => {
                setOpenDeleteModal(true);
                setSelectedAttachment(attachment);
            }}>
                <WastebasketNew width={32} height={32} />
            </IconButton>,
        ]);
    }, [quoteItemValue?.attachments]);

    const handleDeleteAttachment = async (attachment: any) => {
        const callBack = (res) => {
            if (res?.success) {
                getQuote();
            }
        }
        await deleteDocumentAttachmentApi(callApi, callBack, {
            id: attachment?.id,
        });

    };

    return {
        t,
        handleFileUpload,
        getAttachmentsRows,
        handleDeleteAttachment,
        onClickCloseDeleteModal,
        selectedAttachment,
        quoteItemValue,
        openDeleteModal,
    };
};

export { useAddAttachmentsModal };
