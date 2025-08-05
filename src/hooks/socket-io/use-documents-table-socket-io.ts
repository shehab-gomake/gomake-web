import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";

const useDocumentsTableSocketIo = (documentType: DOCUMENT_TYPE) => {
  const [isSocketUpdateDocumentsTable, setIsSocketUpdateDocumentsTable] =
    useState<boolean>(false);
  const [printHouse] = useRecoilState(printHouseProfile);

  useEffect(() => {
    const socket = io(config.api_server);
    socket.on(`updateDocumentTable-${printHouse.id}-${documentType}`, () => {
      setIsSocketUpdateDocumentsTable(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [documentType]);

  return {
    isSocketUpdateDocumentsTable,
    setIsSocketUpdateDocumentsTable,
  };
};

export { useDocumentsTableSocketIo };
