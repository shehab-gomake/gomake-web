import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";

interface CreatePrintHouseTestPayload {
  domain?: string;
  username?: string;
  password?: string;
}

const useCreatePrintHouseTestSocketIo = () => {
  const [data, setData] = useState<CreatePrintHouseTestPayload | null>(null);

  useEffect(() => {
    const socket = io(config.api_server);

    socket.on("createPrintHouseTest", (payload: CreatePrintHouseTestPayload) => {
      setData(payload || null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { data };
};

export { useCreatePrintHouseTestSocketIo };

