import {useEffect, useState} from "react";
import io from "socket.io-client";
import config from "@/config";
import {DOCUMENT_TYPE} from "@/pages-components/quotes/enums";
import {useRecoilState} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";

const useDocumentsTableSocketIo = (documentType: DOCUMENT_TYPE, getData: ()=>void) => {
    const [connectionId, setConnectionId] = useState<any>();
    const [printHouse] = useRecoilState(printHouseProfile);
    useEffect(()=>{
        const socket = io(config.api_server);
        socket.on(`updateDocumentTable-${printHouse.id}-${documentType}`, () => {
            getData();
        });
        socket.on('connect', () => {
            setConnectionId(socket.id);
        });
        return () => {
            console.log("Closing socket connection...");
            socket.disconnect();
        };
    },[documentType])
    return {
        connectionId,
    };
};

export { useDocumentsTableSocketIo };
