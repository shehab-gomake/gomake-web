import { deleteDocumentAttachmentApi } from "@/services/api-service/generic-doc/documents-api";
import { useCallback, useEffect, useState } from "react";
import { fileItemsState, quoteConfirmationState, quoteItemState } from "@/store/quote-item";
import { useRecoilState, useRecoilValue } from "recoil";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { uploadDocumentAttachmentApi, uploadQuoteItemFileApi } from "@/services/api-service/materials/materials-endpoints";
import { WastebasketNew } from "@/icons/wastebasket-new";
import { IconButton } from "@mui/material";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { loadingWithShadowState } from "@/store/loading-with-shadow";
import {getTempUserToken, getUserToken} from "@/services/storage-data";
import axios from "axios";


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
    const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [isLoading, setIsLoading] = useRecoilState(loadingWithShadowState);
    const [fileItems, setFileItems] = useRecoilState(fileItemsState);

    const onClickCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    }
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const data = new Uint8Array(arrayBuffer as ArrayBuffer);
                // Convert data to a Base64 string with proper data URI format
                const base64Content = `data:${file.type};base64,${btoa(
                    new Uint8Array(data).reduce((data, byte) => {
                        return data + String.fromCharCode(byte);
                    }, '')
                )}`;
                const tempAttachment = {
                    id: `temp-${Date.now()}`, // Temporary ID
                    documentId: quoteItemValue?.id,
                    documentType: documentType,
                    fileName: file.name,
                    base64Content: base64Content,
                    fileUrl: URL.createObjectURL(file) // Create temporary URL for preview
                };

                setQuoteItemValue(prev => ({
                    ...prev,
                    attachments: [...(prev.attachments || []), tempAttachment]
                }));
                uploadDocumentAttachmentApi(callApi, () => {
                    getQuote();
                    setTimeout(() => setIsLoading(false), 5000);
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


    // const handleFileUploadQuoteConfirmation = async (event: React.ChangeEvent<HTMLInputElement>, item) => {
    //     setIsLoading(true);
    //     const uri = `${quoteConfirm?.filesApiAddress}/api/Files/UploadBase64`
    //     console.log("uri", uri)
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (event) => {
    //             const arrayBuffer = event.target.result;
    //             const data = new Uint8Array(arrayBuffer as ArrayBuffer);
    //             // Convert data to a Base64 string with proper data URI format
    //             const base64Content = `data:${file.type};base64,${btoa(
    //                 new Uint8Array(data).reduce((data, byte) => {
    //                     return data + String.fromCharCode(byte);
    //                 }, '')
    //             )}`;
    //             const callBack = (res) => {
    //                 setFileItems(prevItems => {
    //                     const existingItemIndex = prevItems.findIndex(i => i.id === item.id);

    //                     if (existingItemIndex >= 0) {
    //                         // Update existing item
    //                         const updatedItems = [...prevItems];
    //                         updatedItems[existingItemIndex] = {
    //                             ...updatedItems[existingItemIndex],
    //                             files: updatedItems[existingItemIndex].files
    //                                 ? [...updatedItems[existingItemIndex].files, {
    //                                     fileName: file.name,
    //                                     url: res.data
    //                                 }]
    //                                 : [{
    //                                     fileName: file.name,
    //                                     url: res.data
    //                                 }]
    //                         };
    //                         return updatedItems;
    //                     } else {
    //                         // Add new item
    //                         return [...prevItems, {
    //                             id: item.id,
    //                             productName: item.productName,
    //                             files: [{
    //                                 fileName: file.name,
    //                                 url: res.data
    //                             }]
    //                         }];
    //                     }
    //                 });
    //                 setIsLoading(false);
    //             }
    //             uploadQuoteItemFileApi(
    //                 callApi,
    //                 callBack,
    //                 {
    //                     documentId: quoteConfirm?.id,
    //                     fileName: file.name,
    //                     base64Content: base64Content,
    //                     uri
    //                 }
    //             );
    //         };
    //         reader.readAsArrayBuffer(file);
    //     }
    // };

    const handleFileUploadQuoteConfirmation = async (event: React.ChangeEvent<HTMLInputElement>, item) => {
        setIsLoading(true);
        // Use the filesApiAddress directly in the fetch call
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target.result;
                const data = new Uint8Array(arrayBuffer as ArrayBuffer);
                const base64Content = `data:${file.type};base64,${btoa(
                    new Uint8Array(data).reduce((data, byte) => {
                        return data + String.fromCharCode(byte);
                    }, '')
                )}`;

                try {
                    let userToken = getUserToken();
                    if(!userToken){
                        userToken = getTempUserToken();
                    }
                    const response = await axios.post(`${quoteConfirm?.filesApiAddress}/api/Files/UploadBase64`, {
                        quoteItemId: quoteConfirm?.id,
                        fileName: file.name,
                        base64Content: base64Content
                    }, {
                        headers: {
                            authorization: "Bearer " + userToken,
                        },
                    });

                    if (!response) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const res = response.data;
                    setFileItems(prevItems => {
                        const existingItemIndex = prevItems.findIndex(i => i.id === item.id);

                        if (existingItemIndex >= 0) {
                            const updatedItems = [...prevItems];
                            updatedItems[existingItemIndex] = {
                                ...updatedItems[existingItemIndex],
                                files: updatedItems[existingItemIndex].files
                                    ? [...updatedItems[existingItemIndex].files, {
                                        fileName: file.name,
                                        screenShot: res.screenshotUrl,
                                        url: res.fileUrl
                                    }]
                                    : [{
                                        fileName: file.name,
                                        screenShot: res.screenshotUrl,
                                        url: res.fileUrl
                                    }]
                            };
                            return updatedItems;
                        } else {
                            return [...prevItems, {
                                id: item.id,
                                productName: item.productName,
                                files: [{
                                    fileName: file.name,
                                    screenShot: res.screenshotUrl,
                                    url: res.fileUrl
                                }]
                            }];
                        }
                    });
                } catch (error) {
                    console.log("Upload failed:", error);
                }
                setIsLoading(false);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const getAttachmentsRowsQuoteConfirmation = useCallback((item) => {
        const fileItem = fileItems?.find(f => f.id === item.id);

        return fileItem?.files?.map((file) => [
            <h4 style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                {file.fileName.length > 50
                    ? `${file.fileName.substring(0, 35)}...`
                    : file.fileName}
            </h4>,
            <IconButton onClick={() => {
                window.open(file.url, '_blank');
            }}>
                <FileOpenIcon />
            </IconButton>,
            <IconButton onClick={() => {
                setOpenDeleteModal(true);
                setSelectedAttachment({ ...file, parentItem: item });
            }}>
                <WastebasketNew width={32} height={32} />
            </IconButton>,
        ]) || [];
    }, [fileItems]);
    const handleDeleteFileFromItems = (itemId: string, fileName: string) => {
        setFileItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === itemId) {
                    // If there are no files or files is null, return the item as is
                    if (!item.files) return item;

                    // Filter out the file
                    const updatedFiles = item.files.filter(file => file.fileName !== fileName);

                    // If no files left, set files to null
                    return {
                        ...item,
                        files: updatedFiles.length > 0 ? updatedFiles : null
                    };
                }
                return item;
            });
        });
    };
    return {
        t,
        handleFileUpload,
        getAttachmentsRows,
        handleDeleteAttachment,
        onClickCloseDeleteModal,
        handleFileUploadQuoteConfirmation,
        selectedAttachment,
        quoteItemValue,
        openDeleteModal,
        isLoading,
        fileItems,
        getAttachmentsRowsQuoteConfirmation,
        handleDeleteFileFromItems
    };
};

export { useAddAttachmentsModal };
