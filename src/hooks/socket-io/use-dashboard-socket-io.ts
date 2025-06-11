import {useEffect, useState} from "react";
import io from "socket.io-client";
import config from "@/config";
import {useRecoilValue} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";

const useDashboardSocketIo = (onUpdate: ()=>void) => {
    const profile = useRecoilValue(printHouseProfile);
    useEffect(() => {
        const socket = io(config.api_server);
        socket.on(`UpdateDashboard-${profile.id}`, () => {
            onUpdate();
        });

        return () => {
            console.log("Closing socket connection...");
            socket.disconnect();
        };
    }, []);

    return {
    };
};

export { useDashboardSocketIo };