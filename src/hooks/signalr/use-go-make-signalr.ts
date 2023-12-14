import {useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";

export interface ISignalRProps {
    accessToken: string;
    url: string;
    methodName: string;
}
const useGoMakeSignalr = <T>({accessToken, url, methodName}: ISignalRProps): {data: T | null, connection: null | HubConnection} => {
    const [connection, setConnection] = useState<null | HubConnection>(null);
    const [data, setData] = useState<T | null>(null);
    const getAccessToken = ()=>{
       return accessToken
    }
    useEffect(() => {

        const connect = new HubConnectionBuilder()
            .withUrl(url,{accessTokenFactory: () => getAccessToken()})
            .withAutomaticReconnect()
            .build();

        setConnection(connect);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    connection.on(methodName, (newData) => {
                        setData(newData);
                        console.log(newData);
                    });
                })
                .catch((error) => alert(JSON.stringify(error)));
        }
    }, [connection]);
    return {
        data,
        connection
    };
}


export {useGoMakeSignalr}