import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {useSetRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {boardMissionsStationsState} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import {boardMissionsActivitiesState} from "@/widgets/production-floor/state/board-missions-activities";
import {useEffect} from "react";

const useBoardMissionsSignalr = () => {
    const setBoardMissions = useSetRecoilState(boardMissionsDetailsState);
    const setBoardMissionsStations = useSetRecoilState(boardMissionsStationsState);
    const setActivities = useSetRecoilState(boardMissionsActivitiesState);
    const {connectionId, data, connection} = useGoMakeSignalr<any>({
        url: config.erp_server + '/hubs/boardMissions',
        accessToken: getUserToken(),
        methodName: "AddBoardMissionsTables"
    })

    useEffect(() => {
        if (connection) {
            connection.on('UpdateBoardMissionModal', (newData) => {
                console.log(newData);
                setActivities(newData?.activites);
                setBoardMissions(newData?.details);
                setBoardMissionsStations(newData?.stations.workFlow?.actions);
            })
        }
    }, [connection])

    return {
        connectionId,
        data
    }
};
export {useBoardMissionsSignalr}
