import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";

const useDeliveriesSocketIo = () => {
  const [isSocketUpdateDeliveriesTable, setIsSocketUpdateDeliveriesTable] =
    useState<boolean>(false);
  const [printHouse] = useRecoilState(printHouseProfile);

  useEffect(() => {
    const socket = io(config.api_server);

    socket.on(`updateDeliveriesTable-${printHouse.id}`, () => {
      setIsSocketUpdateDeliveriesTable(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [printHouse?.id]);

  return { isSocketUpdateDeliveriesTable, setIsSocketUpdateDeliveriesTable };
};

export { useDeliveriesSocketIo };
