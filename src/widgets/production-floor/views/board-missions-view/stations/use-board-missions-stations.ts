import {useRouter} from "next/router";
import {getBoardsMissionsStations} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {
    boardMissionsStationsState,
    stationGeneralInformationState
} from "@/widgets/production-floor/views/board-missions-view/stations/state";

const useBoardMissionsStations = () => {
    const {callApi} = useGomakeAxios();
    const {query} = useRouter();
    const {boardMissionsId, step} = query;
    const [stations, setStations] = useRecoilState(boardMissionsStationsState);
    const [, setInformation] = useRecoilState(stationGeneralInformationState);
    const getStations = async (id: string) => {
        const callBack = res => {
            if (res?.success) {
                setStations(res?.data?.workFlow?.actions);
                setInformation(res?.data?.generalInformations)
            }
        }
        await getBoardsMissionsStations(callApi, callBack, id)
    }

    useEffect(() => {
        if (!!boardMissionsId && step === 'stations') {
            getStations(boardMissionsId?.toString()).then();
        }
    }, [boardMissionsId, step])
    return {
        stations
    }
}

export {useBoardMissionsStations}