import {useCallback} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {productionStatusesState, productionFloorFiltersState, boardsMissionsSelectedIdsState, productionFilterSelectedStatusesState} from "@/widgets/production-floor-widget/state";
import {updateBoardsMissionsStatusApi} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
const useProductionFloorStatuses = () => {
    const statusesState = useRecoilValue(productionStatusesState);
    const selectedBoardMissions = useRecoilValue(boardsMissionsSelectedIdsState);
    const [filters, setFilters] = useRecoilState(productionFloorFiltersState);
    const selectedStatuses = useRecoilValue(productionFilterSelectedStatusesState);
    const {callApi} = useGomakeAxios();
    const handleStatusChecked = (statusId: string) => {
        let selectedIds = [...selectedStatuses];
        if (selectedStatuses?.includes(statusId)) {
            selectedIds = selectedStatuses?.filter(s => s !== statusId);
        } else {
            if (selectedIds?.length > 0) {
            selectedIds = [...selectedIds, statusId]
            }else {
                selectedIds = [statusId];
            }
        }
        setFilters({
            ...filters,
            statusIds: selectedIds,
        });
    }

    const isSelectedBoardMissions = useCallback(() => selectedBoardMissions.length > 0, [selectedBoardMissions])

    const statuses = useCallback(() => {
        return statusesState?.map(status => ({...status.boardMissionStatus, count: status.count, checked: selectedStatuses?.includes(status.boardMissionStatus.id)}));
    }, [statusesState])

    const onChangeBoardsStatus = async (statusId: string) => {
        const callBack = (res) => {
            if (res?.success) {
            }
        }
        await updateBoardsMissionsStatusApi(callApi, callBack, {boardsIds: selectedBoardMissions, statusId})
    }

    return {
        statuses,
        handleStatusChecked,
        isSelectedBoardMissions,
        onChangeBoardsStatus
    }
}

export {useProductionFloorStatuses};
