import {getProductionStatusesApi} from "@/services/api-service/enums/enums-endpoints";
import {useGomakeAxios} from "@/hooks";
import {useCallback} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {productionStatusesState, workJobsState} from "@/widgets/production-floor-widget/state";
import {EStatus} from "@/widgets/production-floor-widget/components/status-btn";

const useStatuses = () => {
    const [statusesState, setStatuses] = useRecoilState(productionStatusesState);
    const {callApi} = useGomakeAxios();
    const boardMissions = useRecoilValue(workJobsState);
    const getStatuses = async () => {
        const callBack = (res: { success: boolean, data: {value: EStatus, text: string}[] }) => {
            if (res.success) {
                setStatuses(res.data.map(status => ({...status, checked: true, count: 0})));
            }
        }
        await getProductionStatusesApi(callApi, callBack)
    }

    const handleStatusChecked = (status: EStatus) => {
        setStatuses(statusesState.map(s => s.value === status ? {...s, checked: !s.checked} : s))
    }

    const isSelectedBoardMissions = useCallback(() => boardMissions.some(mission => mission.checked), [boardMissions])

    const statuses = useCallback(() => {
        return statusesState.map(status => ({...status, count: boardMissions.filter(mission => mission.statusId === status.value).length}))
    }, [statusesState, boardMissions])

    return {
        getStatuses,
        statuses,
        handleStatusChecked,
        isSelectedBoardMissions
    }
}
export {useStatuses}