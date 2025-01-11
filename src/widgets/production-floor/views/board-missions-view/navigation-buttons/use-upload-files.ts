import {getUserToken} from "@/services/storage-data";
import {useRecoilState} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";
import {fileUploaderConnectionIdState, pinFileUploaderState, uploadingFilesState} from "@/store/file-uploader-state";
import {EUploadingFileStatus} from "@/widgets/file-uploader-widget/interface";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {useGomakeAxios} from "@/hooks";

const useUploadFiles = (orderItemId, filesPath) => {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
    const [companyProfile] = useRecoilState(printHouseProfile);
    const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
    const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
    const [uploadingFiles, setUploadingFiles] = useRecoilState(uploadingFilesState);
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const { callApi } = useGomakeAxios();
    const handleFileUpload = async (file) => {
        setShowFileUploader(true);
        const filesGroup = uploadingFiles?.find(fg => fg.orderItemId === orderItemId);
        if (!!filesGroup) {
            setUploadingFiles(uploadingFiles.map(fg => fg.orderItemId === orderItemId ? {
                ...filesGroup,
                filesInfo: [{
                    fileName: file?.name,
                    fileStatus: EUploadingFileStatus.UPLOADING
                }, ...filesGroup.filesInfo]
            } : fg));
            
        } 
        else {
            setUploadingFiles([{
                orderItemId: orderItemId,
                filesInfo: [{fileName: file?.name, fileStatus: EUploadingFileStatus.UPLOADING}],
                boardMissionId: boardMissions.boardMissionId,
                filePath: filesPath,
                title: boardMissions.boardMissionNumber + ' | ' + boardMissions.orderNumber + ' | ' + boardMissions.clientName,
            }, ...uploadingFiles])
        }
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let currentChunk = 0;
        debugger
        while (currentChunk < totalChunks) {
            const start = currentChunk * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);
            let response = await uploadChunk(chunk, currentChunk, totalChunks, file?.name);
            if(!response || !response.success) {
                setUploadingFiles(uploadingFiles.map(fg => fg.orderItemId === orderItemId ? {
                    ...filesGroup,
                    filesInfo: [{
                        fileName: file?.name,
                        fileStatus: EUploadingFileStatus.ERROR
                    }, ...filesGroup.filesInfo]
                } : fg));
                await setOrderItemFileStatus({
                    orderItemId: orderItemId,
                    filename:file?.name,
                    source: filesPath,
                    screenShot: "",
                    productType: "",
                    signalRConnectId: connectionId,
                    status: EUploadingFileStatus.ERROR,
                })
                return
            }
            currentChunk++;
            if(currentChunk == totalChunks){
                setUploadingFiles(uploadingFiles.map(fg => fg.orderItemId === orderItemId ? {
                    ...filesGroup,
                    filesInfo: [{
                        fileName: file?.name,
                        fileStatus: EUploadingFileStatus.Uploaded
                    }, ...filesGroup.filesInfo]
                } : fg));
                await setOrderItemFileStatus({
                    orderItemId: orderItemId,
                    filename:file?.name,
                    source: filesPath,
                    screenShot: response.screenShot,
                    productType: "",
                    signalRConnectId: connectionId,
                    status: EUploadingFileStatus.Uploaded,
                })
            }
        }
    }
    const uploadChunk = async (chunk, chunkIndex, totalChunks, fileName) => {
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("orderItemId", orderItemId);
        formData.append("fileName", fileName);
        formData.append("path", filesPath);
        formData.append("takeScreenShot", chunkIndex + 1 === totalChunks ? 'true' : 'false');
        formData.append("currentPacket", chunkIndex + 1);
        formData.append("totalPackets", totalChunks);
        formData.append("signalRConnectId", connectionId);

        try {
            const response = await fetch( companyProfile.filesApiAddress + '/api/Files/UploadOrderItemFile', {
                method: 'POST',
                body: formData,
                headers: {
                    'authorization': "Bearer " + getUserToken(),
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error uploading chunk:', error);
            return null;
        }
    }

    const setOrderItemFileStatus = async (dto)=>{
        const res: any = await callApi(
            "POST",
            `/v1/erp-service/board-missions/set-order-item-file-status`,
            dto,
            false
        );
    }
    return {
        handleFileUpload
    }
}

export {useUploadFiles}