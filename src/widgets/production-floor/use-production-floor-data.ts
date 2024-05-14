import {useGomakeAxios} from "@/hooks";
import {
    getProductionFloorData,
    updateBoardsMissionsStatusApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useRecoilState, useSetRecoilState} from "recoil";
import {productionFloorFiltersState} from "@/widgets/production-floor/state/production-floor-filters";
import {boardsMissionsState} from "@/widgets/production-floor/state/boards";
import {tagsState} from "@/widgets/production-floor/state/tags";
import {userProductionFloorGroupsState} from "@/widgets/production-floor/state/production-floor-groups-state";
import {productionFloorPathsState} from "@/widgets/production-floor/state/production-floor-paths";

const useProductionFloorData = () => {
    const {callApi} = useGomakeAxios();
    const setData = useSetRecoilState(boardsMissionsState);
    const [, setFilters] = useRecoilState(productionFloorFiltersState);
    const [, setTags] = useRecoilState(tagsState);
    const [, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
    const [, setPath] = useRecoilState(productionFloorPathsState);

    const getData = async (connectionId?: string) => {
        const callBack = (res) => {
            if (res.success) {
                setData(res?.data?.boardMissionsCollections);
                setFilters(res?.data?.filter);
                setTags(res?.data?.automatedTagsFilter);
                setUserGroups(res?.data?.groups);
                setPath(res?.data?.path ? res?.data?.path : []);
            }
        }
        await getProductionFloorData(callApi, callBack, connectionId);
    }


    const updateStatus = async (boardsIds: {BoardMissionId: string; productType: string;}[], statusId: string) => {
        const callBack = (res) => {
            if (res.success) {
            }
        }
        await updateBoardsMissionsStatusApi(callApi, callBack, {boardsIds, statusId})
    }
    return {getData, updateStatus, setData}
}

export {useProductionFloorData}