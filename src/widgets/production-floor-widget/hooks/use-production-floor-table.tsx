import {useRecoilState, useRecoilValue} from "recoil";
import {useCallback, useEffect, useState} from "react";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import Link from "next/link";
import {TaskCategoryLabel} from "@/widgets/production-floor-widget/components/task-category-label";
import {StatusBtn} from "@/widgets/production-floor-widget/components/status-btn";
import {OptionsButton} from "@/components/options-button/options-button";
import {
    boardsMissionsSelectedIdsState,
    boardsMissionsState, isLoadingMoreBoardsState
} from "@/widgets/production-floor-widget/state/boards-missions-state";
import {updateBoardsMissionsStatusApi} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {productionFloorFiltersState} from "@/widgets/production-floor-widget/state";
import {CurrentStationComponent} from "@/widgets/production-floor-widget/components/current-station-component";
import {DateFormatterDDMMYYYY} from "@/utils/adapter";

const useProductionFloorTable = () => {
    const boardsMissions = useRecoilValue(boardsMissionsState);
    const [boardsMissionsSelectedIds, setBoardsMissionsSelectedIds] = useRecoilState(boardsMissionsSelectedIdsState);
    const [hasMoreBoards, setHasMoreBoards] = useState<boolean>(true);
    const [loadingBoards, setLoadingBoards] = useRecoilState<boolean>(isLoadingMoreBoardsState);
    const filters = useRecoilValue(productionFloorFiltersState);
    const {callApi} = useGomakeAxios();
    const onSelectUnSelectBoardMission = (id: string) => {
        if (boardsMissionsSelectedIds?.includes(id)) {
            setBoardsMissionsSelectedIds(boardsMissionsSelectedIds?.filter(boardId => id !== boardId));
        } else {
            setBoardsMissionsSelectedIds([...boardsMissionsSelectedIds, id]);
        }
    }

    const onUpdateStatus = async (id: string, statusId: string) => {
        const callBack = () => {
        }
        await updateBoardsMissionsStatusApi(callApi, callBack, {boardsIds: [id], statusId})
    }

    const tableHeaders = ['', 'jobs', 'task category', 'station', 'status', 'customer', "Station Delivery time", 'Delivery time', 'more'];

    const getBoardsMissionsRows = useCallback(() => {
        return boardsMissions
            ?.map(boardMission => ({
                checked: boardsMissionsSelectedIds?.includes(boardMission?.id),
                values: [
                    <SecondaryCheckBox checked={boardsMissionsSelectedIds.includes(boardMission.id)}
                                       onChange={() => onSelectUnSelectBoardMission(boardMission?.id)}/>,
                    <Link
                        href={'/production-floor?boardMissionId=' + boardMission?.id}>{`${boardMission?.boardMissionNumber}\\${boardMission?.orderNumber}`}</Link>,
                    <TaskCategoryLabel label={boardMission?.productName}/>,
                    <CurrentStationComponent {...boardMission.currentStation} boardMissionId={boardMission.id}/>,
                    <StatusBtn id={boardMission?.id} onChange={onUpdateStatus} statusId={boardMission?.statusId}/>,
                    boardMission?.clientName,
                    DateFormatterDDMMYYYY(boardMission?.actionDueDate),
                    DateFormatterDDMMYYYY(boardMission?.dueDate),
                    <OptionsButton><></>
                    </OptionsButton>
                ]
            }))
    }, [boardsMissions, boardsMissionsSelectedIds]);

    const handelEndGettingData = (hasMore: boolean) => {
        setHasMoreBoards(hasMore);
    }

    useEffect(() => {
        setHasMoreBoards(true);
    }, [filters])

    return {
        getBoardsMissionsRows,
        hasMoreBoards,
        loadingBoards,
        handelEndGettingData,
        setLoadingBoards,
        tableHeaders
    }
}

export {useProductionFloorTable}