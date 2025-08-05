import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";

const useJobsTableSocketIo = () => {
  const [isSocketUpdateJobsTable, setIsSocketUpdateJobsTable] =
    useState<boolean>(false);
  const [printHouse] = useRecoilState(printHouseProfile);

  useEffect(() => {
    const socket = io(config.api_server);

    socket.on(`updateJobsTable-${printHouse.id}`, () => {
      setIsSocketUpdateJobsTable(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [printHouse?.id]);

  return { isSocketUpdateJobsTable, setIsSocketUpdateJobsTable };
};

export { useJobsTableSocketIo };
