import { getUserToken } from "@/services/storage-data";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import {
  fileUploaderConnectionIdState,
  pinFileUploaderState,
  uploadingFilesState,
} from "@/store/file-uploader-state";
import {
  EUploadingFileStatus,
  FileTypeENUM,
} from "@/widgets/file-uploader-widget/interface";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { useGomakeAxios } from "@/hooks";
import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import {useEffect, useState} from "react";

const useUploadFiles = (
  orderItemId, 
  filesPath, 
  graphicsFilePath,
  isComplexProduct?: boolean,
  productType?: string,
  isOpenPrintingModal?: any
) => {
  const CHUNK_SIZE = 10 * 1024 * 1024; // 5MB
  const [companyProfile] = useRecoilState(printHouseProfile);
  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [uploadingFiles, setUploadingFiles] = useRecoilState(uploadingFilesState);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const { callApi } = useGomakeAxios();
  useEffect(()=>{
    // Check if we should open printing modal
    const finalFilesGroup = uploadingFiles?.find(
        (fg) => fg.orderItemId === orderItemId && fg.productType === productType
    );

    if (CheckPreferenceValue(EPreferences.USE_PRINTNODE_AFTER_UPLOAD_FILE) && isFileUploaded && finalFilesGroup
        && finalFilesGroup.filesInfo.length == 1 && finalFilesGroup.filesInfo[0].fileStatus === EUploadingFileStatus.Uploaded) {
      isOpenPrintingModal?.open();
      setIsFileUploaded(false)
    }
  },[uploadingFiles,isFileUploaded])
  const handleFileUpload = async (file, fileType) => {
    const finalPath = fileType === FileTypeENUM.Printing ? filesPath : graphicsFilePath;
    setShowFileUploader(true);

    // Generate a unique identifier for this file upload
    const uploadId = `${orderItemId}_${file.name}_${Date.now()}`;

    // Update files state to show uploading status
    const currentFilesGroup = uploadingFiles?.find(
      (fg) => fg.orderItemId === orderItemId && fg.productType === productType
    );

    if (currentFilesGroup) {
      setUploadingFiles(prev =>
        prev.map((fg) =>
          fg.orderItemId === orderItemId && fg.productType === productType
            ? {
                ...fg,
                filesInfo: [
                  {
                    fileName: file?.name,
                    fileStatus: EUploadingFileStatus.UPLOADING,
                    fileType,
                    uploadId, // Add uploadId to track this specific upload
                  },
                  ...fg.filesInfo,
                ],
              }
            : fg
        )
      );
    } else {
      setUploadingFiles(prev => [
        {
          orderItemId,
          boardMissionId: boardMissions.boardMissionId,
          filePath: filesPath,
          graphicsFilePath: graphicsFilePath,
          productType: productType,
          title: `${boardMissions.boardMissionNumber} | ${boardMissions.orderNumber} | ${boardMissions.clientName}`,
          hotFolderName: file?.hotFolderName,
          filesInfo: [
            {
              fileName: file?.name,
              fileStatus: EUploadingFileStatus.UPLOADING,
              fileType,
              uploadId, // Add uploadId to track this specific upload
            },
          ],
        },
        ...prev,
      ]);
    }

    // Initial status update to get fileId
    const initialStatusResponse = await setOrderItemFileStatus({
      orderItemId,
      filename: file?.name,
      source: finalPath,
      productType: !!productType ? productType.toString() : "",
      signalRConnectId: connectionId,
      status: EUploadingFileStatus.UPLOADING,
      fileType,
    });

    // Get the fileId specific to this upload
    const fileId = initialStatusResponse?.data?.data?.data;

    // File upload logic
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0;
    
    while (currentChunk < totalChunks) {
      const start = currentChunk * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      // Get the latest state for hotFolderName
      const latestFilesGroup = uploadingFiles?.find(
        (fg) => fg.orderItemId === orderItemId && fg.productType === productType
      );
      const hotFolderName = latestFilesGroup?.hotFolderName;

      let response = await uploadChunk(
        chunk,
        currentChunk,
        totalChunks,
        file?.name,
        fileType,
        productType,
        hotFolderName,
        fileId, // Pass the specific fileId for this upload
        uploadId // Pass uploadId to identify this specific upload
      );

      if (!response || !response.success) {
        // Update error status for this specific file
        setUploadingFiles(prev =>
          prev.map((fg) =>
            fg.orderItemId === orderItemId && fg.productType === productType
              ? {
                  ...fg,
                  filesInfo: fg.filesInfo.map(fileInfo =>
                    fileInfo.uploadId === uploadId
                      ? { ...fileInfo, fileStatus: EUploadingFileStatus.ERROR }
                      : fileInfo
                  ),
                }
              : fg
          )
        );
        
        await setOrderItemFileStatus({
          orderItemId,
          filename: file?.name,
          source: finalPath,
          screenShot: "",
          productType: !!productType ? productType.toString() : "",
          signalRConnectId: connectionId,
          status: EUploadingFileStatus.ERROR,
          fileType,
          fileId: fileId
        });
        return;
      }

      currentChunk++;
      
      if (currentChunk === totalChunks) {
        setIsFileUploaded(true)
        // Update success status for this specific file
        setUploadingFiles(prev =>
          prev.map((fg) =>
            fg.orderItemId === orderItemId && fg.productType === productType
              ? {
                  ...fg,
                  filesInfo: fg.filesInfo.map(fileInfo =>
                    fileInfo.uploadId === uploadId
                      ? { ...fileInfo, fileStatus: response.isUploadedToGoogleCloud ? EUploadingFileStatus.UploadedToGoogleCloud : EUploadingFileStatus.Uploaded,downloadFilePath:response.source ,bucketKey:response.bucketKey}
                      : fileInfo
                  ),
                }
              : fg
          )
        );
        
        await setOrderItemFileStatus({
          orderItemId,
          filename: file?.name,
          source: response.source,
          screenShot: response.screenShot,
          productType: !!productType ? productType.toString() : "",
          signalRConnectId: connectionId,
          status: response.isUploadedToGoogleCloud ? EUploadingFileStatus.UploadedToGoogleCloud : EUploadingFileStatus.Uploaded,
          fileType,
          fileId: fileId,
          bucketKey: response.bucketKey,
        });
        if(response.jdfFileUrl){
          await setOrderItemFileStatus({
            orderItemId,
            filename: response.jdfFileName,
            source: response.jdfFileUrl,
            screenShot: "",
            productType: !!productType ? productType.toString() : "",
            signalRConnectId: connectionId,
            status: EUploadingFileStatus.Uploaded,
            fileType,
            fileId: response.jdfFileId,
          });
          setUploadingFiles(prev =>
              prev.map((fg) =>
                  fg.orderItemId === orderItemId && fg.productType === productType
                      ? {
                        ...fg,
                        filesInfo: [...fg.filesInfo.map(fileInfo =>
                            fileInfo.uploadId === uploadId
                                ? { ...fileInfo, fileStatus: EUploadingFileStatus.Uploaded,downloadFilePath:response.source }
                                : fileInfo
                        ),...fg.filesInfo.map(fileInfo =>
                            fileInfo.uploadId === uploadId
                                ? { ...fileInfo,fileName:response.jdfFileName, fileStatus: EUploadingFileStatus.Uploaded,downloadFilePath:response.jdfFileUrl }
                                : fileInfo
                        ),]
                      }
                      : fg
              )
          );
        }
        
      }
    }
  };

  const uploadChunk = async (
    chunk,
    chunkIndex,
    totalChunks,
    fileName,
    fileType,
    productType,
    hotFolderName,
    fileId, // Now passed as parameter
    uploadId // For tracking
  ) => {
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("uploadFileRequestId", uploadId);
    formData.append("productType", productType ? productType.toString() : null);
    formData.append("orderItemId", orderItemId);
    formData.append("isComplexProduct", isComplexProduct ? "true" : "false");
    formData.append("fileName", fileName);
    formData.append("hotFolderName", hotFolderName || "");
    formData.append(
      "takeScreenShot",
      chunkIndex + 1 === totalChunks ? "true" : "false"
    );
    formData.append("currentPacket", (chunkIndex + 1).toString());
    formData.append("totalPackets", totalChunks.toString());
    formData.append("signalRConnectId", connectionId);
    formData.append("fileId", fileId || "");
    formData.append("fileType", fileType);
    formData.append(
      "path",
      fileType === FileTypeENUM.Printing ? filesPath : graphicsFilePath
    );

    try {
      const response = await fetch(
        companyProfile.filesApiAddress + "/api/Files/UploadOrderItemFile",
        {
          method: "POST",
          body: formData,
          headers: {
            authorization: "Bearer " + getUserToken(),
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading chunk:", error);
      return null;
    }
  };

  const setOrderItemFileStatus = async (dto) => {
    const res: any = await callApi(
      "POST",
      `/v1/erp-service/board-missions/set-order-item-file-status`,
      {
        ...dto,
        boardMissionIds: uploadingFiles.map(
          (fileGroup) => fileGroup.boardMissionId
        ),
        fileId: dto.fileId
      },
      false
    );
    return res;
  };

  return {
    handleFileUpload,
  };
};

export { useUploadFiles };