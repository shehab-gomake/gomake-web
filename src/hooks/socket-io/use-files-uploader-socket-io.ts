import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import {useRecoilState, useRecoilValue} from "recoil";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
  uploadingFilesState,
} from "@/store/file-uploader-state";
import {printHouseProfile} from "@/store/print-house-profile";
import {EUploadingFileStatus} from "@/widgets/file-uploader-widget/interface";

const useFilesUploaderSocketIO = () => {
  const [connectionId, setConnectionId] = useState<string>();
  const [data, setData] = useState<any>();
  const [, setFiles] = useRecoilState(uploadingFilesState);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [, setOpen] = useRecoilState(openFileUploaderList);
  const [, setConnectionIdState] = useRecoilState(fileUploaderConnectionIdState);
  const profile = useRecoilValue(printHouseProfile);

  useEffect(()=>{
    const socket = io(config.api_server);
    socket.on("UpdateFileUploader", (newData) => {
      if(newData && newData.length > 0){
        for(let i = 0;i<newData.length;i++){
          if(newData[i].productType){
            newData[i].productType = newData[i].productType.replaceAll('\\','');
            newData[i].productType = newData[i].productType.replaceAll('"','');
          }
        }
      }
      setFiles(newData);
      setData(newData);
      setShowFileUploader(newData?.length > 0);
      setOpen(newData?.length > 0);

      
    });
    socket.on('connect', () => {
      setConnectionId(socket.id);
      setConnectionIdState(socket.id);
    });
  
    return () => {
      socket.disconnect();
    };
  },[])

  

  return {
    connectionId,
    data,
    closeConnection: () => {
      // Socket.IO will automatically handle disconnection when component unmounts
    }
  };
};

export { useFilesUploaderSocketIO }; 