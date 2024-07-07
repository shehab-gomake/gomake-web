import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {useRecoilState} from "recoil";
import {useEffect} from "react";
import {useGomakeAxios} from "@/hooks";
import {getAllBoardMissionsUploadingFiles} from "@/services/api-service/production-floor/production-floor-endpoints";
import {fileUploaderConnectionIdState, pinFileUploaderState, uploadingFilesState} from "@/store/file-uploader-state";

const useFilesUploaderSignalr = () => {
    const {connectionId, data} = useGoMakeSignalr<any>({
        url: config.erp_server + '/hubs/fileUploader',
        accessToken: getUserToken(),
        methodName: "UpdateFileUploader"
    });
    const [, setFiles] = useRecoilState(uploadingFilesState);
    const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
    const [, setConnectionId] = useRecoilState(fileUploaderConnectionIdState);
    const {callApi} = useGomakeAxios();
    useEffect(() => {
        if (connectionId) {
            setConnectionId(connectionId);
            getAllBoardMissionsUploadingFiles(callApi, (res) => {
                setFiles(res?.data);
                setShowFileUploader(res?.data?.length > 0);
            }, connectionId).then();
        }
    }, [connectionId]);

    useEffect(() => {
        setShowFileUploader(data?.length > 0);
        setFiles(data)
    }, [data])

    return {
        connectionId,
        data
    }
};
export {useFilesUploaderSignalr}
