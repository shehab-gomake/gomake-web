import {useRecoilState} from "recoil";
import {
    productionFloorGroupsState,
    userProductionFloorGroupsState
} from "@/widgets/production-floor/state/production-floor-groups-state";
import {useGomakeAxios} from "@/hooks";
import {useEffect} from "react";
import {getBoardsMissionsGroupsByID} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useRouter} from "next/router";
import {useProductionFloorFilters} from "@/widgets/production-floor/filters/use-production-floor-filters";
import {productionFloorFiltersState} from "@/widgets/production-floor/state/production-floor-filters";
import {tagsState} from "@/widgets/production-floor/state/tags";
import {productionFloorPathsState} from "@/widgets/production-floor/state/production-floor-paths";

const useProductionFloorGroups = () => {
    const [groups, setGroups] = useRecoilState(productionFloorGroupsState);
    const {callApi} = useGomakeAxios();
    const {query} = useRouter();
    const {groupsId} = query;
    const {handleGroupsFilterChange} = useProductionFloorFilters();
    const [, setFilters] = useRecoilState(productionFloorFiltersState);
    const [, setTags] = useRecoilState(tagsState);
    const [, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
    const [, setPath] = useRecoilState(productionFloorPathsState);

    const getgroupsCollections = async () => {
        const callBack = (res) => {
            if (res.success) {
                setGroups(res?.data?.boardMissionGroupCollections);
                setFilters(res?.data?.filter);
                setTags(res?.data?.automatedTagsFilter);
                setUserGroups(res?.data?.groups);
                setPath(res?.data?.path ? res?.data?.path : []);
            }
        }
        await getBoardsMissionsGroupsByID(callApi, callBack, groupsId);
    }

    const onNavigateToGroupBoardsMissions = async (value: string, valueId: string) => {
        await handleGroupsFilterChange(groupsId, value, valueId)
    }
    useEffect(() => {
        getgroupsCollections().then();
    }, [groupsId])
    return {
        groups,
        onNavigateToGroupBoardsMissions
    }
}

export {useProductionFloorGroups}