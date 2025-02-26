import {useEffect, useState} from "react";
import io from "socket.io-client";
import config from "@/config";
import {useRecoilState} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";

const useJobsTableSocketIo = (isPurchaseJobs:boolean,getData: ( isPurchaseJobs: boolean, isClear: boolean)=>void) => {
    const [connectionId, setConnectionId] = useState<any>();
    const [printHouse] = useRecoilState(printHouseProfile);

    useEffect(()=>{
        const socket = io(config.api_server);
        socket.on(`updateJobsTable-${printHouse.id}`, () => {
            getData(isPurchaseJobs,false);
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
