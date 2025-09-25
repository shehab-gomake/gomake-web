import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";

const useFileServiceStatusSocketIo = () => {
  const [fileServiceStatus, setFileServiceStatus] = useState<number>(0);
  const [printHouse] = useRecoilState(printHouseProfile);

  useEffect(() => {
    const socket = io(config.api_server);

    socket.on(
      `updateFileServiceStatus-${printHouse.id}`,
      (data: { fileServiceStatus: number }) => {
        console.log(
          "File service status updated via socket:",
          data.fileServiceStatus
        );
        setFileServiceStatus(data.fileServiceStatus);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [printHouse?.id]);

  return { fileServiceStatus, setFileServiceStatus };
};

export { useFileServiceStatusSocketIo };
