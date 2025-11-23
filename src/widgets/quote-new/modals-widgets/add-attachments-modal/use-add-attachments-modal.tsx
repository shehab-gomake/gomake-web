import { deleteDocumentAttachmentApi } from "@/services/api-service/generic-doc/documents-api";
import { useCallback, useEffect, useState } from "react";
import { fileItemsState, quoteItemState } from "@/store/quote-item";
import { useRecoilState } from "recoil";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import {
  removeQuoteItemFileApi,
  uploadDocumentAttachmentApi,
  uploadQuoteItemFileApi,
  uploadQuoteItemFileForDocumentApi,
} from "@/services/api-service/materials/materials-endpoints";
import { WastebasketNew } from "@/icons/wastebasket-new";
import { IconButton } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { loadingWithShadowState } from "@/store/loading-with-shadow";
import { getTempUserToken, getUserToken } from "@/services/storage-data";
import axios from "axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";

interface AttachmentPayload {
  documentId: string;
  documentType: number;
  fileName: string;
  base64Content: string;
  fileUrl?: string;
}

const useAddAttachmentsModal = ({
  getQuote,
  documentType,
  quoteConfirm,
  isQuoteConfirmation,
  onFileUploadStart,
  onFileUploadComplete,
  onContinueApproval,
}) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultDelete, alertSuccessDelete } = useSnackBar();
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [fileItems, setFileItems] = useRecoilState(fileItemsState);
  const [uploadingFiles, setUploadingFiles] = useState<{
    [key: string]: string[];
  }>({});
  const [downloadingFiles, setDownloadingFiles] = useState<string[]>([]);
  const [deletingFiles, setDeletingFiles] = useState<string[]>([]);

  const uploadQuoteItemFileForDocument = async (data: any) => {
    const callBack = (res) => {
      if (res?.success) {
        getQuote();
      } else {
        // alertFault(res?.message)
      }
    };
    await uploadQuoteItemFileForDocumentApi(callApi, callBack, {
      id: data?.id,
      fileName: data?.fileName,
      screenShot: data?.screenShot,
      url: data?.url,
      bucketName: data?.bucketName,
    });
  };

  const removeQuoteItemFile = async (data: any) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessDelete();
      } else {
        alertFaultDelete();
      }
    };
    await removeQuoteItemFileApi(callApi, callBack, {
      id: data?.id,
      url: data?.url,
    });
  };

  const handleDownloadFile = async (bucketName: string) => {
    // Add file to downloading state
    setDownloadingFiles((prev) => [...prev, bucketName]);

    try {
      let userToken = getUserToken();
      if (!userToken) {
        userToken = getTempUserToken();
      }

      const response = await axios.post(
        `${quoteConfirm?.filesApiAddress}/api/Files/CreateDownloadFilePreSignedUrl`,
        { bucketKey: bucketName },
        {
          headers: {
            authorization: "Bearer " + userToken,
          },
        }
      );

      if (response.data && typeof response.data === "string") {
        // Open the presigned URL in a new tab
        window.open(response.data, "_blank");
      } else {
        console.error("Invalid response from CreateDownloadFilePreSignedUrl");
      }
    } catch (error) {
      console.error("Error getting download URL:", error);
    } finally {
      // Remove file from downloading state
      setDownloadingFiles((prev) => prev.filter((key) => key !== bucketName));
    }
  };

  const handleDeleteFile = async (bucketName: string, quoteItemId: string) => {
    // Add file to deleting state
    setDeletingFiles((prev) => [...prev, bucketName]);

    try {
      let userToken = getUserToken();
      if (!userToken) {
        userToken = getTempUserToken();
      }

      const response = await axios.post(
        `${quoteConfirm?.filesApiAddress}/api/Files/DeleteUploadedFile`,
        {
          bucketName: bucketName,
          quoteItemId: quoteItemId,
        },
        {
          headers: {
            authorization: "Bearer " + userToken,
          },
        }
      );

      if (response.data?.success || response.status === 200) {
        // Remove file from fileItems state
        setFileItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.id === quoteItemId) {
              const updatedFiles = item.files?.filter(
                (file) => file.bucketName !== bucketName
              );
              return {
                ...item,
                files:
                  updatedFiles && updatedFiles.length > 0 ? updatedFiles : null,
              };
            }
            return item;
          });
        });

        alertSuccessDelete();
      } else {
        console.error("Failed to delete file");
        alertFaultDelete();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alertFaultDelete();
    } finally {
      // Remove file from deleting state
      setDeletingFiles((prev) => prev.filter((key) => key !== bucketName));
    }
  };

  const handleFileUploadQuoteConfirmation = async (
    event: React.ChangeEvent<HTMLInputElement>,
    item
  ) => {
    // Use the filesApiAddress directly in the fetch call
    const file = event.target.files?.[0];
    if (file) {
      // Add file to uploading state
      setUploadingFiles((prev) => ({
        ...prev,
        [item.id]: [...(prev[item.id] || []), file.name],
      }));

      try {
        let userToken = getUserToken();
        if (!userToken) {
          userToken = getTempUserToken();
        }
        debugger;
        const response = await axios.post(
          `${quoteConfirm?.filesApiAddress}/api/Files/CreateUploadSession`,
          { fileName: file.name, contentType: file.type },
          {
            headers: {
              authorization: "Bearer " + userToken,
            },
          }
        );
        const sessionUri = response.data.sessionUri;
        const bucketName = response.data.bucketName;
        const fileUrl = response.data.fileUrl;
        await uploadFileToGCS(sessionUri, file, (progress) => {});
        await uploadQuoteItemFileForDocument({
          id: item.id,
          fileName: file.name,
          screenShot: "",
          url: fileUrl,
          bucketName: bucketName,
        });

        // Remove file from uploading state on success
        setUploadingFiles((prev) => ({
          ...prev,
          [item.id]: (prev[item.id] || []).filter((f) => f !== file.name),
        }));

        setFileItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (i) => i.id === item.id
          );
          debugger;
          if (existingItemIndex >= 0) {
            const updatedItems = [...prevItems];
            if (updatedItems?.find((x) => x.fileUrl === fileUrl)) {
              return updatedItems;
            }
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              files: updatedItems[existingItemIndex].files
                ? [
                    ...updatedItems[existingItemIndex].files,
                    {
                      fileName: file.name,
                      screenShot: "",
                      url: fileUrl,
                      bucketName: bucketName,
                    },
                  ]
                : [
                    {
                      fileName: file.name,
                      screenShot: "",
                      url: fileUrl,
                      bucketName: bucketName,
                    },
                  ],
            };
            return updatedItems;
          } else {
            return [
              ...prevItems,
              {
                id: item.id,
                productName: item.productName,
                files: [
                  {
                    fileName: file.name,
                    screenShot: "",
                    url: fileUrl,
                    bucketName: bucketName,
                  },
                ],
              },
            ];
          }
        });
      } catch (error) {
        console.error("File upload error:", error);
        // Remove file from uploading state on error
        setUploadingFiles((prev) => ({
          ...prev,
          [item.id]: (prev[item.id] || []).filter((f) => f !== file.name),
        }));
        return;
      }
      return;
      // Call onFileUploadStart if provided
     /* if (onFileUploadStart) {
        onFileUploadStart();
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer as ArrayBuffer);
        const base64Content = `data:${file.type};base64,${btoa(
          new Uint8Array(data).reduce((data, byte) => {
            return data + String.fromCharCode(byte);
          }, "")
        )}`;

        try {
          let userToken = getUserToken();
          if (!userToken) {
            userToken = getTempUserToken();
          }
          const response = await axios.post(
            `${quoteConfirm?.filesApiAddress}/api/Files/UploadBase64`,
            {
              quoteItemId: quoteConfirm?.id,
              fileName: file.name,
              base64Content: base64Content,
            },
            {
              headers: {
                authorization: "Bearer " + userToken,
              },
            }
          );

          if (!response) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const res = response.data;
          uploadQuoteItemFileForDocument({
            id: item.id,
            fileName: file.name,
            screenShot: res.screenshotUrl,
            url: res.fileUrl,
          });
          setFileItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
              (i) => i.id === item.id
            );

            if (existingItemIndex >= 0) {
              const updatedItems = [...prevItems];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                files: updatedItems[existingItemIndex].files
                  ? [
                      ...updatedItems[existingItemIndex].files,
                      {
                        fileName: file.name,
                        screenShot: res.screenshotUrl,
                        url: res.fileUrl,
                      },
                    ]
                  : [
                      {
                        fileName: file.name,
                        screenShot: res.screenshotUrl,
                        url: res.fileUrl,
                      },
                    ],
              };
              return updatedItems;
            } else {
              return [
                ...prevItems,
                {
                  id: item.id,
                  productName: item.productName,
                  files: [
                    {
                      fileName: file.name,
                      screenShot: res.screenshotUrl,
                      url: res.fileUrl,
                    },
                  ],
                },
              ];
            }
          });

          // Call onFileUploadComplete if provided
          if (onFileUploadComplete) {
            onFileUploadComplete();
          }
        } catch (error) {
          console.error("File upload error:", error);
          // Call onFileUploadComplete even on error
          if (onFileUploadComplete) {
            onFileUploadComplete();
          }
        }
      };

      reader.onerror = () => {
        console.error("File reader error");
        // Call onFileUploadComplete on reader error
        if (onFileUploadComplete) {
          onFileUploadComplete();
        }
      };

      reader.readAsArrayBuffer(file);*/
    }
  };
  async function uploadFileToGCS(
    sessionUri: string,
    file: File,
    onProgress?: (n: number) => void
  ) {
    const chunkSize = 8 * 1024 * 1024; // 8 MiB; tune to 8–32 MiB
    let offset = 0;

    while (offset < file.size) {
      const end = Math.min(offset + chunkSize, file.size);
      const chunk = file.slice(offset, end);
      const res = await fetch(sessionUri, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "Content-Range": `bytes ${offset}-${end - 1}/${file.size}`,
        },
        body: chunk,
      });
      if (!(res.ok || res.status === 308))
        throw new Error(`Upload failed: ${res.status}`);
      offset = end;
      onProgress?.(Math.round((offset / file.size) * 100));
    }
  }
  const getAttachmentsRowsQuoteConfirmation = useCallback(
    (item) => {
      const fileItem = fileItems?.find((f) => f.id === item.id);
      const uploadingFileNames = uploadingFiles[item.id] || [];

      // Combine existing files with uploading files
      const allRows = [];

      // Add existing files
      if (fileItem?.files) {
        fileItem.files.forEach((file, index) => {
          const row = [
            <div key={`empty-${file.fileName}-${index}`}></div>,
            <h4
              key={`file-${file.fileName}-${index}`}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {file.fileName.length > 50
                ? `${file.fileName.substring(0, 35)}...`
                : file.fileName}
            </h4>,
            <IconButton
              key={`download-${file.fileName}-${index}`}
              onClick={() => {
                handleDownloadFile(file.bucketName);
              }}
              disabled={downloadingFiles.includes(file.bucketName)}
            >
              {downloadingFiles.includes(file.bucketName) ? (
                <DotsLoader />
              ) : (
                <FileOpenIcon />
              )}
            </IconButton>,
            <IconButton
              key={`delete-${file.fileName}-${index}`}
              onClick={() => handleDeleteFile(file.bucketName, item.id)}
              disabled={deletingFiles.includes(file.bucketName)}
            >
              {deletingFiles.includes(file.bucketName) ? (
                <DotsLoader />
              ) : (
                <WastebasketNew width={32} height={32} />
              )}
            </IconButton>,
          ];

          allRows.push(row);
        });
      }

      // Add uploading files with loader
      uploadingFileNames.forEach((fileName, index) => {
        const row = [
          <DotsLoader key={`uploading-loader-${fileName}-${index}`} />,
          <h4
            key={`uploading-${fileName}-${index}`}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fileName.length > 50
              ? `${fileName.substring(0, 35)}...`
              : fileName}
          </h4>,
          <div
            key={`uploading-download-${fileName}-${index}`}
            style={{ opacity: 0.5 }}
          >
            <IconButton disabled>
              <FileOpenIcon />
            </IconButton>
          </div>,
          <div
            key={`uploading-delete-${fileName}-${index}`}
            style={{ opacity: 0.5 }}
          >
            <IconButton disabled>
              <WastebasketNew width={32} height={32} />
            </IconButton>
          </div>,
        ];

        allRows.push(row);
      });

      return allRows;
    },
    [
      fileItems,
      uploadingFiles,
      downloadingFiles,
      deletingFiles,
      isQuoteConfirmation,
      setSelectedAttachment,
    ]
  );
  const handleDeleteFileFromItems = (
    itemId: string,
    fileName: string,
    url: string
  ) => {
    removeQuoteItemFile({
      id: itemId,
      url: url,
    });
    setFileItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          // If there are no files or files is null, return the item as is
          if (!item.files) return item;

          // Filter out the file
          const updatedFiles = item.files.filter(
            (file) => file.fileName !== fileName
          );

          // If no files left, set files to null
          return {
            ...item,
            files: updatedFiles.length > 0 ? updatedFiles : null,
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
        .filter((item) => item.files && item.files.length > 0)
        .map((item) => ({
          id: item.id,
          productName: item.productName,
          files: item.files.map((file) => ({
            fileName: file.fileName,
            screenShot: file.screenShot,
            url: file.url,
            bucketName: file.bucketName,
          })),
        }));

      // Only update if there are items with files and fileItems is empty or needs updating
      if (itemsWithFiles.length > 0) {
        setFileItems((prevItems) => {
          // If fileItems is empty, initialize with documentItems files
          if (prevItems.length === 0) {
            return itemsWithFiles;
          }

          // Merge existing fileItems with new items from documentItems
          const mergedItems = [...prevItems];

          itemsWithFiles.forEach((newItem) => {
            const existingIndex = mergedItems.findIndex(
              (item) => item.id === newItem.id
            );

            if (existingIndex === -1) {
              // Item doesn't exist, add it
              mergedItems.push(newItem);
            } else {
              // Item exists, merge files (avoid duplicates)
              const existingFiles = mergedItems[existingIndex].files || [];
              const newFiles = newItem.files || [];

              const mergedFiles = [...existingFiles];
              newFiles.forEach((newFile) => {
                const fileExists = mergedFiles.some(
                  (f) =>
                    f.fileName === newFile.fileName && f.url === newFile.url
                );
                if (!fileExists) {
                  mergedFiles.push(newFile);
                }
              });

              mergedItems[existingIndex] = {
                ...mergedItems[existingIndex],
                files: mergedFiles,
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
    selectedAttachment,
    handleFileUploadQuoteConfirmation,
    getAttachmentsRowsQuoteConfirmation,
    handleDeleteFileFromItems,
    handleDownloadFile,
    handleDeleteFile,
    uploadingFiles,
    downloadingFiles,
    deletingFiles,
  };
};

export { useAddAttachmentsModal };
