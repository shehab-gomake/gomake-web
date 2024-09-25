import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { productionFloorTextSearchState, selectedChipIdState } from "@/widgets/production-floor/state/text-search";
import { productionFloorFiltersState } from "@/widgets/production-floor/state/production-floor-filters";
import { tagsState } from "@/widgets/production-floor/state/tags";
import { IFilterGroup, IProductionFloorFilter, IStation } from "@/widgets/production-floor/interfaces/filters";
import { setBoardFiltersApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { boardsMissionsState } from "@/widgets/production-floor/state/boards";
import { EProductionFloorView, productionFloorViewState } from "@/widgets/production-floor/state/production-floor-view";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { userProductionFloorGroupsState } from "@/widgets/production-floor/state/production-floor-groups-state";
import { productionFloorPathsState } from "@/widgets/production-floor/state/production-floor-paths";
import { Source, useActionsList } from "./select/actions-select/use-actions-list";
import { useTranslation } from "react-i18next";

const useProductionFloorFilters = () => {
    const [filtersState, setFiltersState] = useRecoilState(productionFloorFiltersState);
    const [, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
    const [, setPath] = useRecoilState(productionFloorPathsState);
    const [search, setSearch] = useRecoilState(productionFloorTextSearchState);
    const setTags = useSetRecoilState(tagsState);
    const { callApi } = useGomakeAxios();
    const [data, setData] = useRecoilState(boardsMissionsState);
    const setView = useSetRecoilState(productionFloorViewState);
    const { push } = useRouter();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const { t } = useTranslation();
    const dir = t("direction");
    const isRTL = dir === "rtl";
    const { actionsMachinesIds } = useActionsList(Source.PRODUCTION_FLOOR);
    const [selectedChip, setSelectedChip] = useState<string | null>(null);
    const setSelectedChipId = useSetRecoilState(selectedChipIdState);
    const [visibleCards, setVisibleCards] = useState<{ label: string, machineId: string }[]>([]);
    const [hiddenCards, setHiddenCards] = useState<{ label: string, machineId: string }[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const filters = useRecoilValue(productionFloorFiltersState);
    const [machinesColors, setMachinesColors] = useState([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const groups = filtersState?.groups;

    const setFilters = async (filters: IProductionFloorFilter) => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();

                const backendFiltersStations = res?.data?.filter?.stations || [];
                const mergedStations = filters.stations.map(station => {
                    const correspondingBackendFilter = backendFiltersStations.find(
                        backendFilter => backendFilter.actionId === station.actionId
                    );

                    return {
                        ...station,
                        ...correspondingBackendFilter,
                    };
                });

                setFiltersState({
                    ...filters,
                    stations: mergedStations
                });

                // setFiltersState(filters);
                setData(res?.data?.boardMissionsCollections);
                setTags(res?.data?.automatedTagsFilter);
                setUserGroups(res?.data?.groups);
                setPath(res?.data?.path ? res?.data?.path : []);
            } else {
                alertFaultUpdate();
            }
        }
        await setBoardFiltersApi(callApi, callBack, filters)
    }

    const onTagsChange = async (tag: string) => {
        await setFilters({
            ...filtersState,
            automatedTags: filtersState?.automatedTags?.includes(tag) ? filtersState.automatedTags.filter(t => t !== tag) : [...filtersState.automatedTags, tag]
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
            groupsHistory: filtersState.groupsHistory ? filtersState.groupsHistory.concat({ groupId, value, valueId }) : [{ groupId, value, valueId }],
            groups: filtersState.groups?.length > 0 ? [...filtersState?.groups, { groupId, value, valueId }] : [{
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
    }), [filtersState]);

    const deliveryDateFilter = useMemo(() => ({
        fromDate: filtersState?.fromDeliveryTime,
        toDate: filtersState?.toDeliveryTime
    }), [filtersState]);

    const setGroupFromPath = (groups: IFilterGroup[]) => {
        setFilters({
            ...filtersState,
            groups: groups,
        }).then();
    }

    const onStationsChange = (stations: IStation[]) => {
        setFilters({
            ...filtersState,
            stations
        })
    }


    //////////////////////////////////////////////  NEW ///////////////////////////////////////////////////

    const getColorByMachineId = (machineId) => {
        const entry = machinesColors?.find(item => item.id === machineId);
        return entry ? entry?.color : '#088AB2';
    };

    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChipClick = (card: { label: string; machineId: string }) => {
        const { label, machineId } = card;
        const isChipSelected = selectedChip === label;
        setSelectedChip(isChipSelected ? null : label);
        if (machineId && !isChipSelected) {
            setSelectedChipId(machineId);
        }
        else{
            setSelectedChipId(null);

        }
    };

    const handleMenuItemClick = (selectedCard: { label: string; machineId: string }) => {
        setHiddenCards(prevHidden => {
            const updatedHiddenCards = prevHidden.filter(card => card.label !== selectedCard.label);
            return updatedHiddenCards;
        });

        setVisibleCards(prevVisible => {
            const newVisibleCards = [{ label: selectedCard.label, machineId: selectedCard.machineId }, ...prevVisible];

            if (newVisibleCards.length > 0) {
                setHiddenCards(prevHidden => [...prevHidden, newVisibleCards[newVisibleCards.length - 1]]);
            }

            return newVisibleCards.slice(0, -1);
        });
        setSelectedChip(selectedCard.label);
      
        if (selectedCard.machineId) {
            setSelectedChipId(selectedCard.machineId);
        }
        else{
            setSelectedChipId(null);
        }
    };

    return {
        t,
        dir,
        search,
        setSearch,
        actionsMachinesIds,
        data,
        filters,
        selectedChip,
        setSelectedChip,
        filtersState,
        setFilters,
        onTagsChange,
        onSelectDeliveryTimeDates,
        onSelectCreateDates,
        handleGroupsFilterChange,
        initGroupsFilters,
        hasGroupsFilters,
        createDateFilter,
        deliveryDateFilter,
        setGroupFromPath,
        onStationsChange,
        isRTL,
        getColorByMachineId,
        handleMoreClick,
        handleChipClick,
        handleMenuItemClick,
        handleClose,
        anchorEl,
        visibleCards,
        hiddenCards,
        setMachinesColors,
        setVisibleCards,
        setHiddenCards,
        scrollContainerRef,
        groups
    }
}

export { useProductionFloorFilters }