import {setBoardFiltersApi} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useRecoilState, useSetRecoilState} from "recoil";
import {
    boardsMissionsSelectedIdsState,
    isLoadingMoreBoardsState,
    productionStatusesState
} from "@/widgets/production-floor-widget/state";
import {useGomakeAxios} from "@/hooks";
import {useEffect} from "react";
import {useProductionFloorSignalr} from "@/hooks/signalr/use-production-floor-signalr";
import {boardsMissionsState} from "@/widgets/production-floor-widget/state/boards-missions-state";

const useProductionFloorData = () => {
    const {data, connection, appendData} = useProductionFloorSignalr();
    const [boards, setBoards] = useRecoilState(boardsMissionsState);
    const setStatuses = useSetRecoilState(productionStatusesState);
    const [selectedBoardsMissionsIds, setSelectedBoardsMissionsIds] = useRecoilState(boardsMissionsSelectedIdsState);
    const setIsLoadingMoreData = useSetRecoilState(isLoadingMoreBoardsState);
    const {callApi} = useGomakeAxios();

    const startGettingData = async () => {
        await setBoardFiltersApi(callApi, () => {
        }, {});
    }

    useEffect(() => {
        if (data?.boardMissions) {
            setBoards(data?.boardMissions)
            setStatuses(data?.boardMissionStatusFilter);
        }
    }, [data])

    useEffect(() => {
        if (appendData?.boardMissions) {
            setBoards([...boards, ...appendData?.boardMissions]);
            setIsLoadingMoreData(false)
        }
    }, [appendData])

    useEffect(() => {
        if (connection) {
            startGettingData().then();
        }
    }, [connection])

    useEffect(() => {
        const boardsIds = boards?.map(board => board.id);
        setSelectedBoardsMissionsIds(selectedBoardsMissionsIds?.filter(id => boardsIds?.includes(id)))
    }, [boards])

    return {}
}

export {useProductionFloorData}