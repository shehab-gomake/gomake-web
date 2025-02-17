import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  filteredMissionsStateBySearch,
  missionsListState,
  productionFloorTextSearchState,
  searchLoadingState,
} from "@/widgets/production-floor/state/text-search";
import { productionFloorFiltersState } from "@/widgets/production-floor/state/production-floor-filters";
import { tagsState } from "@/widgets/production-floor/state/tags";
import {
  IFilterGroup,
  IProductionFloorFilter,
  IStation,
} from "@/widgets/production-floor/interfaces/filters";
import { setBoardFiltersApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { boardsMissionsState,jobsStatusesState } from "@/widgets/production-floor/state/boards";
import {
  EProductionFloorView,
  productionFloorViewState,
} from "@/widgets/production-floor/state/production-floor-view";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { userProductionFloorGroupsState } from "@/widgets/production-floor/state/production-floor-groups-state";
import { productionFloorPathsState } from "@/widgets/production-floor/state/production-floor-paths";
import { useTranslation } from "react-i18next";
import { selectedChipIdsState } from "../state/text-search";
import {
  deleteStationFilterByGroupIdApi, getJobsByGroups,
  getStationFilterByGroupIdApi,
} from "@/services/api-service/board-missions/board-mission-station-filter-groups";
import { selectedGroupIdState } from "../state/filter-group";
import { IFilterGroupsList } from "../interfaces/borad-missions-filter-groups";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";

interface onStationsChangeProps {
  stations: IStation[];
  groupId?: string | null;
}

interface IUseProductionFloorFiltersProps {
  getStationFilterGroups?: any;
  connectionId: string;
}

const useProductionFloorFilters = ({
  getStationFilterGroups,
  connectionId
}: IUseProductionFloorFiltersProps) => {
  const [filtersState, setFiltersState] = useRecoilState(
    productionFloorFiltersState
  );
  const [, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
  const [, setPath] = useRecoilState(productionFloorPathsState);
  const [search, setSearch] = useRecoilState(productionFloorTextSearchState);
  const setTags = useSetRecoilState(tagsState);
  const { callApi } = useGomakeAxios();
  const [data, setData] = useRecoilState(boardsMissionsState);
  const { getDataByGroups } = useProductionFloorData();

  const setView = useSetRecoilState(productionFloorViewState);
  const { push } = useRouter();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";
  const filteredMissionsBySearch = useRecoilValue(
    filteredMissionsStateBySearch
  );
  const isSearchLoading = useRecoilValue(searchLoadingState);

  const [missionsList, setMissionsList] = useRecoilState(missionsListState);
  const [visibleCards, setVisibleCards] = useState<
    { label: string; machineId: string }[]
  >([]);
  const [hiddenCards, setHiddenCards] = useState<
    { label: string; machineId: string }[]
  >([]);
  const [visibleFilterGroups, setVisibleFilterGroups] = useState<
    IFilterGroupsList[]
  >([]);
  const [hiddenFilterGroups, setHiddenFilterGroups] = useState<
    IFilterGroupsList[]
  >([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const filters = useRecoilValue(productionFloorFiltersState);
  const [machinesColors, setMachinesColors] = useState([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const groups = filtersState?.groups;
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [selectedChipIds, setSelectedChipIds] =
    useRecoilState(selectedChipIdsState);
  const router = useRouter();
  const setFilters = async (filters: IProductionFloorFilter) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        const backendFiltersStations = res?.data?.filter?.stations || [];
        const mergedStations = filters?.stations?.map((station) => {
          const correspondingBackendFilter = backendFiltersStations.find(
            (backendFilter) => backendFilter.actionId === station.actionId
          );

          return {
            ...station,
            ...correspondingBackendFilter,
          };
        });

        setFiltersState({
          ...filters,
          stations: mergedStations,
        });

        // selectedChipIds contains an ID that has already been unchecked (removed) from actions dropdown, and ensure that the filteredDataByMachine correctly updates
        const validMachineIds = mergedStations?.flatMap(
          (station) => station.machineIds
        );
        const updatedSelectedChipIds = selectedChipIds?.filter((id) =>
          validMachineIds?.includes(id)
        );
        setSelectedChipIds(updatedSelectedChipIds);
        setData(res?.data?.boardMissionsCollections);
        setTags(res?.data?.automatedTagsFilter);
        setUserGroups(res?.data?.groups);
        setPath(res?.data?.path ? res?.data?.path : []);
      } else {
        alertFaultUpdate();
      }
    };
    await setBoardFiltersApi(callApi, callBack, filters);
  };

  const onTagsChange = async (tag: string) => {
    await setFilters({
      ...filtersState,
      automatedTags: filtersState?.automatedTags?.includes(tag)
        ? filtersState.automatedTags.filter((t) => t !== tag)
        : [...filtersState.automatedTags, tag],
    });
  };

  const onSelectDeliveryTimeDates = async (fromDate: Date, toDate: Date) => {
    await setFilters({
      ...filtersState,
      fromDeliveryTime: fromDate,
      toDeliveryTime: toDate,
    });
  };

  const onSelectCreateDates = async (fromDate: Date, toDate: Date) => {
    await setFilters({
      ...filtersState,
      fromCreateDate: fromDate,
      toCreateDate: toDate,
    });
  };

  const handleGroupsFilterChange = (groupId, value, valueId) => {
    setFilters({
      ...filtersState,
      groupsHistory: filtersState.groupsHistory
        ? filtersState.groupsHistory.concat({ groupId, value, valueId })
        : [{ groupId, value, valueId }],
      groups:
        filtersState.groups?.length > 0
          ? [...filtersState?.groups, { groupId, value, valueId }]
          : [
              {
                groupId,
                value,
                valueId,
              },
            ],
    }).then(() => {
      setView(EProductionFloorView.TABLE);
      // push("/production-floor").then();
      push("/production-floor?view=table").then();
    });
  };

  const initGroupsFilters = async () => {
    await setFilters({
      ...filtersState,
      groups: null,
      groupsHistory: null,
    });
  };

  const hasGroupsFilters = useMemo(
    () => filtersState?.groups?.length > 0,
    [filtersState]
  );

  const createDateFilter = useMemo(
    () => ({
      fromDate: filtersState?.fromCreateDate,
      toDate: filtersState?.toCreateDate,
    }),
    [filtersState]
  );

  const deliveryDateFilter = useMemo(
    () => ({
      fromDate: filtersState?.fromDeliveryTime,
      toDate: filtersState?.toDeliveryTime,
    }),
    [filtersState]
  );

  const setGroupFromPath = (groups: IFilterGroup[]) => {
    setFilters({
      ...filtersState,
      groups: groups,
    }).then();
  };

  const onStationsChange = ({
    stations,
    groupId = null,
  }: onStationsChangeProps) => {
    setFilters({
      ...filtersState,
      stations,
      groupId,
    });
  };

  const getColorByMachineId = (machineId) => {
    const entry = machinesColors?.find((item) => item.id === machineId);
    return entry ? entry?.color : "#088AB2";
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChipClick = (card: { label: string; machineId: string }) => {
    const { label, machineId } = card;
    setSelectedChips((prevSelectedChips) => {
      // Check if the chip is already selected
      const isChipSelected = prevSelectedChips.includes(label);

      if (isChipSelected) {
        // Remove the chip if it is already selected
        return prevSelectedChips.filter((chip) => chip !== label);
      } else {
        // Add the chip if it is not selected
        return [...prevSelectedChips, label];
      }
    });
    // Set selected chip ID logic
    setSelectedChipIds((prevSelectedIds) => {
      if (selectedChips.includes(label)) {
        // Remove the ID if the chip is already selected
        return prevSelectedIds.filter((id) => id !== machineId);
      } else {
        // Add the ID if the chip is not selected
        return [...prevSelectedIds, machineId];
      }
    });
  };

  /* Department/Group Section */
  const [selectedGroupId, setSelectedGroupId] = useRecoilState<string | null>(
    selectedGroupIdState
  );

  const handleSelectGroup = (groupId: string) => {
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
      onStationsChange({ stations: [], groupId: null });
    } else {
      if(selectedGroupId === "all" && groupId !== "all") {
        const viewName = EProductionFloorView[EProductionFloorView.TABLE].toLowerCase();
        router.push(`/production-floor?view=${viewName}`, undefined, {
          shallow: true,
        });
        setData([])
      }
      if(groupId === "all"){
        const viewName = EProductionFloorView[EProductionFloorView.FILTER_GROUPS].toLowerCase();
        router.push(`/production-floor?view=${viewName}`, undefined, {
          shallow: true,
        });
        setData([])
      }
      setSelectedGroupId(groupId);
      getStationFilterGroupById(groupId);
    }
  };

  const getStationFilterGroupById = async (id) => {
    if(id === "all"){
      setData([])
      await getDataByGroups(connectionId,true)
      return;
    }
    const callBack = (res) => {
      if (res.success) {
        onStationsChange({ stations: res?.data?.stations, groupId: id });
      }
    };
    await getStationFilterByGroupIdApi(callApi, callBack, {
      groupId: id,
    }).then();
  };

  const deleteStationFilterGroupById = async (id) => {
    const callBack = (res) => {
      if (res.success) {
        getStationFilterGroups();
        if (id === selectedGroupId) {
          onStationsChange({ stations: [], groupId: null });
          setSelectedGroupId(null);
        }
      }
    };
    await deleteStationFilterByGroupIdApi(callApi, callBack, {
      groupId: id,
    }).then();
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string>("");

  const handleClearClick = (id: string) => {
    setOpenModal(true);
    setSelectedIdToDelete(id);
  };

  const handleDeleteConfirm = () => {
    deleteStationFilterGroupById(selectedIdToDelete);
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedIdToDelete("");
  };

  return {
    t,
    dir,
    search,
    setSearch,
    filters,
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
    handleClose,
    anchorEl,
    visibleCards,
    hiddenCards,
    setMachinesColors,
    setVisibleCards,
    setHiddenCards,
    scrollContainerRef,
    groups,
    selectedChips,
    visibleFilterGroups,
    setVisibleFilterGroups,
    hiddenFilterGroups,
    setHiddenFilterGroups,
    handleSelectGroup,
    selectedGroupId,
    setSelectedGroupId,
    getStationFilterGroups,
    getStationFilterGroupById,
    deleteStationFilterGroupById,
    missionsList,
    setMissionsList,
    filteredMissionsBySearch,
    isSearchLoading,
    openModal,
    handleDeleteConfirm,
    handleCancel,
    handleClearClick,
  };
};

export { useProductionFloorFilters };
