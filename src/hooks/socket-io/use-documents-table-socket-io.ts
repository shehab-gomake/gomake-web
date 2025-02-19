import {useEffect, useState} from "react";
import io from "socket.io-client";
import config from "@/config";
import {DOCUMENT_TYPE} from "@/pages-components/quotes/enums";

const useDocumentsTableSocketIo = (documentType: DOCUMENT_TYPE, getData: ()=>void) => {
    const [connectionId, setConnectionId] = useState<any>();
    useEffect(()=>{
        const socket = io(config.api_server);
        socket.on(`updateDocumentTable-${documentType}`, () => {
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
