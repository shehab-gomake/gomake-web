import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {useRecoilState, useSetRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {
    boardMissionsStationsState,
    boardMissionsSubWorkFlowsState, isReadyBoardMissionsState
} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import {boardMissionsActivitiesState} from "@/widgets/production-floor/state/board-missions-activities";
import {useEffect} from "react";
import {boardMissionsFilesState} from "@/widgets/production-floor/views/board-missions-view/files/state";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";

const useBoardMissionsSignalr = () => {
    const setBoardMissions = useSetRecoilState(boardMissionsDetailsState);
    const setBoardMissionsStations = useSetRecoilState(boardMissionsStationsState);
    const setActivities = useSetRecoilState(boardMissionsActivitiesState);
    const [, setIsReady] = useRecoilState(isReadyBoardMissionsState)
    const [, setFiles] = useRecoilState(boardMissionsFilesState);
    const {getData} = useProductionFloorData();
    const setSubWorkFlows = useSetRecoilState(boardMissionsSubWorkFlowsState);
    const {connectionId, data, connection} = useGoMakeSignalr<any>({
        url: config.erp_server + '/hubs/boardMissions',
        accessToken: getUserToken(),
        methodName: "AddBoardMissionsTables"
    })

    useEffect(() => {
        if (connection) {
            connection.on('UpdateBoardMissionModal', (newData) => {
                if (!!newData) {
                    setActivities(newData?.activites);
                    setBoardMissions(newData?.details);
                    setBoardMissionsStations(newData?.stations.workFlow?.actions);
                    setSubWorkFlows(newData?.stations.workFlow?.subWorkFlows);
                    setIsReady(newData?.stations.isReady);
                    setFiles(newData?.orderItemFiles);
                }
            })

            connection.on('UpdateBoardMissionsStation', () => {
                getData().then();
            })
        }
    }, [connection])

    return {
        connectionId,
        data
    }
};
export {useBoardMissionsSignalr}
