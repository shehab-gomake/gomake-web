import {getUserToken} from "@/services/storage-data";
import {useGomakeAxios} from "@/hooks";
import {saveUploadedFile} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {printHouseProfile} from "@/store/print-house-profile";
import {useRouter} from "next/router";

const useUploadFiles = () => {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
    const {callApi} = useGomakeAxios();
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const [companyProfile] = useRecoilState(printHouseProfile);
    const {query} = useRouter();
    const {productType} = query

    const handleFileUpload = async (file) => {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let currentChunk = 0;

        while (currentChunk < totalChunks) {
            const start = currentChunk * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);
            await uploadChunk(chunk, currentChunk, totalChunks, file?.name);
            currentChunk++;
        }
    }
    const uploadChunk = async (chunk, chunkIndex, totalChunks, fileName) => {
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("orderItemId", boardMissions?.orderItemId);
        formData.append("path", boardMissions.filesPath);
        formData.append("fileName", fileName);
        formData.append("takeScreenShot", chunkIndex + 1 === totalChunks ? 'true' : 'false');
        try {
            const response = await fetch(companyProfile.filesApiAddress + '/api/Files/UploadOrderItemFile', {
                method: 'POST',
                body: formData,
                headers: {
                    'authorization': "Bearer " + getUserToken(),
                }
            });

            const data = await response.json();

            if (chunkIndex + 1 === totalChunks) {
                await saveUploadedFile(callApi, () => {
                }, {...data, productType: !!productType ? productType : ''});
            }
        } catch (error) {
            console.error('Error uploading chunk:', error);
        }
    }


    return {
        handleFileUpload
    }
}

export {useUploadFiles}