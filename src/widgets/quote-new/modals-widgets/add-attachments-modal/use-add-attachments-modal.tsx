import { deleteDocumentAttachmentApi } from "@/services/api-service/generic-doc/documents-api";
import { useCallback, useEffect, useState } from "react";
import { fileItemsState, quoteItemState } from "@/store/quote-item";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { removeQuoteItemFileApi, uploadDocumentAttachmentApi, uploadQuoteItemFileApi, uploadQuoteItemFileForDocumentApi } from "@/services/api-service/materials/materials-endpoints";
import { WastebasketNew } from "@/icons/wastebasket-new";
import { IconButton } from "@mui/material";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { loadingWithShadowState } from "@/store/loading-with-shadow";
import { getTempUserToken, getUserToken } from "@/services/storage-data";
import axios from "axios";
import { useSnackBar } from "@/hooks/use-snack-bar";


interface AttachmentPayload {
    documentId: string;
    documentType: number;
    fileName: string;
    base64Content: string;
    fileUrl?: string;
}
const useAddAttachmentsModal = ({ getQuote, documentType, quoteConfirm, isQuoteConfirmation }) => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertFaultDelete, alertSuccessDelete } = useSnackBar();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [fileItems, setFileItems] = useRecoilState(fileItemsState);
    const setLoadingWithShadow = useSetRecoilState(loadingWithShadowState);

    const onClickCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    }
    const uploadQuoteItemFileForDocument = async (data: any) => {
        const callBack = (res) => {
            if (res?.success) {
                getQuote();
            }
            else {
                // alertFault(res?.message)
            }
        }
        await uploadQuoteItemFileForDocumentApi(callApi, callBack, {
            "id": data?.id,
            "fileName": data?.fileName,
            "screenShot": data?.screenShot,
            "url": data?.url
        });
    }

    const removeQuoteItemFile = async (data: any) => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessDelete()
            }
            else {
                alertFaultDelete()
            }
        }
        await removeQuoteItemFileApi(callApi, callBack, {
            id: data?.id,
            url: data?.url
        });
    }

    const handleFileUploadQuoteConfirmation = async (event: React.ChangeEvent<HTMLInputElement>, item) => {
        // Use the filesApiAddress directly in the fetch call
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                setLoadingWithShadow(true);
                const arrayBuffer = event.target.result;
                const data = new Uint8Array(arrayBuffer as ArrayBuffer);
                const base64Content = `data:${file.type};base64,${btoa(
                    new Uint8Array(data).reduce((data, byte) => {
                        return data + String.fromCharCode(byte);
                    }, '')
                )}`;

                try {
                    let userToken = getUserToken();
                    if (!userToken) {
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
                    await uploadQuoteItemFileForDocument({
                        id: item.id,
                        fileName: file.name,
                        screenShot: res.screenshotUrl,
                        url: res.fileUrl
                    })
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
                } finally {
                    setLoadingWithShadow(false);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const getAttachmentsRowsQuoteConfirmation = useCallback((item) => {
        const fileItem = fileItems?.find(f => f.id === item.id);

        return fileItem?.files?.map((file) => {
            const row = [
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
                </IconButton>
            ];

            if (isQuoteConfirmation) {
                row.push(
                    <IconButton onClick={() => {
                        setOpenDeleteModal(true);
                        setSelectedAttachment({ ...file, parentItem: item });
                    }}>
                        <WastebasketNew width={32} height={32} />
                    </IconButton>
                );
            }

            return row;
        }) || [];
    }, [fileItems, isQuoteConfirmation, setOpenDeleteModal, setSelectedAttachment]);
    const handleDeleteFileFromItems = (itemId: string, fileName: string, url: string) => {
        removeQuoteItemFile({
            id: itemId,
            url: url
        })
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

    useEffect(() => {
        // Initialize fileItems from quoteConfirm.documentItems when they have files
        if (quoteConfirm?.documentItems && quoteConfirm.documentItems.length > 0) {
            const itemsWithFiles = quoteConfirm.documentItems
                .filter(item => item.files && item.files.length > 0)
                .map(item => ({
                    id: item.id,
                    productName: item.productName,
                    files: item.files.map(file => ({
                        fileName: file.fileName,
                        screenShot: file.screenShot,
                        url: file.url
                    }))
                }));

            // Only update if there are items with files and fileItems is empty or needs updating
            if (itemsWithFiles.length > 0) {
                setFileItems(prevItems => {
                    // If fileItems is empty, initialize with documentItems files
                    if (prevItems.length === 0) {
                        return itemsWithFiles;
                    }

                    // Merge existing fileItems with new items from documentItems
                    const mergedItems = [...prevItems];

                    itemsWithFiles.forEach(newItem => {
                        const existingIndex = mergedItems.findIndex(item => item.id === newItem.id);

                        if (existingIndex === -1) {
                            // Item doesn't exist, add it
                            mergedItems.push(newItem);
                        } else {
                            // Item exists, merge files (avoid duplicates)
                            const existingFiles = mergedItems[existingIndex].files || [];
                            const newFiles = newItem.files || [];

                            const mergedFiles = [...existingFiles];
                            newFiles.forEach(newFile => {
                                const fileExists = mergedFiles.some(f => f.fileName === newFile.fileName && f.url === newFile.url);
                                if (!fileExists) {
                                    mergedFiles.push(newFile);
                                }
                            });

                            mergedItems[existingIndex] = {
                                ...mergedItems[existingIndex],
                                files: mergedFiles
                            };
                        }
                    });

                    return mergedItems;
                });
            }
        }
    }, [quoteConfirm?.documentItems]);
    return {
        t,
        onClickCloseDeleteModal,
        selectedAttachment,
        openDeleteModal,
        handleFileUploadQuoteConfirmation,
        getAttachmentsRowsQuoteConfirmation,
        handleDeleteFileFromItems
    };
};

export { useAddAttachmentsModal };
