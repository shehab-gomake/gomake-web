import {
    getBoardMissionsById,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {useRecoilState, useResetRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {
    boardMissionsStationsState,
    boardMissionsSubWorkFlowsState, stationGeneralInformationState
} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import {boardMissionsFilesState} from "@/widgets/production-floor/views/board-missions-view/files/state";
import {boardMissionsActivitiesState} from "@/widgets/production-floor/state/board-missions-activities";

const useBoardMissions = () => {
    const {callApi} = useGomakeAxios();
    const [, setBoardMissionsDetails] = useRecoilState(boardMissionsDetailsState);
    const resetStations = useResetRecoilState(boardMissionsStationsState);
    const resetFiles = useResetRecoilState(boardMissionsFilesState);
    const resetDetails = useResetRecoilState(boardMissionsDetailsState);
    const resetActivities = useResetRecoilState(boardMissionsActivitiesState);
    const resetSubWorkFlows = useResetRecoilState(boardMissionsSubWorkFlowsState);
    const resetGeneralInformation = useResetRecoilState(stationGeneralInformationState)
    const initStates = () => {
        resetDetails();
        resetActivities();
        resetFiles();
        resetStations();
        resetSubWorkFlows();
        resetGeneralInformation();
    }

    const getBoardMissions = async (id: string, connectionId, productType: string) => {
        const callBack = async (res) => {
            if (res.success) {
                setBoardMissionsDetails(res.data)
            }
        }
        await getBoardMissionsById(callApi, callBack, {id, connectionId, productType})
    }

    return {
        getBoardMissions,
        initStates
    }
}

export {useBoardMissions}