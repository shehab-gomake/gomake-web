import {useRouter} from "next/router";
import {getBoardsMissionsStations} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {
    boardMissionsStationsState, boardMissionsSubWorkFlowsState, isReadyBoardMissionsState,
    stationGeneralInformationState
} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";

const useBoardMissionsStations = () => {
    const {callApi} = useGomakeAxios();
    const {query, replace, pathname} = useRouter();
    const {boardMissionsId, step, productType} = query;
    const [stations, setStations] = useRecoilState(boardMissionsStationsState);
    const [, setInformation] = useRecoilState(stationGeneralInformationState);
    const [subWorkFlows, setSubWorkFlows] = useRecoilState(boardMissionsSubWorkFlowsState);
    const [, setIsReady] = useRecoilState(isReadyBoardMissionsState);
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const getStations = async () => {
        const callBack = res => {
            if (res?.success) {
                setStations(res?.data?.workFlow?.actions);
                setSubWorkFlows(res?.data?.workFlow?.subWorkFlows);
                setInformation(res?.data?.generalInformations);
                setIsReady(res?.data?.isReady);
            }
        }
        await getBoardsMissionsStations(callApi, callBack, {boardMissionsId: boardMissionsId, productType: productType ? productType : ''})
    }
    const onClickAllJob = () => {
        replace({ pathname: pathname, query: {...query, productType: ''}}, undefined, { shallow: true }).then();

    }

    useEffect(() => {
        if (!!boardMissionsId && step === 'stations') {
            getStations().then();
        }
    }, [boardMissionsId, step, productType])
    return {
        stations,
        subWorkFlows,
        boardMissions,
        onClickAllJob
    }
}

export {useBoardMissionsStations}