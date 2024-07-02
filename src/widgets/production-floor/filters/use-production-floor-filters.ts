import {useRecoilState, useSetRecoilState} from "recoil";
import {productionFloorTextSearchState} from "@/widgets/production-floor/state/text-search";
import {productionFloorFiltersState} from "@/widgets/production-floor/state/production-floor-filters";
import {tagsState} from "@/widgets/production-floor/state/tags";
import {IFilterGroup, IProductionFloorFilter, IStation} from "@/widgets/production-floor/interfaces/filters";
import {setBoardFiltersApi} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {boardsMissionsState} from "@/widgets/production-floor/state/boards";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";
import {useRouter} from "next/router";
import {useMemo} from "react";
import {userProductionFloorGroupsState} from "@/widgets/production-floor/state/production-floor-groups-state";
import {productionFloorPathsState} from "@/widgets/production-floor/state/production-floor-paths";

const useProductionFloorFilters = () => {
    const [filtersState, setFiltersState] = useRecoilState(productionFloorFiltersState);
    const [, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
    const [, setPath] = useRecoilState(productionFloorPathsState);
    const [search, setSearch] = useRecoilState(productionFloorTextSearchState);
    const [tags, setTags] = useRecoilState(tagsState);
    const {callApi} = useGomakeAxios();
    const setData = useSetRecoilState(boardsMissionsState);
    const setView = useSetRecoilState(productionFloorViewState);
    const {push} = useRouter();
    const {alertSuccessUpdate, alertFaultUpdate} = useSnackBar();
    const groups = filtersState?.groups;
    const setFilters = async (filters: IProductionFloorFilter) => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
                setFiltersState(filters);
                setData(res?.data?.boardMissionsCollections);
                setTags(res?.data?.automatedTagsFilter);
                setUserGroups(res?.data?.groups);
                setPath(res?.data?.path ? res?.data?.path : []);
            }else {
                alertFaultUpdate();
            }
        }
        await setBoardFiltersApi(callApi, callBack, filters)
    }
    const onTagsChange = async (tag: string) => {

        await setFilters({
            ...filtersState,
            automatedTags: filtersState.automatedTags.includes(tag) ? filtersState.automatedTags.filter(t => t !== tag) : [...filtersState.automatedTags, tag]
        })
    }

    const onSelectDeliveryTimeDates = async (fromDate: Date, toDate: Date) => {
        await setFilters({
            ...filtersState,
            fromDeliveryTime: fromDate,
            toDeliveryTime: toDate
        })
    }
    const onSelectCreateDates = async (fromDate: Date, toDate: Date) => {
        await setFilters({
            ...filtersState,
            fromCreateDate: fromDate,
            toCreateDate: toDate
        })
    }


    const handleGroupsFilterChange = (groupId, value, valueId) => {
        setFilters({
                ...filtersState,
            groupsHistory: filtersState.groupsHistory ? filtersState.groupsHistory.concat({groupId, value, valueId}) : [{groupId, value, valueId}],
                groups: filtersState.groups?.length > 0 ? [...filtersState?.groups, {groupId, value, valueId}] : [{
                    groupId,
                    value,
                    valueId
                }]
            }
        ).then(() => {
            setView(EProductionFloorView.TABLE);
            push('/production-floor').then();
        })
    }

    const initGroupsFilters = async () => {
        await setFilters({
            ...filtersState,
            groups: null,
            groupsHistory: null
        })
    }

    const hasGroupsFilters = useMemo(() => filtersState?.groups?.length > 0, [filtersState]);

    const createDateFilter = useMemo(() => ({
        fromDate: filtersState?.fromCreateDate,
        toDate: filtersState?.toCreateDate
    }), [filtersState])
    const deliveryDateFilter = useMemo(() => ({
        fromDate: filtersState?.fromDeliveryTime,
        toDate: filtersState?.toDeliveryTime
    }), [filtersState])
    const setGroupFromPath = (groups: IFilterGroup[]) => {
        setFilters({
            ...filtersState,
            groups: groups
        }).then();
    }

    const onStationsChange = (stations: IStation[]) => {
        setFilters({
            ...filtersState,
            stations
        })
    }

    return {
        search,
        setSearch,
        tags,
        setTags,
        onTagsChange,
        onSelectDeliveryTimeDates,
        handleGroupsFilterChange,
        initGroupsFilters,
        hasGroupsFilters,
        onSelectCreateDates,
        createDateFilter,
        deliveryDateFilter,
        setGroupFromPath,
        groups,
        onStationsChange
    }
}

export {useProductionFloorFilters}