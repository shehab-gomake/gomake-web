import {useEffect, useState} from "react";
import io from "socket.io-client";
import config from "@/config";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";
import {printHouseProfile} from "@/store/print-house-profile";
import {useRecoilValue} from "recoil";

const useProductionFloorSocketIO = () => {
    const [connectionId, setConnectionId] = useState<any>();
    const profile = useRecoilValue(printHouseProfile);
    const { getData } = useProductionFloorData();
    useEffect(()=>{
        debugger
        const socket = io(config.api_server);
        socket.on(`UpdateBoardMissionsStation-${profile.id}`, () => {
            getData(socket.id).then();
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

export { useProductionFloorSocketIO };
