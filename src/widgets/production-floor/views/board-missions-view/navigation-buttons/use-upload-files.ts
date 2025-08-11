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
import { useState } from "react";
import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";

const useUploadFiles = (orderItemId, filesPath, graphicsFilePath,isComplexProduct?:boolean,productType?:string,isOpenPrintingModal?:any) => {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  const [companyProfile] = useRecoilState(printHouseProfile);
  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [uploadingFiles, setUploadingFiles] = useRecoilState(uploadingFilesState);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [fileId, setFileId] = useState<string>("");
  const { CheckPreferenceValue } = usePrintHousePreferences();

  const { callApi } = useGomakeAxios();

  const handleFileUpload = async (file, fileType) => {
    const finalPath =
      fileType === FileTypeENUM.Printing ? filesPath : graphicsFilePath;
    setShowFileUploader(true);

    const filesGroup = uploadingFiles?.find(
      (fg) => fg.orderItemId === orderItemId && fg.productType === productType
    );
    debugger
    if (filesGroup) {
      setUploadingFiles(
        uploadingFiles.map((fg) =>
          fg.orderItemId === orderItemId && fg.productType === productType
            ? {
                ...filesGroup,
                filesInfo: [
                  {
                    fileName: file?.name,
                    fileStatus: EUploadingFileStatus.UPLOADING,
                    fileType,
                  },
                  ...filesGroup.filesInfo,
                ],
              }
            : fg
        )
      );
    } else {
      setUploadingFiles([
        {
          orderItemId,
          boardMissionId: boardMissions.boardMissionId,
          filePath: filesPath,
          graphicsFilePath: graphicsFilePath,
          productType:productType,
          title: `${boardMissions.boardMissionNumber} | ${boardMissions.orderNumber} | ${boardMissions.clientName}`,
          hotFolderName: file?.hotFolderName,
          filesInfo: [
            {
              fileName: file?.name,
              fileStatus: EUploadingFileStatus.UPLOADING,
              fileType,
            },
          ],
        },
        ...uploadingFiles,
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

    // Get the initial fileId from the response
    const initialFileId = initialStatusResponse?.data?.data?.data;
    if (initialFileId) {
      setFileId(initialFileId);
    }

    // File upload logic remains unchanged
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0;
    while (currentChunk < totalChunks) {
      const start = currentChunk * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const hotFolderName = uploadingFiles?.find(
        (fg) => fg.orderItemId === orderItemId
      )?.hotFolderName;
      let response = await uploadChunk(
        chunk,
        currentChunk,
        totalChunks,
        file?.name,
        fileType, 
        productType,
        hotFolderName,
        filesGroup
      );

      if (!response || !response.success) {
        setUploadingFiles(
          uploadingFiles.map((fg) =>
            fg.orderItemId === orderItemId && fg.productType === productType
              ? {
                  ...filesGroup,
                  filesInfo: [
                    {
                      fileName: file?.name,
                      fileStatus: EUploadingFileStatus.ERROR,
                      fileType,
                    },
                    ...filesGroup.filesInfo,
                  ],
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
          fileId: initialFileId
        });
        return;
      }

      currentChunk++;
      if (currentChunk === totalChunks) {
        if(CheckPreferenceValue(EPreferences.USE_PRINTNODE_AFTER_UPLOAD_FILE) && filesGroup?.filesInfo?.length < 1){
          isOpenPrintingModal?.open();
        }
        setUploadingFiles(
          uploadingFiles.map((fg) =>
            fg.orderItemId === orderItemId && fg.productType === productType
              ? {
                  ...filesGroup,
                  filesInfo: [
                    {
                      fileName: file?.name,
                      fileStatus: EUploadingFileStatus.Uploaded,
                      fileType,
                    },
                    ...filesGroup.filesInfo,
                  ],
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
          status: EUploadingFileStatus.Uploaded,
          fileType,
          fileId: initialFileId
        });
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
    filesGroup
  ) => {
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("productType", productType ? productType.toString() : null);
    formData.append("orderItemId", orderItemId);
    formData.append("isComplexProduct", isComplexProduct ? "true" : "false");
    formData.append("fileName", fileName);
    formData.append("hotFolderName", hotFolderName);
    formData.append(
      "takeScreenShot",
      chunkIndex + 1 === totalChunks ? "true" : "false"
    );
    formData.append("currentPacket", chunkIndex + 1);
    formData.append("totalPackets", totalChunks);
    formData.append("signalRConnectId", connectionId);
    formData.append("fileId", fileId);

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
