import { useGoMakeSignalr } from "@/hooks/signalr/use-go-make-signalr";
import { getUserToken } from "@/services/storage-data";
import config from "@/config";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { useGomakeAxios } from "@/hooks";
import { getAllBoardMissionsUploadingFiles } from "@/services/api-service/production-floor/production-floor-endpoints";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
  uploadingFilesState,
} from "@/store/file-uploader-state";

const useFilesUploaderSignalr = () => {
  const { connectionId, data, closeConnection } = useGoMakeSignalr<any>({
    url: config.erp_server + "/hubs/fileUploader",
    accessToken: getUserToken(),
    methodName: "UpdateFileUploader",
  });
  const [, setFiles] = useRecoilState(uploadingFilesState);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [, setOpen] = useRecoilState(openFileUploaderList);
  const [, setConnectionId] = useRecoilState(fileUploaderConnectionIdState);
  const { callApi } = useGomakeAxios();

  useEffect(() => {
    if (connectionId) {
      setConnectionId(connectionId);
      getAllBoardMissionsUploadingFiles(
          callApi,
          (res) => {
            setFiles(res?.data);
            setShowFileUploader(res?.data?.length > 0);
            setOpen(res?.data?.length > 0);
          },
          connectionId
      ).then();
    }
  }, [connectionId]);

  useEffect(() => {
    setShowFileUploader(data?.length > 0);
    setFiles(data);
  }, [data]);

  return {
    connectionId,
    data,
    closeConnection,
  };
};
export { useFilesUploaderSignalr };
