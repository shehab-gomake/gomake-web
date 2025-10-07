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

const useFilesStatusSocketIO = (printHouseId) => {
  const [, setFiles] = useRecoilState(uploadingFilesState);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);

  useEffect(()=>{
    const socket = io(config.api_server);
    if(!printHouseId)
      return ;
    socket.on(`updateFileStatus-${printHouseId}`, (data) => {
      debugger
      //setFiles(prev=);
      setFiles(prev =>
          prev.map((fg) =>
              fg.filesInfo.some(fileInfo => fileInfo.bucketKey === data.bucketKey)
                  ? {
                    ...fg,
                    filesInfo: fg.filesInfo.map(fileInfo =>
                        fileInfo.bucketKey === data.bucketKey
                            ? { ...fileInfo, fileStatus: data.status }
                            : fileInfo
                    ),
                  }
                  : fg
          )
      );
    });

  
    
    return () => {
      socket.disconnect();
    };
  },[printHouseId])

  

  return {
    closeConnection: () => {
      // Socket.IO will automatically handle disconnection when component unmounts
    }
  };
};

export { useFilesStatusSocketIO }; 