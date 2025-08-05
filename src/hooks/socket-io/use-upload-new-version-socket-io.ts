import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";

const useUploadingNewVersionSocketIo = () => {
  const [openAlertModal, setOpenAlertModal] = useState<boolean>(false);

  useEffect(() => {
    const socket = io(config.api_server);

    socket.on(`UploadNewVersionStart`, () => {
      setOpenAlertModal(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    openAlertModal,
    setOpenAlertModal,
  };
};

export { useUploadingNewVersionSocketIo };
