import { useEffect, useMemo, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export interface ISignalRProps {
  accessToken: string;
  url: string;
  methodName: string;
}
const useGoMakeSignalr = <T>({
  accessToken,
  url,
  methodName,
}: ISignalRProps): {
  data: T | null;
  connection: null | HubConnection;
  connectionId: string;
} => {
  const [connection, setConnection] = useState<null | HubConnection>(null);
  const [data, setData] = useState<T | null>(null);
  const [connectionId, setConnectionId] = useState<string>("");
  const getAccessToken = () => {
    return accessToken;
  };
  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl(url, { accessTokenFactory: () => getAccessToken() })
      .withAutomaticReconnect()
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          setConnectionId(connection.connectionId);
          connection.on(methodName, (newData) => {
            setData(newData);
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);
  return {
    data, 
    connection,
    connectionId,
  };
};

export { useGoMakeSignalr };
