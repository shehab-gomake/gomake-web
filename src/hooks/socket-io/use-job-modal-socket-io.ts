import {useCallback, useEffect, useState} from "react";
import io from "socket.io-client";
import config from "@/config";
import {useRecoilState, useSetRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {
    boardMissionsStationsState, boardMissionsSubWorkFlowsState,
    isReadyBoardMissionsState
} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import {boardMissionsActivitiesState} from "@/widgets/production-floor/state/board-missions-activities";
import {boardMissionsFilesState} from "@/widgets/production-floor/views/board-missions-view/files/state";

const useJobModalSocketIO = (boardMissionId:string) => {
    const [connectionId, setConnectionId] = useState<any>();
    const [currentBoardMissions, setBoardMissions] = useRecoilState(boardMissionsDetailsState);
    const setBoardMissionsStations = useSetRecoilState(
        boardMissionsStationsState
    );
    const setActivities = useSetRecoilState(boardMissionsActivitiesState);
    const [, setIsReady] = useRecoilState(isReadyBoardMissionsState);
    const [, setFiles] = useRecoilState(boardMissionsFilesState);
    const setSubWorkFlows = useSetRecoilState(boardMissionsSubWorkFlowsState);
    useEffect(()=>{
        const socket = io(config.api_server);
        socket.on(`UpdateBoardMissionModal-${boardMissionId}`, (newData) => {
            if (!!newData && boardMissionId === newData.details.boardMissionId) {
                setActivities(newData?.activites);
                setBoardMissions(newData?.details);
                setBoardMissionsStations(newData?.stations.workFlow?.actions);
                setSubWorkFlows(newData?.stations.workFlow?.subWorkFlows);
                setIsReady(newData?.stations.isReady);
                setFiles(newData?.orderItemFiles);
            }
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

export { useJobModalSocketIO };
