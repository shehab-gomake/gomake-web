import {useEffect, useState} from "react";
import io from "socket.io-client";
import config from "@/config";
import {useRecoilState} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";

const useJobsTableSocketIo = (getData: ()=>void) => {
    const [connectionId, setConnectionId] = useState<any>();
    const [printHouse] = useRecoilState(printHouseProfile);

    useEffect(()=>{
        const socket = io(config.api_server);
        socket.on(`updateJobsTable-${printHouse.id}`, () => {
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
