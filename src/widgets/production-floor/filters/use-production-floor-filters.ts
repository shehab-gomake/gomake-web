import {useRecoilState, useSetRecoilState} from "recoil";
import {productionFloorTextSearchState} from "@/widgets/production-floor/state/text-search";
import {productionFloorFiltersState} from "@/widgets/production-floor/state/production-floor-filters";
import {tagsState} from "@/widgets/production-floor/state/tags";
import {IFilterGroup, IProductionFloorFilter} from "@/widgets/production-floor/interfaces/filters";
import {setBoardFiltersApi} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {boardsMissionsState} from "@/widgets/production-floor/state/boards";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";
import {useRouter} from "next/router";
import {useMemo} from "react";
import {userProductionFloorGroupsState} from "@/widgets/production-floor/state/production-floor-groups-state";
import {productionFloorPathsState} from "@/widgets/production-floor/state/production-floor-paths";
import {IActionMachines} from "@/widgets/production-floor/state/actions-list";

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
    const groups = filtersState.groups;
    const setFilters = async (filters: IProductionFloorFilter) => {
        const callBack = (res) => {
            if (res?.success) {
                setFiltersState(filters);
                setData(res?.data?.boardMissionsCollections);
                setTags(res?.data?.automatedTagsFilter);
                setUserGroups(res?.data?.groups);
                setPath(res?.data?.path ? res?.data?.path : []);
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

    const handleSelectStation = async (action: IActionMachines) => {
        const station = filtersState.stations.find(station => station.actionId === action.actionId);
        if (!!station) {
            await setFilters({
                ...filtersState,
                stations: station.machineIds.length === 0 ? filtersState.stations.filter(s => s.actionId !== action.actionId) :
                    filtersState.stations.map(s => s.actionId === action.actionId ? {
                        actionId: action.actionId,
                        machineIds: []
                    } : s)
            })
        } else {
            await setFilters({
                ...filtersState,
                stations: filtersState.stations.concat({actionId: action.actionId, machineIds: []})
            })
        }
    }

    const handelSelectMachine = async (actionId: string, machineId: string, option: IActionMachines) => {
        const station = filtersState.stations.find(station => station.actionId === actionId);
        if (!!station) {
            await setFilters({
                ...filtersState,
                stations: filtersState?.stations
                    ?.map(s => s.actionId === actionId ?
                        {
                            ...s, machineIds: s?.machineIds?.length === 0 ? option?.machines?.filter(m => m.machineId !== machineId)?.map(s => s.machineId) : s.machineIds.includes(machineId) ?
                                s.machineIds?.filter(id => id !== machineId) : s.machineIds.concat(machineId)
                        }: s)
            })
        } else {
            await setFilters({
                ...filtersState,
                stations: filtersState?.stations && filtersState?.stations?.length > 0 ?
                    filtersState?.stations?.concat({actionId, machineIds: [machineId]}) :
                    [{actionId, machineIds: [machineId]}]
            })
        }
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
        fromDate: filtersState.fromCreateDate,
        toDate: filtersState.toCreateDate
    }), [filtersState])
    const deliveryDateFilter = useMemo(() => ({
        fromDate: filtersState.fromDeliveryTime,
        toDate: filtersState.toDeliveryTime
    }), [filtersState])
    const setGroupFromPath = (groups: IFilterGroup[]) => {
        setFilters({
            ...filtersState,
            groups: groups
        }).then();
    }
    return {
        search,
        setSearch,
        tags,
        setTags,
        onTagsChange,
        onSelectDeliveryTimeDates,
        handleSelectStation,
        handleGroupsFilterChange,
        initGroupsFilters,
        hasGroupsFilters,
        onSelectCreateDates,
        createDateFilter,
        deliveryDateFilter,
        setGroupFromPath,
        handelSelectMachine,
        groups
    }
}

export {useProductionFloorFilters}