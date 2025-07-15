import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRecoilState } from "recoil";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
  uploadingFilesState,
} from "@/store/file-uploader-state";

const useFilesUploaderSocketIO = () => {
  const [connectionId, setConnectionId] = useState<string>();
  const [data, setData] = useState<any>();
  const [, setFiles] = useRecoilState(uploadingFilesState);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [, setOpen] = useRecoilState(openFileUploaderList);
  const [, setConnectionIdState] = useRecoilState(fileUploaderConnectionIdState);


  useEffect(()=>{
    const socket = io(config.api_server);
    socket.on("UpdateFileUploader", (newData) => {
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