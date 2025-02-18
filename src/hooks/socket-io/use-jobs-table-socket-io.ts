import {useEffect, useState} from "react";
import io from "socket.io-client";
import config from "@/config";

const useJobsTableSocketIo = (getData: ()=>void) => {
    const [connectionId, setConnectionId] = useState<any>();
    useEffect(()=>{
        const socket = io(config.api_server);
        socket.on(`updateJobsTable`, () => {
            getData();
        });
        socket.on('connect', () => {
            setConnectionId(socket.id);
        });
        return () => {
            console.log("Closing socket connection...");
            socket.disconnect();
        };
    },[])
    return {
        connectionId,
    };
};

export { useJobsTableSocketIo };
