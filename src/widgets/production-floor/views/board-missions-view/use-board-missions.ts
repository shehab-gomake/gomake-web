import {
    getBoardMissionsById,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {useRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";

const useBoardMissions = () => {
    const {callApi} = useGomakeAxios();
    const [, setBoardMissionsDetails] = useRecoilState(boardMissionsDetailsState);

    const getBoardMissions = async (id: string, connectionId) => {
        const callBack = async (res) => {
            if (res.success) {
                setBoardMissionsDetails(res.data)
            }
        }
        await getBoardMissionsById(callApi, callBack, {id, connectionId})
    }

    return {
        getBoardMissions,
    }
}

export {useBoardMissions}